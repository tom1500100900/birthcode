import type { PracticeTemplate } from '@/lib/content-packs/pl/practices/practices';

export const EN_PRACTICES: PracticeTemplate[] = [
  // ── STRESS ──────────────────────────────────────────────────────────────────────
  {
    id: 'en_stress_reset',
    category: 'stress',
    title: 'Stress Reset',
    durationMin: 5,
    steps: [
      'When you feel tension rising, stop what you are doing.',
      'Set a timer for 3 minutes. Focus only on your breath — in for 4 counts, out for 6.',
      'After the timer, write one sentence: what triggered this, and what you will do next.',
    ],
    expectedOutcome:
      'Reduced physiological activation. Clearer decision-making in the next 30 minutes.',
    metricFocus: ['emotional_sensitivity', 'intensity_depth'],
    tensionFocus: ['intensity_vs_lightness'],
  },
  {
    id: 'en_stress_loop_close',
    category: 'stress',
    title: 'Close One Open Loop',
    durationMin: 8,
    steps: [
      'List every open task or commitment that is sitting in your head right now.',
      'Pick the one that is generating the most background noise.',
      'Do the minimum viable version of it today — even a 5-minute partial action counts.',
      'Mark it as closed or scheduled. Notice the relief.',
    ],
    expectedOutcome:
      'Reduced cognitive load. One fewer item draining your attention in the background.',
    metricFocus: ['analytical_order', 'persistence_drive'],
    tensionFocus: ['perfection_vs_progress'],
  },
  // ── CAREER ──────────────────────────────────────────────────────────────────────
  {
    id: 'en_career_focus_block',
    category: 'career',
    title: 'Focus Block',
    durationMin: 25,
    steps: [
      'Choose one task that requires your highest-quality thinking.',
      'Remove all notifications. Close all tabs except what you need.',
      'Work for 25 minutes without switching. No email, no messages.',
      'After 25 minutes, take a 5-minute break. Then decide: continue or stop.',
    ],
    expectedOutcome:
      'One unit of deep work completed. Measurable progress on your most important task.',
    metricFocus: ['persistence_drive', 'analytical_order'],
    tensionFocus: ['analysis_vs_speed'],
  },
  {
    id: 'en_career_decision_log',
    category: 'career',
    title: 'Decision Log',
    durationMin: 10,
    steps: [
      'After any significant decision, open a note and write: what was the context?',
      'What did you choose, and why?',
      'Set a reminder for 24 hours later to check: what actually happened?',
      'Over time, this log reveals your decision patterns — where you are accurate, where you are not.',
    ],
    expectedOutcome:
      'A growing record of your decision quality. Faster pattern recognition over time.',
    metricFocus: ['analytical_order', 'risk_orientation'],
    tensionFocus: ['analysis_vs_speed'],
  },
  {
    id: 'en_career_zone_audit',
    category: 'career',
    title: 'Zone Audit',
    durationMin: 15,
    steps: [
      'List your top 5 tasks from last week.',
      'For each one, mark: was this in my highest-value zone, or was it maintenance work?',
      'Calculate the ratio. How much of your week was spent in your zone?',
      'Identify one task you can delegate or eliminate to increase that ratio next week.',
    ],
    expectedOutcome:
      'Clarity on where your time is going. One concrete action to protect your highest-value work.',
    metricFocus: ['persistence_drive', 'control_need'],
    tensionFocus: ['exploration_vs_control'],
  },
  // ── RELATIONSHIPS ───────────────────────────────────────────────────────────────
  {
    id: 'en_relations_check',
    category: 'relationships',
    title: 'Relationship Energy Audit',
    durationMin: 10,
    steps: [
      'List the 5 people you interact with most this week.',
      'For each one, ask: does this relationship add energy or drain it?',
      'For the ones that drain: is it the person, the dynamic, or the context?',
      'Identify one relationship to invest in more, and one pattern to change.',
    ],
    expectedOutcome:
      'Clarity on your relational energy budget. One concrete shift in how you manage your social time.',
    metricFocus: ['connection_need', 'social_expression'],
    tensionFocus: ['independence_vs_connection'],
  },
  {
    id: 'en_relations_direct_need',
    category: 'relationships',
    title: 'State One Need Directly',
    durationMin: 10,
    steps: [
      'Identify one need you have been waiting for someone to notice.',
      'Write it as a clear, non-blaming statement: "I need X because Y."',
      'Choose one person to say it to today — in person, by message, or by call.',
      'Notice what happens. Most people respond better to clarity than to hints.',
    ],
    expectedOutcome:
      'One unmet need communicated directly. Reduced background resentment.',
    metricFocus: ['connection_need', 'social_expression'],
    tensionFocus: ['independence_vs_connection'],
  },
  // ── IDENTITY ──────────────────────────────────────────────────────────────────────
  {
    id: 'en_identity_values_compass',
    category: 'identity',
    title: 'Values Compass',
    durationMin: 12,
    steps: [
      'Write down 3 values that matter most to you this week.',
      'For each value, write one behavior that would make it visible to someone else.',
      'At the end of the day, check: did your decisions reflect these values?',
      'If not, identify the gap — not to judge, but to understand.',
    ],
    expectedOutcome:
      'Increased alignment between stated values and daily behavior. Reduced identity friction.',
    metricFocus: ['curiosity_openness', 'control_need'],
    tensionFocus: ['exploration_vs_control'],
  },
  {
    id: 'en_identity_tension_journal',
    category: 'identity',
    title: 'Tension Journal',
    durationMin: 10,
    steps: [
      'Think of a moment this week when you felt internal conflict.',
      'Write: what were the two competing pulls? What did each one want?',
      'Which one did you follow? Was it the right choice?',
      'What would you do differently next time?',
    ],
    expectedOutcome:
      'Greater awareness of your primary tension pattern. One insight about how to navigate it better.',
    metricFocus: ['curiosity_openness', 'intensity_depth'],
    tensionFocus: ['exploration_vs_control', 'intensity_vs_lightness'],
  },
];
