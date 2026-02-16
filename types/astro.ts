export interface BirthInput {
  dateISO: string;
  timeHHmm: string;
  placeName: string;
  timezone?: string;
  lat?: number;
  lon?: number;
}

export type CelestialBody = 'sun' | 'moon' | 'asc';

export type SignSegment = 'early' | 'mid' | 'late';

export interface AstroSnapshot {
  sunLon: number;
  moonLon: number;
  ascLon: number;
}

export interface Placement {
  body: CelestialBody;
  lon: number;
  sign: string;
  signDeg: number;
  segment: SignSegment;
  decan: 1 | 2 | 3;
  isCusp: boolean;
}

export interface ProfileContext {
  input: BirthInput;
  placements: {
    sun: Placement;
    moon: Placement;
    asc: Placement;
  };
  snapshot: AstroSnapshot;
  aspects?: Aspect[];
  houses?: unknown[];
}

export interface AstroProvider {
  computeSnapshot: (input: BirthInput) => AstroSnapshot;
}

export interface LegacyBirthInput {
  date: string;
  time: string;
  place: string;
  latitude?: number;
  longitude?: number;
  timezone: string;
}

export type AspectType =
  | 'conjunction'
  | 'opposition'
  | 'trine'
  | 'square'
  | 'sextile';

export interface PlanetPlacement {
  name: string;
  sign: string;
  degree: number;
}

export interface Aspect {
  from: string;
  to: string;
  type: AspectType;
  orb: number;
}

export interface AstroChart {
  sun: PlanetPlacement;
  moon: PlanetPlacement;
  ascendant: { sign: string; degree: number };
  planets: PlanetPlacement[];
  aspects: Aspect[];
  elementBalance: {
    element: 'Fire' | 'Earth' | 'Air' | 'Water';
    count: number;
    percentage: number;
  }[];
  modalityBalance: {
    modality: 'Cardinal' | 'Fixed' | 'Mutable';
    count: number;
    percentage: number;
  }[];
  dominantElement: 'Fire' | 'Earth' | 'Air' | 'Water';
  dominantModality: 'Cardinal' | 'Fixed' | 'Mutable';
}

export interface AstroProfile {
  traits: {
    title: string;
    description: string;
    longDescription: string;
    dimension: 'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Emotional Stability';
    resource: string;
    shadow: string;
    growthPath: string;
  }[];
  strengths: string[];
  risks: string[];
  riskPatterns: {
    trigger: string;
    automaticReaction: string;
    cost: string;
    alternativeResponse: string;
  }[];
  recommendations: string[];
  recommendationMeta: {
    text: string;
    need: 'autonomy' | 'competence' | 'relatedness';
  }[];
}

export type InsightCategory =
  | 'relationships'
  | 'career'
  | 'stress'
  | 'identity';

export interface InsightItem {
  id: string;
  category: InsightCategory;
  title: string;
  whyItMatters: string;
  questions: [string, string, string];
  linkedDimensions: Array<'Openness' | 'Conscientiousness' | 'Extraversion' | 'Agreeableness' | 'Emotional Stability'>;
  motivationLens: 'autonomy' | 'competence' | 'relatedness';
}

export interface ActItem {
  id: string;
  category: InsightCategory;
  title: string;
  durationMinutes: number;
  steps: string[];
  expectedOutcome: string;
  supportsNeed: 'autonomy' | 'competence' | 'relatedness';
  rationale: string;
}

export interface AstroResult {
  chart: AstroChart;
  profile: AstroProfile;
  insights: InsightItem[];
  acts: ActItem[];
  context: ProfileContext;
  contentLocale?: 'en' | 'pl';
}

export interface PersonProfile {
  id: string;
  label: string;
  birthInput: BirthInput;
  profileContext: ProfileContext | null;
  astroResult: AstroResult | null;
  createdAt: string;
  updatedAt: string;
}
