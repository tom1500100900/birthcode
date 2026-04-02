import { derivePlacement } from '@/src/lib/engine/derive';

function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`[segmentSmoke] ${message}`);
  }
}

export function runSegmentSmoke(): void {
  const early = derivePlacement('sun', 0.5);
  assert(early.segment === 'early', '0.5 should be early');
  assert(early.decan === 1, 'early should map to decan 1');
  assert(early.isCusp, '0.5 should be cusp');

  const mid = derivePlacement('moon', 10.1);
  assert(mid.segment === 'mid', '10.1 should be mid');
  assert(mid.decan === 2, 'mid should map to decan 2');
  assert(!mid.isCusp, '10.1 should not be cusp');

  const late = derivePlacement('asc', 29.5);
  assert(late.segment === 'late', '29.5 should be late');
  assert(late.decan === 3, 'late should map to decan 3');
  assert(late.isCusp, '29.5 should be cusp');
}
