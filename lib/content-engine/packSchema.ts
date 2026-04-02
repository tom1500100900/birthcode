import { z } from 'zod';

export const SIGN_KEYS = [
  'aries',
  'taurus',
  'gemini',
  'cancer',
  'leo',
  'virgo',
  'libra',
  'scorpio',
  'sagittarius',
  'capricorn',
  'aquarius',
  'pisces',
] as const;

export const ELEMENT_KEYS = ['fire', 'earth', 'air', 'water'] as const;
export const MODALITY_KEYS = ['cardinal', 'fixed', 'mutable'] as const;
export const DEGREE_BAND_KEYS = ['early', 'mid', 'late'] as const;
export const ASPECT_TYPE_KEYS = ['conjunction', 'sextile', 'square', 'trine', 'opposition'] as const;
export const HOUSE_KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] as const;
export const PLANET_KEYS = [
  'sun',
  'moon',
  'mercury',
  'venus',
  'mars',
  'jupiter',
  'saturn',
  'uranus',
  'neptune',
  'pluto',
] as const;

export type Sign = typeof SIGN_KEYS[number];
export type Element = typeof ELEMENT_KEYS[number];
export type Modality = typeof MODALITY_KEYS[number];
export type DegreeBand = typeof DEGREE_BAND_KEYS[number];
export type ContentPackLocale = 'en' | 'pl';

export const AtomBlockSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  bodyShort: z.string().min(1),
  bodyLong: z.string().min(1),
  tags: z.array(z.string().min(1)).optional(),
  sources: z.array(z.string().min(1)).optional(),
});

function keyedObjectSchema<const K extends readonly string[], T>(
  keys: K,
  valueSchema: z.ZodType<T>
) {
  const shape = {} as Record<K[number], z.ZodType<T>>;
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i] as K[number];
    shape[key] = valueSchema;
  }
  return z.object(shape).strict();
}

const SignSectionSchema = z.object({
  general: AtomBlockSchema,
  byDegreeBand: keyedObjectSchema(DEGREE_BAND_KEYS, AtomBlockSchema),
}).strict();

const SunAtomSchema = z.object({
  core: SignSectionSchema,
  strengths: SignSectionSchema,
  risks: SignSectionSchema,
  recommendations: SignSectionSchema,
}).strict();

const MoonAtomSchema = z.object({
  needs: SignSectionSchema,
  regulation: SignSectionSchema,
  attachment: SignSectionSchema,
}).strict();

const AscAtomSchema = z.object({
  firstImpression: SignSectionSchema,
  socialStyle: SignSectionSchema,
  growthEdge: SignSectionSchema,
}).strict();

export const ContentPackSchema = z.object({
  meta: z.object({
    version: z.literal('v1'),
    locale: z.enum(['en', 'pl']),
    createdAt: z.string().min(1),
    contentRevision: z.number().int().nonnegative(),
  }).strict(),
  atoms: z.object({
    sun: keyedObjectSchema(SIGN_KEYS, SunAtomSchema),
    moon: keyedObjectSchema(SIGN_KEYS, MoonAtomSchema),
    asc: keyedObjectSchema(SIGN_KEYS, AscAtomSchema),
    dominants: z.object({
      element: keyedObjectSchema(ELEMENT_KEYS, AtomBlockSchema),
      modality: keyedObjectSchema(MODALITY_KEYS, AtomBlockSchema),
    }).strict(),
    aspects: z.object({
      types: keyedObjectSchema(ASPECT_TYPE_KEYS, AtomBlockSchema),
      tensionBands: z.object({
        low: AtomBlockSchema,
        medium: AtomBlockSchema,
        high: AtomBlockSchema,
      }).strict(),
    }).strict(),
    houses: keyedObjectSchema(HOUSE_KEYS, AtomBlockSchema),
    planets: keyedObjectSchema(PLANET_KEYS, AtomBlockSchema),
  }).strict(),
  combos: z.object({
    sun_moon: z.record(z.string(), AtomBlockSchema),
    sun_asc: z.record(z.string(), AtomBlockSchema),
    moon_asc: z.record(z.string(), AtomBlockSchema),
    big_three: z.record(z.string(), AtomBlockSchema),
  }).strict(),
}).strict();

export const DegreeBandSchema = z.enum(DEGREE_BAND_KEYS);
export const AspectTensionBandSchema = z.object({
  low: AtomBlockSchema,
  medium: AtomBlockSchema,
  high: AtomBlockSchema,
}).strict();

export type AtomBlock = z.infer<typeof AtomBlockSchema>;
export type ContentPack = z.infer<typeof ContentPackSchema>;
