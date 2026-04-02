export type ZodiacElement = 'Fire' | 'Earth' | 'Air' | 'Water';
export type ZodiacModality = 'Cardinal' | 'Fixed' | 'Mutable';

export type ZodiacPlacement = {
  sign: string;
  degree: number;
  element: ZodiacElement;
  modality: ZodiacModality;
};

export type BirthProfile = {
  birthDateISO: string;
  birthTimeHHMM: string | null;
  timeUnknown: boolean;
  timeConfidence: number;
  placeText: string;
  country?: string;
  createdAtISO: string;
};

export type ChartCore = {
  sunSign: ZodiacPlacement;
  moonSign: ZodiacPlacement & { isApprox: boolean };
  risingSign: ZodiacPlacement & { isApprox: boolean };
  disclaimer: string;
};

export type InsightItem = {
  id: string;
  dateISO: string;
  title: string;
  body: string;
  tags: string[];
  saved: boolean;
};

export type AskCategory =
  | 'Career'
  | 'Relationships'
  | 'Money'
  | 'Purpose'
  | 'Growth'
  | 'Stress';

export type QACategory = AskCategory;

export type QAItem = {
  id: string;
  createdAtISO: string;
  category: AskCategory;
  question: string;
  answer: string;
  references: string[];
  followUps: string[];
};
