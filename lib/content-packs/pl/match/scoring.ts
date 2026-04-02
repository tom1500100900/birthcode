// PL Match Scoring Content Pack

export const PL_MATCH_BREAKDOWN_LABELS = {
  sun_sun: 'Słońce ↔ Słońce (Tożsamość)',
  moon_moon: 'Księżyc ↔ Księżyc (Świat emocjonalny)',
  moon_sun: 'Księżyc ↔ Słońce (Głębia emocjonalna)',
  asc_asc: 'Asc ↔ Asc (Interfejs społeczny)',
} as const;

export const PL_MATCH_REASON_TEMPLATES = {
  strong:
    `Silny rezonans. Wasze wzorce na tej osi są naturalnie wyrównane — ` +
    `dzielicie podobny instynkt działania w tym obszarze. ` +
    `To tworzy łatwość i zmniejsza potrzebę ciągłego tłumaczenia.`,
  medium:
    `Umiarkowana kompatybilność. Jest wystarczająco dużo części wspólnych, żeby tworzyć połączenie, ` +
    `ale również wystarczająco dużo różnic, żeby wymagać tłumaczenia. ` +
    `Ta oś będzie płynna w dobrych warunkach i wymagająca pod presją.`,
  low:
    `Znacząca różnica. Wasze domyślne wzorce na tej osi się rozchodzą. ` +
    `To nie jest dyskwalifikacja — to miejsce, które wymaga świadomej komunikacji. ` +
    `Nazwijcie różnicę wcześnie. Zbudujcie wspólny protokół, zanim tarcie się nagromadzi.`,
} as const;
