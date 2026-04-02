export const EN_MATCH_BREAKDOWN_LABELS = {
  sun_sun: 'Sun ↔ Sun (Core Identity)',
  moon_moon: 'Moon ↔ Moon (Emotional World)',
  moon_sun: 'Moon ↔ Sun (Emotional Depth)',
  asc_asc: 'Asc ↔ Asc (Social Interface)',
} as const;

export const EN_MATCH_REASON_TEMPLATES = {
  strong:
    `Strong resonance. Your patterns on this axis are naturally aligned — ` +
    `you share a similar instinct for how to operate here. ` +
    `This creates ease and reduces the need for constant explanation.`,
  medium:
    `Moderate compatibility. There is enough overlap to create connection, ` +
    `but also enough difference to require translation. ` +
    `This axis will feel smooth in good conditions and challenging under pressure.`,
  low:
    `Significant difference. Your default patterns on this axis diverge. ` +
    `This is not a dealbreaker — it is a place that requires deliberate communication. ` +
    `Name the difference early. Build a shared protocol before friction accumulates.`,
} as const;
