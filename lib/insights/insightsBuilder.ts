import { AstroChart, AstroProfile, InsightItem, ProfileContext } from '@/types/astro';
import { AppLocale } from '@/store/useLocaleStore';

function elementTheme(element: AstroChart['dominantElement']): string {
  if (element === 'Fire') return 'initiative and momentum';
  if (element === 'Earth') return 'structure and reliability';
  if (element === 'Air') return 'perspective and communication';
  return 'emotional attunement and depth';
}

function modalityTheme(modality: AstroChart['dominantModality']): string {
  if (modality === 'Cardinal') return 'starting and leading';
  if (modality === 'Fixed') return 'stabilizing and sustaining';
  return 'adapting and integrating';
}

export function buildInsights(
  context: ProfileContext,
  chart: AstroChart,
  profile: AstroProfile,
  language: AppLocale = 'en'
): InsightItem[] {
  const isPl = language === 'pl';
  const elementFocus = elementTheme(chart.dominantElement);
  const modalityFocus = modalityTheme(chart.dominantModality);
  const openness = profile.traits.find((item) => item.dimension === 'Openness');
  const conscientiousness = profile.traits.find((item) => item.dimension === 'Conscientiousness');
  const extraversion = profile.traits.find((item) => item.dimension === 'Extraversion');
  const agreeableness = profile.traits.find((item) => item.dimension === 'Agreeableness');
  const emotionalStability = profile.traits.find((item) => item.dimension === 'Emotional Stability');

  return [
    {
      id: 'insight-identity-1',
      category: 'identity',
      title: isPl ? 'Wybory tozsamosci i spojnosc wartosci' : 'Identity choices and values consistency',
      whyItMatters: isPl
        ? `Twoj wzorzec pokazuje, ze otwartosc i sumiennosc dzialaja najlepiej, gdy eksploracja przechodzi w decyzje. Przy dominancie ${elementFocus} i ${modalityFocus} tozsamosc wzmacnia sie, gdy wartosci staja sie widocznymi nawykami. Slonce w ${context.placements.sun.sign} dodaje stabilny kierunek.`
        : `Your behavior suggests that openness and conscientiousness work best together when exploration is followed by commitment. With ${elementFocus} and ${modalityFocus} in your chart pattern, your identity feels strongest when values become visible habits instead of abstract intentions. Your Sun in ${context.placements.sun.sign} adds a consistent directional tone.`,
      questions: [
        isPl
          ? `Gdzie Twoja ${openness?.growthPath ?? 'ciekawosc'} zaprasza do malego eksperymentu w tym tygodniu?`
          : `Where is your ${openness?.growthPath ?? 'curiosity'} inviting a small experiment this week?`,
        isPl
          ? 'Ktore codzienne zachowanie pokaze Twoje wartosci w praktyce?'
          : 'Which daily behavior would make your values observable to someone else?',
        isPl
          ? 'Jakie jedno zobowiazanie ochronisz mimo zmian planu?'
          : 'What one commitment will you protect even if plans change around it?',
      ],
      linkedDimensions: ['Openness', 'Conscientiousness'],
      motivationLens: 'autonomy',
    },
    {
      id: 'insight-relationships-1',
      category: 'relationships',
      title: isPl ? 'Zaufanie w relacjach pod presja' : 'Relational trust under pressure',
      whyItMatters: isPl
        ? 'Ugodowosc i stabilnosc emocjonalna mocno wplywaja na sposob reagowania na napiecie. Relacja wzmacnia sie, gdy laczysz klarownosc z empatia i nazywasz potrzeby, zanim narasta frustracja.'
        : `Agreeableness and emotional stability often shape how you handle tension. You tend to preserve connection by staying constructive, but trust deepens most when clarity is paired with empathy and when needs are stated before frustration accumulates.`,
      questions: [
        isPl
          ? `Ktora relacja najbardziej potrzebuje teraz: ${agreeableness?.growthPath ?? 'uczciwej rozmowy'}?`
          : `Which relationship currently needs the ${agreeableness?.growthPath ?? 'next honest conversation'}?`,
        isPl
          ? 'Jakie uczucie warto nazwac, zanim przejdziesz do rozwiazan?'
          : 'What feeling is important to acknowledge before discussing solutions?',
        isPl
          ? 'Jaka granica poprawilaby przewidywalnosc po obu stronach?'
          : 'What boundary would improve reliability for both sides of the relationship?',
      ],
      linkedDimensions: ['Agreeableness', 'Emotional Stability'],
      motivationLens: 'relatedness',
    },
    {
      id: 'insight-career-1',
      category: 'career',      
      title: isPl ? 'Jakosc realizacji i pewnosc dzialania' : 'Execution quality and confidence',
      whyItMatters: isPl
        ? 'Sumiennosc rosnie przez petle informacji zwrotnej, nie sam wysilek. Lepsze wyniki pojawiaja sie, gdy rytm pracy pasuje do Twojej dynamiki, a postep mierzysz prostymi wskaznikami.'
        : `Conscientiousness grows through feedback loops, not just effort. Your pattern suggests better outcomes when workload design matches your natural rhythm and when progress is measured with simple, repeatable indicators.`,
      questions: [
        isPl
          ? `Ktora czesc tygodnia najlepiej wspiera ${conscientiousness?.resource ?? 'regularne domykanie'}?`
          : `Which part of your week supports ${conscientiousness?.resource ?? 'steady follow-through'} most consistently?`,
        isPl
          ? 'Jaki miernik pokaze poprawe procesu, nie tylko ilosci pracy?'
          : 'What metric would show that your process is improving, not only your output volume?',
        isPl
          ? 'Ktore zadanie mozesz przeprojektowac, by zmniejszyc tarcie?'
          : 'What task can be redesigned to reduce friction before motivation drops?',
      ],
      linkedDimensions: ['Conscientiousness'],
      motivationLens: 'competence',
    },
    {
      id: 'insight-stress-1',
      category: 'stress',
      title: isPl ? 'Regulacja przed decyzja' : 'Recovery pattern before decision pattern',
      whyItMatters: isPl
        ? 'Stabilnosc emocjonalna wzmacnia sie, gdy sygnaly stresu sa zauwazane wczesnie. Szybkie reakcje moga dawac pozor skutecznosci, ale czesto zawezaja perspektywe. Krotka regulacja poprawia decyzje i ton relacji.'
        : `Emotional stability is strengthened when stress signals are processed early. Your risk patterns show that fast reactions can feel productive but often reduce perspective, while short regulation routines improve judgment and relationship tone.`,
      questions: [
        isPl
          ? `Jaki sygnal pokazuje, ze narasta ${emotionalStability?.shadow ?? 'reaktywnosc'}?`
          : `What signal tells you that ${emotionalStability?.shadow ?? 'reactivity'} is rising?`,
        isPl
          ? 'Jaki 3-minutowy reset mozesz wykonac przed kolejna wazna odpowiedzia?'
          : 'What three-minute reset can you run before your next important reply?',
        isPl
          ? 'Ktore oczekiwanie mozna renegocjowac bez szkody dla priorytetow?'
          : 'Which expectation can be renegotiated without harming your core priorities?',
      ],
      linkedDimensions: ['Emotional Stability'],
      motivationLens: 'autonomy',
    },
    {
      id: 'insight-relationships-2',
      category: 'relationships',
      title: isPl ? 'Energia spoleczna i wplyw' : 'Social energy and influence',
      whyItMatters: isPl
        ? 'Ekstrawersja w Twoim profilu jest selektywna, a nie stala. Wplyw rośnie, gdy cel jest jasny, przygotowanie celowe, a rozmowa laczy strukture z uwaznym sluchaniem.'
        : `Extraversion in your profile appears selective rather than constant. You influence best when purpose is clear, preparation is intentional, and dialogue leaves room for both structure and listening.`,
      questions: [
        isPl
          ? `Gdzie ${extraversion?.resource ?? 'komunikacja z celem'} moze poprawic zgranie w tym tygodniu?`
          : `Where can ${extraversion?.resource ?? 'purpose-driven communication'} create better alignment this week?`,
        isPl
          ? 'Ktory komunikat trzeba skrocic, aby byl bardziej przekonujacy?'
          : 'What message needs to be concise before it can be persuasive?',
        isPl
          ? 'Jak zaprosic do wspolpracy zamiast brac wszystko na siebie?'
          : 'How can you invite collaboration instead of carrying full responsibility alone?',
      ],
      linkedDimensions: ['Extraversion', 'Agreeableness'],
      motivationLens: 'relatedness',
    },
    {
      id: 'insight-career-2',
      category: 'career',
      title: isPl ? 'Architektura motywacji' : 'Motivation architecture',
      whyItMatters: isPl
        ? 'Trwala motywacja rosnie, gdy w tygodniu obecne sa autonomia, kompetencja i relacyjnosc. Profil dziala najlepiej, gdy laczysz samodzielne decyzje z mierzalnym postepem i wsparciem.'
        : `Sustainable motivation increases when autonomy, competence, and relatedness are all represented in your week. Your profile is strongest when you pair self-directed decisions with measurable progress and high-quality support.`,
      questions: [
        isPl
          ? 'Ktora decyzja w tym tygodniu bedzie w pelni zgodna z Twoimi wartosciami?'
          : 'Which decision this week will be fully self-chosen by your own values?',
        isPl
          ? 'Gdzie mozesz pokazac postep jednym obiektywnym punktem kontrolnym?'
          : 'Where can you make progress more visible with one objective checkpoint?',
        isPl
          ? 'Kto moze dac feedback, ktory wyostrzy kolejny krok?'
          : 'Who can offer useful feedback that sharpens your next step?',
      ],
      linkedDimensions: ['Openness', 'Conscientiousness', 'Emotional Stability'],
      motivationLens: 'competence',
    },
  ];
}
