
export const matchNarratives = {
  strength: [
    { id: "m_strength_01", text: "Waszą największą siłą jest zdolność do inspirowania się nawzajem." }
  ],
  tension: [
    { id: "m_tension_01", text: "Największe napięcia mogą pojawiać się wtedy, gdy każde z Was próbuje narzucić własny sposób działania." }
  ],
  advice: [
    { id: "m_advice_01", text: "Najlepszym sposobem pracy z tą relacją jest otwarta komunikacja i regularne sprawdzanie potrzeb obu stron." }
  ]
}

const firstText = (key: keyof typeof matchNarratives): string =>
  matchNarratives[key]?.[0]?.text ?? 'Tresc w przygotowaniu.';

export const PL_MATCH_SECTION_TEMPLATES = {
  overallTitle: 'Ocena dopasowania',
  overallBody: firstText('strength'),
  dynamicTitle: 'Punkty napięcia',
  dynamicBody: firstText('tension'),
  growthTitle: 'Rekomendacja',
  growthBody: firstText('advice'),
};
