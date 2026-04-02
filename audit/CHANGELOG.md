# Audit Changelog

## 2026-02-16 - i18n cleanup (Insights / Acts focus)
- Updated `app/(tabs)/insights.tsx`:
  - kept all UI copy on `t(...)`
  - fixed Definitions navigation target to `/(tabs)/definitions`
- Updated `app/(tabs)/acts.tsx`:
  - kept all UI copy on `t(...)`
  - fixed Definitions navigation target to `/(tabs)/definitions`
- Updated `locales/pl.json`:
  - cleaned mixed/broken strings and normalized PL microcopy in existing keys
  - adjusted labels: `tabs.activeProfile`, `tabs.activeProfileFallback`, `profile.info.degreesMessage`, `chart.orbFormat`, `chart.info.degreesMessage`, `premium.dailyTitle`, `definitions.degreesText1`, `definitions.elementsFire`, `settings.languageEnglish`, `settings.resetMessage`
- Updated `content/pl/traits.json`:
  - replaced corrupted content with clean Polish content structure
  - preserved module shape for `profile`, `extraversion`, and remaining Big Five buckets

## 2026-02-16 - Astro Pipeline v1 (provider-ready context flow)
- Added target pipeline types in `types/astro.ts`:
  - `BirthInput` (dateISO/timeHHmm/placeName/timezone/lat/lon)
  - `AstroSnapshot`, `Placement`, `ProfileContext`, `AstroProvider`
  - `AstroResult` now carries `context`
  - `PersonProfile` now stores `profileContext`
- Added provider layer in `lib/astro/provider.ts`:
  - `StubAstroProvider` implements `computeSnapshot(input)`
  - single provider swap point for future Swiss Ephemeris integration
- Reworked derivation in `src/lib/engine/derive.ts`:
  - `derivePlacement` with sign/signDeg/segment/decan/cusp logic
  - `deriveProfileContext`, `buildProfileContext`
  - `deriveProfileContextFromChart` fallback adapter
- Updated generation flow:
  - `lib/astro/stubGenerator.ts` now builds chart from `ProfileContext`
  - `lib/astro/resultBuilder.ts` now builds `ProfileContext` for backend charts too
  - `store/useBirthcodeStore.ts` stores normalized `BirthInput` and `profileContext`
- Updated engine consumers to use context-aware signatures:
  - `lib/profile/profileBuilder.ts`
  - `lib/insights/insightsBuilder.ts`
  - `lib/acts/actsBuilder.ts`
  - `lib/engine/profileComposer.ts`
- Added compatibility normalization for old persisted inputs:
  - `lib/astro/input.ts`
- Added smoke test for segmentation/cusp:
  - `lib/astro/__tests__/segmentSmoke.ts`

## 2026-02-16 - Content overlays + automation tooling
- Added new overlay modules:
  - `content/modules/en/decan_overlays.json`
  - `content/modules/pl/decan_overlays.json`
  - `content/modules/en/cusp_overlays.json`
  - `content/modules/pl/cusp_overlays.json`
- Fixed empty module JSONs and kept parity:
  - `content/modules/en/aspect_modules.json`
  - `content/modules/pl/aspect_modules.json`
- Added generated content registry:
  - `scripts/generate-content-index.ts`
  - generated output: `content/generated/index.ts`
  - composer/module repo now consume modules via generated registry instead of manual JSON import list
- Added automated content quality checks:
  - `scripts/content_check.ts`
  - checks JSON validity, EN/PL parity (modules + locales), overlay schema, and language-mix heuristics
  - new package scripts:
    - `content:generate-index`
    - `content:check`
- Composer integration:
  - `lib/engine/profileComposer.ts` now appends decan + segment + cusp overlays based on `ProfileContext.placements.*.decan/segment/isCusp`
  - changing stub-derived degrees now changes overlay paragraphs deterministically
