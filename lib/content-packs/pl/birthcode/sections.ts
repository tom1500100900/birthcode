// ─── Nowa struktura: 6 bloków produktowych ───────────────────────────────────
// Zasady (z uwag):
// 1. 1 myśl = 1 zdanie
// 2. Abstrakcja → konkret z życia
// 3. Metryki tylko raz (w bloku hook)
// 4. Każda sekcja ma moment „to o mnie"
// 5. Mniej „system", więcej „Ty"

export const PL_BIRTHCODE_SECTION_ORDER = [
  'hook',
  'who_you_are',
  'tension',
  'how_you_work',
  'stress',
  'relations',
] as const;

export const PL_BIRTHCODE_SECTION_TITLES = {
  hook: '{{archetype}}',
  who_you_are: 'Kim jesteś',
  tension: 'Twoje napięcie',
  how_you_work: 'Jak działasz',
  stress: 'Co Cię rozwala',
  relations: 'Relacje',
} as const;

export const PL_BIRTHCODE_SECTION_TEMPLATES = {

  // ─── 1. HOOK — 2–3 zdania, „to o mnie" ──────────────────────────────────
  hook: [
    'Myślisz długoterminowo. Nie działasz impulsywnie — obserwujesz, analizujesz i dopiero wtedy podejmujesz decyzję.',
    'Widzisz dalej niż większość ludzi wokół Ciebie. Łączysz fakty, emocje i kontekst w jedną całość.',
    'Twoje Słońce w {{sun_label}}, Księżyc w {{moon_label}}, Ascendent w {{asc_label}}. Trzy różne energie — jeden spójny wzorzec.',
  ],

  // ─── 2. KIM JESTEŚ — prosto, bez teorii ─────────────────────────────────
  who_you_are: [
    'Jesteś {{archetype}}.',
    'To znaczy: masz naturalną zdolność do głębokiej analizy i cierpliwego działania. Nie spieszysz się — bo wiesz, że dobre decyzje wymagają czasu.',
    'Twoja największa siła to {{top_metric_1}}. To właśnie dlatego inni często przychodzą do Ciebie po radę — czujesz, że za każdą sytuacją kryje się coś więcej.',
    'Twój potencjał jest największy wtedy, gdy masz przestrzeń do myślenia. Chaos i pośpiech to Twoi wrogowie.',
  ],

  // ─── 3. NAPIĘCIE — GOLD, konkretne, życiowe ──────────────────────────────
  tension: [
    '⚡ {{tension_1}}',
    'Z jednej strony: wchodzisz głęboko. Angażujesz się na 100%. Nie robisz niczego połowicznie.',
    'Z drugiej: szybko się wyczerpujesz. Potrzebujesz luzu i resetu — i często czujesz się winny, że go potrzebujesz.',
    'Twoim kluczem nie jest „więcej pracy". Tylko rytm: głęboko → lekko → głęboko.',
    'Kiedy to rozumiesz — przestajesz walczyć ze sobą.',
  ],

  // ─── 4. JAK DZIAŁASZ — konkretne sytuacje ───────────────────────────────
  how_you_work: [
    'Najlepiej działasz, gdy masz czas, żeby coś dokładnie przemyśleć i zrobić po swojemu.',
    'Nie lubisz być poganiany. Nie lubisz decydować bez danych.',
    'Twój Ascendent w {{asc_label}} sprawia, że na zewnątrz wyglądasz spokojnie i pewnie — nawet kiedy w środku intensywnie przetwarzasz.',
    'Decyzje podejmujesz wolniej niż inni — ale trafniej. To nie jest wada. To Twój styl.',
  ],

  // ─── 5. STRES — bardzo ważne, życiowe ───────────────────────────────────
  stress: [
    'Kiedy jesteś pod presją — wchodzisz w tryb kontroli.',
    'Zaczynasz analizować za dużo. Odkładasz decyzje. Albo odwrotnie — działasz zbyt szybko, żeby „mieć to z głowy".',
    'Twój sygnał alarmowy: zaczynasz się izolować i przestajesz rozmawiać o tym, co czujesz.',
    'Powrót do siebie jest prosty: jedno spokojne działanie. Nie plan. Nie analiza. Działanie.',
  ],

  // ─── 6. RELACJE — prosto i życiowo ──────────────────────────────────────
  relations: [
    'W relacjach dajesz stabilność. Ludzie czują, że mogą na Tobie polegać.',
    'Twój Księżyc w {{moon_label}} sprawia, że szybko wyczuwasz nastroje innych — zanim cokolwiek powiedzą.',
    'Twoje wyzwanie: mówisz mało o tym, czego potrzebujesz. Zakładasz, że inni się domyślą.',
    'Najlepsze relacje dla Ciebie to takie, gdzie możesz być głęboki — bez tłumaczenia się z tego, że nie jesteś „lekki".',
  ],

} as const;
