// PL Match Narrative Content Pack
// Premium psychologiczny raport dopasowania — signal-driven, token-aware

export const PL_MATCH_SECTION_TEMPLATES = {

  // ── OVERALL ──────────────────────────────────────────────────────────────────────
  overallTitle: 'Ocena dopasowania',
  overallBody:
    `Wasz wynik dopasowania to {{score}}/100. ` +
    `Najsilniejsza oś tej pary to {{best_axis}} — tutaj Wasze wzorce naturalnie się wzmacniają. ` +
    `Najbardziej wymagająca oś to {{weak_axis}}, gdzie różne style działania tworzą tarcie wymagające świadomej nawigacji. ` +
    `Wynik w tym zakresie odzwierciedla parę z realnym potencjałem i realną pracą do wykonania. ` +
    `Pary z najwyższymi wynikami rzadko są tymi bez napięć — są tymi, które wiedzą, jak je wykorzystać.`,

  // ── DYNAMICS ───────────────────────────────────────────────────────────────────
  dynamicTitle: 'Dynamika relacji',
  dynamicBody:
    `Oś {{best_axis}} tworzy naturalny przepływ między Wami — momenty, gdy czujecie się rozumiani bez tłumaczenia. ` +
    `To jest fundament. Budujcie na nim świadomie. ` +
    `Oś {{weak_axis}} to miejsce, gdzie Wasze domyślne wzorce się rozchodzą. ` +
    `To nie znaczy niekompatybilność — to znaczy, że będziecie musieli tłumaczyć. ` +
    `Instynkt jednej osoby będzie obcy dla drugiej. ` +
    `Pary, które dobrze nawigują tę różnicę, nie eliminują jej — nazywają ją, szanują i budują wokół niej wspólny język. ` +
    `Wasze wspólne siły tworzą momentum. Wasze różnice tworzą głębię — jeśli na to pozwolicie.`,

  // ── GROWTH ───────────────────────────────────────────────────────────────────────
  growthTitle: 'Ścieżka wzrostu',
  growthBody:
    `Z wynikiem {{score}}/100 ta para ma składniki do długoterminowej głębi. ` +
    `Oś {{best_axis}} daje Wam wspólny język emocjonalny. ` +
    `Oś {{weak_axis}} daje Wam tarcie, które wymusza wzrost. ` +
    `Pytanie nie brzmi, czy ta relacja jest łatwa — ale czy oboje jesteście gotowi na pracę, która zamienia tarcie w rozumienie. ` +
    `Relacje najwyższej jakości to nie te z najwyższymi wynikami. ` +
    `To te, w których oboje wybrali pozostać ciekawymi siebie nawzajem.`,

  // ── STRENGTHS ────────────────────────────────────────────────────────────────────
  strengthsTitle: 'Wspólne siły',
  strengthsBody:
    `Połączenie {{best_axis}} to Wasza strukturalna przewaga. ` +
    `W praktyce oznacza to, że prawdopodobnie dzielicie podobny rejestr emocjonalny — ` +
    `jak poważnie traktujecie sprawy, jak wychodzicie z konfliktu, jak głębokości oczekujecie od relacji. ` +
    `To wyrównanie zmniejsza niewidoczny koszt ciągłego rekalibrowania. ` +
    `Nie musicie tłumaczyć, dlaczego coś ma znaczenie — druga osoba już to wyczuwa. ` +
    `Użyjcie tego jako fundamentu zaufania, a nie powodu, żeby przestać komunikować.`,

  // ── RISKS ────────────────────────────────────────────────────────────────────────
  risksTitle: 'Potencjalne punkty tarcia',
  risksBody:
    `Oś {{weak_axis}} to miejsce, gdzie błędne odczyty są najbardziej prawdopodobne. ` +
    `Jedna osoba może interpretować milczenie drugiej jako wycofanie, gdy to jest przetwarzanie. ` +
    `Jedna może odczytywać bezpośredniość jako agresję, gdy to jest po prostu efektywność. ` +
    `Te błędne odczyty nawarstwiają się z czasem, jeśli nie są nazywane. ` +
    `Antidotum to nie więcej cierpliwości — to więcej precyzji. ` +
    `Nazwij wzorzec, gdy go widzisz. Zapytaj, co druga osoba ma na myśli, zanim założysz, że wiesz. ` +
    `Tarcie na tej osi to nie znak, że coś jest nie tak — to sygnał, że macie do czynienia z prawdziwą różnicą, nie powierzchowną.`,

  // ── MITIGATION ──────────────────────────────────────────────────────────────────
  mitigationTitle: 'Jak nawigować różnice',
  mitigationBody:
    `Trzy praktyki, które działają dla par z Waszym profilem: ` +
    `Po pierwsze — stwórzcie wspólny sygnał na chwile, gdy wzorzec {{weak_axis}} jest aktywny. ` +
    `Jedno słowo lub fraza, która znaczy: "jestem teraz w swoim domyślnym trybie, nie reaguję na Ciebie." ` +
    `Po drugie — użyjcie siły {{best_axis}} jako punktu resetu. ` +
    `Gdy napięcie rośnie, wróćcie do domeny, w której naturalnie się rozumiecie. ` +
    `Po trzecie — zaplanujcie miesięczny check-in, który nie dotyczy problemów. ` +
    `Pytajcie: co działa? Co doceniam w tym, jak się pojawiasz? ` +
    `Relacje, które trwają, to nie te z mniejszą liczbą problemów — to te z lepszym serwisem.`,

} as const;
