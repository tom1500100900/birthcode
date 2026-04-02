import type { AstroChart, AstroProfile, InsightItem, ProfileContext } from '@/types/astro';
import type { AppLocale } from '@/store/useLocaleStore';
import type { BirthcodeSignals, MetricKey } from '@/lib/content-engine/psychoNarrative';
import { toNormalizedAstroV2FromChart } from '@/lib/content-engine/chartAdapters';
import { buildBirthcodeSignals } from '@/lib/content-engine/psychoNarrative';

// ─── Metric label helpers ────────────────────────────────────────────────────
const METRIC_LABELS_EN: Record<MetricKey, string> = {
  curiosity_openness: 'Curiosity & Openness',
  analytical_order: 'Analytical Order',
  emotional_sensitivity: 'Emotional Sensitivity',
  intensity_depth: 'Intensity & Depth',
  social_expression: 'Social Expression',
  control_need: 'Need for Control',
  adaptability: 'Adaptability',
  persistence_drive: 'Persistence Drive',
  risk_orientation: 'Risk Orientation',
  connection_need: 'Need for Connection',
};
const METRIC_LABELS_PL: Record<MetricKey, string> = {
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
};

function metricLabel(key: MetricKey, isPl: boolean): string {
  return isPl ? METRIC_LABELS_PL[key] : METRIC_LABELS_EN[key];
}

function topMetrics(signals: BirthcodeSignals, count: number): MetricKey[] {
  return (Object.entries(signals.metrics) as [MetricKey, number][])
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([k]) => k);
}

function lowMetrics(signals: BirthcodeSignals, count: number): MetricKey[] {
  return (Object.entries(signals.metrics) as [MetricKey, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, count)
    .map(([k]) => k);
}

export function buildInsights(
  context: ProfileContext,
  chart: AstroChart,
  profile: AstroProfile,
  language: AppLocale = 'en'
): InsightItem[] {
  const isPl = language === 'pl';

  // Derive BirthcodeSignals from the chart for signal-driven insights
  let signals: BirthcodeSignals | null = null;
  try {
    const normalized = toNormalizedAstroV2FromChart(chart);
    signals = buildBirthcodeSignals(normalized);
  } catch {
    signals = null;
  }

  const top3 = signals ? topMetrics(signals, 3) : [];
  const low2 = signals ? lowMetrics(signals, 2) : [];
  const primaryTension = signals?.tensions[0];
  const archetype = signals?.archetype ?? 'Deep Strategist';
  const sunSign = context.placements.sun.sign;
  const moonSign = context.placements.moon.sign;
  const ascSign = context.placements.asc.sign;

  const top1Label = top3[0] ? metricLabel(top3[0], isPl) : (isPl ? 'Twoja główna siła' : 'your top strength');
  const top2Label = top3[1] ? metricLabel(top3[1], isPl) : (isPl ? 'drugi wymiar' : 'second dimension');
  const low1Label = low2[0] ? metricLabel(low2[0], isPl) : (isPl ? 'obszar do wzmocnienia' : 'area to strengthen');
  const tensionLabel = primaryTension
    ? (isPl
        ? primaryTension.key.replace(/_/g, ' ').replace('vs', 'vs.')
        : primaryTension.key.replace(/_/g, ' ').replace('vs', 'vs.'))
    : (isPl ? 'główne napięcie' : 'primary tension');

  // Suppress unused variable warnings for legacy params still needed by signature
  void profile;

  return [
    // ── IDENTITY 1 ───────────────────────────────────────────────────────────────────────
    {
      id: 'insight-identity-1',
      category: 'identity',
      title: isPl ? 'Twój wzorzec tożsamości' : 'Your identity pattern',
      whyItMatters: isPl
        ? `Twój archetype to ${archetype}. Twoja najsilniejsza metryka — ${top1Label} — kształtuje to, jak budujesz poczucie siebie. Słońce w ${sunSign} nadaje temu kierunek. Kiedy działasz zgodnie z tym wzorcem, czujesz się spójny. Kiedy go ignorujesz, pojawia się tarcie.`
        : `Your archetype is ${archetype}. Your strongest metric — ${top1Label} — shapes how you build your sense of self. Sun in ${sunSign} gives this a direction. When you act in alignment with this pattern, you feel coherent. When you ignore it, friction appears.`,
      questions: [
        isPl
          ? `Kiedy ostatnio działałeś w pełni zgodnie z ${top1Label}?`
          : `When did you last act fully in alignment with ${top1Label}?`,
        isPl
          ? 'Które decyzje z ostatniego tygodnia były naprawdę Twoje — a które były odpowiedzią na czyjejś oczekiwania?'
          : 'Which decisions last week were truly yours — and which were responses to someone else\'s expectations?',
        isPl
          ? 'Co możesz uprościć, żeby działać bardziej spójnie z tym, kim jesteś?'
          : 'What can you simplify to act more consistently with who you are?',
      ],
      linkedDimensions: ['Openness', 'Conscientiousness'],
      motivationLens: 'autonomy',
    },
    // ── IDENTITY 2 ───────────────────────────────────────────────────────────────────────
    {
      id: 'insight-identity-2',
      category: 'identity',
      title: isPl ? 'Napięcie jako kompas' : 'Tension as compass',
      whyItMatters: isPl
        ? `Twoje główne napięcie to ${tensionLabel}. To nie jest problem do rozwiązania — to informacja o tym, gdzie leży Twój wzrost. Kiedy to napięcie jest aktywne, masz wybór: zareagować automatycznie albo użyć go świadomie.`
        : `Your primary tension is ${tensionLabel}. This is not a problem to solve — it's information about where your growth lives. When this tension is active, you have a choice: react automatically or use it deliberately.`,
      questions: [
        isPl
          ? `Kiedy ostatnio poczułeś napięcie ${tensionLabel}? Co wtedy zrobiłeś?`
          : `When did you last feel the ${tensionLabel} tension? What did you do with it?`,
        isPl
          ? 'Jak wyglądałoby Twoje życie, gdybyś to napięcie traktował jako sygnał, a nie jako problem?'
          : 'What would your life look like if you treated this tension as a signal rather than a problem?',
        isPl
          ? 'Jedno konkretne działanie, które możesz zrobić dziś, żeby pracować z tym napięciem zamiast przeciwko niemu?'
          : 'One concrete action you can take today to work with this tension instead of against it?',
      ],
      linkedDimensions: ['Openness', 'Emotional Stability'],
      motivationLens: 'autonomy',
    },
    // ── CAREER 1 ────────────────────────────────────────────────────────────────────────
    {
      id: 'insight-career-1',
      category: 'career',
      title: isPl ? 'Twoja strefa najwyższej wartości' : 'Your highest-value zone',
      whyItMatters: isPl
        ? `Twoje dwie najsilniejsze metryki — ${top1Label} i ${top2Label} — to Twoja strefa najwyższej wartości zawodowej. Nie chodzi o to, żeby być dobry we wszystkim. Chodzi o to, żeby wiedzieć, gdzie Twoja praca jest jakościowo inna niż u innych.`
        : `Your two strongest metrics — ${top1Label} and ${top2Label} — define your highest-value professional zone. It's not about being good at everything. It's about knowing where your work is qualitatively different from others.`,
      questions: [
        isPl
          ? `Które zadania w tym tygodniu wymagają ${top1Label}? Czy masz na nie wystarczająco czasu?`
          : `Which tasks this week require ${top1Label}? Do you have enough time allocated to them?`,
        isPl
          ? 'Co możesz oddelegować lub uprościć, żeby chronić czas na pracę w swojej strefie?'
          : 'What can you delegate or simplify to protect time for work in your zone?',
        isPl
          ? 'Jak wygląda Twój najlepszy dzień pracy — konkretnie, godzina po godzinie?'
          : 'What does your best work day look like — specifically, hour by hour?',
      ],
      linkedDimensions: ['Conscientiousness', 'Openness'],
      motivationLens: 'competence',
    },
    // ── CAREER 2 ────────────────────────────────────────────────────────────────────────
    {
      id: 'insight-career-2',
      category: 'career',
      title: isPl ? 'Rytm decyzji i wykonania' : 'Decision and execution rhythm',
      whyItMatters: isPl
        ? `Ascendent w ${ascSign} kształtuje to, jak wchodzisz w nowe projekty i jak Cię widzą współpracownicy. Twój wzorzec decyzji jest mocny, gdy masz czas na przetworzenie informacji. Pod presją czasu jakość spada. To nie jest słabość — to jest informacja o tym, jak projektować swój rytm pracy.`
        : `Ascendant in ${ascSign} shapes how you enter new projects and how colleagues perceive you. Your decision pattern is strong when you have time to process information. Under time pressure, quality drops. This is not a weakness — it's information about how to design your work rhythm.`,
      questions: [
        isPl
          ? 'Które decyzje z ostatniego miesiąca były podjęte za szybko? Co byś zmienił?'
          : 'Which decisions from last month were made too quickly? What would you change?',
        isPl
          ? 'Jak możesz zbudować bufor czasowy przed kolejną ważną decyzją?'
          : 'How can you build a time buffer before your next important decision?',
        isPl
          ? 'Jedno narzędzie lub rytuał, który pomoże Ci utrzymać jakość decyzji pod presją?'
          : 'One tool or ritual that would help you maintain decision quality under pressure?',
      ],
      linkedDimensions: ['Conscientiousness', 'Emotional Stability'],
      motivationLens: 'competence',
    },
    // ── RELATIONSHIPS 1 ──────────────────────────────────────────────────────────────────
    {
      id: 'insight-relationships-1',
      category: 'relationships',
      title: isPl ? 'Jak budujesz zaufanie' : 'How you build trust',
      whyItMatters: isPl
        ? `Księżyc w ${moonSign} kształtuje to, jak regulujesz emocje w relacjach. Twoja metryka ${top1Label} wpływa na to, czego szukasz w kontakcie z innymi. Zaufanie rośnie najszybciej, gdy jesteś przewidywalny — nie idealny.`
        : `Moon in ${moonSign} shapes how you regulate emotions in relationships. Your ${top1Label} metric influences what you seek in contact with others. Trust grows fastest when you are predictable — not perfect.`,
      questions: [
        isPl
          ? 'Które relacje w Twoim życiu są oparte na prawdziwym zaufaniu? Co je buduje?'
          : 'Which relationships in your life are built on genuine trust? What builds them?',
        isPl
          ? 'Kiedy ostatnio wyraziłeś potrzebę wprost, zamiast czekać, że ktoś ją odgadnie?'
          : 'When did you last express a need directly, instead of waiting for someone to guess it?',
        isPl
          ? 'Jedna zmiana w tym, jak komunikujesz się z bliskim, która poprawiłaby jakość tej relacji?'
          : 'One change in how you communicate with someone close that would improve the quality of that relationship?',
      ],
      linkedDimensions: ['Agreeableness', 'Emotional Stability'],
      motivationLens: 'relatedness',
    },
    // ── RELATIONSHIPS 2 ─────────────────────────────────────────────────────────────────
    {
      id: 'insight-relationships-2',
      category: 'relationships',
      title: isPl ? 'Granice i energia społeczna' : 'Boundaries and social energy',
      whyItMatters: isPl
        ? `Twoja metryka ${top1Label} jest wysoka. To oznacza, że masz dużo do dania w relacjach. Ale wysoka energia społeczna bez granic to przepis na wypalenie. Granice nie niszczą relacji — one je chronią.`
        : `Your ${top1Label} metric is high. That means you have a lot to give in relationships. But high social energy without boundaries is a recipe for burnout. Boundaries don't destroy relationships — they protect them.`,
      questions: [
        isPl
          ? 'Która relacja w Twoim życiu pobiera więcej energii niż daje? Co z tym zrobisz?'
          : 'Which relationship in your life takes more energy than it gives? What will you do about it?',
        isPl
          ? 'Jaka granica, którą mógłbyś postawić teraz, poprawiłaby jakość Twojego życia?'
          : 'What boundary, if you set it now, would improve the quality of your life?',
        isPl
          ? 'Jak wygląda dla Ciebie regeneracja po intensywnym kontakcie społecznym?'
          : 'What does recovery look like for you after intense social contact?',
      ],
      linkedDimensions: ['Extraversion', 'Agreeableness'],
      motivationLens: 'relatedness',
    },
    // ── STRESS 1 ────────────────────────────────────────────────────────────────────────
    {
      id: 'insight-stress-1',
      category: 'stress',
      title: isPl ? 'Twój sygnał alarmowy' : 'Your early warning signal',
      whyItMatters: isPl
        ? `Pod stresem Twoja najszałbsza metryka — ${low1Label} — spada jako pierwsza. To jest Twój sygnał alarmowy. Nie czekaj, aż będziesz wypalony. Naucz się rozpoznawać ten sygnał wcześnie i reagować na niego jednym konkretnym działaniem.`
        : `Under stress, your weakest metric — ${low1Label} — drops first. That is your early warning signal. Don't wait until you're burned out. Learn to recognize this signal early and respond with one concrete action.`,
      questions: [
        isPl
          ? `Jak wygląda u Ciebie spadek ${low1Label}? Jakie zachowania to sygnalizują?`
          : `What does a drop in ${low1Label} look like for you? What behaviors signal it?`,
        isPl
          ? 'Jedno działanie, które możesz wykonać w ciągu 5 minut, gdy poczujesz ten sygnał?'
          : 'One action you can take in 5 minutes when you feel this signal?',
        isPl
          ? 'Kto w Twoim życiu widzi ten sygnał wcześniej niż Ty? Czy możesz go zapytać o feedback?'
          : 'Who in your life sees this signal before you do? Can you ask them for feedback?',
      ],
      linkedDimensions: ['Emotional Stability', 'Conscientiousness'],
      motivationLens: 'autonomy',
    },
    // ── STRESS 2 ────────────────────────────────────────────────────────────────────────
    {
      id: 'insight-stress-2',
      category: 'stress',
      title: isPl ? 'Regeneracja jako strategia' : 'Recovery as strategy',
      whyItMatters: isPl
        ? `Księżyc w ${moonSign} kształtuje to, jak się regenerujesz. Nie każda metoda działa dla każdego. Twój wzorzec sugeruje, że regeneracja jest skuteczna, gdy jest aktywna i celowa — nie pasywna. Odpoczynek to nie lenistwo. To inwestycja w jakość następnego dnia.`
        : `Moon in ${moonSign} shapes how you recover. Not every method works for everyone. Your pattern suggests that recovery is most effective when it is active and intentional — not passive. Rest is not laziness. It's an investment in the quality of your next day.`,
      questions: [
        isPl
          ? 'Jakie działanie najszybciej przywraca Ci energię po trudnym dniu?'
          : 'What activity most quickly restores your energy after a difficult day?',
        isPl
          ? 'Kiedy ostatnio wziąłeś prawdziwy odpoczynek — bez poczucia winy?'
          : 'When did you last take genuine rest — without guilt?',
        isPl
          ? 'Jak możesz wbudować 20 minut regeneracji w każdy dzień, bez negocjacji?'
          : 'How can you build 20 minutes of recovery into every day, non-negotiably?',
      ],
      linkedDimensions: ['Emotional Stability', 'Agreeableness'],
      motivationLens: 'autonomy',
    },
  ];
}
