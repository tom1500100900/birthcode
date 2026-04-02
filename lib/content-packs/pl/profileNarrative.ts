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
    overview: 'Twój wzorzec',
    sun: 'Jak działasz',
    moon: 'Jak się regenerujesz',
    asc: 'Jak Cię widzą inni',
    decisions: 'Jak decydujesz',
    genius: 'Twoja strefa geniuszu',
    stress: 'Pod presją',
    leadership: 'Twój wpływ',
    recommendations: 'Co zrobić teraz',
  },
  metricNames: {
    curiosity_openness: 'Ciekawość i otwartość',
    analytical_order: 'Porządek analityczny',
    emotional_sensitivity: 'Wrażliwość emocjonalna',
    intensity_depth: 'Intensywność i głębia',
    social_expression: 'Ekspresja społeczna',
    control_need: 'Potrzeba kontroli',
    adaptability: 'Adaptatywność',
    persistence_drive: 'Napęd wytrwałości',
    risk_orientation: 'Orientacja na ryzyko',
    connection_need: 'Potrzeba bliskości',
  },
  archetypes: {
    'Explorer Mind': {
      headline: 'Jesteś Umysłem Odkrywcy.',
      gift: 'Łączysz kropki, których inni nie widzą. Rozwijasz się na nowych informacjach i nieoczekiwanych połączeniach.',
      risk: 'Zaczynasz więcej niż kończysz. Prawdziwa praca to wybór jednego toru i pozostanie w nim.',
    },
    'System Builder': {
      headline: 'Jesteś Budowniczym Systemów.',
      gift: 'Tworzysz porządek z chaosu. Twoje struktury przeżywają Cię — to Twoja supermoc.',
      risk: 'Optymalizujesz za wcześnie. Czasem wersja niedoskonała jest właściwą wersją.',
    },
    'Strategic Transformer': {
      headline: 'Jesteś Strategicznym Transformatorem.',
      gift: 'Widzisz ruch trzy kroki do przodu. Zmieniasz rzeczy od środka — cicho i precyzyjnie.',
      risk: 'Trzymasz napięcie za długo. Uwolnienie jest częścią strategii.',
    },
    'Social Catalyst': {
      headline: 'Jesteś Społecznym Katalizatorem.',
      gift: 'Aktywujesz ludzi. Pokoje zmieniają się, gdy do nich wchodzisz.',
      risk: 'Absorbujesz energię innych. Granice to nie mury — to filtry.',
    },
    'Sensitive Analyst': {
      headline: 'Jesteś Wrażliwym Analitykiem.',
      gift: 'Czytasz sytuacje jednocześnie na dwóch poziomach: danych i uczuć. To rzadkie.',
      risk: 'Nadinterpretujesz pod wpływem zmęczenia. Nie każdy sygnał wymaga odpowiedzi.',
    },
    'Steady Builder': {
      headline: 'Jesteś Stabilnym Budowniczym.',
      gift: 'Pojawiasz się konsekwentnie. To rzadsze niż talent.',
      risk: 'Opierasz się zmianom dłużej niż trzeba. Stabilność i stagnacja wyglądają tak samo od środka.',
    },
    'Visionary Architect': {
      headline: 'Jesteś Wizjonerskim Architektem.',
      gift: 'Widzisz to, co może istnieć, zanim jeszcze istnieje. Projektujesz przyszłości, których inni nie wyobrażają sobie.',
      risk: 'Za dużo żyjesz w przyszłości. Teraźniejszość też potrzebuje Twojej uwagi.',
    },
    'Deep Strategist': {
      headline: 'Jesteś Głębokim Strategiem.',
      gift: 'Myślisz w długich łukach. Widzisz dalej, planujesz głębiej i wykonujesz z precyzją.',
      risk: 'Przygotowujesz się za bardzo. W pewnym momencie plan musi stać się działaniem.',
    },
    'Curious Integrator': {
      headline: 'Jesteś Ciekawym Integratorem.',
      gift: 'Budujesz mosty między ludźmi i ideami, które nie wiedzą, że do siebie należą.',
      risk: 'Rozpraszasz się za bardzo. Głębia wymaga mówienia nie niektórym połączeniom.',
    },
    'Pragmatic Optimizer': {
      headline: 'Jesteś Pragmatycznym Optymalizatorem.',
      gift: 'Kończysz to, co inni porzucają. Twoja wytrwałość to Twoja przewaga konkurencyjna.',
      risk: 'Mylisz ruch z postępem. Czasem właściwym ruchem jest zatrzymanie się i ponowna ocena.',
    },
    'Relational Harmonizer': {
      headline: 'Jesteś Relacyjnym Harmonizatorem.',
      gift: 'Sprawiasz, że ludzie czują się dostrzeżeni. To buduje lojalność, której inni nie mogą kupić.',
      risk: 'Tłumisz własne potrzeby, żeby utrzymać spokój. To nie jest harmonia — to dług.',
    },
    'Adaptive Pioneer': {
      headline: 'Jesteś Adaptacyjnym Pionierem.',
      gift: 'Ruszasz pierwszy i dostosowujesz się szybko. Czujesz się komfortowo tam, gdzie inni zamierają.',
      risk: 'Wyprzedzasz swój rytm regeneracji. Szybkość bez odpoczynku to tylko szybszy sposób na załamanie.',
    },
  },
  tensions: {
    exploration_vs_control: {
      left: 'Chcesz eksplorować i pozostać otwarty.',
      right: 'Potrzebujesz też struktury i przewidywalności.',
      bridge: 'Rozwiązanie: eksploruj w zdefiniowanych ramach. Wolność z krawędziami.',
    },
    analysis_vs_speed: {
      left: 'Chcesz wszystko zrozumieć przed podjęciem decyzji.',
      right: 'Świat nagradza szybkość.',
      bridge: 'Rozwiązanie: ustal termin decyzji zanim zaczniesz analizować.',
    },
    independence_vs_connection: {
      left: 'Potrzebujesz przestrzeni i autonomii.',
      right: 'Potrzebujesz też ludzi i przynależności.',
      bridge: 'Rozwiązanie: kontakt na Twoich warunkach. Zaplanowany, nie reaktywny.',
    },
    intensity_vs_lightness: {
      left: 'Wchodzisz głęboko i angażujesz się w pełni.',
      right: 'Wypalasz się i potrzebujesz regeneracji.',
      bridge: 'Rozwiązanie: celowo wbuduj lekkie fazy w swój rytm.',
    },
    perfection_vs_progress: {
      left: 'Chcesz, żeby było zrobione dobrze.',
      right: 'Zrobione jest lepsze niż doskonałe.',
      bridge: 'Rozwiązanie: zdefiniuj „wystarczająco dobre" zanim zaczniesz, nie po.',
    },
  },
  roleOpeners: {
    sun: 'Twoje Słońce kształtuje to, co napędza Cię w rdzeniu.',
    moon: 'Twój Księżyc kształtuje to, jak się regenerujesz i regulujesz.',
    asc: 'Twój Ascendent kształtuje to, jak wchodzisz w sytuacje i jak inni Cię najpierw odczytują.',
  },
  roleSynthesis: {
    sun: 'To jest Twój silnik — kierunek, w który naturalnie się pchasz.',
    moon: 'To jest Twój system paliwowy — jak się regenerujesz, żeby silnik mógł działać.',
    asc: 'To jest Twój interfejs — wersja Ciebie, którą świat napotyka jako pierwszą.',
  },
  segmentTone: {
    sun: {
      early: 'Wciąż odkrywasz pełen zakres tego napędu. Surowa energia, niefiltrowana.',
      mid: 'Jesteś w rdzeniu ekspresji tego napędu. Niezawodny i konsekwentny.',
      late: 'Głęboko zintegrowałeś tę energię. Pojawia się z niuansem i precyzją.',
    },
    moon: {
      early: 'Twój styl regulacji wciąż się kształtuje. Uczysz się, co naprawdę Cię regeneruje.',
      mid: 'Twój wzorzec jest stabilny. Wiesz, czego potrzebujesz — praca polega na proszeniu o to.',
      late: 'Regulujesz się szybko, gdy wybierasz. Zestaw narzędzi jest wyrafinowany.',
    },
    asc: {
      early: 'Twoje pierwsze wrażenie jest energetyczne i niefiltrowane. Ludzie dostają od Ciebie dużo od razu.',
      mid: 'Twój styl wejścia jest konsekwentny i czytelny. Ludzie wiedzą, czego się spodziewać.',
      late: 'Twoja obecność jest dopracowana. Silne wrażenie, minimalne wysiłki.',
    },
  },
  overviewIntegration: 'Te trzy energie — Twój napęd, Twoja regulacja i Twój interfejs — tworzą jeden spójny wzorzec.',
  tensionPrompt: 'Twoje główne napięcie to nie problem. To silnik Twojej najlepszej pracy.',
  roleMetricBridge: 'Widać to najwyraźniej w:',
  decisionsFrame: 'Decydujesz, ważąc',
  decisionsSecond: 'Pod presją ta równowaga się przesuwa — i wtedy zdarzają się błędy.',
  ascImpactPrefix: 'Twój Ascendent w',
  geniusFrame: 'Twój geniusz aktywuje się, gdy Twoje najwyższe metryki działają jednocześnie.',
  geniusExecution: 'To jest stan, w którym Twoje wyniki stają się jakościowo inne — nie tylko więcej, ale lepsze w rodzaju.',
  stressFrame: 'Pod stresem nadmiernie polegasz na swojej dominującej metryce i tłumisz resztę.',
  stressBridge: 'Sygnał ostrzegawczy jest zawsze taki sam:',
  stressRecovery: 'Regeneracja to jedno celowe działanie — nie plan, nie analiza. Działanie.',
  leadershipFrame: 'Prowadzisz przez',
  leadershipExecution: 'Ludzie podążają za Tobą z powodu konsekwencji i jakości osądu — nie dlatego, że ich prosisz.',
  recommendationOpen: 'Najbardziej efektywny ruch dla Ciebie teraz:',
  recommendationMiddle: 'Rzecz, którą należy przestać robić:',
  recommendationClose: 'Rzecz, którą należy chronić za wszelką cenę:',
};
