// DEPRECATED: This hardcoded atom map remains temporarily for backward compatibility.
// New content should be authored in versioned content packs (content/packs/*) and loaded via packRepo.
export type AtomicLayer = {
  core: string;
  shadow: string;
};

const FALLBACK_ATOM: AtomicLayer = {
  core: 'Expresses a developing pattern that can be refined with awareness and repetition.',
  shadow: 'May overcorrect under pressure when pace outruns reflection.',
};

export const sunAtoms: Record<string, AtomicLayer> = {
  Aries: {
    core: 'Moves first, learns by action, and generates momentum through direct decisions.',
    shadow: 'Can force timing or skip calibration when urgency is high.',
  },
  Taurus: {
    core: 'Builds steadily, protects consistency, and turns effort into durable outcomes.',
    shadow: 'Can resist needed pivots when certainty feels safer than adaptation.',
  },
  Gemini: {
    core: 'Connects ideas fast, translates complexity, and keeps options alive through curiosity.',
    shadow: 'Can scatter focus or overprocess choices before committing.',
  },
};

export const moonAtoms: Record<string, AtomicLayer> = {
  Aries: {
    core: 'Regulates emotion through movement, immediacy, and clear next actions.',
    shadow: 'Can react quickly before naming the deeper need.',
  },
  Taurus: {
    core: 'Regulates through routine, sensory grounding, and stable rhythms.',
    shadow: 'Can hold discomfort too long to avoid disruption.',
  },
  Gemini: {
    core: 'Regulates by language, context switching, and mental reframing.',
    shadow: 'Can intellectualize feelings instead of processing them directly.',
  },
};

export const ascAtoms: Record<string, AtomicLayer> = {
  Aries: {
    core: 'Shows up as direct, energetic, and willing to initiate first contact.',
    shadow: 'Can be perceived as abrupt when pace exceeds social context.',
  },
  Taurus: {
    core: 'Shows up as composed, grounded, and dependable in unfamiliar environments.',
    shadow: 'Can appear rigid when flexibility would help trust grow faster.',
  },
  Gemini: {
    core: 'Shows up as curious, conversational, and socially adaptive.',
    shadow: 'Can signal inconsistency when attention shifts too quickly.',
  },
};

export function getSunAtom(sign: string): AtomicLayer {
  return sunAtoms[sign] ?? FALLBACK_ATOM;
}

export function getMoonAtom(sign: string): AtomicLayer {
  return moonAtoms[sign] ?? FALLBACK_ATOM;
}

export function getAscAtom(sign: string): AtomicLayer {
  return ascAtoms[sign] ?? FALLBACK_ATOM;
}
