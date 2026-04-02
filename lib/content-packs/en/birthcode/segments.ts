import type { SegmentKey } from '@/lib/content-engine/psychoNarrative';

export function segmentSnippet(role: 'sun' | 'moon' | 'asc', segment: SegmentKey): string {
  const map: Record<'sun' | 'moon' | 'asc', Record<SegmentKey, string>> = {
    sun: {
      early: 'It starts fast, prototype-first, and momentum-oriented.',
      mid: 'It seeks balanced pacing, clear sequencing, and steady execution.',
      late: 'It finishes through consolidation, depth, and integration.',
    },
    moon: {
      early: 'Emotional cues are noticed quickly and processed directly.',
      mid: 'Emotional cues are integrated step by step with reflection.',
      late: 'Emotional cues are processed deeply before outward expression.',
    },
    asc: {
      early: 'Your entry style is immediate, dynamic, and momentum-driven.',
      mid: 'Your entry style is calibrated, context-aware, and balanced.',
      late: 'Your entry style is selective, intentional, and strategic.',
    },
  };

  return map[role]?.[segment] ?? 'Segment tone in progress.';
}
