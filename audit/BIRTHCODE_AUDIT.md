# Birthcode Audit Report

- Generated: 2026-02-16T17:15:14

- Repo root: `C:\Users\Tomasz\unicorn\birthcode`

## Quick signals

- `app/` exists: **True**

- `locales/` exists: **True**

- i18n hints found: **True**

- Files scanned: **132**

- Mixed language heuristic hits: **3**

## Route map (from `app/`)

- `app\(tabs)\_index.tsx` (index)
- `app\(tabs)\_layout.tsx` (layout)
- `app\(tabs)\acts.tsx` (screen)
- `app\(tabs)\ask.tsx` (screen)
- `app\(tabs)\chart.tsx` (screen)
- `app\(tabs)\definitions.tsx` (screen)
- `app\(tabs)\explore.tsx` (screen)
- `app\(tabs)\insights.tsx` (screen)
- `app\(tabs)\profile.tsx` (screen)
- `app\(tabs)\saved.tsx` (screen)
- `app\(tabs)\settings.tsx` (screen)
- `app\_layout.tsx` (layout)
- `app\index.tsx` (index)
- `app\modal.tsx` (screen)
- `app\onboarding\index.tsx` (index)
- `app\profiles.tsx` (screen)

## Top files by long strings (likely hardcoded content)

| path | long_strings | mixed_lang_hint |
| --- | --- | --- |
| package-lock.json | 5049 | False |
| content\modules\pl\sign_core.json | 194 | False |
| content\modules\en\sign_core.json | 188 | False |
| locales\pl.json | 151 | True |
| locales\en.json | 145 | False |
| src\lib\ask\questions.ts | 70 | False |
| app\(tabs)\profile.tsx | 54 | True |
| .expo\types\router.d.ts | 51 | False |
| content\en\dominants.json | 50 | False |
| content\en\traits.json | 49 | False |
| lib\profile\profileBuilder.ts | 41 | False |
| app\(tabs)\saved.tsx | 41 | False |
| app\(tabs)\acts.tsx | 40 | False |
| content\en\big_three.json | 38 | False |
| app\(tabs)\definitions.tsx | 38 | False |
| app\(tabs)\insights.tsx | 38 | False |
| lib\insights\insightsBuilder.ts | 36 | False |
| content\pl\traits.json | 36 | True |
| app\onboarding\index.tsx | 36 | False |
| lib\acts\actsBuilder.ts | 34 | False |
| app\profiles.tsx | 32 | False |
| lib\engine\profileComposer.ts | 32 | False |
| content\modules\en\dominant_overlays.json | 32 | False |
| app\(tabs)\chart.tsx | 32 | False |
| dist\metadata.json | 31 | False |

## Top files by keyword density (likely logic / content hotspots)

| path | keyword_total | hits |
| --- | --- | --- |
| store\useBirthcodeStore.ts | 182 | {"birth": 22, "insight": 33, "profile": 127} |
| app\(tabs)\profile.tsx | 158 | {"locales": 1, "i18n": 1, "expo-router": 1, "copy": 12, "Clipboard": 3, "birth": 7, "ascendant": 12, "sun": 11, "moon": 11, "profile": 99} |
| locales\en.json | 120 | {"copy": 4, "Clipboard": 3, "expand": 2, "birth": 14, "ascendant": 14, "sun": 7, "moon": 7, "insight": 26, "profile": 43} |
| app\profiles.tsx | 87 | {"i18n": 1, "expo-router": 1, "react-navigation": 1, "birth": 7, "ascendant": 4, "sun": 2, "moon": 2, "profile": 69} |
| app\(tabs)\saved.tsx | 82 | {"i18n": 1, "copy": 9, "expand": 8, "birth": 11, "insight": 27, "profile": 26} |
| app\(tabs)\insights.tsx | 70 | {"i18n": 1, "expo-router": 1, "copy": 5, "birth": 9, "insight": 38, "profile": 16} |
| src\lib\engine\derive.ts | 62 | {"birth": 40, "sun": 4, "moon": 7, "profile": 11} |
| app\onboarding\index.tsx | 62 | {"i18n": 1, "expo-router": 1, "birth": 20, "profile": 40} |
| lib\engine\profileComposer.ts | 55 | {"ascendant": 5, "sun": 22, "moon": 24, "profile": 4} |
| package-lock.json | 52 | {"expo-router": 14, "react-navigation": 27, "Clipboard": 4, "expand": 5, "birth": 2} |
| src\lib\storage.ts | 48 | {"birth": 11, "insight": 16, "profile": 21} |
| locales\pl.json | 46 | {"copy": 2, "Clipboard": 1, "expand": 1, "birth": 6, "ascendant": 5, "sun": 8, "moon": 3, "insight": 6, "profile": 14} |
| lib\reports\profileReport.ts | 44 | {"birth": 7, "ascendant": 9, "sun": 3, "moon": 3, "profile": 22} |
| lib\astro\stubGenerator.ts | 35 | {"birth": 2, "ascendant": 5, "sun": 7, "moon": 7, "insight": 6, "profile": 8} |
| app\(tabs)\chart.tsx | 35 | {"i18n": 1, "birth": 7, "ascendant": 12, "sun": 3, "moon": 3, "profile": 9} |
| app\(tabs)\acts.tsx | 34 | {"i18n": 1, "expo-router": 1, "copy": 5, "birth": 9, "insight": 2, "profile": 16} |
| app\(tabs)\ask.tsx | 30 | {"locales": 1, "copy": 5, "Clipboard": 3, "expand": 4, "birth": 3, "profile": 14} |
| app\(tabs)\_layout.tsx | 30 | {"i18n": 1, "expo-router": 1, "birth": 3, "insight": 2, "profile": 23} |
| src\lib\ask\answer.ts | 29 | {"sun": 16, "moon": 13} |
| .expo\types\router.d.ts | 27 | {"expo-router": 3, "insight": 8, "profile": 16} |
| app\(tabs)\settings.tsx | 26 | {"i18n": 1, "expo-router": 1, "Clipboard": 3, "birth": 5, "insight": 4, "profile": 12} |
| app\index.tsx | 24 | {"i18n": 1, "expo-router": 1, "birth": 4, "profile": 18} |
| content\en\definitions.json | 20 | {"birth": 4, "ascendant": 3, "sun": 3, "moon": 3, "insight": 4, "profile": 3} |
| content\modules\en\role_overlays.json | 20 | {"ascendant": 4, "sun": 8, "moon": 8} |
| lib\insights\insightsBuilder.ts | 19 | {"insight": 9, "profile": 10} |

## Mixed-language heuristic candidates

| path | long_strings |
| --- | --- |
| locales\pl.json | 151 |
| content\pl\traits.json | 36 |
| app\(tabs)\profile.tsx | 54 |