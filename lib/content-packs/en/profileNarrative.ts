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
    overview: 'Overview',
    sun: 'Sun Drive',
    moon: 'Moon Regulation',
    asc: 'Asc Expression',
    decisions: 'Decision Pattern',
    genius: 'Genius Zone',
    stress: 'Stress Pattern',
    leadership: 'Leadership Style',
    recommendations: 'Recommendations',
  },
  metricNames: {
    curiosity_openness: 'Curiosity and openness',
    analytical_order: 'Analytical order',
    emotional_sensitivity: 'Emotional sensitivity',
    intensity_depth: 'Intensity and depth',
    social_expression: 'Social expression',
    control_need: 'Need for control',
    adaptability: 'Adaptability',
    persistence_drive: 'Persistence drive',
    risk_orientation: 'Risk orientation',
    connection_need: 'Need for connection',
  },
  archetypes: {
    'Explorer Mind': {
      headline: 'You operate like an Explorer Mind.',
      gift: 'Your edge is pattern discovery through movement and open loops.',
      risk: 'You may over-expand before selecting one concrete lane.',
    },
    'System Builder': {
      headline: 'You operate like a System Builder.',
      gift: 'Your edge is creating repeatable structures that lower chaos.',
      risk: 'You may over-optimize and delay adaptation.',
    },
    'Strategic Transformer': {
      headline: 'You operate like a Strategic Transformer.',
      gift: 'Your edge is changing systems from the inside with timing.',
      risk: 'You may hold intensity too long before release.',
    },
    'Social Catalyst': {
      headline: 'You operate like a Social Catalyst.',
      gift: 'Your edge is activating people and momentum quickly.',
      risk: 'You may carry too many social demands at once.',
    },
    'Sensitive Analyst': {
      headline: 'You operate like a Sensitive Analyst.',
      gift: 'Your edge is combining precision with emotional signal reading.',
      risk: 'You may over-interpret weak signals under fatigue.',
    },
    'Steady Builder': {
      headline: 'You operate like a Steady Builder.',
      gift: 'Your edge is durable progress under pressure.',
      risk: 'You may resist changes that would increase efficiency.',
    },
    'Visionary Architect': {
      headline: 'You operate like a Visionary Architect.',
      gift: 'Your edge is connecting abstract possibilities with concrete plans.',
      risk: 'You may stay in design mode too long.',
    },
    'Deep Strategist': {
      headline: 'You operate like a Deep Strategist.',
      gift: 'Your edge is focused long-range positioning.',
      risk: 'You may default to control when uncertainty grows.',
    },
    'Curious Integrator': {
      headline: 'You operate like a Curious Integrator.',
      gift: 'Your edge is translating between perspectives and teams.',
      risk: 'You may absorb too many conflicting inputs.',
    },
    'Pragmatic Optimizer': {
      headline: 'You operate like a Pragmatic Optimizer.',
      gift: 'Your edge is turning messy processes into usable systems.',
      risk: 'You may cut exploration too early.',
    },
    'Relational Harmonizer': {
      headline: 'You operate like a Relational Harmonizer.',
      gift: 'Your edge is building trust and repair through attunement.',
      risk: 'You may suppress your own direction to keep peace.',
    },
    'Adaptive Pioneer': {
      headline: 'You operate like an Adaptive Pioneer.',
      gift: 'Your edge is moving first while staying flexible.',
      risk: 'You may outrun your recovery rhythm.',
    },
  },
  tensions: {
    exploration_vs_control: {
      left: 'Exploration',
      right: 'Control',
      bridge: 'Your system needs freedom windows paired with hard constraints.',
    },
    analysis_vs_speed: {
      left: 'Analysis',
      right: 'Speed',
      bridge: 'Your best output appears when you define when to decide, not only what to decide.',
    },
    independence_vs_connection: {
      left: 'Independence',
      right: 'Connection',
      bridge: 'You perform best when solo ownership and relational check-ins are both scheduled.',
    },
    intensity_vs_lightness: {
      left: 'Intensity',
      right: 'Lightness',
      bridge: 'High depth works when cycles include deliberate light recovery phases.',
    },
    perfection_vs_progress: {
      left: 'Perfection',
      right: 'Progress',
      bridge: 'Quality rises when iteration cadence is protected from over-polish.',
    },
  },
  roleOpeners: {
    sun: 'Your Sun describes how intention becomes action.',
    moon: 'Your Moon describes how you process emotion and restore stability.',
    asc: 'Your Asc describes your first-contact strategy with people and contexts.',
  },
  roleSynthesis: {
    sun: 'This channel is strongest when goals are explicit and measurable.',
    moon: 'This channel is strongest when needs are named before reactivity appears.',
    asc: 'This channel is strongest when transitions are prepared, not improvised under pressure.',
  },
  segmentTone: {
    sun: {
      early: 'It starts fast and prototyping-first.',
      mid: 'It seeks balanced pacing and clear sequencing.',
      late: 'It finishes through consolidation and depth.',
    },
    moon: {
      early: 'Emotional cues are noticed quickly and directly.',
      mid: 'Emotional cues are integrated step by step.',
      late: 'Emotional cues are processed deeply before expression.',
    },
    asc: {
      early: 'Your entry style is immediate and momentum-oriented.',
      mid: 'Your entry style is calibrated and context-aware.',
      late: 'Your entry style is selective and intentional.',
    },
  },
  overviewIntegration: 'Your dominant metrics currently are',
  tensionPrompt: 'The key balancing point right now sits around',
  roleMetricBridge: 'Within this role, the strongest active levers are',
  decisionsFrame: 'Decision quality is shaped by',
  decisionsSecond: 'Execution rhythm is shaped by',
  ascImpactPrefix: 'Asc modulation in this cycle:',
  geniusFrame: 'Your best contribution emerges when you use',
  geniusExecution: 'That combination supports high-value execution in complex environments.',
  stressFrame: 'Under stress, the least-supported dimensions are',
  stressBridge: 'When this is ignored, friction rises quickly.',
  stressRecovery: 'Recovery speeds up when you name the active tradeoff explicitly.',
  leadershipFrame: 'Leadership impact is mostly driven by',
  leadershipExecution: 'Delivery reliability is reinforced by',
  recommendationOpen: 'Build one weekly habit that upgrades',
  recommendationMiddle: 'Create one boundary that protects',
  recommendationClose: 'Use this integration question during planning:',
};
