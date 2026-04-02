import { SIGN_META, ZODIAC_SIGNS } from '@/src/lib/engine/zodiac';

type Lang = 'pl' | 'en';

const LABELS: Record<Lang, Record<string, string>> = {
  pl: {
    Aries: 'Baran',
    Taurus: 'Byk',
    Gemini: 'Bliźnięta',
    Cancer: 'Rak',
    Leo: 'Lew',
    Virgo: 'Panna',
    Libra: 'Waga',
    Scorpio: 'Skorpion',
    Sagittarius: 'Strzelec',
    Capricorn: 'Koziorozec',
    Aquarius: 'Wodnik',
    Pisces: 'Ryby',
  },
  en: {
    Aries: 'Aries',
    Taurus: 'Taurus',
    Gemini: 'Gemini',
    Cancer: 'Cancer',
    Leo: 'Leo',
    Virgo: 'Virgo',
    Libra: 'Libra',
    Scorpio: 'Scorpio',
    Sagittarius: 'Sagittarius',
    Capricorn: 'Capricorn',
    Aquarius: 'Aquarius',
    Pisces: 'Pisces',
  },
};

const CANON_BY_LOWER = Object.fromEntries(
  ZODIAC_SIGNS.map((sign) => [sign.toLowerCase(), sign] as const)
) as Record<string, (typeof ZODIAC_SIGNS)[number]>;

export function toCanonicalSign(sign: string | undefined): (typeof ZODIAC_SIGNS)[number] {
  const key = String(sign ?? '').trim().toLowerCase();
  return CANON_BY_LOWER[key] ?? 'Aries';
}

export function zodiacLabel(sign: string | undefined, lang: Lang): string {
  const canonical = toCanonicalSign(sign);
  return LABELS[lang][canonical] ?? canonical;
}

export function zodiacElement(sign: string | undefined) {
  return SIGN_META[toCanonicalSign(sign)].element;
}

export function zodiacModality(sign: string | undefined) {
  return SIGN_META[toCanonicalSign(sign)].modality;
}
