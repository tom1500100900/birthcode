export const practices = [
  {
    id: 'pr_stress_reset',
    title: 'Reset stresu',
    description: 'Kiedy czujesz napięcie, zatrzymaj się na 3 minuty i skup się tylko na oddechu.',
    category: 'stres',
  },
  {
    id: 'pr_focus_block',
    title: 'Blok koncentracji',
    description: 'Pracuj przez 25 minut nad jednym zadaniem bez zadnych rozproszen.',
    category: 'kariera',
  },
  {
    id: 'pr_relations_check',
    title: 'Check relacji',
    description: 'Raz w tygodniu zadaj sobie pytanie: które relacje dodaja mi energii, a które ja odbieraja?',
    category: 'relacje',
  },
  {
    id: 'pr_identity_values',
    title: 'Kompas wartosci',
    description: 'Zapisz 3 wartosci na ten tydzien i sprawdz, czy codzienne decyzje sa z nimi spojne.',
    category: 'tożsamość',
  },
  {
    id: 'pr_stress_loop_close',
    title: 'Domkniecie petli stresu',
    description: 'Wybierz jedna otwarta petle i domknij ja dzisiaj, nawet w wersji minimalnej.',
    category: 'stres',
  },
  {
    id: 'pr_career_decision_log',
    title: 'Dziennik decyzji zawodowych',
    description: 'Po wazniejszej decyzji zapisz kontekst, wybor i efekt po 24 godzinach.',
    category: 'kariera',
  },
];

export type PracticeTemplate = {
  id: string;
  category: 'identity' | 'career' | 'relationships' | 'stress';
  title: string;
  durationMin: number;
  steps: string[];
  expectedOutcome: string;
  metricFocus: Array<
    | 'curiosity_openness'
    | 'analytical_order'
    | 'emotional_sensitivity'
    | 'intensity_depth'
    | 'social_expression'
    | 'control_need'
    | 'adaptability'
    | 'persistence_drive'
    | 'risk_orientation'
    | 'connection_need'
  >;
  tensionFocus: Array<
    | 'exploration_vs_control'
    | 'analysis_vs_speed'
    | 'independence_vs_connection'
    | 'intensity_vs_lightness'
    | 'perfection_vs_progress'
  >;
};

function mapCategory(category: string): PracticeTemplate['category'] {
  if (category === 'stres') return 'stress';
  if (category === 'relacje') return 'relationships';
  if (category === 'tożsamość') return 'identity';
  return 'career';
}

export const PL_PRACTICES: PracticeTemplate[] = practices.map((item) => ({
  id: item.id,
  category: mapCategory(item.category),
  title: item.title,
  durationMin: item.category === 'stres' ? 8 : item.category === 'relacje' ? 10 : item.category === 'tożsamość' ? 12 : 20,
  steps: [
    `Zacznij od tego: ${item.description}`,
    'Wykonaj wersje minimalna tej praktyki jeszcze dzisiaj.',
    'Na koniec zapisz w jednym zdaniu, co się zmienilo.',
  ],
  expectedOutcome: item.description,
  metricFocus: item.category === 'stres'
    ? ['emotional_sensitivity', 'intensity_depth']
    : item.category === 'relacje'
      ? ['connection_need', 'social_expression']
      : item.category === 'tożsamość'
        ? ['curiosity_openness', 'control_need']
        : ['persistence_drive', 'analytical_order'],
  tensionFocus: item.category === 'stres'
    ? ['intensity_vs_lightness']
    : item.category === 'relacje'
      ? ['independence_vs_connection']
      : item.category === 'tożsamość'
        ? ['exploration_vs_control']
        : ['perfection_vs_progress'],
}));
