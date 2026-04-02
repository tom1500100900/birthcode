import { AstroChart, AstroProfile, ProfileContext } from '@/types/astro';

type Need = 'autonomy' | 'competence' | 'relatedness';

const elementResource: Record<AstroChart['dominantElement'], string> = {
  Fire: 'initiative and momentum',
  Earth: 'structure and follow-through',
  Air: 'perspective and communication',
  Water: 'empathy and emotional timing',
};

const modalityResource: Record<AstroChart['dominantModality'], string> = {
  Cardinal: 'starting and setting direction',
  Fixed: 'staying focused and reliable',
  Mutable: 'adjusting and integrating feedback',
};

function formatRiskPattern(
  trigger: string,
  automaticReaction: string,
  cost: string,
  alternativeResponse: string
): string {
  return `Trigger: ${trigger} | Automatic reaction: ${automaticReaction} | Cost: ${cost} | Alternative response: ${alternativeResponse}`;
}

export function buildProfile(context: ProfileContext, chart: AstroChart): AstroProfile {
  const resourceTone = elementResource[chart.dominantElement];
  const modeTone = modalityResource[chart.dominantModality];

  const traits: AstroProfile['traits'] = [
    {
      title: 'Curiosity and meaning-making',
      dimension: 'Openness',
      description: `You tend to explore ideas through ${resourceTone} and learn by connecting patterns across different contexts.`,
      longDescription: `Your pattern suggests a reflective kind of curiosity that is practical rather than abstract for its own sake. You usually ask better questions when you are working on a real decision, not when brainstorming without constraints. In daily behavior this can look like reading deeply before making a move, comparing two competing options, and looking for the principle behind a repeated conflict. You are less interested in novelty for novelty's sake and more interested in insight that changes action. When pressure rises, your curiosity can narrow into over-analysis, especially if you feel responsible for getting everything right on the first attempt. A growth direction is to keep exploration time-bound: give yourself a clear window to gather perspective, then move into one small experiment. This preserves learning while avoiding decision fatigue.`,
      resource: `Pattern recognition and learning agility shaped by ${context.placements.sun.sign} self-direction.`,
      shadow: 'Too much ideation can delay commitment and drain confidence.',
      growthPath: 'Use a two-step rule: explore intentionally, then test one concrete next action.',
    },
    {
      title: 'Planning and follow-through',
      dimension: 'Conscientiousness',
      description: `You often work best with visible structure, and your pace is strongest when goals are translated into clear routines.`,
      longDescription: `Your behavioral style points to conscientious effort when expectations are explicit and progress is trackable. You generally do not need external pressure to begin; you need clarity on what "done" looks like. In practice, this appears as list-making, sequencing tasks, and protecting focused time from noise. The upside is reliable execution and a reputation for consistency. The downside appears when standards become too rigid and normal friction feels like failure. In those moments, planning can turn into self-criticism instead of support. A stronger strategy is to separate standards from identity: treat plans as tools, not verdicts. Keep one non-negotiable priority, one flexible task, and one quick review checkpoint each day. This keeps discipline high without locking you into perfection loops and helps sustain progress across changing conditions.`,
      resource: `Execution strength supported by ${modeTone}.`,
      shadow: 'Rigid standards can create unnecessary pressure and slower recovery after setbacks.',
      growthPath: 'Use adaptive planning: one firm commitment, one flexible block, and a brief end-of-day review.',
    },
    {
      title: 'Energy and social expression',
      dimension: 'Extraversion',
      description: `Your social energy is intentional: you engage deeply when purpose is clear and conserve energy when interactions lack direction.`,
      longDescription: `Your chart pattern suggests not a simple "high" or "low" social style, but a selective expression style. You tend to become more expressive when the interaction has a clear goal, shared language, or a meaningful project attached to it. In behavior, this can look like speaking decisively in planning meetings while staying quieter in unstructured conversation. You likely gain confidence from preparation and from environments where role expectations are clear. Under stress, social behavior can swing between over-asserting to regain control and withdrawing to preserve energy. Both reactions are understandable, but each can reduce mutual understanding. A better path is intentional pacing: define your message before important conversations, then leave room for two-way exchange. This supports influence without overextension and lets your communication style stay grounded and credible.`,
      resource: `Purpose-driven visibility and communication clarity.`,
      shadow: 'Stress can shift social tone toward over-control or disengagement.',
      growthPath: 'Before key conversations, define one outcome and one curiosity question you will ask.',
    },
    {
      title: 'Cooperation and trust-building',
      dimension: 'Agreeableness',
      description: `You usually build trust through consistency and respectful boundaries, balancing warmth with clear expectations.`,
      longDescription: `Your interpersonal style is best described as grounded cooperation. You tend to show care through reliability, follow-through, and direct communication rather than purely emotional reassurance. In everyday settings, people may experience you as dependable and fair, especially when roles are ambiguous and someone needs calm structure. The risk appears when responsibility becomes over-functioning: you may absorb too much to keep harmony, then feel unrecognized or depleted. Another pattern is softening your own needs to avoid short-term friction, which can create longer-term resentment. A healthier relational pattern is explicit reciprocity. Name what you can offer, what you need in return, and what timeline is realistic. This keeps connection authentic and reduces hidden pressure on both sides. Trust grows faster when generosity is paired with clear agreements.`,
      resource: 'Stable trust-building through clarity, reliability, and respect.',
      shadow: 'Conflict avoidance can hide needs and increase long-term tension.',
      growthPath: 'Practice direct reciprocity statements in key relationships each week.',
    },
    {
      title: 'Emotional steadiness under pressure',
      dimension: 'Emotional Stability',
      description: `You recover best when you pair reflection with action, turning emotional signals into specific adjustments.`,
      longDescription: `Your profile indicates that emotional steadiness is built through process, not suppression. You tend to regulate best when you can name what is happening, identify what is controllable, and act on one clear lever. In daily behavior this may look like taking a pause before replying, reframing a setback into feedback, or returning to a grounding routine before making a decision. The vulnerability appears when uncertainty stacks across multiple domains: your attention can lock onto worst-case forecasting, making options feel narrower than they are. The growth direction is structured recovery. Use a short reset sequence: label the signal, choose one stabilizing action, and confirm the next concrete step. This keeps emotional truth in the loop while protecting your decision quality. Over time, this pattern builds confidence that pressure can be managed without losing direction.`,
      resource: 'Reflective self-regulation and practical recovery routines.',
      shadow: 'Accumulated uncertainty can increase reactivity and narrowed thinking.',
      growthPath: 'Use a repeatable reset routine before high-stakes responses.',
    },
  ];

  const strengths = [
    `Resource: You convert ${resourceTone} into practical decisions and visible movement.`,
    `Resource: Your ${modeTone} style helps maintain momentum through complexity.`,
    'Resource: You translate reflection into behavior, which supports durable growth.',
  ];

  const riskPatterns: AstroProfile['riskPatterns'] = [
    {
      trigger: 'Too many competing priorities with unclear ownership',
      automaticReaction: 'Trying to solve everything at once to restore control',
      cost: 'Attention fragments and quality drops despite high effort',
      alternativeResponse: 'Choose one priority outcome, defer the rest, and communicate the sequence explicitly',
    },
    {
      trigger: 'Interpersonal tension that remains unspoken',
      automaticReaction: 'Keeping peace short-term by withholding direct needs',
      cost: 'Hidden strain builds and trust weakens over time',
      alternativeResponse: 'State one need and one boundary clearly, then invite collaborative adjustment',
    },
    {
      trigger: 'Unexpected setbacks in important plans',
      automaticReaction: 'Interpreting delay as failure and increasing pressure',
      cost: 'Lower resilience and reduced strategic perspective',
      alternativeResponse: 'Run a brief review: what is controllable now, what is learned, and what is next',
    },
  ];

  const risks = riskPatterns.map((pattern) =>
    formatRiskPattern(
      pattern.trigger,
      pattern.automaticReaction,
      pattern.cost,
      pattern.alternativeResponse
    )
  );

  const recommendationMeta: AstroProfile['recommendationMeta'] = [
    {
      text: 'Protect one weekly decision that is fully self-chosen to reinforce intrinsic direction.',
      need: 'autonomy',
    },
    {
      text: 'Track one measurable skill target for two weeks to strengthen confidence through evidence.',
      need: 'competence',
    },
    {
      text: 'Schedule one structured check-in where expectations and support are discussed explicitly.',
      need: 'relatedness',
    },
  ];

  const recommendations = recommendationMeta.map((item) => item.text);

  return {
    traits,
    strengths,
    risks,
    riskPatterns,
    recommendations,
    recommendationMeta,
  };
}
