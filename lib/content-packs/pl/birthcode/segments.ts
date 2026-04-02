
export const segments = {
  early: {
    id: "seg_early",
    text: "Wczesny segment znaku oznacza energię inicjowania – częściej zaczynasz nowe rzeczy niż je kończysz."
  },
  mid: {
    id: "seg_mid",
    text: "Środkowy segment znaku daje stabilność i równowagę między impulsem a refleksją."
  },
  late: {
    id: "seg_late",
    text: "Późny segment znaku daje dojrzałość i zdolność integrowania doświadczeń."
  }
}

export function segmentSnippet(segmentKey: 'early' | 'mid' | 'late'): { id: string; text: string } | null {
  return segments[segmentKey] ?? null;
}
