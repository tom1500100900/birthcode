# Content Pack Guide (v1)

This guide defines how to upgrade premium-ready content packs without changing the schema.

## Scope

- Schema: `lib/content-engine/packSchema.ts`
- Runtime loader: `lib/content-engine/packRepo.ts`
- Pack files:
  - `content/packs/v1/en/pack.json`
  - `content/packs/v1/pl/pack.json`

## Naming Conventions

### Block IDs

Use stable, dot-separated IDs:

- Sun section block: `sun.<sign>.<section>.<general|early|mid|late>`
- Moon section block: `moon.<sign>.<section>.<general|early|mid|late>`
- Asc section block: `asc.<sign>.<section>.<general|early|mid|late>`
- Dominants: `dominants.element.<element>`, `dominants.modality.<modality>`
- Aspects: `aspects.types.<type>`, `aspects.tension.<low|medium|high>`
- Houses: `houses.<1-12>`
- Planets: `planets.<planet>`
- Combos: `combos.<group>.<key>` (optional convention; group object key is still authoritative)

IDs should be deterministic and never reused for unrelated meaning.

### Combo Keys

Use lowercase sign keys only:

- `sun_moon`: `<sun>__<moon>` (example: `aries__scorpio`)
- `sun_asc`: `<sun>__<asc>` (example: `aries__leo`)
- `moon_asc`: `<moon>__<asc>` (example: `scorpio__leo`)
- `big_three`: `<sun>__<moon>__<asc>` (example: `aries__scorpio__leo`)

Do not use spaces, title case, or single `_`.

## Writing Premium Content

Each block has:

- `bodyShort`: compact UI/preview/copy surface.
- `bodyLong`: full interpretation text for expanded views.

Guidelines:

- `bodyShort` should be concise and scannable.
- `bodyLong` should carry nuance and practical framing.
- Keep meaning aligned between both fields; `bodyLong` extends rather than contradicts `bodyShort`.
- Keep locale parity: EN and PL should have equivalent structure and intent.

## Upgrading Content Revision

When replacing pack content with a higher-quality revision:

1. Keep schema version fixed at `meta.version = "v1"`.
2. Replace only pack bodies/metadata content in `pack.json`.
3. Increase `meta.contentRevision` (integer, monotonic).
4. Keep all required keys and objects present (including empty combo maps if not filled yet).
5. Run validation before commit.

Recommended commit style:

- `content(pack-v1): bump EN/PL to revision <N>`

## Validation Before Commit

Run:

```bash
npm run content:validate
```

This script:

- Loads EN and PL packs.
- Validates each pack via `ContentPackSchema` (Zod).
- Prints section block counts and combo entry counts.
- Exits non-zero on any error.

## Scaling to 1700+ Variants

Prefer layered coverage instead of writing every full triple description manually:

- Base layers:
  - Sun/Moon/Asc sign sections (`general` + degree bands)
  - Dominants (`element`, `modality`)
  - Aspect tension bands and aspect types
- Overlay layers:
  - Pair combos (`sun_moon`, `sun_asc`, `moon_asc`)
  - Selective `big_three` entries only where premium depth is needed

This keeps authoring tractable while allowing high personalization density without schema changes.
