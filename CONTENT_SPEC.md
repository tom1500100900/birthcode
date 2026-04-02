# Birthcode Content Spec v1

## Purpose
Birthcode content is reflective and educational. It helps users understand patterns, choices, and self-regulation. No diagnosing, no therapy claims, no medical language.

## Psychological Methodology
- Big Five (OCEAN) as primary trait framework (openness, conscientiousness, extraversion, agreeableness, emotional_stability).
- Self-Determination Theory (SDT): autonomy, competence, relatedness for practices/recommendations.
- CBT-lite patterning for “risks”: trigger → automatic response → cost → alternative response → recovery move.
- Strengths-based framing: resource → shadow → growth edge.

UI text should remain human and non-technical (avoid “low trait” wording in the UI).

## Content Modules
Content lives in modular JSON files per language:
- definitions
- big_three
- dominants
- traits (Big Five buckets)
- risks (CBT-lite)
- recommendations (SDT)
- insights
- practices
- ui copy
Future: daily (premium layer)

## Block Shapes
TraitBlock:
- title, shortSummary, longDescription (120–220 words)
- howItShowsUp (3–5 bullets)
- watchOutFor (3–5 bullets)
- growthSuggestion (2–4 bullets)
- examples (1–2 short scenarios)
- microActions (2–3 steps)

InsightBlock:
- title, shortSummary, longDescription (120–220 words)
- questions (3)
- experiment (1)

PracticeBlock:
- title, shortSummary
- rationale (80–150 words)
- durationMinutes
- steps (4–7)
- difficulty (easy|medium|hard)
- reflectionAfter (2)

DefinitionBlock:
- title, body (40–120 words), optional bullets (2–4)

## Variables & Schema
Variables computed by engine (stub now, Swiss later):
- Big Five scores 0–100 with buckets:
  low (0–33), mid (34–66), high (67–100)
- SDT need emphasis: autonomy/competence/relatedness
- Dominants: element (Fire/Earth/Air/Water) and modality (Cardinal/Fixed/Mutable)

Engine computes variables; content maps variables → stable keys.

## Key Naming
Stable DB-friendly dot keys, lowercase + snake_case:
- definitions.big_three
- big_three.sun
- dominants.element.fire.meaning
- traits.extraversion.high.longDescription
EN and PL must have identical key structure.

## Localization Rules
No mixed-language strings. Builders must not hardcode long text; they select keys. EN/PL parity required.

## UX Rules
Long text uses Expand/Collapse. Every card supports Copy-to-Clipboard. Saved items store: id + type (insight|practice).

## Quality Standards
Concrete examples (work/relationships/stress). No horoscope clichés. No diagnosis language. Each block ends with micro-action/experiment. Tone: grounded, supportive, not preachy.
