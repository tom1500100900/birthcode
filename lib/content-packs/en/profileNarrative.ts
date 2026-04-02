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

export const enProfileNarrativePack: NarrativePack = {
  sectionTitles: {
    overview: 'Your Pattern',
    sun: 'How You Drive',
    moon: 'How You Recharge',
    asc: 'How Others See You',
    decisions: 'How You Decide',
    genius: 'Your Genius Zone',
    stress: 'Under Pressure',
    leadership: 'Your Impact',
    recommendations: 'What to Do Next',
  },
  metricNames: {
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
  },
  archetypes: {
    'Explorer Mind': {
      headline: 'You are an Explorer Mind.',
      gift: 'You connect dots others miss. You thrive on new information and unexpected combinations.',
      risk: 'You start more than you finish. The real work is choosing one lane and staying in it.',
    },
    'System Builder': {
      headline: 'You are a System Builder.',
      gift: 'You create order from chaos. Your structures outlast you — that\'s your superpower.',
      risk: 'You optimize too early. Sometimes the messy version is the right version.',
    },
    'Strategic Transformer': {
      headline: 'You are a Strategic Transformer.',
      gift: 'You see the move three steps ahead. You change things from the inside — quietly and precisely.',
      risk: 'You hold tension too long. Release is part of the strategy.',
    },
    'Social Catalyst': {
      headline: 'You are a Social Catalyst.',
      gift: 'You activate people. Rooms change when you enter them.',
      risk: 'You absorb others\' energy. Boundaries are not walls — they\'re filters.',
    },
    'Sensitive Analyst': {
      headline: 'You are a Sensitive Analyst.',
      gift: 'You read situations at two levels simultaneously: data and feeling. That\'s rare.',
      risk: 'You over-interpret under fatigue. Not every signal needs a response.',
    },
    'Steady Builder': {
      headline: 'You are a Steady Builder.',
      gift: 'You show up consistently. That\'s rarer than talent.',
      risk: 'You resist change longer than necessary. Stability and stagnation feel the same from the inside.',
    },
    'Visionary Architect': {
      headline: 'You are a Visionary Architect.',
      gift: 'You see what could exist before it does. You design futures others can\'t yet imagine.',
      risk: 'You live in the future too much. The present needs your attention too.',
    },
    'Deep Strategist': {
      headline: 'You are a Deep Strategist.',
      gift: 'You think in long arcs. You see further, plan deeper, and execute with precision.',
      risk: 'You over-prepare. At some point, the plan needs to become action.',
    },
    'Curious Integrator': {
      headline: 'You are a Curious Integrator.',
      gift: 'You build bridges between people and ideas that don\'t know they belong together.',
      risk: 'You spread too thin. Depth requires saying no to some connections.',
    },
    'Pragmatic Optimizer': {
      headline: 'You are a Pragmatic Optimizer.',
      gift: 'You finish what others abandon. Your follow-through is your competitive advantage.',
      risk: 'You confuse motion with progress. Sometimes the right move is to stop and reassess.',
    },
    'Relational Harmonizer': {
      headline: 'You are a Relational Harmonizer.',
      gift: 'You make people feel seen. That creates loyalty others can\'t buy.',
      risk: 'You suppress your own needs to keep the peace. That\'s not harmony — it\'s debt.',
    },
    'Adaptive Pioneer': {
      headline: 'You are an Adaptive Pioneer.',
      gift: 'You move first and adjust fast. You\'re comfortable where others freeze.',
      risk: 'You outrun your recovery. Speed without rest is just a faster way to break down.',
    },
  },
  tensions: {
    exploration_vs_control: {
      left: 'You want to explore and stay open.',
      right: 'You also need structure and predictability.',
      bridge: 'The resolution: explore within defined containers. Freedom with edges.',
    },
    analysis_vs_speed: {
      left: 'You want to understand everything before deciding.',
      right: 'The world rewards speed.',
      bridge: 'The resolution: set a decision deadline before you start analysing.',
    },
    independence_vs_connection: {
      left: 'You need space and autonomy.',
      right: 'You also need people and belonging.',
      bridge: 'The resolution: connection on your terms. Scheduled, not reactive.',
    },
    intensity_vs_lightness: {
      left: 'You go deep and commit fully.',
      right: 'You burn out and need recovery.',
      bridge: 'The resolution: build light phases into your rhythm deliberately.',
    },
    perfection_vs_progress: {
      left: 'You want it done right.',
      right: 'Done is better than perfect.',
      bridge: 'The resolution: define "good enough" before you start, not after.',
    },
  },
  roleOpeners: {
    sun: 'Your Sun sign shapes what drives you at the core.',
    moon: 'Your Moon sign shapes how you restore and regulate.',
    asc: 'Your Ascendant shapes how you enter situations and how others first read you.',
  },
  roleSynthesis: {
    sun: 'This is your engine — the direction you naturally push toward.',
    moon: 'This is your fuel system — how you recover so the engine can run.',
    asc: 'This is your interface — the version of you the world encounters first.',
  },
  segmentTone: {
    sun: {
      early: 'You\'re still discovering the full range of this drive. Raw energy, unfiltered.',
      mid: 'You\'re in the core expression of this drive. Reliable and consistent.',
      late: 'You\'ve integrated this energy deeply. It shows up with nuance and precision.',
    },
    moon: {
      early: 'Your regulation style is still forming. You\'re learning what actually restores you.',
      mid: 'Your pattern is stable. You know what you need — the work is asking for it.',
      late: 'You regulate quickly when you choose to. The toolkit is sophisticated.',
    },
    asc: {
      early: 'Your first impression is energetic and unfiltered. People get a lot of you immediately.',
      mid: 'Your entry style is consistent and readable. People know what to expect.',
      late: 'Your presence is refined. Strong impression, minimal effort.',
    },
  },
  overviewIntegration: 'These three energies — your drive, your regulation, and your interface — create one coherent pattern.',
  tensionPrompt: 'Your primary tension is not a problem. It\'s the engine of your best work.',
  roleMetricBridge: 'This shows up most clearly in:',
  decisionsFrame: 'You decide by weighing',
  decisionsSecond: 'Under pressure, this balance shifts — and that\'s when mistakes happen.',
  ascImpactPrefix: 'Your Ascendant in',
  geniusFrame: 'Your genius activates when your top metrics operate simultaneously.',
  geniusExecution: 'This is the state where your output becomes qualitatively different — not just more, but better in kind.',
  stressFrame: 'Under stress, you over-rely on your dominant metric and suppress the rest.',
  stressBridge: 'The warning signal is always the same:',
  stressRecovery: 'Recovery is one deliberate action — not a plan, not analysis. Action.',
  leadershipFrame: 'You lead through',
  leadershipExecution: 'People follow you because of consistency and judgment — not because you ask them to.',
  recommendationOpen: 'The highest-leverage move for you right now:',
  recommendationMiddle: 'The thing to stop doing:',
  recommendationClose: 'The thing to protect at all costs:',
};
