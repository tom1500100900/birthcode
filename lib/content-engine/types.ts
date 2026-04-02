export type InterpretationBlock = {
  id: string;
  title: string;
  body: string;
  tags?: string[];
};

export type NarrativeSectionKey =
  | 'overview'
  | 'sun'
  | 'moon'
  | 'asc'
  | 'decisions'
  | 'genius'
  | 'stress'
  | 'leadership'
  | 'recommendations';

export type NarrativeSection = {
  id: NarrativeSectionKey;
  title: string;
  paragraphs: string[];
};

export type ProfileInterpretation = {
  narrative: Record<NarrativeSectionKey, NarrativeSection>;
  core: InterpretationBlock[];
  strengths: InterpretationBlock[];
  risks: InterpretationBlock[];
  relationships: InterpretationBlock[];
  career: InterpretationBlock[];
  recommendations: InterpretationBlock[];
};

export type NormalizedAstroV2 = {
  bigThree: {
    sun: { sign: string; degree?: number };
    moon: { sign: string; degree?: number };
    asc: { sign: string; degree?: number };
  };
  dominantElement?: 'Fire' | 'Earth' | 'Air' | 'Water';
  dominantModality?: 'Cardinal' | 'Fixed' | 'Mutable';
  aspects?: Array<{
    from: string;
    to: string;
    type: string;
    orb?: number;
  }>;
};

export type ContentPackLocale = 'en' | 'pl';
