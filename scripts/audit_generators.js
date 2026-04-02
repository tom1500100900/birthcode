/* eslint-disable no-console */
const path = require('path');
const Module = require('module');
const { registerTS, registerTSX } = require('sucrase/dist/register');

registerTS();
registerTSX();

const rootDir = path.resolve(__dirname, '..');
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function patchedResolve(request, parent, isMain, options) {
  if (request.startsWith('@/')) {
    const absolutePath = path.join(rootDir, request.slice(2));
    return originalResolveFilename.call(this, absolutePath, parent, isMain, options);
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

global.__DEV__ = false;

const { TEST_FIXTURE_PROFILES } = require('../lib/dev/fixtures/profiles.ts');
const { calcMetrics, pickArchetype, detectTensions } = require('../lib/content-engine/psychoNarrative.ts');
const { buildBirthcodeReport } = require('../lib/content-engine/buildBirthcodeReport.ts');
const { buildPractices } = require('../lib/content-engine/buildPractices.ts');
const { scoreMatch } = require('../lib/match-engine/scoreMatch.ts');
const { buildMatchReport } = require('../lib/content-engine/buildMatchReport.ts');

function profileByLabel(label) {
  const found = TEST_FIXTURE_PROFILES.find((item) => item.label === label);
  if (!found) {
    throw new Error(`Fixture not found: ${label}`);
  }
  return found;
}

function flattenSelections(selections) {
  return Object.entries(selections).flatMap(([section, ids]) => ids.map((id) => `${section}:${id}`));
}

function diffSelections(a, b) {
  const setA = new Set(flattenSelections(a));
  const setB = new Set(flattenSelections(b));
  const onlyA = [...setA].filter((item) => !setB.has(item)).sort();
  const onlyB = [...setB].filter((item) => !setA.has(item)).sort();
  return { onlyA, onlyB };
}

function nonBigThreeSelectionDiff(diff) {
  const all = [...diff.onlyA, ...diff.onlyB];
  return all.filter((entry) => {
    const id = entry.split(':').slice(1).join(':');
    return !(
      id.includes('pk_sun_')
      || id.includes('fb_moon_')
      || id.includes('fb_asc_')
      || id === 'bc_birthcode_summary_big_three'
      || id === 'bc_birthcode_intro_integrated'
    );
  });
}

function metricDrivenSelectionDiff(entries) {
  return entries.filter((entry) => {
    const [section] = entry.split(':');
    return section !== 'birthcode' && section !== 'relations';
  });
}

function makeAuditInput(label, chartDataSwiss) {
  const metricsResult = calcMetrics({ bigThree: chartDataSwiss });
  const archetype = pickArchetype(metricsResult.metrics);
  const tensions = detectTensions(metricsResult.metrics);

  const birthcode = buildBirthcodeReport({
    lang: 'pl',
    chartDataSwiss,
    metrics: metricsResult.metrics,
    archetype,
    tensions,
    segments: metricsResult.segments,
  });

  const practices = buildPractices({
    lang: 'pl',
    metrics: metricsResult.metrics,
    tensions,
  });

  return {
    label,
    chartDataSwiss,
    metricsResult,
    archetype,
    tensions,
    birthcode,
    practices,
  };
}

function run() {
  const fixture1 = profileByLabel('Tomek 1979-06-04 17:30 Warsaw');
  const fixture3 = profileByLabel('Ania 1990-02-11 08:15 Krakow');

  const profileData = [
    makeAuditInput('P1 Tomek 17:30', {
      sun: { sign: 'Gemini', degree: 13.4 },
      moon: { sign: 'Cancer', degree: 18.1 },
      asc: { sign: 'Virgo', degree: 6.8 },
    }),
    makeAuditInput('P2 Tomek 13:30 (ASC changed)', {
      sun: { sign: 'Gemini', degree: 13.4 },
      moon: { sign: 'Cancer', degree: 18.1 },
      asc: { sign: 'Libra', degree: 24.2 },
    }),
    makeAuditInput(`P3 ${fixture3.label}`, {
      sun: { sign: 'Aquarius', degree: 2.6 },
      moon: { sign: 'Scorpio', degree: 23.9 },
      asc: { sign: 'Capricorn', degree: 11.2 },
    }),
  ];

  console.log('=== AUDIT GENERATOROW (offline, PL) ===');
  console.log(`Fixtures source: ${fixture1.label} / wariant ASC / ${fixture3.label}`);
  console.log('');

  for (const item of profileData) {
    const signalPresence = {
      hasMetrics: !!item.metricsResult && Object.keys(item.metricsResult.metrics).length > 0,
      hasArchetype: typeof item.archetype === 'string' && item.archetype.length > 0,
      hasTensions: Array.isArray(item.tensions) && item.tensions.length > 0,
    };

    console.log(`--- ${item.label} ---`);
    console.log(
      `Sygnały: metrics=${signalPresence.hasMetrics} archetype=${signalPresence.hasArchetype} tensions=${signalPresence.hasTensions}`
    );
    console.log(`Archetype: ${item.archetype}`);
    console.log(`Tensions: ${item.tensions.map((t) => t.key).join(', ')}`);
    console.log(`Practices: ${item.practices.length}`);
    console.log(`Selection sections: ${Object.keys(item.birthcode.debug?.selections ?? {}).join(', ')}`);
    console.log('');
  }

  const sel1 = profileData[0].birthcode.debug?.selections ?? {};
  const sel2 = profileData[1].birthcode.debug?.selections ?? {};
  const sel3 = profileData[2].birthcode.debug?.selections ?? {};
  const diff12 = diffSelections(sel1, sel2);
  const diff13 = diffSelections(sel1, sel3);

  console.log('=== DIFF SELECTIONS ===');
  console.log(`P1 vs P2 -> onlyA=${diff12.onlyA.length}, onlyB=${diff12.onlyB.length}`);
  console.log(`P1 vs P3 -> onlyA=${diff13.onlyA.length}, onlyB=${diff13.onlyB.length}`);
  const nonBigThree12 = nonBigThreeSelectionDiff(diff12);
  const nonBigThree13 = nonBigThreeSelectionDiff(diff13);
  const metricDriven12 = metricDrivenSelectionDiff(nonBigThree12);
  const metricDriven13 = metricDrivenSelectionDiff(nonBigThree13);
  console.log(`P1 vs P2 non-big-three diffs: ${nonBigThree12.length}`);
  if (nonBigThree12.length > 0) {
    console.log(nonBigThree12.join('\n'));
  }
  console.log(`P1 vs P3 non-big-three diffs: ${nonBigThree13.length}`);
  if (nonBigThree13.length > 0) {
    console.log(nonBigThree13.join('\n'));
  }
  console.log(`P1 vs P2 metric/tension/archetype-driven selection diffs: ${metricDriven12.length}`);
  console.log(`P1 vs P3 metric/tension/archetype-driven selection diffs: ${metricDriven13.length}`);
  console.log('');

  const phraseRegex = /(Birthcode to|Big Three to)/i;
  const definitionFlags = profileData.flatMap((profile) =>
    profile.birthcode.sections.flatMap((section) =>
      section.paragraphs
        .filter((paragraph) => phraseRegex.test(paragraph))
        .map((paragraph) => ({
          profile: profile.label,
          sectionId: section.id,
          snippet: paragraph.slice(0, 120),
        }))
    )
  );

  console.log('=== FLAG: definicje w środku raportu ===');
  if (definitionFlags.length === 0) {
    console.log('Brak flagowanych fraz "Birthcode to"/"Big Three to" w sekcjach raportu.');
  } else {
    for (const flag of definitionFlags) {
      console.log(`[${flag.profile}] ${flag.sectionId}: ${flag.snippet}`);
    }
  }
  console.log('');

  const match12Score = scoreMatch({
    lang: 'pl',
    profileA: profileData[0].chartDataSwiss,
    profileB: profileData[1].chartDataSwiss,
  });
  const match13Score = scoreMatch({
    lang: 'pl',
    profileA: profileData[0].chartDataSwiss,
    profileB: profileData[2].chartDataSwiss,
  });

  const match12 = buildMatchReport({
    lang: 'pl',
    profileA: profileData[0].chartDataSwiss,
    profileB: profileData[1].chartDataSwiss,
    matchScore: match12Score.score100,
    breakdownMeta: match12Score.breakdown,
    pairLabel: 'P1 vs P2',
  });
  const match13 = buildMatchReport({
    lang: 'pl',
    profileA: profileData[0].chartDataSwiss,
    profileB: profileData[2].chartDataSwiss,
    matchScore: match13Score.score100,
    breakdownMeta: match13Score.breakdown,
    pairLabel: 'P1 vs P3',
  });

  console.log('=== MATCH ===');
  console.log(`P1 vs P2: score=${match12.score100}, breakdown=${match12.breakdown.map((i) => `${i.id}:${i.points}/${i.maxPoints}`).join(' | ')}`);
  console.log(`P1 vs P3: score=${match13.score100}, breakdown=${match13.breakdown.map((i) => `${i.id}:${i.points}/${i.maxPoints}`).join(' | ')}`);
  console.log('');

  const signalDriven = metricDriven12.length > 0 || metricDriven13.length > 0;
  console.log('=== WERDYKT ===');
  console.log(signalDriven ? 'SIGNAL-DRIVEN' : 'PLACEHOLDER-ONLY');
}

run();
