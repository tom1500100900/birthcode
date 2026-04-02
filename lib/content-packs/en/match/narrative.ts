// EN Match Narrative Content Pack
// Premium psychological match report sections — signal-driven, token-aware

export const EN_MATCH_SECTION_TEMPLATES = {

  // ── OVERALL ──────────────────────────────────────────────────────────────────────
  overallTitle: 'Match Overview',
  overallBody:
    `Your compatibility score is {{score}}/100. ` +
    `The strongest axis in this pair is {{best_axis}} — this is where your patterns reinforce each other naturally. ` +
    `The most challenging axis is {{weak_axis}}, where different operating styles create friction that requires conscious navigation. ` +
    `A score in this range reflects a pairing with real potential and real work. ` +
    `The highest-scoring couples are rarely those with no tension — they are those who know how to use it.`,

  // ── DYNAMICS ───────────────────────────────────────────────────────────────────
  dynamicTitle: 'Relationship Dynamics',
  dynamicBody:
    `The {{best_axis}} axis creates a natural flow between you — moments where you feel understood without explanation. ` +
    `This is the foundation. Build on it deliberately. ` +
    `The {{weak_axis}} axis is where your default patterns diverge. ` +
    `This doesn't mean incompatibility — it means you will need to translate. ` +
    `One person's instinct will feel foreign to the other. ` +
    `The couples who navigate this well don't eliminate the difference — they name it, respect it, and build a shared language around it. ` +
    `Your shared strengths create momentum. Your differences create depth — if you let them.`,

  // ── GROWTH ───────────────────────────────────────────────────────────────────────
  growthTitle: 'Growth Path',
  growthBody:
    `With a score of {{score}}/100, this pairing has the ingredients for long-term depth. ` +
    `The {{best_axis}} axis gives you a shared emotional language. ` +
    `The {{weak_axis}} axis gives you the friction that forces growth. ` +
    `The question is not whether this relationship is easy — it is whether you are both willing to do the work that turns friction into understanding. ` +
    `The highest-quality relationships are not the ones with the highest scores. ` +
    `They are the ones where both people chose to stay curious about each other.`,

  // ── STRENGTHS ────────────────────────────────────────────────────────────────────
  strengthsTitle: 'Common Strengths',
  strengthsBody:
    `The {{best_axis}} connection is your structural advantage. ` +
    `In practice, this means you are likely to share a similar emotional register — ` +
    `how seriously you take things, how you recover from conflict, how much depth you expect from a relationship. ` +
    `This alignment reduces the invisible tax of constant recalibration. ` +
    `You don't have to explain why something matters — the other person already senses it. ` +
    `Use this as a foundation for trust, not as a reason to stop communicating.`,

  // ── RISKS ────────────────────────────────────────────────────────────────────────
  risksTitle: 'Potential Friction Points',
  risksBody:
    `The {{weak_axis}} axis is where misreads are most likely. ` +
    `One person may interpret the other's silence as withdrawal when it is actually processing. ` +
    `One may read directness as aggression when it is simply efficiency. ` +
    `These misreads compound over time if left unnamed. ` +
    `The antidote is not more patience — it is more precision. ` +
    `Name the pattern when you see it. Ask what the other person means before assuming you know. ` +
    `The friction on this axis is not a sign that something is wrong — it is a signal that you are dealing with a real difference, not a surface one.`,

  // ── MITIGATION ──────────────────────────────────────────────────────────────────
  mitigationTitle: 'How to Navigate the Differences',
  mitigationBody:
    `Three practices that work for pairs with your profile: ` +
    `First — create a shared signal for when the {{weak_axis}} pattern is active. ` +
    `A single word or phrase that means "I'm in my default mode right now, not reacting to you." ` +
    `Second — use the {{best_axis}} strength as a reset point. ` +
    `When tension escalates, return to the domain where you naturally understand each other. ` +
    `Third — schedule a monthly check-in that is not about problems. ` +
    `Ask: what is working? What do I appreciate about how you show up? ` +
    `Relationships that last are not those with fewer problems — they are those with better maintenance.`,

} as const;
