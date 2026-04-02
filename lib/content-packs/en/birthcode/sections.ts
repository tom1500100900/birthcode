// ─── New structure: 6 product blocks ─────────────────────────────────────────
// Rules (from feedback):
// 1. 1 thought = 1 sentence
// 2. Abstract → concrete, real-life
// 3. Metrics only once (in hook block)
// 4. Every section has a "that's me" moment
// 5. Less "system", more "You"

export const EN_BIRTHCODE_SECTION_ORDER = [
  'hook',
  'who_you_are',
  'tension',
  'how_you_work',
  'stress',
  'relations',
] as const;

export const EN_BIRTHCODE_SECTION_TITLES = {
  hook: '{{archetype}}',
  who_you_are: 'Who You Are',
  tension: 'Your Core Tension',
  how_you_work: 'How You Operate',
  stress: 'What Breaks You',
  relations: 'Relationships',
} as const;

export const EN_BIRTHCODE_SECTION_TEMPLATES = {

  // ─── 1. HOOK — 2–3 sentences, "that's me" ───────────────────────────────
  hook: [
    'You think long-term. You don\'t act on impulse — you observe, analyse, and only then decide.',
    'You see further than most people around you. You connect facts, emotions, and context into one picture.',
    'Sun in {{sun_label}}, Moon in {{moon_label}}, Ascendant in {{asc_label}}. Three different energies — one coherent pattern.',
  ],

  // ─── 2. WHO YOU ARE — simple, no theory ─────────────────────────────────
  who_you_are: [
    'You are a {{archetype}}.',
    'That means: you have a natural ability for deep analysis and patient action. You don\'t rush — because you know that good decisions take time.',
    'Your greatest strength is {{top_metric_1}}. That\'s why people often come to you for advice — you sense that there\'s always more beneath the surface.',
    'Your potential is highest when you have space to think. Chaos and urgency are your enemies.',
  ],

  // ─── 3. TENSION — GOLD, concrete, real-life ─────────────────────────────
  tension: [
    '⚡ {{tension_1}}',
    'On one side: you go deep. You commit fully. You don\'t do anything halfway.',
    'On the other: you burn out fast. You need space and recovery — and you often feel guilty for needing it.',
    'Your key is not "more effort". It\'s rhythm: deep → light → deep.',
    'When you understand this — you stop fighting yourself.',
  ],

  // ─── 4. HOW YOU OPERATE — concrete situations ───────────────────────────
  how_you_work: [
    'You work best when you have time to think something through properly and do it your way.',
    'You don\'t like being rushed. You don\'t like deciding without data.',
    'Your Ascendant in {{asc_label}} means you appear calm and composed on the outside — even when you\'re intensely processing on the inside.',
    'You make decisions slower than others — but more accurately. That\'s not a flaw. That\'s your style.',
  ],

  // ─── 5. WHAT BREAKS YOU — important, real-life ──────────────────────────
  stress: [
    'Under pressure, you go into control mode.',
    'You start over-analysing. You delay decisions. Or the opposite — you act too fast just to "get it off your plate".',
    'Your warning signal: you start isolating and stop talking about what you\'re feeling.',
    'Getting back to yourself is simple: one calm action. Not a plan. Not analysis. Action.',
  ],

  // ─── 6. RELATIONSHIPS — simple and real ─────────────────────────────────
  relations: [
    'In relationships, you give stability. People feel they can rely on you.',
    'Your Moon in {{moon_label}} means you pick up on others\' moods quickly — before they say a word.',
    'Your challenge: you say little about what you need. You assume others will figure it out.',
    'The best relationships for you are ones where you can go deep — without having to explain why you\'re not "light".',
  ],

} as const;
