import AsyncStorage from '@react-native-async-storage/async-storage';

import type { BirthProfile, InsightItem, QAItem } from '@/src/types';

const PROFILE_STORAGE_KEY = 'birthcode.profile.v1';
const QA_STORAGE_KEY = 'birthcode.qa.v1';
const INSIGHTS_STORAGE_KEY = 'birthcode.insights.v1';

function isValidProfile(input: unknown): input is BirthProfile {
  if (!input || typeof input !== 'object') {
    return false;
  }

  const candidate = input as Record<string, unknown>;
  return (
    typeof candidate.birthDateISO === 'string' &&
    (typeof candidate.birthTimeHHMM === 'string' || candidate.birthTimeHHMM === null) &&
    typeof candidate.timeUnknown === 'boolean' &&
    typeof candidate.timeConfidence === 'number' &&
    typeof candidate.placeText === 'string' &&
    typeof candidate.createdAtISO === 'string'
  );
}

export async function getJSON<T>(key: string): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);
    if (!raw) {
      return null;
    }
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setJSON<T>(key: string, value: T): Promise<void> {
  await AsyncStorage.setItem(key, JSON.stringify(value));
}

export async function getProfile(): Promise<BirthProfile | null> {
  const profile = await getJSON<BirthProfile>(PROFILE_STORAGE_KEY);
  return isValidProfile(profile) ? profile : null;
}

export async function saveProfile(profile: BirthProfile): Promise<void> {
  await setJSON(PROFILE_STORAGE_KEY, profile);
}

export async function clearProfile(): Promise<void> {
  await AsyncStorage.removeItem(PROFILE_STORAGE_KEY);
}

function isValidQAItem(input: unknown): input is QAItem {
  if (!input || typeof input !== 'object') {
    return false;
  }
  const candidate = input as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.createdAtISO === 'string' &&
    typeof candidate.category === 'string' &&
    typeof candidate.question === 'string' &&
    typeof candidate.answer === 'string' &&
    Array.isArray(candidate.references) &&
    Array.isArray(candidate.followUps)
  );
}

function isValidInsightItem(input: unknown): input is InsightItem {
  if (!input || typeof input !== 'object') {
    return false;
  }
  const candidate = input as Record<string, unknown>;
  return (
    typeof candidate.id === 'string' &&
    typeof candidate.dateISO === 'string' &&
    typeof candidate.title === 'string' &&
    typeof candidate.body === 'string' &&
    Array.isArray(candidate.tags) &&
    typeof candidate.saved === 'boolean'
  );
}

export async function getQAHistory(): Promise<QAItem[]> {
  const history = await getJSON<QAItem[]>(QA_STORAGE_KEY);
  if (!Array.isArray(history)) {
    return [];
  }
  return history.filter(isValidQAItem);
}

export async function addQA(item: QAItem): Promise<void> {
  const history = await getQAHistory();
  await setJSON(QA_STORAGE_KEY, [item, ...history]);
}

export async function clearQA(): Promise<void> {
  await AsyncStorage.removeItem(QA_STORAGE_KEY);
}

export async function getInsights(): Promise<InsightItem[]> {
  const insights = await getJSON<InsightItem[]>(INSIGHTS_STORAGE_KEY);
  if (!Array.isArray(insights)) {
    return [];
  }
  return insights.filter(isValidInsightItem);
}

export async function clearInsights(): Promise<void> {
  await AsyncStorage.removeItem(INSIGHTS_STORAGE_KEY);
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([PROFILE_STORAGE_KEY, QA_STORAGE_KEY, INSIGHTS_STORAGE_KEY]);
}
