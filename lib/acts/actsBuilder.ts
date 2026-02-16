import { ActItem, AstroChart, AstroProfile, ProfileContext } from '@/types/astro';
import { AppLocale } from '@/store/useLocaleStore';

function focusAction(element: AstroChart['dominantElement']): string {
  if (element === 'Fire') return 'channel urgency into one deliberate priority';
  if (element === 'Earth') return 'convert plans into visible daily outputs';
  if (element === 'Air') return 'turn ideas into shared decisions';
  return 'name emotional load before taking action';
}

function rhythmAction(modality: AstroChart['dominantModality']): string {
  if (modality === 'Cardinal') return 'start quickly, then checkpoint before expanding scope';
  if (modality === 'Fixed') return 'commit deeply, then schedule flexibility windows';
  return 'adapt rapidly, then close loops before adding new tasks';
}

export function buildActs(
  context: ProfileContext,
  chart: AstroChart,
  profile: AstroProfile,
  language: AppLocale = 'en'
): ActItem[] {
  const isPl = language === 'pl';
  const focus = focusAction(chart.dominantElement);
  const rhythm = rhythmAction(chart.dominantModality);
  const primaryStrength = profile.strengths[0] ?? (isPl ? 'Utrzymuj tempo zgodne z wartosciami.' : 'Keep momentum aligned with core values.');
  const primaryRisk = profile.risks[0] ?? (isPl ? 'Unikaj reaktywnych automatyzmow.' : 'Avoid defaulting to reactive patterns.');

  return [
    {
      id: 'act-identity-1',
      category: 'identity',
      title: isPl ? 'Poranne ustawienie kierunku' : 'Morning Alignment Brief',
      durationMinutes: 12,
      steps: [
        isPl ? 'Zapisz jedno zdanie, ktore ustawia kierunek dnia.' : 'Write one identity statement for the day.',
        isPl ? `Wybierz jeden priorytet, ktory odzwierciedla: ${focus}.` : `Choose one priority that reflects: ${focus}.`,
        isPl ? 'Ustal jedna granice, ktora chroni czas realizacji.' : 'Set one boundary that protects execution time.',
      ],
      expectedOutcome: isPl ? 'Wieksza klarownosc i mniej przelaczania kontekstu w ciagu dnia.' : 'Higher clarity and less context switching across the day.',
      supportsNeed: 'autonomy',
      rationale: isPl
        ? `Wspiera autonomie przez laczenie codziennych dzialan z wybranymi wartosciami i granicami. Ascendent w ${context.placements.asc.sign} korzysta z jasnych pierwszych krokow.`
        : `Supports autonomy by linking daily actions to self-chosen values and boundaries. Your Ascendant in ${context.placements.asc.sign} benefits from clear first steps.`,
    },
    {
      id: 'act-career-1',
      category: 'career',
      title: isPl ? 'Skoncentrowany sprint pracy' : 'Focused Work Sprint',
      durationMinutes: 45,
      steps: [
        isPl ? 'Wybierz jedno zadanie o najwyzszym wplywie.' : 'Pick one high-leverage task.',
        isPl ? `Zastosuj zasade rytmu: ${rhythm}.` : `Apply rhythm rule: ${rhythm}.`,
        isPl ? 'Zakoncz 5-minutowym podsumowaniem i notatka kolejnego kroku.' : 'Close with a 5-minute review and next-step note.',
      ],
      expectedOutcome: isPl ? 'Bardziej przewidywalny postep w pracy strategicznej.' : 'More reliable progress on strategic work.',
      supportsNeed: 'competence',
      rationale: isPl
        ? 'Wspiera kompetencje przez budowanie pewnosci dzieki mierzalnemu, skoncentrowanemu wynikowi.'
        : 'Supports competence by building skill confidence through measurable focused output.',
    },
    {
      id: 'act-relationships-1',
      category: 'relationships',
      title: isPl ? 'Relacyjny check-in' : 'Connection Check-in',
      durationMinutes: 20,
      steps: [
        isPl ? 'Wskaz jedna relacje, ktora potrzebuje uwagi.' : 'Identify one relationship needing attention.',
        isPl ? 'Wyslij jasny komunikat o potrzebie lub uznaniu.' : 'Send a clear and grounded message about needs or appreciation.',
        isPl ? 'Zaplanuj jeden punkt follow-up, aby utrzymac ciaglosc.' : 'Schedule one follow-up point to keep continuity.',
      ],
      expectedOutcome: isPl ? 'Silniejsze zaufanie przez regularnosc i bezposrednia komunikacje.' : 'Stronger trust through consistency and direct communication.',
      supportsNeed: 'relatedness',
      rationale: isPl
        ? 'Wspiera relacyjnosc przez wzmacnianie wzajemnej jasnosci, troski i domykania.'
        : 'Supports relatedness by strengthening mutual clarity, care, and follow-through.',
    },
    {
      id: 'act-stress-1',
      category: 'stress',
      title: isPl ? 'Reset ukladu nerwowego' : 'Nervous System Reset',
      durationMinutes: 15,
      steps: [
        isPl ? 'Zatrzymaj sie i nazwij poziom stresu od 1 do 10.' : 'Pause and name current stress level from 1 to 10.',
        isPl ? 'Wykonaj 5-minutowy reset oddechowy lub ruchowy.' : 'Run one breathing or movement reset for 5 minutes.',
        isPl ? `Przejrzyj wzorzec ryzyka: ${primaryRisk}` : `Review risk pattern: ${primaryRisk}`,
        isPl ? 'Wybierz jedno male dzialanie stabilizujace przed powrotem do pracy.' : 'Choose one small stabilizing action before returning to work.',
      ],
      expectedOutcome: isPl ? 'Nizsza reaktywnosc i szybsza regeneracja pod presja.' : 'Lower reactivity and faster recovery under pressure.',
      supportsNeed: 'autonomy',
      rationale: isPl
        ? 'Wspiera autonomie przez przywrocenie wyboru reakcji przed automatycznym dzialaniem.'
        : 'Supports autonomy by restoring response choice before reacting automatically.',
    },
    {
      id: 'act-career-2',
      category: 'career',
      title: isPl ? 'Tygodniowy przeglad systemu pracy' : 'Weekly Systems Review',
      durationMinutes: 30,
      steps: [
        isPl ? 'Wypisz, co poszlo do przodu i co utknelo w tym tygodniu.' : 'List what advanced and what stalled this week.',
        isPl ? 'Zamien jeden powtarzalny problem na checklistę.' : 'Convert one recurring issue into a repeatable checklist.',
        isPl ? 'Usun jedno zobowiazanie o niskim wplywie z kolejnego tygodnia.' : 'Remove one low-impact commitment from next week.',
      ],
      expectedOutcome: isPl ? 'Czystszy backlog i wyzsza jakosc realizacji.' : 'Cleaner workload and higher execution quality.',
      supportsNeed: 'competence',
      rationale: isPl
        ? 'Wspiera kompetencje przez wieksza czytelnosc procesu i mniej bledow do unikniecia.'
        : 'Supports competence by improving process clarity and reducing avoidable errors.',
    },
    {
      id: 'act-identity-2',
      category: 'identity',
      title: isPl ? 'Mapowanie mocnej strony na dzialanie' : 'Strength-to-Action Mapping',
      durationMinutes: 25,
      steps: [
        isPl ? `Zacznij od tej mocnej strony: ${primaryStrength}` : `Start from this strength: ${primaryStrength}`,
        isPl ? 'Wybierz jeden kontekst, gdzie ta mocna strona jest niedowykorzystana.' : 'Choose one context where this strength is underused.',
        isPl ? 'Okresl jedno konkretne zachowanie, ktore wdrozysz w tym tygodniu.' : 'Define one concrete behavior to deploy it this week.',
      ],
      expectedOutcome: isPl ? 'Bardziej intencjonalne wykorzystanie mocnych stron w realnych decyzjach.' : 'More intentional use of natural strengths in real decisions.',
      supportsNeed: 'autonomy',
      rationale: isPl
        ? 'Wspiera autonomie przez zastosowanie osobistych zasobow do samodzielnie wybranych zobowiazan.'
        : 'Supports autonomy by applying personal strengths to self-directed commitments.',
    },
  ];
}
