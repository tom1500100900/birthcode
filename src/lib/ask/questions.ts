import { AskCategory } from '@/src/types';

export type SuggestedQuestion = {
  id: string;
  question: string;
  strategyId: string;
};

type QuestionBank = Record<AskCategory, SuggestedQuestion[]>;

function makeQuestion(
  category: AskCategory,
  index: number,
  question: string,
  strategyId: string
): SuggestedQuestion {
  return {
    id: `${category.toLowerCase()}-${index + 1}`,
    question,
    strategyId,
  };
}

export const QUESTION_BANK: QuestionBank = {
  Career: [
    makeQuestion('Career', 0, 'What kind of work environment helps me thrive?', 'work-environment'),
    makeQuestion('Career', 1, 'How do I build influence without burning out?', 'influence-sustainable'),
    makeQuestion('Career', 2, 'Where should I focus my energy this quarter?', 'focus-quarter'),
    makeQuestion('Career', 3, 'How do I handle imposter feelings in visible roles?', 'imposter-visible'),
    makeQuestion('Career', 4, 'What leadership style is most natural for me?', 'leadership-style'),
    makeQuestion('Career', 5, 'How can I communicate my value more clearly?', 'communicate-value'),
    makeQuestion('Career', 6, 'When should I push, and when should I pause?', 'push-vs-pause'),
    makeQuestion('Career', 7, 'What habits would improve my execution?', 'execution-habits'),
    makeQuestion('Career', 8, 'How do I navigate career transitions with confidence?', 'transition-confidence'),
    makeQuestion('Career', 9, 'What boundaries protect my long-term ambition?', 'career-boundaries'),
  ],
  Relationships: [
    makeQuestion('Relationships', 0, 'What do I need to feel safe in love?', 'safety-in-love'),
    makeQuestion(
      'Relationships',
      1,
      'What patterns do I repeat when I feel insecure?',
      'insecure-patterns'
    ),
    makeQuestion('Relationships', 2, 'How can I ask for closeness without pressure?', 'ask-closeness'),
    makeQuestion('Relationships', 3, 'What does emotional maturity look like for me?', 'emotional-maturity'),
    makeQuestion('Relationships', 4, 'How do I set healthier boundaries?', 'healthy-boundaries'),
    makeQuestion('Relationships', 5, 'How can I repair conflict more effectively?', 'conflict-repair'),
    makeQuestion('Relationships', 6, 'What kind of partner dynamic suits me?', 'partner-dynamic'),
    makeQuestion('Relationships', 7, 'How do I stop over-giving in relationships?', 'over-giving'),
    makeQuestion('Relationships', 8, 'How can I trust more while staying grounded?', 'trust-grounded'),
    makeQuestion('Relationships', 9, 'What relationship habit should I start this week?', 'weekly-habit'),
  ],
  Money: [
    makeQuestion('Money', 0, 'What is my healthiest relationship with money?', 'money-relationship'),
    makeQuestion('Money', 1, 'How do I earn in a way that matches my values?', 'values-earning'),
    makeQuestion('Money', 2, 'Where do I leak energy through spending?', 'spending-leaks'),
    makeQuestion('Money', 3, 'How can I build steady financial confidence?', 'financial-confidence'),
    makeQuestion('Money', 4, 'What does abundance mean for me right now?', 'abundance-definition'),
    makeQuestion('Money', 5, 'How do I balance security and risk?', 'security-risk-balance'),
    makeQuestion('Money', 6, 'What money habit brings long-term stability?', 'stability-habit'),
    makeQuestion('Money', 7, 'How should I think about pricing my work?', 'pricing-work'),
    makeQuestion('Money', 8, 'How do I reduce scarcity thinking?', 'scarcity-thinking'),
    makeQuestion('Money', 9, 'What is one practical financial move for this month?', 'monthly-move'),
  ],
  Purpose: [
    makeQuestion('Purpose', 0, 'How do I recognize meaningful direction?', 'meaningful-direction'),
    makeQuestion('Purpose', 1, 'What themes keep calling me forward?', 'recurring-themes'),
    makeQuestion('Purpose', 2, 'How can I act on purpose without over-planning?', 'act-without-overplanning'),
    makeQuestion('Purpose', 3, 'What does service look like in my life?', 'service-shape'),
    makeQuestion('Purpose', 4, 'How do I stay aligned when life gets noisy?', 'stay-aligned'),
    makeQuestion('Purpose', 5, 'What should I let go to make room for purpose?', 'let-go-room'),
    makeQuestion('Purpose', 6, 'How do I balance calling with responsibility?', 'calling-responsibility'),
    makeQuestion('Purpose', 7, 'What am I uniquely equipped to contribute?', 'unique-contribution'),
    makeQuestion('Purpose', 8, 'How can I make purpose feel practical today?', 'practical-purpose'),
    makeQuestion('Purpose', 9, 'What is my next meaningful experiment?', 'meaningful-experiment'),
  ],
  Growth: [
    makeQuestion('Growth', 0, 'What edge am I currently outgrowing?', 'outgrowing-edge'),
    makeQuestion('Growth', 1, 'How can I build discipline without rigidity?', 'discipline-flex'),
    makeQuestion('Growth', 2, 'What belief is limiting my next step?', 'limiting-belief'),
    makeQuestion('Growth', 3, 'How do I recover after setbacks?', 'setback-recovery'),
    makeQuestion('Growth', 4, 'What daily practice would change my trajectory?', 'daily-practice'),
    makeQuestion('Growth', 5, 'How do I turn self-awareness into behavior change?', 'awareness-action'),
    makeQuestion('Growth', 6, 'Where should I be more patient with myself?', 'self-patience'),
    makeQuestion('Growth', 7, 'How can I deepen confidence from the inside out?', 'inner-confidence'),
    makeQuestion('Growth', 8, 'What skill should I prioritize next?', 'next-skill'),
    makeQuestion('Growth', 9, 'How do I measure progress in a healthy way?', 'healthy-progress'),
  ],
  Stress: [
    makeQuestion('Stress', 0, 'How do I recover when I am overwhelmed?', 'overwhelm-recovery'),
    makeQuestion('Stress', 1, 'What signs tell me I need rest earlier?', 'early-rest-signs'),
    makeQuestion('Stress', 2, 'How do I regulate when emotions spike fast?', 'rapid-regulation'),
    makeQuestion('Stress', 3, 'What routines calm my nervous system?', 'calming-routines'),
    makeQuestion('Stress', 4, 'How can I reduce pressure I place on myself?', 'self-pressure'),
    makeQuestion('Stress', 5, 'How do I separate urgency from importance?', 'urgency-vs-importance'),
    makeQuestion('Stress', 6, 'What boundaries protect my energy best?', 'energy-boundaries'),
    makeQuestion('Stress', 7, 'How can I reset after a draining interaction?', 'post-drain-reset'),
    makeQuestion('Stress', 8, 'What support should I ask for right now?', 'ask-support'),
    makeQuestion('Stress', 9, 'What is one grounding ritual for difficult days?', 'grounding-ritual'),
  ],
};

const FOLLOW_UPS: Record<AskCategory, string[]> = {
  Career: ['How do I set better boundaries at work?', 'What is my best daily focus habit?'],
  Relationships: ['How can I express needs without fear?', 'What boundary deserves clarity now?'],
  Money: ['What financial habit should I automate?', 'How can I make spending more intentional?'],
  Purpose: ['What small step would honor my values today?', 'What can I release to stay aligned?'],
  Growth: ['What challenge should I lean into next?', 'How do I track progress without pressure?'],
  Stress: ['How do I set boundaries when overloaded?', 'What is my best daily reset ritual?'],
};

export function getSuggestedQuestions(category: AskCategory): SuggestedQuestion[] {
  return QUESTION_BANK[category];
}

export function getFollowUpPrompts(category: AskCategory): string[] {
  return FOLLOW_UPS[category];
}
