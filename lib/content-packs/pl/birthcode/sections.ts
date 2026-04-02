
export const sections = {
  birthcode: {
    id: "bc_birthcode",
    title: "Twój Birthcode",
    blocks: [
      { id: "bc_birthcode_01", text: "Twój Birthcode powstaje z połączenia trzech głównych elementów kosmogramu: Słońca, Księżyca i Ascendentu. Te trzy energie tworzą psychologiczny wzorzec Twojego działania – sposób myślenia, reagowania emocjonalnego i kontaktu ze światem." }
    ]
  },

  potential: {
    id: "bc_potential",
    title: "Twój główny potencjał",
    blocks: [
      { id: "bc_potential_01", text: "Twoja największa siła pojawia się wtedy, gdy Twoje myślenie, emocje i działanie pracują w jednym kierunku. W takich momentach potrafisz działać szybciej, widzieć więcej możliwości niż inni i tworzyć rozwiązania, które łączą logikę z intuicją." }
    ]
  },

  mind: {
    id: "bc_mind",
    title: "Jak działa Twój umysł",
    blocks: [
      { id: "bc_mind_01", text: "Twój umysł działa najlepiej w środowisku, które daje przestrzeń na eksplorowanie pomysłów. Zamiast jednego rozwiązania naturalnie widzisz kilka alternatyw i potrafisz szybko zmieniać perspektywę." }
    ]
  },

  emotions: {
    id: "bc_emotions",
    title: "Twój system emocjonalny",
    blocks: [
      { id: "bc_emotions_01", text: "Twoje emocje są głównym systemem sygnałów informujących Cię o tym, czy jesteś w zgodzie ze sobą. Kiedy je ignorujesz, pojawia się napięcie. Kiedy je rozumiesz, zaczynają działać jak kompas." }
    ]
  },

  stress: {
    id: "bc_stress",
    title: "Twój tryb stresu",
    blocks: [
      { id: "bc_stress_01", text: "Pod presją Twój system psychologiczny przełącza się w domyślną strategię przetrwania wyznaczaną przez Twoje najsilniejsze napięcie. Zazwyczaj jest to próba odzyskania równowagi kosztem ignorowania jednej strony tego napięcia." },
      { id: "bc_stress_02", text: "Zrozumienie, którą metrykę poświęcasz w stresie, pozwala Ci świadomie zresetować swój system nerwowy, zanim wejdziesz w tryb reaktywny." }
    ]
  },

  relations: {
    id: "bc_relations",
    title: "Relacje i wpływ ludzi",
    blocks: [
      { id: "bc_relations_01", text: "W relacjach międzyludzkich Twój mechanizm psychologiczny zderza się z energiami innych. To, co u Ciebie jest naturalnym dążeniem (np. do kontroli lub autonomii), dla innych może stanowić źródło fascynacji lub tarcia." },
      { id: "bc_relations_02", text: "Najlepsze relacje budujesz nie wtedy, gdy rezygnujesz ze swojego głównego napięcia, ale wtedy, gdy świadomie komunikujesz swoje potrzeby i potrafisz wyważyć swoje naturalne skłonności." }
    ]
  }
}

type SectionKey = 'birthcode' | 'potential' | 'mind' | 'emotions' | 'action' | 'decisions' | 'genius' | 'stress' | 'relations';

const FALLBACK_TEXT = 'Tresc w przygotowaniu.';

export const PL_BIRTHCODE_SECTION_ORDER: SectionKey[] = [
  'birthcode',
  'potential',
  'mind',
  'emotions',
  'action',
  'decisions',
  'genius',
  'stress',
  'relations',
];

export const PL_BIRTHCODE_SECTION_TITLES: Record<SectionKey, string> = {
  birthcode: sections.birthcode?.title ?? 'Twój Birthcode',
  potential: sections.potential?.title ?? 'Twój glowny potencjal',
  mind: sections.mind?.title ?? 'Jak dziala Twój umysl',
  emotions: sections.emotions?.title ?? 'Twój system emocjonalny',
  action: 'Twój styl dzialania',
  decisions: 'Jak podejmujesz decyzje',
  genius: 'Twój tryb geniuszu',
  stress: sections.stress?.title ?? 'Twój tryb stresu',
  relations: sections.relations?.title ?? 'Relacje i wplyw ludzi',
};

export const PL_BIRTHCODE_SECTION_TEMPLATES: Record<SectionKey, string[]> = {
  birthcode: (sections.birthcode?.blocks ?? []).map((block) => block.text),
  potential: (sections.potential?.blocks ?? []).map((block) => block.text),
  mind: (sections.mind?.blocks ?? []).map((block) => block.text),
  emotions: (sections.emotions?.blocks ?? []).map((block) => block.text),
  action: [FALLBACK_TEXT],
  decisions: [FALLBACK_TEXT],
  genius: [FALLBACK_TEXT],
  stress: (sections.stress?.blocks ?? []).map((block) => block.text),
  relations: (sections.relations?.blocks ?? []).map((block) => block.text),
};
