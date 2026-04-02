import { ZodiacElement, ZodiacModality } from '@/src/types';

export const ZODIAC_SIGNS = [
  'Aries',
  'Taurus',
  'Gemini',
  'Cancer',
  'Leo',
  'Virgo',
  'Libra',
  'Scorpio',
  'Sagittarius',
  'Capricorn',
  'Aquarius',
  'Pisces',
] as const;

export type ZodiacSign = (typeof ZODIAC_SIGNS)[number];

export type SignBoundary = {
  sign: ZodiacSign;
  startMonth: number;
  startDay: number;
};

export const TROPICAL_BOUNDARIES: SignBoundary[] = [
  { sign: 'Capricorn', startMonth: 12, startDay: 22 },
  { sign: 'Aquarius', startMonth: 1, startDay: 20 },
  { sign: 'Pisces', startMonth: 2, startDay: 19 },
  { sign: 'Aries', startMonth: 3, startDay: 21 },
  { sign: 'Taurus', startMonth: 4, startDay: 20 },
  { sign: 'Gemini', startMonth: 5, startDay: 21 },
  { sign: 'Cancer', startMonth: 6, startDay: 21 },
  { sign: 'Leo', startMonth: 7, startDay: 23 },
  { sign: 'Virgo', startMonth: 8, startDay: 23 },
  { sign: 'Libra', startMonth: 9, startDay: 23 },
  { sign: 'Scorpio', startMonth: 10, startDay: 23 },
  { sign: 'Sagittarius', startMonth: 11, startDay: 22 },
];

export const SIGN_META: Record<
  ZodiacSign,
  { element: ZodiacElement; modality: ZodiacModality }
> = {
  Aries: { element: 'Fire', modality: 'Cardinal' },
  Taurus: { element: 'Earth', modality: 'Fixed' },
  Gemini: { element: 'Air', modality: 'Mutable' },
  Cancer: { element: 'Water', modality: 'Cardinal' },
  Leo: { element: 'Fire', modality: 'Fixed' },
  Virgo: { element: 'Earth', modality: 'Mutable' },
  Libra: { element: 'Air', modality: 'Cardinal' },
  Scorpio: { element: 'Water', modality: 'Fixed' },
  Sagittarius: { element: 'Fire', modality: 'Mutable' },
  Capricorn: { element: 'Earth', modality: 'Cardinal' },
  Aquarius: { element: 'Air', modality: 'Fixed' },
  Pisces: { element: 'Water', modality: 'Mutable' },
};
