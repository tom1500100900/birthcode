import type { ArchetypeKey, MetricKey, NarrativeSectionKey, SegmentKey, TensionKey } from '@/lib/content-engine/psychoNarrative';

type NarrativePack = {
  sectionTitles: Record<NarrativeSectionKey, string>;
  metricNames: Record<MetricKey, string>;
  archetypes: Record<ArchetypeKey, { headline: string; gift: string; risk: string }>;
  tensions: Record<TensionKey, { left: string; right: string; bridge: string }>;
  roleOpeners: Record<'sun' | 'moon' | 'asc', string>;
  roleSynthesis: Record<'sun' | 'moon' | 'asc', string>;
  segmentTone: Record<'sun' | 'moon' | 'asc', Record<SegmentKey, string>>;
  overviewIntegration: string;
  tensionPrompt: string;
  roleMetricBridge: string;
  decisionsFrame: string;
  decisionsSecond: string;
  ascImpactPrefix: string;
  geniusFrame: string;
  geniusExecution: string;
  stressFrame: string;
  stressBridge: string;
  stressRecovery: string;
  leadershipFrame: string;
  leadershipExecution: string;
  recommendationOpen: string;
  recommendationMiddle: string;
  recommendationClose: string;
};

export const plProfileNarrativePack: NarrativePack = {
  sectionTitles: {
    overview: 'Synteza',
    sun: 'Napedy Slonca',
    moon: 'Regulacja Ksiezyca',
    asc: 'Ekspresja Asc',
    decisions: 'Styl decyzji',
    genius: 'Strefa geniuszu',
    stress: 'Wzorzec stresu',
    leadership: 'Styl przywodztwa',
    recommendations: 'Rekomendacje',
  },
  metricNames: {
    curiosity_openness: 'Ciekawosc i otwartosc',
    analytical_order: 'Porzadek analityczny',
    emotional_sensitivity: 'Wrazliwosc emocjonalna',
    intensity_depth: 'Intensywnosc i glebia',
    social_expression: 'Ekspresja spoleczna',
    control_need: 'Potrzeba kontroli',
    adaptability: 'Adaptacyjnosc',
    persistence_drive: 'Napedy wytrwalosci',
    risk_orientation: 'Orientacja na ryzyko',
    connection_need: 'Potrzeba bliskosci',
  },
  archetypes: {
    'Explorer Mind': {
      headline: 'Dzialasz jak Explorer Mind.',
      gift: 'Twoja przewaga to odkrywanie wzorcow przez ruch i eksperyment.',
      risk: 'Mozesz zbyt dlugo rozszerzac opcje zamiast je domykac.',
    },
    'System Builder': {
      headline: 'Dzialasz jak System Builder.',
      gift: 'Twoja przewaga to budowanie powtarzalnych struktur.',
      risk: 'Mozesz przeoptymalizowac proces i opoznic adaptacje.',
    },
    'Strategic Transformer': {
      headline: 'Dzialasz jak Strategic Transformer.',
      gift: 'Twoja przewaga to zmiana systemow od srodka i we wlasciwym momencie.',
      risk: 'Mozesz za dlugo utrzymywac wysokie napiecie.',
    },
    'Social Catalyst': {
      headline: 'Dzialasz jak Social Catalyst.',
      gift: 'Twoja przewaga to szybkie uruchamianie ludzi i dynamiki.',
      risk: 'Mozesz brac na siebie zbyt wiele oczekiwan relacyjnych.',
    },
    'Sensitive Analyst': {
      headline: 'Dzialasz jak Sensitive Analyst.',
      gift: 'Twoja przewaga to laczenie precyzji i czytania sygnalow emocjonalnych.',
      risk: 'Pod zmeczeniem mozesz nadinterpretowac slabe sygnaly.',
    },
    'Steady Builder': {
      headline: 'Dzialasz jak Steady Builder.',
      gift: 'Twoja przewaga to trwaly postep pod presja.',
      risk: 'Mozesz zbyt dlugo trzymac sie starego sposobu dzialania.',
    },
    'Visionary Architect': {
      headline: 'Dzialasz jak Visionary Architect.',
      gift: 'Twoja przewaga to laczenie wizji z konkretnym planem.',
      risk: 'Mozesz zostac za dlugo w fazie projektowej.',
    },
    'Deep Strategist': {
      headline: 'Dzialasz jak Deep Strategist.',
      gift: 'Twoja przewaga to precyzyjne pozycjonowanie na dlugi dystans.',
      risk: 'Przy niepewnosci mozesz przechodzic w nadmierna kontrole.',
    },
    'Curious Integrator': {
      headline: 'Dzialasz jak Curious Integrator.',
      gift: 'Twoja przewaga to laczenie perspektyw i jezykow zespolowych.',
      risk: 'Mozesz chlonac za duzo sprzecznych danych.',
    },
    'Pragmatic Optimizer': {
      headline: 'Dzialasz jak Pragmatic Optimizer.',
      gift: 'Twoja przewaga to upraszczanie zlozonych procesow.',
      risk: 'Mozesz ucinasz eksploracje zbyt szybko.',
    },
    'Relational Harmonizer': {
      headline: 'Dzialasz jak Relational Harmonizer.',
      gift: 'Twoja przewaga to budowanie zaufania i naprawa relacji.',
      risk: 'Mozesz tlumic wlasny kierunek dla utrzymania spokoju.',
    },
    'Adaptive Pioneer': {
      headline: 'Dzialasz jak Adaptive Pioneer.',
      gift: 'Twoja przewaga to szybki start i elastyczne korekty.',
      risk: 'Mozesz wyprzedzac swoj rytm regeneracji.',
    },
  },
  tensions: {
    exploration_vs_control: {
      left: 'Eksploracja',
      right: 'Kontrola',
      bridge: 'Najlepiej dzialasz, gdy masz okna swobody i twarde ramy wykonania.',
    },
    analysis_vs_speed: {
      left: 'Analiza',
      right: 'Szybkosc',
      bridge: 'Jakosc decyzji rosnie, gdy najpierw ustalasz moment decyzji.',
    },
    independence_vs_connection: {
      left: 'Niezaleznosc',
      right: 'Bliskosc',
      bridge: 'Skutecznosc rosnie, gdy laczysz samodzielnosc z regularnym feedbackiem relacyjnym.',
    },
    intensity_vs_lightness: {
      left: 'Intensywnosc',
      right: 'Lekkosc',
      bridge: 'Duza glebia dziala najlepiej, gdy ma zaplanowane fazy odciazenia.',
    },
    perfection_vs_progress: {
      left: 'Perfekcja',
      right: 'Postep',
      bridge: 'Jakosc rosnie, gdy chronisz rytm iteracji przed dopieszczaniem.',
    },
  },
  roleOpeners: {
    sun: 'Twoje Slonce opisuje, jak intencja zamienia sie w dzialanie.',
    moon: 'Twoj Ksiezyc opisuje, jak regulujesz emocje i wracasz do rownowagi.',
    asc: 'Twoj Asc opisuje strategie pierwszego kontaktu z ludzmi i sytuacjami.',
  },
  roleSynthesis: {
    sun: 'Ten kanal dziala najmocniej, gdy cel jest nazwany i mierzalny.',
    moon: 'Ten kanal dziala najmocniej, gdy potrzeby sa nazwane przed reakcja.',
    asc: 'Ten kanal dziala najmocniej, gdy przejscia sa przygotowane.',
  },
  segmentTone: {
    sun: {
      early: 'Start jest szybki i nastawiony na prototypowanie.',
      mid: 'Tempo jest zrownowazone i sekwencyjne.',
      late: 'Domykanie idzie przez konsolidacje i glebie.',
    },
    moon: {
      early: 'Sygnaly emocjonalne sa wychwytywane szybko.',
      mid: 'Sygnaly emocjonalne sa integrowane krok po kroku.',
      late: 'Sygnaly emocjonalne sa najpierw poglabiane, potem wyrazane.',
    },
    asc: {
      early: 'Styl wejscia jest bezposredni i dynamiczny.',
      mid: 'Styl wejscia jest wywazony i kontekstowy.',
      late: 'Styl wejscia jest selektywny i intencjonalny.',
    },
  },
  overviewIntegration: 'Najmocniejsze metryki teraz to',
  tensionPrompt: 'Glowny punkt rownowazenia dotyczy',
  roleMetricBridge: 'W tej roli najmocniej pracuja dzwignie',
  decisionsFrame: 'Jakosc decyzji jest ksztaltowana przez',
  decisionsSecond: 'Rytm wykonania jest ksztaltowany przez',
  ascImpactPrefix: 'Wplyw modulacji ASC w tym cyklu:',
  geniusFrame: 'Najwieksza wartosc tworzysz, gdy opierasz sie na',
  geniusExecution: 'To polaczenie wspiera wysoka skutecznosc w zlozonych warunkach.',
  stressFrame: 'W stresie najslabiej podparte sa obszary',
  stressBridge: 'Ignorowanie tego szybko podnosi tarcie.',
  stressRecovery: 'Regeneracja przyspiesza, gdy jawnie nazwiesz aktywny kompromis.',
  leadershipFrame: 'Wplyw przywodczy opiera sie glownie na',
  leadershipExecution: 'Stabilnosc dowozu wzmacniaja',
  recommendationOpen: 'Zbuduj jeden tygodniowy nawyk, ktory wzmacnia',
  recommendationMiddle: 'Ustal jedna granice, ktora chroni',
  recommendationClose: 'W planowaniu wracaj do pytania integrujacego:',
};
