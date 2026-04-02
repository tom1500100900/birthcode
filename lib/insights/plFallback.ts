import type { InsightCategory, InsightItem } from '@/types/astro';

type InsightDisplay = {
  title: string;
  whyItMatters: string;
  questions: [string, string, string];
};

const PL_BY_CATEGORY: Record<InsightCategory, InsightDisplay> = {
  identity: {
    title: 'To?samo?? i kierunek',
    whyItMatters: 'Ta kategoria pomaga nazwac, kim jestes w dzialaniu i co daje Ci poczucie sprawczosci w codziennych wyborach.',
    questions: [
      'Jakie decyzje z ostatniego tygodnia byly najbardziej zgodne ze mna?',
      'W jakich sytuacjach zbyt latwo oddaje ster innym?',
      'Co mog? uproscic, zeby dzialac bardziej spojnie?',
    ],
  },
  career: {
    title: 'Kariera i wykonanie',
    whyItMatters: 'Ta kategoria porzadkuje styl pracy, tempo decyzji i sposob domykania tematow o najwyzszej wartosci.',
    questions: [
      'Kt?re zadanie daje dzisiaj najwiekszy zwrot z energii?',
      'Czy m?j rytm pracy wspiera jako??, czy tylko gasi pozary?',
      'Jaka jedna decyzje mog? domknac do konca dnia?',
    ],
  },
  relationships: {
    title: 'Relacje i komunikacja',
    whyItMatters: 'Ta kategoria pokazuje, jak laczyc granice, blisko?? i klarowna komunikacje bez niepotrzebnego tarcia.',
    questions: [
      'Gdzie potrzebuje wi?cej jasnosci, a gdzie wi?cej empatii?',
      'Jak komunikuje potrzeby, zanim pojawi si? napi?cie?',
      'Kt?ra relacja wymaga teraz spokojnej rozmowy kalibrujacej?',
    ],
  },
  stress: {
    title: 'Stres i regulacja',
    whyItMatters: 'Ta kategoria pomaga szybciej wracac do r?wnowagi, gdy pojawia si? przeciazenie lub duza zmiennosc.',
    questions: [
      'Po czym rozpoznaje, ze wchodze w tryb reaktywny?',
      'Jaki mikro-rytual najszybciej przywraca mi klarownosc?',
      'Kt?ra otwarta petle warto domknac, by zmniejszyc napi?cie?',
    ],
  },
};

function looksEnglish(text: string): boolean {
  return /\b(the|and|your|you|with|for|from|that|this|because|stress|focus|growth)\b/i.test(text);
}

export function toPolishInsightDisplay(
  item: InsightItem,
  forceFallback: boolean
): InsightDisplay {
  const fallback = PL_BY_CATEGORY[item.category];
  const mixedLanguage = looksEnglish(item.title) || looksEnglish(item.whyItMatters) || item.questions.some((q) => looksEnglish(q));
  if (forceFallback || mixedLanguage) {
    return fallback;
  }
  return {
    title: item.title,
    whyItMatters: item.whyItMatters,
    questions: item.questions,
  };
}

export function categoryInsightHeader(category: InsightCategory): InsightDisplay {
  return PL_BY_CATEGORY[category];
}
