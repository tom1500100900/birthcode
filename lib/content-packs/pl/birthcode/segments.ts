import type { SegmentKey } from '@/lib/content-engine/psychoNarrative';

export function segmentSnippet(role: 'sun' | 'moon' | 'asc', segment: SegmentKey): string {
  const map: Record<'sun' | 'moon' | 'asc', Record<SegmentKey, string>> = {
    sun: {
      early: 'Start jest szybki, nastawiony na prototypowanie i budowanie tempa.',
      mid: 'Tempo jest zrównoważone, sekwencyjne i nastawione na stabilne wykonanie.',
      late: 'Domykanie idzie przez konsolidację, głębię i integrację doświadczeń.',
    },
    moon: {
      early: 'Sygnały emocjonalne są wychwytywane szybko i przetwarzane bezpośrednio.',
      mid: 'Sygnały emocjonalne są integrowane krok po kroku z refleksją.',
      late: 'Sygnały emocjonalne są najpierw pogłębiane, a dopiero potem wyrażane.',
    },
    asc: {
      early: 'Styl wejścia jest bezpośredni, dynamiczny i zorientowany na tempo.',
      mid: 'Styl wejścia jest wyważony, kontekstowy i kalibrowany.',
      late: 'Styl wejścia jest selektywny, intencjonalny i strategiczny.',
    },
  };

  return map[role]?.[segment] ?? 'Tresc w przygotowaniu.';
}
