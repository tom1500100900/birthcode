import { loadPacks } from '@/lib/content-engine/loadPacks';
import { EN_TENSION_DESCRIPTIONS } from '@/lib/content-packs/en/birthcode/tensions';
import { PL_TENSION_DESCRIPTIONS } from '@/lib/content-packs/pl/birthcode/tensions';
import type { BirthcodeBuildInput, BirthcodeReport } from '@/lib/content-engine/contracts';
import type { MetricKey } from '@/lib/content-engine/psychoNarrative';
import { zodiacElement, zodiacLabel, toCanonicalSign } from '@/lib/i18n/zodiac';

// ─── Humanized metric labels ────────────────────────────────────────────────

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getMetricLabel(key: MetricKey, lang: string): string {
  return lang === 'pl' ? (METRIC_LABELS_PL[key] ?? key) : (METRIC_LABELS_EN[key] ?? key);
}

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

// ─── Main builder ─────────────────────────────────────────────────────────────

export function buildBirthcodeReport(input: BirthcodeBuildInput): BirthcodeReport {
  const packs = loadPacks(input.lang);
  const { signals } = input;
  const lang = input.lang;

  const canonicalSun = toCanonicalSign(signals.bigThree.sun.sign);
  const canonicalMoon = toCanonicalSign(signals.bigThree.moon.sign);
  const canonicalAsc = toCanonicalSign(signals.bigThree.asc.sign);

  const top3 = topMetrics(signals.metrics, 3, true);
  const low2 = topMetrics(signals.metrics, 2, false);
  const t1 = signals.tensions[0];
  const t2 = signals.tensions[1] ?? signals.tensions[0];
  const fallbackText = packs.fallbackText;

  // Humanized metric labels for token replacement
  const top3Labels = top3.map((k) => getMetricLabel(k, lang));
  const low2Labels = low2.map((k) => getMetricLabel(k, lang));

  // Tension descriptions (full) for the Birthcode section narrative
  const tensionDescriptions = lang === 'pl' ? PL_TENSION_DESCRIPTIONS : EN_TENSION_DESCRIPTIONS;

  const blockIds: Record<string, string[]> = {};
  const generatorOrder: Array<'tensions' | 'archetype' | 'metrics'> = ['tensions', 'archetype', 'metrics'];

  // Build token vars map for template replacement
  const vars: Record<string, string> = {
    sun_label: zodiacLabel(canonicalSun, lang),
    moon_label: zodiacLabel(canonicalMoon, lang),
    asc_label: zodiacLabel(canonicalAsc, lang),
    archetype: signals.archetype,
    top_metric_1: metricText(top3Labels[0] ?? top3[0], signals.metrics[top3[0]]),
    top_metric_2: metricText(top3Labels[1] ?? top3[1], signals.metrics[top3[1]]),
    top_metric_3: metricText(top3Labels[2] ?? top3[2], signals.metrics[top3[2]]),
    low_metric_1: metricText(low2Labels[0] ?? low2[0], signals.metrics[low2[0]]),
    low_metric_2: metricText(low2Labels[1] ?? low2[1], signals.metrics[low2[1]]),
    tension_1: packs.birthcode.tensionSnippets[t1?.key ?? 'analysis_vs_speed'] ?? fallbackText,
    tension_2: packs.birthcode.tensionSnippets[t2?.key ?? 'exploration_vs_control'] ?? fallbackText,
    sun_segment_tone: packs.birthcode.segmentSnippet('sun', signals.bigThree.sun.segment ?? 'mid'),
    moon_segment_tone: packs.birthcode.segmentSnippet('moon', signals.bigThree.moon.segment ?? 'mid'),
    asc_segment_tone: packs.birthcode.segmentSnippet('asc', signals.bigThree.asc.segment ?? 'mid'),
    metric_analytical_order: metricText(getMetricLabel('analytical_order', lang), signals.metrics.analytical_order),
    metric_risk_orientation: metricText(getMetricLabel('risk_orientation', lang), signals.metrics.risk_orientation),
  };

  // ─── Signature insight ───────────────────────────────────────────────────
  const archetypeSignature = packs.birthcode.archetypeSignatures[signals.archetype] ?? fallbackText;
  const signatureInsight = lang === 'pl'
    ? `Twoja sygnatura psychologiczna opiera się na archetypie ${signals.archetype}. ${archetypeSignature}`
    : `Your psychological signature is built on the ${signals.archetype} archetype. ${archetypeSignature}`;

  // ─── Birthcode section (signal-priority logic) ───────────────────────────
  const birthcodeParagraphs: string[] = [];
  const birthcodeIds: string[] = [];

  if (t1) {
    const tensionText = tensionDescriptions[t1.key as keyof typeof tensionDescriptions] ?? packs.birthcode.tensionSnippets[t1.key] ?? fallbackText;
    const dominantSideLabel = t1.dominantSide === 'left'
      ? (lang === 'pl' ? 'lewą' : 'left')
      : (lang === 'pl' ? 'prawą' : 'right');

    if (lang === 'pl') {
      birthcodeParagraphs.push(
        `Twój Birthcode opiera się na archetypie ${signals.archetype}. ${archetypeSignature}`
      );
      birthcodeParagraphs.push(
        `Główne napięcie napędzające Twój system to: ${tensionText}`
      );
      birthcodeParagraphs.push(
        `Mechanizm: Balansujesz między wymiarem ${getMetricLabel(t1.leftMetric, lang)} a ${getMetricLabel(t1.rightMetric, lang)}, z wyraźnym przechyleniem na stronę ${dominantSideLabel}. W sytuacjach stresowych najpierw uruchamiasz tę dominującą strategię.`
      );
      birthcodeParagraphs.push(
        `Konsekwencja: Słońce w ${zodiacLabel(canonicalSun, 'pl')}, Księżyc w ${zodiacLabel(canonicalMoon, 'pl')} i Ascendent w ${zodiacLabel(canonicalAsc, 'pl')} są stylistycznym wyrazem tego wzorca — nie jego przyczyną.`
      );
    } else {
      birthcodeParagraphs.push(
        `Your Birthcode is built on the ${signals.archetype} archetype. ${archetypeSignature}`
      );
      birthcodeParagraphs.push(
        `The primary tension driving your system is: ${tensionText}`
      );
      birthcodeParagraphs.push(
        `Mechanism: You balance between ${getMetricLabel(t1.leftMetric, lang)} and ${getMetricLabel(t1.rightMetric, lang)}, with a clear lean toward the ${dominantSideLabel} side. Under stress, you activate this dominant strategy first.`
      );
      birthcodeParagraphs.push(
        `Consequence: Sun in ${zodiacLabel(canonicalSun, 'en')}, Moon in ${zodiacLabel(canonicalMoon, 'en')}, and Ascendant in ${zodiacLabel(canonicalAsc, 'en')} are the stylistic expression of this pattern — not its cause.`
      );
    }
    birthcodeIds.push('bc_priority_tension');
  } else if (signals.dominantEnergy.element || signals.dominantEnergy.modality) {
    if (lang === 'pl') {
      birthcodeParagraphs.push(`Twój system operacyjny opiera się na dominującej energii: ${signals.dominantEnergy.label}.`);
      birthcodeParagraphs.push(`Mechanizm: Działasz przez pryzmat tej jakości, traktując ją jako domyślny sposób radzenia sobie z rzeczywistością.`);
      birthcodeParagraphs.push(`Konsekwencja: Słońce w ${zodiacLabel(canonicalSun, 'pl')}, Księżyc w ${zodiacLabel(canonicalMoon, 'pl')} i Ascendent w ${zodiacLabel(canonicalAsc, 'pl')} realizują ten dominujący tryb i nadają mu kolorytu.`);
    } else {
      birthcodeParagraphs.push(`Your operating system is primarily driven by dominant energy: ${signals.dominantEnergy.label}.`);
      birthcodeParagraphs.push(`Mechanism: You process reality through this quality as your default mode.`);
      birthcodeParagraphs.push(`Consequence: Sun in ${zodiacLabel(canonicalSun, 'en')}, Moon in ${zodiacLabel(canonicalMoon, 'en')}, and Ascendant in ${zodiacLabel(canonicalAsc, 'en')} express this dominant mode and give it its style.`);
    }
    birthcodeIds.push('bc_priority_dominant');
  } else {
    if (lang === 'pl') {
      birthcodeParagraphs.push(`Kluczem do Twojego wzorca działania jest archetyp: ${signals.archetype}.`);
      birthcodeParagraphs.push(`Mechanizm: ${archetypeSignature}`);
      birthcodeParagraphs.push(`Konsekwencja: Twoje zachowania przypisywane znakom (Słońce w ${zodiacLabel(canonicalSun, 'pl')}) to styl realizacji strategii tego archetypu.`);
    } else {
      birthcodeParagraphs.push(`The key to your operating pattern is the ${signals.archetype} archetype.`);
      birthcodeParagraphs.push(`Mechanism: ${archetypeSignature}`);
      birthcodeParagraphs.push(`Consequence: Your behaviors attributed to signs (Sun in ${zodiacLabel(canonicalSun, 'en')}) are the stylistic expression of this archetype's strategy.`);
    }
    birthcodeIds.push('bc_priority_archetype');
  }

  const metricsLine = top3.map((m) => metricText(getMetricLabel(m, lang), signals.metrics[m])).join(', ');
  birthcodeParagraphs.push(
    lang === 'pl'
      ? `Wysokie metryki wspierające ten wzorzec to: ${metricsLine}.`
      : `The top metrics supporting this pattern are: ${metricsLine}.`
  );
  birthcodeIds.push('bc_priority_metrics');
  blockIds.birthcode = birthcodeIds;

  // ─── Relations section (element-aware variant) ───────────────────────────
  const elements = [zodiacElement(canonicalSun), zodiacElement(canonicalMoon), zodiacElement(canonicalAsc)];
  const groundedCount = elements.filter((item) => item === 'Earth' || item === 'Water').length;

  const relationVariant = groundedCount >= 2
    ? (lang === 'pl'
      ? [
        'W relacjach budujesz wpływ przez stabilność, przewidywalność i uważność na sygnały emocjonalne drugiej strony.',
        'Ludzie najczęściej ufają Ci wtedy, gdy widzą konsekwencję i spokojne domykanie spraw.',
        `Twoje dominujące metryki — ${metricText(top3Labels[0], signals.metrics[top3[0]])} i ${metricText(top3Labels[1], signals.metrics[top3[1]])} — tworzą relacyjną kotwicę, na której inni mogą polegać.`,
      ]
      : [
        'In relationships, you build influence through stability, predictability, and attunement to the other person\'s emotional signals.',
        'People trust you most when they see consistency and calm follow-through.',
        `Your dominant metrics — ${metricText(top3Labels[0], signals.metrics[top3[0]])} and ${metricText(top3Labels[1], signals.metrics[top3[1]])} — create a relational anchor others can rely on.`,
      ])
    : (lang === 'pl'
      ? [
        'W relacjach budujesz wpływ przez energię, tempo i uruchamianie ludzi do działania.',
        'Najlepiej działasz społecznie, kiedy łączysz dynamikę z chwilą kalibracji potrzeb i granic.',
        `Twoje dominujące metryki — ${metricText(top3Labels[0], signals.metrics[top3[0]])} i ${metricText(top3Labels[1], signals.metrics[top3[1]])} — nadają Twojej obecności relacyjnej wyraźny charakter i kierunek.`,
      ]
      : [
        'In relationships, you build influence through energy, momentum, and activating people to act.',
        'You operate best socially when you pair your natural dynamism with a moment of calibration around needs and boundaries.',
        `Your dominant metrics — ${metricText(top3Labels[0], signals.metrics[top3[0]])} and ${metricText(top3Labels[1], signals.metrics[top3[1]])} — give your relational presence a clear character and direction.`,
      ]);
  blockIds.relations = [groundedCount >= 2 ? 'rel_variant_grounded' : 'rel_variant_dynamic'];

  // ─── All other sections via template engine ───────────────────────────────
  const sections = packs.birthcode.sectionOrder.map((id) => {
    if (id === 'birthcode') {
      return {
        id: 'bc_birthcode',
        title: packs.birthcode.sectionTitles.birthcode,
        paragraphs: birthcodeParagraphs,
      };
    }

    if (id === 'relations') {
      return {
        id,
        title: packs.birthcode.sectionTitles[id] ?? (lang === 'pl' ? 'Relacje i wpływ społeczny' : 'Relationships and Social Impact'),
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
    headerDefinition: lang === 'pl'
      ? 'Birthcode to syntetyczny opis wzorca działania: jak myślisz, regulujesz emocje i wchodzisz w relacje. To mapa mechanizmów, nie etykieta.'
      : 'Birthcode is a synthetic description of your operating pattern: how you think, regulate emotions, and engage with people. It is a map of mechanisms, not a label.',
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
