import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { normalizeBirthInput } from '@/lib/astro/input';
import {
  AstroEngineInvokeResponse,
  generateOrLoadAstroResult as generateOrLoadAstroResultFromApi,
  getAstroResult,
  mapStoredResultToAstroResult,
} from '@/lib/supabase/astroRepo';
import {
  deleteProfile as deleteSupabaseProfile,
  insertProfile,
  listProfiles,
  SupabaseProfileRow,
  upsertProfile,
} from '@/lib/supabase/profilesRepo';
import { createUuid } from '@/lib/supabase/deviceId';
import { fixtureProfilesToPersons } from '@/lib/dev/fixtures/profiles';
import { BirthInput, PersonProfile } from '@/types/astro';

interface SavedByProfile {
  [profileId: string]: string[];
}

interface AstroByProfileItem {
  source: 'cache' | 'computed';
  engineVersion: string;
  bigThree: {
    sun: string;
    moon: string;
    asc: string;
  };
}

export interface BirthcodeState {
  profiles: PersonProfile[];
  astroByProfileId: Record<string, AstroByProfileItem>;
  activeProfileId: string | null;
  isLoading: boolean;
  error: string | null;
  savedInsightIds: string[];
  savedPracticeIds: string[];
  savedInsightIdsByProfile: SavedByProfile;
  savedPracticeIdsByProfile: SavedByProfile;
}

export interface BirthcodeActions {
  createProfile: (label: string, input: BirthInput) => Promise<string>;
  updateProfileLabel: (id: string, label: string) => Promise<void>;
  updateProfileBirthInput: (id: string, input: BirthInput) => Promise<void>;
  setActiveProfile: (id: string) => void;
  deleteProfile: (id: string) => Promise<void>;
  syncProfilesFromSupabase: () => Promise<number>;
  generateOrLoadAstroResult: (id: string) => Promise<void>;
  generateAstroResultForProfile: (id: string) => Promise<void>;
  getActiveProfile: () => PersonProfile | null;
  getActiveAstroResult: () => PersonProfile['astroResult'];
  clearError: () => void;
  toggleInsightSaved: (profileId: string, insightId: string) => void;
  togglePracticeSaved: (profileId: string, actId: string) => void;
  addTestProfiles: () => void;
  resetToFixtures: () => void;
  reset: () => void;
}

export type BirthcodeStore = BirthcodeState & BirthcodeActions;

const initialState: BirthcodeState = {
  profiles: [],
  astroByProfileId: {},
  activeProfileId: null,
  isLoading: false,
  error: null,
  savedInsightIds: [],
  savedPracticeIds: [],
  savedInsightIdsByProfile: {},
  savedPracticeIdsByProfile: {},
};

function makeProfileId(): string {
  return createUuid();
}

function nowIso(): string {
  return new Date().toISOString();
}

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function toStoreProfile(row: SupabaseProfileRow, previous?: PersonProfile): PersonProfile {
  const birthInput = normalizeBirthInput({
    dateISO: row.birth_date,
    timeHHmm: row.birth_time,
    placeName: row.birth_place,
    timezone: row.timezone,
    lat: row.latitude ?? undefined,
    lon: row.longitude ?? undefined,
  });

  return {
    id: row.id,
    label: row.label,
    birthInput,
    profileContext: previous?.profileContext ?? null,
    astroResult: previous?.astroResult ?? null,
    createdAt: row.created_at ?? previous?.createdAt ?? nowIso(),
    updatedAt: row.updated_at ?? previous?.updatedAt ?? nowIso(),
  };
}

function toEnginePayload(response: AstroEngineInvokeResponse): Record<string, unknown> | null {
  const candidate = response.astro_result as Record<string, unknown> | null;
  if (!candidate) {
    return null;
  }
  if ('result' in candidate && candidate.result && typeof candidate.result === 'object') {
    return candidate.result as Record<string, unknown>;
  }
  return candidate;
}

function getBigThreeSigns(payload: Record<string, unknown> | null): AstroByProfileItem['bigThree'] {
  const bigThree = (payload?.big_three ?? null) as
    | { sun_sign?: string; moon_sign?: string; asc_sign?: string }
    | null;
  return {
    sun: bigThree?.sun_sign ?? '-',
    moon: bigThree?.moon_sign ?? '-',
    asc: bigThree?.asc_sign ?? '-',
  };
}

function getEngineVersion(payload: Record<string, unknown> | null): string {
  const version = payload?.engine_version;
  return typeof version === 'string' && version.length > 0 ? version : 'v2';
}

function toCachedPreview(payload: Record<string, unknown> | null): AstroByProfileItem | null {
  if (!payload) {
    return null;
  }
  return {
    source: 'cache',
    engineVersion: getEngineVersion(payload),
    bigThree: getBigThreeSigns(payload),
  };
}

function toUpsertPayload(profile: PersonProfile) {
  return {
    ...(UUID_REGEX.test(profile.id) ? { id: profile.id } : {}),
    label: profile.label,
    birth_date: profile.birthInput.dateISO,
    birth_time: profile.birthInput.timeHHmm,
    birth_place: profile.birthInput.placeName,
    timezone: profile.birthInput.timezone ?? 'UTC',
    latitude: profile.birthInput.lat ?? null,
    longitude: profile.birthInput.lon ?? null,
  };
}

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

export const useBirthcodeStore = create<BirthcodeStore>()(
  persist(
    (set, get) => ({
      ...initialState,
      createProfile: async (label: string, input: BirthInput) => {
        const normalizedInput = normalizeBirthInput(input);
        const trimmed = label.trim();
        const createdAt = nowIso();
        const localId = makeProfileId();
        const nextProfile: PersonProfile = {
          id: localId,
          label: trimmed.length > 0 ? trimmed : `Profile ${get().profiles.length + 1}`,
          birthInput: normalizedInput,
          profileContext: null,
          astroResult: null,
          createdAt,
          updatedAt: createdAt,
        };
        set((state) => ({
          profiles: [nextProfile, ...state.profiles],
          activeProfileId: localId,
          savedInsightIds: state.savedInsightIdsByProfile[localId] ?? [],
          savedPracticeIds: state.savedPracticeIdsByProfile[localId] ?? [],
          error: null,
        }));
        try {
          const persisted = await insertProfile(toUpsertPayload(nextProfile));
          await get().syncProfilesFromSupabase();
          return persisted.id;
        } catch (error) {
          set({ error: errorMessage(error, 'Failed to save profile to Supabase.') });
          return localId;
        }
      },
      updateProfileLabel: async (id: string, label: string) => {
        const trimmed = label.trim();
        if (!trimmed) {
          return;
        }
        set((state) => ({
          profiles: state.profiles.map((profile) =>
            profile.id === id
              ? { ...profile, label: trimmed, updatedAt: nowIso() }
              : profile
          ),
        }));
        const profile = get().profiles.find((item) => item.id === id);
        if (!profile) {
          return;
        }
        try {
          await upsertProfile(toUpsertPayload(profile));
          await get().syncProfilesFromSupabase();
        } catch (error) {
          set({ error: errorMessage(error, 'Failed to update profile label in Supabase.') });
        }
      },
      updateProfileBirthInput: async (id: string, input: BirthInput) => {
        const normalizedInput = normalizeBirthInput(input);
        set((state) => ({
          profiles: state.profiles.map((profile) =>
            profile.id === id
              ? {
                  ...profile,
                  birthInput: normalizedInput,
                  profileContext: null,
                  astroResult: null,
                  updatedAt: nowIso(),
                }
              : profile
          ),
          error: null,
        }));
        const profile = get().profiles.find((item) => item.id === id);
        if (!profile) {
          return;
        }
        try {
          await upsertProfile(toUpsertPayload(profile));
          await get().syncProfilesFromSupabase();
        } catch (error) {
          set({ error: errorMessage(error, 'Failed to update profile birth data in Supabase.') });
        }
      },
      setActiveProfile: (id: string) => {
        if (!get().profiles.some((profile) => profile.id === id)) {
          return;
        }
        set((state) => ({
          activeProfileId: id,
          savedInsightIds: state.savedInsightIdsByProfile[id] ?? [],
          savedPracticeIds: state.savedPracticeIdsByProfile[id] ?? [],
          error: null,
        }));
      },
      deleteProfile: async (id: string) => {
        set((state) => {
          const nextProfiles = state.profiles.filter((profile) => profile.id !== id);
          const nextActive =
            state.activeProfileId === id
              ? nextProfiles[0]?.id ?? null
              : state.activeProfileId;
          const nextSavedInsights = { ...state.savedInsightIdsByProfile };
          const nextSavedPractices = { ...state.savedPracticeIdsByProfile };
          delete nextSavedInsights[id];
          delete nextSavedPractices[id];

          return {
            profiles: nextProfiles,
            activeProfileId: nextActive,
            savedInsightIds: nextActive ? nextSavedInsights[nextActive] ?? [] : [],
            savedPracticeIds: nextActive ? nextSavedPractices[nextActive] ?? [] : [],
            savedInsightIdsByProfile: nextSavedInsights,
            savedPracticeIdsByProfile: nextSavedPractices,
          };
        });
        try {
          await deleteSupabaseProfile(id);
          await get().syncProfilesFromSupabase();
        } catch (error) {
          set({ error: errorMessage(error, 'Failed to delete profile in Supabase.') });
        }
      },
      syncProfilesFromSupabase: async () => {
        set({ isLoading: true });
        try {
          const rows = await listProfiles();
          const astroPairs = await Promise.all(
            rows.map(async (row) => {
              const birthInput = normalizeBirthInput({
                dateISO: row.birth_date,
                timeHHmm: row.birth_time,
                placeName: row.birth_place,
                timezone: row.timezone,
                lat: row.latitude ?? undefined,
                lon: row.longitude ?? undefined,
              });
              try {
                const storedResult = await getAstroResult(row.id);
                const astroResult = storedResult
                  ? mapStoredResultToAstroResult(birthInput, storedResult)
                  : null;
                return [
                  row.id,
                  astroResult,
                  toCachedPreview(storedResult as Record<string, unknown> | null),
                ] as const;
              } catch {
                return [row.id, null, null] as const;
              }
            })
          );
          const astroByProfileId = new Map(astroPairs.map((item) => [item[0], item[1]]));
          const astroPreviewByProfileId = new Map(
            astroPairs
              .filter((item) => Boolean(item[2]))
              .map((item) => [
                item[0],
                {
                  source: (item[2] as AstroByProfileItem).source,
                  engineVersion: (item[2] as AstroByProfileItem).engineVersion,
                  bigThree: (item[2] as AstroByProfileItem).bigThree,
                },
              ])
          );
          set((state) => {
            const previousById = new Map(state.profiles.map((profile) => [profile.id, profile]));
            const nextProfiles = rows.map((row) => {
              const previous = previousById.get(row.id);
              const next = toStoreProfile(row, previous);
              const remoteAstro = astroByProfileId.get(row.id);
              return {
                ...next,
                astroResult: remoteAstro ?? previous?.astroResult ?? null,
                profileContext: (remoteAstro?.context ?? previous?.profileContext) ?? null,
              };
            });

            const nextActive =
              state.activeProfileId && nextProfiles.some((profile) => profile.id === state.activeProfileId)
                ? state.activeProfileId
                : nextProfiles[0]?.id ?? null;

            return {
              profiles: nextProfiles,
              astroByProfileId: {
                ...state.astroByProfileId,
                ...Object.fromEntries(astroPreviewByProfileId),
              },
              activeProfileId: nextActive,
              savedInsightIds: nextActive ? state.savedInsightIdsByProfile[nextActive] ?? [] : [],
              savedPracticeIds: nextActive ? state.savedPracticeIdsByProfile[nextActive] ?? [] : [],
              error: null,
            };
          });
          return rows.length;
        } catch (error) {
          set({ error: errorMessage(error, 'Failed to sync profiles from Supabase.') });
          return get().profiles.length;
        } finally {
          set({ isLoading: false });
        }
      },
      generateOrLoadAstroResult: async (id: string) => {
        const profile = get().profiles.find((item) => item.id === id);
        if (!profile) {
          set({ error: 'Profile not found.' });
          return;
        }

        const normalizedInput = normalizeBirthInput(profile.birthInput);
        let targetProfileId = id;

        // Old local state may contain non-UUID ids. Persist first and use remote UUID.
        if (!UUID_REGEX.test(id)) {
          try {
            const persisted = await upsertProfile(toUpsertPayload(profile));
            targetProfileId = persisted.id;
            await get().syncProfilesFromSupabase();
          } catch (error) {
            set({ error: errorMessage(error, 'Failed to sync profile before astro generation.') });
            return;
          }
        }

        set({ isLoading: true, error: null });
        try {
          const response = await generateOrLoadAstroResultFromApi(targetProfileId);
          const payload = toEnginePayload(response);
          if (!payload) {
            throw new Error('astro-engine returned invalid payload');
          }

          const mapped = mapStoredResultToAstroResult(
            normalizedInput,
            payload as Parameters<typeof mapStoredResultToAstroResult>[1]
          );

          set((state) => ({
            profiles: state.profiles.map((item) =>
              item.id === targetProfileId
                ? {
                    ...item,
                    birthInput: normalizedInput,
                    profileContext: mapped.context,
                    astroResult: mapped,
                    updatedAt: nowIso(),
                  }
                : item
            ),
            astroByProfileId: {
              ...state.astroByProfileId,
              [targetProfileId]: {
                source: response.source,
                engineVersion: response.engine_version,
                bigThree: getBigThreeSigns(payload),
              },
            },
          }));
        } catch (error) {
          set({ error: errorMessage(error, 'Failed to generate/load astro result.') });
        } finally {
          set({ isLoading: false });
        }
      },
      generateAstroResultForProfile: async (id: string) => {
        await get().generateOrLoadAstroResult(id);
      },
      getActiveProfile: () => {
        const state = get();
        if (!state.activeProfileId) {
          return state.profiles[0] ?? null;
        }
        return state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0] ?? null;
      },
      getActiveAstroResult: () => get().getActiveProfile()?.astroResult ?? null,
      clearError: () => {
        set({ error: null });
      },
      toggleInsightSaved: (profileId: string, insightId: string) => {
        const current = get().savedInsightIdsByProfile[profileId] ?? [];
        const exists = current.includes(insightId);
        set((state) => ({
          savedInsightIds: state.activeProfileId === profileId
            ? (exists ? current.filter((itemId) => itemId !== insightId) : [...current, insightId])
            : state.savedInsightIds,
          savedInsightIdsByProfile: {
            ...state.savedInsightIdsByProfile,
            [profileId]: exists
              ? current.filter((itemId) => itemId !== insightId)
              : [...current, insightId],
          },
        }));
      },
      togglePracticeSaved: (profileId: string, actId: string) => {
        const current = get().savedPracticeIdsByProfile[profileId] ?? [];
        const exists = current.includes(actId);
        set((state) => ({
          savedPracticeIds: state.activeProfileId === profileId
            ? (exists ? current.filter((itemId) => itemId !== actId) : [...current, actId])
            : state.savedPracticeIds,
          savedPracticeIdsByProfile: {
            ...state.savedPracticeIdsByProfile,
            [profileId]: exists
              ? current.filter((itemId) => itemId !== actId)
              : [...current, actId],
          },
        }));
      },
      addTestProfiles: () => {
        const fixtures = fixtureProfilesToPersons(nowIso());
        set((state) => {
          const byId = new Map(state.profiles.map((profile) => [profile.id, profile]));
          for (let i = 0; i < fixtures.length; i += 1) {
            const fixture = fixtures[i];
            if (!byId.has(fixture.id)) {
              byId.set(fixture.id, fixture);
            }
          }
          const nextProfiles = Array.from(byId.values()).sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
          const nextActiveId = state.activeProfileId ?? fixtures[0]?.id ?? null;
          return {
            profiles: nextProfiles,
            activeProfileId: nextActiveId,
            savedInsightIds: nextActiveId ? state.savedInsightIdsByProfile[nextActiveId] ?? [] : [],
            savedPracticeIds: nextActiveId ? state.savedPracticeIdsByProfile[nextActiveId] ?? [] : [],
          };
        });
      },
      resetToFixtures: () => {
        const fixtures = fixtureProfilesToPersons(nowIso());
        const defaultActiveId = 'fixture-tomek-1979-06-04-1730-warsaw';
        set((state) => ({
          ...state,
          profiles: fixtures,
          astroByProfileId: {},
          activeProfileId: defaultActiveId,
          savedInsightIds: [],
          savedPracticeIds: [],
          savedInsightIdsByProfile: {},
          savedPracticeIdsByProfile: {},
          error: null,
        }));
      },
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'birthcode.store.v2',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        profiles: state.profiles,
        astroByProfileId: state.astroByProfileId,
        activeProfileId: state.activeProfileId,
        savedInsightIds: state.savedInsightIds,
        savedPracticeIds: state.savedPracticeIds,
        savedInsightIdsByProfile: state.savedInsightIdsByProfile,
        savedPracticeIdsByProfile: state.savedPracticeIdsByProfile,
      }),
    }
  )
);

export const selectActiveProfile = (state: BirthcodeStore): PersonProfile | null =>
  state.activeProfileId
    ? state.profiles.find((profile) => profile.id === state.activeProfileId) ?? state.profiles[0] ?? null
    : state.profiles[0] ?? null;

export const selectActiveAstroResult = (state: BirthcodeStore) =>
  selectActiveProfile(state)?.astroResult ?? null;
