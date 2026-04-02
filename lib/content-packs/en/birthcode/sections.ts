export const EN_BIRTHCODE_SECTION_ORDER = [
  'birthcode',
  'potential',
  'mind',
  'emotions',
  'action',
  'decisions',
  'genius',
  'stress',
  'relations',
] as const;

export const EN_BIRTHCODE_SECTION_TITLES = {
  birthcode: 'Your Birthcode',
  potential: 'Your Core Potential',
  mind: 'How Your Mind Works',
  emotions: 'Your Emotional System',
  action: 'Your Action Style',
  decisions: 'How You Make Decisions',
  genius: 'Your Genius Mode',
  stress: 'Your Stress Pattern',
  relations: 'Relationships and Social Impact',
} as const;

export const EN_BIRTHCODE_SECTION_TEMPLATES = {
  birthcode: [
    'Your Birthcode is built on the archetype of the {{archetype}}. This is not a personality label — it is a description of the operating system your psychology uses to navigate reality.',
    'The primary tension driving your system is {{tension_1}}. This means your highest-quality output emerges at the intersection of these two forces — not by resolving the tension, but by learning to work with it consciously.',
    'Your Sun in {{sun_label}} ({{sun_segment_tone}}), Moon in {{moon_label}} ({{moon_segment_tone}}), and Ascendant in {{asc_label}} ({{asc_segment_tone}}) are the stylistic channels through which this core pattern expresses itself.',
    'The dominant metrics shaping your pattern are {{top_metric_1}}, {{top_metric_2}}, and {{top_metric_3}}. These are the psychological levers that, when activated, produce your most distinctive output.',
  ],
  potential: [
    'Your greatest potential activates when your thinking, emotional regulation, and action style align in the same direction. In those moments, you operate with unusual clarity and produce output that integrates logic and intuition simultaneously.',
    'As a {{archetype}}, your core contribution is not effort — it is the specific quality of insight and execution that emerges from your unique combination of {{top_metric_1}} and {{top_metric_2}}.',
    'The tension between {{tension_1}} is not a weakness to overcome — it is the engine of your most original work. The people who benefit most from you are those who need someone who can hold both sides of that equation.',
    'Your potential is most visible when you operate in environments that allow your dominant metrics to function at full capacity, without forcing you to suppress the secondary tensions that give your work its depth.',
  ],
  mind: [
    'Your mind operates through the lens of {{top_metric_1}} and {{top_metric_2}}. This means you naturally process information by filtering it through these two dimensions before drawing conclusions.',
    'You think best when you have access to both structure and open space — the {{tension_1}} tension means that your cognitive performance peaks when you can alternate between focused analysis and exploratory thinking.',
    'Your Sun in {{sun_label}} shapes how your intention becomes action: {{sun_segment_tone}} Your Moon in {{moon_label}} shapes how you regulate the internal state that makes thinking possible: {{moon_segment_tone}}',
    'The practical implication is that your best thinking does not happen under constant pressure or in complete isolation. It happens in environments that match your natural cognitive rhythm.',
  ],
  emotions: [
    'Your emotional system is primarily shaped by {{top_metric_1}} and the tension of {{tension_1}}. Emotions are not noise in your system — they are data. When you learn to read them accurately, they become your most reliable decision-making signal.',
    'Your Moon in {{moon_label}} defines how you restore emotional equilibrium: {{moon_segment_tone}} This is not a preference — it is a biological requirement. When this channel is blocked, your overall performance degrades.',
    'The {{tension_2}} tension creates a specific emotional pattern: you may oscillate between states that feel contradictory. This is not instability — it is the natural rhythm of a system that holds two strong drives simultaneously.',
    'Emotional regulation for you is not about feeling less. It is about naming what is active, understanding which tension is driving the state, and choosing a response that honors both sides rather than suppressing one.',
  ],
  action: [
    'Your action style is defined by {{top_metric_1}} and {{top_metric_2}}. You move most effectively when these two forces are aligned — when the goal is clear, the constraints are defined, and the execution path matches your natural rhythm.',
    'Your Ascendant in {{asc_label}} shapes how you enter situations and initiate action: {{asc_segment_tone}} This is your default first-contact strategy — the way you naturally begin things before conscious adjustment.',
    'The tension of {{tension_1}} means your action style has two modes: one that prioritizes speed and one that prioritizes precision. Your highest output emerges when you consciously choose which mode the situation requires, rather than defaulting to your dominant side.',
    'Practically, this means you perform best when you have clarity on the type of action required before you begin. Ambiguous mandates create internal friction that slows your execution.',
  ],
  decisions: [
    'Your decision quality is shaped by the interplay of {{metric_analytical_order}} and {{metric_risk_orientation}}. These two metrics define your default decision architecture — how much you analyze before committing, and how much uncertainty you can tolerate.',
    'The tension of {{tension_1}} directly impacts your decision speed. When this tension is unresolved, you may oscillate between over-analysis and premature commitment. The resolution is to define the decision deadline before the decision content.',
    'Your Ascendant in {{asc_label}} modulates how you present decisions to others: {{asc_segment_tone}} This affects not just what you decide, but how your decisions land in relational and organizational contexts.',
    'The practical protocol: for high-stakes decisions, use your analytical strength to map options; for time-sensitive decisions, use your risk orientation to commit before perfect information arrives. Knowing which type of decision you face is itself the first decision.',
  ],
  genius: [
    'Your genius zone activates when {{top_metric_1}}, {{top_metric_2}}, and {{top_metric_3}} are all operating at high capacity simultaneously. This is the state where your output becomes qualitatively different — not just more, but better in kind.',
    'As a {{archetype}}, your specific genius is the ability to operate at the intersection of your primary tension: {{tension_1}}. Most people choose one side. You generate value by holding both and finding the synthesis that neither side alone can produce.',
    'The conditions for genius are specific: you need an environment that activates your dominant metrics, a challenge that requires your archetype\'s core capability, and enough psychological safety to operate without suppressing your secondary tensions.',
    'Genius for you is not a constant state — it is a mode you enter when conditions align. The practical work is identifying those conditions and engineering them deliberately, rather than waiting for them to occur by chance.',
  ],
  stress: [
    'Under stress, your system defaults to over-relying on your dominant metric while suppressing the weaker dimensions: {{low_metric_1}} and {{low_metric_2}}. This creates a predictable degradation pattern that you can learn to interrupt.',
    'The tension of {{tension_1}} becomes most acute under pressure. When stressed, you are likely to collapse toward one side of this tension — either over-controlling or over-releasing — rather than maintaining the productive balance that defines your best work.',
    'Your stress signature as a {{archetype}} is specific: you may appear functional on the surface while internally running on depleted resources. The early warning signs are typically a narrowing of perspective and an increase in reactive decision-making.',
    'Recovery for you is not passive rest — it is active recalibration. The fastest path back to baseline is naming the active tension, identifying which side you have collapsed toward, and taking one deliberate action that reactivates the suppressed dimension.',
  ],
  relations: [
    'In relationships, your psychological pattern creates a specific dynamic: your dominant metrics — {{top_metric_1}} and {{top_metric_2}} — are both an asset and a source of friction, depending on whether the other person\'s system is compatible or complementary.',
    'Your greatest relational strength is the quality that emerges from your archetype: {{archetype}}. People who benefit most from your presence are those who need someone who can hold your specific combination of depth and capability.',
    'The tension of {{tension_1}} creates a predictable relational pattern: you may attract people who represent one side of your tension, creating a dynamic where the relationship itself becomes the arena for working out the internal conflict.',
    'The practical implication: your best relationships are not with people who resolve your tension for you, but with people who respect both sides of it. Relationships that force you to suppress one dimension of your core pattern will create chronic friction.',
  ],
} as const;
