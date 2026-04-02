import type { TensionKey } from '@/lib/content-engine/psychoNarrative';

// Krótkie etykiety inline używane w szablonach sekcji ({{tension_1}}, {{tension_2}})
export const PL_TENSION_SNIPPETS: Record<TensionKey, string> = {
  exploration_vs_control: 'Eksploracja vs. Kontrola',
  analysis_vs_speed: 'Analiza vs. Szybkość',
  independence_vs_connection: 'Niezależność vs. Bliskość',
  intensity_vs_lightness: 'Intensywność vs. Lekkość',
  perfection_vs_progress: 'Perfekcja vs. Postęp',
};

// Pełne opisy psychologiczne używane w sekcji Birthcode i nagłówku
export const PL_TENSION_DESCRIPTIONS: Record<TensionKey, string> = {
  exploration_vs_control:
    'Twój system jednocześnie pędzi ku nowym terytoriom i ku zabezpieczeniu tego, co już istnieje. Generujesz najlepsze pomysły w otwartej przestrzeni, ale wykonujesz najlepiej w ramach zdefiniowanych ograniczeń. Kluczem nie jest wybór jednej strony, ale planowanie obu: chronione okna eksploracji, a po nich twarde fazy zobowiązania.',

  analysis_vs_speed:
    'Twój system ciągnie ku dokładnemu zrozumieniu i ku szybkiemu wykonaniu. Głęboka analiza zwiększa dokładność, ale opóźnia działanie; szybkość chwyta okazje, ale zwiększa wskaźnik błędów. Rozwiązaniem jest sekwencjonowanie — ustal, kiedy decyzja musi być podjęta, zanim zdecydujesz, co zdecydować.',

  independence_vs_connection:
    'Twój system jednocześnie ceni autonomiczną własność i przynależność relacyjną. Działasz najlepiej z jasną samodzielną odpowiedzialnością, ale potrzebujesz też znaczących kontaktów relacyjnych, aby utrzymać motywację. Rozwiązaniem jest struktura: zaplanowane połączenie, które nie narusza własności.',

  intensity_vs_lightness:
    'Twój system dąży ku głębi, skupieniu i pełnemu zaangażowaniu, jednocześnie potrzebując regeneracji, humoru i interakcji o niskiej stawce. Wysoka intensywność produkuje Twoją najlepszą pracę, ale szybko wyczerpuje rezerwy. Rozwiązaniem jest projektowanie cykli: celowe lekkie fazy wbudowane w rytm, a nie dodawane jako refleksja po fakcie.',

  perfection_vs_progress:
    'Twój system dąży ku wysokiej jakości wyników i ku utrzymaniu tempa do przodu. Perfekcjonizm podnosi sufit jakości, ale spowalnia iterację; orientacja na postęp dostarcza szybciej, ale ryzykuje dług jakościowy. Rozwiązaniem jest ustalanie progów: zdefiniuj minimalny poziom jakości przed rozpoczęciem, a następnie chroń rytm iteracji przed nadmiernym dopieszczaniem.',
};
