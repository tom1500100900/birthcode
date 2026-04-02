
export const matchBands = [
  {
    id: "m_band_low",
    range: [0,39],
    summary: "Ta relacja może wymagać dużo pracy i zrozumienia różnic."
  },

  {
    id: "m_band_mid",
    range: [40,74],
    summary: "Między Wami istnieje potencjał, ale wymaga on świadomej komunikacji."
  },

  {
    id: "m_band_high",
    range: [75,100],
    summary: "Wasze energie naturalnie się uzupełniają i możecie się wzajemnie wzmacniać."
  }
]

const lowSummary = matchBands.find((item) => item.id === 'm_band_low')?.summary ?? 'Tresc w przygotowaniu.';
const midSummary = matchBands.find((item) => item.id === 'm_band_mid')?.summary ?? 'Tresc w przygotowaniu.';
const highSummary = matchBands.find((item) => item.id === 'm_band_high')?.summary ?? 'Tresc w przygotowaniu.';

export const PL_MATCH_BREAKDOWN_LABELS = {
  sun_sun: 'Słońce ↔ Słońce',
  moon_moon: 'Księżyc ↔ Księżyc',
  moon_sun: 'Księżyc ↔ Słońce',
  asc_asc: 'Asc ↔ Asc',
};

export const PL_MATCH_REASON_TEMPLATES = {
  low: lowSummary,
  medium: midSummary,
  strong: highSummary,
};
