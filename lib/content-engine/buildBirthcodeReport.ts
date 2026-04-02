import { loadPacks } from '@/lib/content-engine/loadPacks';
import type { BirthcodeBuildInput, BirthcodeReport } from '@/lib/content-engine/contracts';
import type { MetricKey } from '@/lib/content-engine/psychoNarrative';
import { zodiacRoleSnippet as plZodiacRoleSnippet } from '@/lib/content-packs/pl/birthcode/zodiac';
import { zodiacElement, zodiacLabel, toCanonicalSign } from '@/lib/i18n/zodiac';

function topMetrics(metrics: Record<MetricKey, number>, count: number, descending = true): MetricKey[] {
  return (Object.keys(metrics) as MetricKey[])
    .sort((a, b) => (descending ? metrics[b] - metrics[a] : metrics[a] - metrics[b]) || a.localeCompare(b))
    .slice(0, count);
}

function tokenReplace(text: string, vars: Record<string, string>): string {
  return Object.entries(vars).reduce((acc, [key, value]) => acc.split(`{{${key}}}`).join(value), text);
}

function metricText(label: string, value: number): string {
  return `${label} (${Math.round(value)}/100)`;
}

function segmentLabelPl(segment: 'early' | 'mid' | 'late'): string {
  if (segment === 'early') return 'wczesny';
  if (segment === 'mid') return 'środkowy';
  return 'późny';
}

function fallbackMoonSnippet(signPl: string): string {
  return `Księżyc w znaku ${signPl} pokazuje, że bezpieczeństwo emocjonalne budujesz przez rytm, przewidywalność i nazywanie potrzeb.`;
}

function fallbackAscSnippet(signPl: string): string {
  return `Ascendent w znaku ${signPl} pokazuje styl wejścia w świat, który inni odczytują jako sygnał Twojej energii i intencji.`;
}

export function buildBirthcodeReport(input: BirthcodeBuildInput): BirthcodeReport {
  const packs = loadPacks(input.lang);
  const { signals } = input;

  const canonicalSun = toCanonicalSign(signals.bigThree.sun.sign);
  const canonicalMoon = toCanonicalSign(signals.bigThree.moon.sign);
  const canonicalAsc = toCanonicalSign(signals.bigThree.asc.sign);

  const top3 = topMetrics(signals.metrics, 3, true);
  const low2 = topMetrics(signals.metrics, 2, false);
  const t1 = signals.tensions[0];
  const t2 = signals.tensions[1] ?? signals.tensions[0];
  const fallbackText = packs.fallbackText;

  const blockIds: Record<string, string[]> = {};
  const generatorOrder: Array<'tensions' | 'archetype' | 'metrics'> = ['tensions', 'archetype', 'metrics'];

  const vars = {
    sun_label: zodiacLabel(canonicalSun, input.lang),
    moon_label: zodiacLabel(canonicalMoon, input.lang),
    asc_label: zodiacLabel(canonicalAsc, input.lang),
    archetype: signals.archetype,
    top_metric_1: metricText(top3[0], signals.metrics[top3[0]]),
    top_metric_2: metricText(top3[1], signals.metrics[top3[1]]),
    top_metric_3: metricText(top3[2], signals.metrics[top3[2]]),
    low_metric_1: metricText(low2[0], signals.metrics[low2[0]]),
    low_metric_2: metricText(low2[1], signals.metrics[low2[1]]),
    tension_1: packs.birthcode.tensionSnippets[t1?.key ?? 'analysis_vs_speed'] ?? fallbackText,
    tension_2: packs.birthcode.tensionSnippets[t2?.key ?? 'exploration_vs_control'] ?? fallbackText,
    sun_segment_tone: packs.birthcode.segmentSnippet('sun', signals.bigThree.sun.segment),
    moon_segment_tone: packs.birthcode.segmentSnippet('moon', signals.bigThree.moon.segment),
    asc_segment_tone: packs.birthcode.segmentSnippet('asc', signals.bigThree.asc.segment),
    metric_analytical_order: metricText('analytical_order', signals.metrics.analytical_order),
    metric_risk_orientation: metricText('risk_orientation', signals.metrics.risk_orientation),
  };

  const signatureInsight = `Twoja sygnatura psychologiczna opiera się na archetypie ${signals.archetype}. ${packs.birthcode.archetypeSignatures[signals.archetype] ?? fallbackText}`;

    const birthcodeParagraphs: string[] = [];
  const birthcodeIds: string[] = [];

  if (t1) {
    const tensionText = packs.birthcode.tensionSnippets[t1.key] ?? fallbackText;
    birthcodeParagraphs.push(`Główny silnik Twojego działania opiera się na napięciu: ${tensionText}`);
    birthcodeParagraphs.push(`Mechanizm: Balansujesz między ${t1.leftMetric} a ${t1.rightMetric}, z wyraźnym przechyleniem na stronę ${t1.dominantSide === 'left' ? 'lewą' : 'prawą'}. To powoduje, że w sytuacjach stresowych najpierw uruchamiasz tę dominującą strategię.`);
    birthcodeParagraphs.push(`Konsekwencja: Znaki zodiaku (Słońce w znaku ${zodiacLabel(canonicalSun, 'pl')}, Księżyc w ${zodiacLabel(canonicalMoon, 'pl')}, Ascendent w ${zodiacLabel(canonicalAsc, 'pl')}) stanowią jedynie tło i styl dla tego podstawowego napięcia.`);
    birthcodeIds.push('bc_priority_tension');
  } else if (signals.dominantEnergy.element || signals.dominantEnergy.modality) {
    birthcodeParagraphs.push(`Twój system operacyjny opiera się w głównej mierze na dominującej energii: ${signals.dominantEnergy.label}.`);
    birthcodeParagraphs.push(`Mechanizm: Działasz poprzez pryzmat tej specyficznej jakości, traktując ją jako domyślny sposób radzenia sobie z rzeczywistością.`);
    birthcodeParagraphs.push(`Konsekwencja: Konkretne pozycje (Słońce: ${zodiacLabel(canonicalSun, 'pl')}, Księżyc: ${zodiacLabel(canonicalMoon, 'pl')}, Ascendent: ${zodiacLabel(canonicalAsc, 'pl')}) realizują po prostu ten dominujący tryb i nadają mu kolorytu.`);
    birthcodeIds.push('bc_priority_dominant');
  } else {
    birthcodeParagraphs.push(`Kluczem do Twojego wzorca działania jest archetyp: ${signals.archetype}.`);
    const archetypeSignature = packs.birthcode.archetypeSignatures[signals.archetype] ?? fallbackText;
    birthcodeParagraphs.push(`Mechanizm: ${archetypeSignature}`);
    birthcodeParagraphs.push(`Konsekwencja: Twoje zachowania, dotychczas przypisywane znakom (Słońce w ${zodiacLabel(canonicalSun, 'pl')}), to w rzeczywistości jedynie styl, w jakim realizujesz strategię tego archetypu.`);
    birthcodeIds.push('bc_priority_archetype');
  }

  birthcodeParagraphs.push(`Wysokie metryki wspierające ten wzorzec to m.in. ${top3.map((m) => metricText(m, signals.metrics[m])).join(', ')}.`);
  birthcodeIds.push('bc_priority_metrics');

  blockIds.birthcode = birthcodeIds;

  const elements = [zodiacElement(canonicalSun), zodiacElement(canonicalMoon), zodiacElement(canonicalAsc)];
  const groundedCount = elements.filter((item) => item === 'Earth' || item === 'Water').length;

  const relationVariant = groundedCount >= 2
    ? [
      'W relacjach budujesz wpływ przez stabilność, przewidywalność i uważność na sygnały emocjonalne drugiej strony.',
      'Ludzie najczęściej ufają Ci wtedy, gdy widzą konsekwencję i spokojne domykanie spraw.',
    ]
    : [
      'W relacjach budujesz wpływ przez energię, tempo i uruchamianie ludzi do działania.',
      'Najlepiej działasz społecznie, kiedy łączysz dynamikę z chwilą kalibracji potrzeb i granic.',
    ];
  blockIds.relations = [groundedCount >= 2 ? 'rel_variant_grounded' : 'rel_variant_dynamic'];

  const sections = packs.birthcode.sectionOrder.map((id) => {
    if (id === 'birthcode') {
      return {
        id: 'bc_birthcode',
        title: 'Twój Birthcode',
        paragraphs: birthcodeParagraphs,
      };
    }

    if (id === 'relations') {
      return {
        id,
        title: packs.birthcode.sectionTitles[id] ?? 'Relacje i wpływ ludzi',
        paragraphs: relationVariant,
      };
    }

    const templates = packs.birthcode.sectionTemplates[id] ?? [fallbackText];
    const paragraphs = templates
      .slice(0, 5)
      .map((template) => tokenReplace(template, vars))
      .filter((item) => item.trim().length > 0);

    blockIds[id] = paragraphs.map((_, index) => `${id}_tpl_${index + 1}`);

    return {
      id,
      title: packs.birthcode.sectionTitles[id] ?? fallbackText,
      paragraphs: paragraphs.length > 0 ? paragraphs : [fallbackText],
    };
  });

  return {
    header: {
      archetype: signals.archetype,
      tensions: [t1, t2]
        .filter((item): item is NonNullable<typeof item> => Boolean(item))
        .map((item) => packs.birthcode.tensionSnippets[item.key] ?? item.key),
      metrics: top3.map((metric) => ({ key: metric, value: signals.metrics[metric] })),
    },
    headerDefinition: 'Birthcode to syntetyczny opis wzorca działania: jak myślisz, regulujesz emocje i wchodzisz w relacje. To mapa mechanizmów, nie etykieta.',
    signatureInsight,
    sections,
    debug: {
      blockIds,
      generatorOrder,
      signals: {
        bigThree: signals.bigThree,
        tensions: signals.tensions,
        metrics: signals.metrics,
        archetype: signals.archetype,
        dominantEnergy: signals.dominantEnergy,
        priorities: signals.priorities,
      },
    },
  };
}
