import { AstroSignals, MatchScore, MatchDynamic, RelationshipMatch, PersonProfile, MatchRecommendation } from '../../types/astro';

/**
 * birthcode/lib/engine/matchEngine.ts
 *
 * Silnik obliczeniowy i logiczny dla modułu Relacji/Dopasowania (Astro-Tinder).
 * Łączy dane 'AstroSignals' dwóch osób i wylicza wynik Match (0-100)
 * oraz generuje odpowiednie dynamiki psychologiczne (MatchDynamic) bazując na:
 * 1. Osiach metryk (metrics: structure, curiosity, stability, social)
 * 2. Napięciach (tensions)
 * 3. Dominujących żywiołach i energiach
 */

export class MatchEngine {
  /**
   * Główna funkcja wyliczająca całkowity wynik dopasowania i generująca dynamiki między dwoma profilami.
   */
  public static computeMatch(personA: PersonProfile, personB: PersonProfile): RelationshipMatch {
    const sigA = personA.astroResult?.signals;
    const sigB = personB.astroResult?.signals;

    if (!sigA || !sigB) {
      throw new Error('Both profiles must have computed AstroSignals to run the MatchEngine.');
    }

    const score = this.calculateScores(sigA, sigB);
    const dynamics = this.resolveDynamics(sigA, sigB);
    const recommendations = this.generateRecommendations(dynamics);

    return {
      id: `match_${personA.id}_${personB.id}`,
      personAId: personA.id,
      personBId: personB.id,
      score,
      dynamics,
      recommendations,
      createdAt: new Date().toISOString()
    };
  }

  /**
   * Wylicza poszczególne parametry dopasowania (0-100) na podstawie delty metryk psychologicznych.
   */
  private static calculateScores(a: AstroSignals, b: AstroSignals): MatchScore {
    // 1. Communication: bazuje na Curiosity i Social (podobieństwo ułatwia komunikację, ale skrajności ją niszczą)
    const curiosityDelta = Math.abs(a.metrics.curiosity - b.metrics.curiosity);
    const socialDelta = Math.abs(a.metrics.social - b.metrics.social);
    const communicationScore = Math.max(0, 100 - (curiosityDelta * 0.5 + socialDelta * 0.5));

    // 2. Emotional: bazuje na Stability (im bardziej zbliżone i wysokie tym lepiej, duża delta = zderzenia)
    const stabilityDelta = Math.abs(a.metrics.stability - b.metrics.stability);
    const avgStability = (a.metrics.stability + b.metrics.stability) / 2;
    // Base 60, dodaj premię za wysoką średnią stabilność, odejmij za wielką różnicę
    const emotionalScore = Math.min(100, Math.max(0, 60 + (avgStability * 0.4) - (stabilityDelta * 0.8)));

    // 3. Growth: bazuje na różnicach (komplementarność) w Structure (np. chaos + porządek = wysoki potencjał wzrostu)
    const structureDelta = Math.abs(a.metrics.structure - b.metrics.structure);
    // Wyższa różnica = wyższy potencjał wzrostu (do pewnego momentu)
    const growthScore = Math.min(100, 40 + (structureDelta * 0.8));

    // Total Score (Weighted average)
    const total = Math.round((communicationScore * 0.3) + (emotionalScore * 0.4) + (growthScore * 0.3));

    return {
      total,
      communication: Math.round(communicationScore),
      emotional: Math.round(emotionalScore),
      growth: Math.round(growthScore)
    };
  }

  /**
   * Identyfikuje nazwane, premium dynamiki blokowe na podstawie sygnałów.
   * To tutaj algorytm wybiera bloki do wyświetlenia na UI.
   */
  private static resolveDynamics(a: AstroSignals, b: AstroSignals): MatchDynamic[] {
    const dynamics: MatchDynamic[] = [];

    // Dynamika 1: Kotwica i Latawiec (Anchor & Kite)
    // On/Ona z dużą potrzebą nowości i małą stabilnością vs Ktoś mocno strukturalny i stabilny
    if ((a.metrics.curiosity > 70 && b.metrics.stability > 75 && a.metrics.stability < 50) ||
        (b.metrics.curiosity > 70 && a.metrics.stability > 75 && b.metrics.stability < 50)) {
      dynamics.push({
        id: 'dyn_anchor_kite',
        title: 'Kotwica i Latawiec',
        mechanism: 'Jedna osoba zdejmuje z drugiej konieczność ciągłego skanowania otoczenia. Dzięki wybitnej stabilności partnera, strona analityczna w końcu czuje ulgę i może wyłączyć swój ciągły radar. Z kolei ta druga zyskuje stymulację i inspirację.',
        consequence: 'To, co początkowo daje upragniony spokój, po czasie może wydawać się nużące. Strona poszukująca wrażeń (Latawiec) może zacząć podświadomie prowokować dramaty, tylko po to, by sprawdzić wytrzymałość Kotwicy.',
        type: 'magnetic'
      });
    }

    // Dynamika 2: Zderzenie kontrolerów (Clash of Structures)
    // Obydwoje bardzo wysoko w metrykach Structure (np. Koziorożec/Byk dominant)
    if (a.metrics.structure > 80 && b.metrics.structure > 80) {
      dynamics.push({
        id: 'dyn_clash_of_structures',
        title: 'Starcie Architektów',
        mechanism: 'Oboje macie ściśle określone zasady i świetnie zorganizowany system operacyjny na życie. Na początku budzi to gigantyczny obopólny szacunek i poczucie bezpieczeństwa.',
        consequence: 'Gdy dochodzi do starcia o to, "czyj system jest lepszy", pojawia się całkowity chłód i nieustępliwość. Zamiast emocjonalnej kłótni, oboje ryglujecie swoje fortece, nie dając przeciwnikowi szansy na negocjację.',
        type: 'challenge'
      });
    }

    // Dynamika 3: Emocjonalne lustra (Emotional Mirrors)
    // Obydwoje bardzo wysoko w Social i nisko w Stability (np. Woda + Powietrze z dominacją)
    if (a.metrics.social > 75 && b.metrics.social > 75 && a.metrics.stability < 60 && b.metrics.stability < 60) {
      dynamics.push({
        id: 'dyn_emotional_mirrors',
        title: 'Emocjonalne Lustra',
        mechanism: 'Błyskawicznie rezonujecie na poziomie społecznym i emocjonalnym. Jesteście w stanie czytać sobie w myślach i czujecie, że znacie się od lat, już po pierwszej randce.',
        consequence: 'Wasz związek to wieczny rollercoaster. Brakuje Wam emocjonalnego "uziemienia", przez co mały stres zewnętrzny szybko eskaluje i zaraża oboje paniczną reakcją.',
        type: 'strength'
      });
    }

    // Jeśli nic nie weszło z ekstremów, rzucamy bazową dynamikę (Fallbacks)
    if (dynamics.length === 0) {
      dynamics.push({
        id: 'dyn_balanced_companions',
        title: 'Umiarkowani Towarzysze',
        mechanism: 'Wasze sygnały i metryki psychologiczne nie wchodzą ze sobą w gwałtowne reakcje. Tworzy to grunt pod stabilną, opartą na przyjaźni relację, bez nadmiaru dramatyzmu i fajerwerków na wejściu.',
        consequence: 'Możecie czasami czuć, że relacji brakuje głębokiej "iskry" czy intensywności, do której dążą inne, bardziej spolaryzowane układy.',
        type: 'strength'
      });
    }

    return dynamics;
  }

  /**
   * Generuje zwięzłe rekomendacje (praktyki SDT) powiązane z wybranymi dynamikami
   */
  private static generateRecommendations(dynamics: MatchDynamic[]): MatchRecommendation[] {
    const recs: MatchRecommendation[] = [];

    dynamics.forEach(dyn => {
      switch (dyn.id) {
        case 'dyn_anchor_kite':
          recs.push({
            target: 'personA', // Zakładając, że personA zawsze inicjuje sprawdzenie
            text: 'Przenieś napięcie na wspólną aktywność, nie na emocje.',
            rationale: 'Zamiast prowokować emocjonalne burze, gdy czujesz nudę (np. kłócąc się z powodu bzdur), zaproponuj wspólną, ekscytującą podróż lub nieznaną grę. Stabilny partner (Kotwica) nie znosi dramatów dla samego dramatu, ale z przyjemnością zorganizuje Wam nową ekspedycję.'
          });
          break;
        case 'dyn_clash_of_structures':
          recs.push({
            target: 'both',
            text: 'Wyznaczcie "Strefy Niezależności".',
            rationale: 'Zgódźcie się z góry, w jakich domenach życia każdy z Was ma pełną autolityczną kontrolę (np. jeden zarządza finansami operacyjnymi, drugi urlopem i domem). To chroni przed walką o władzę.'
          });
          break;
        case 'dyn_emotional_mirrors':
          recs.push({
            target: 'personA',
            text: 'Zbuduj "Kotwicę Rzeczywistości" na zewnątrz relacji.',
            rationale: 'Ponieważ oboje łatwo się nakręcacie, gdy przychodzi stres, miejcie sprawdzoną osobę z zewnątrz (chłodnego, racjonalnego przyjaciela lub mentora), z którą konsultujecie decyzje podjęte w afekcie, zanim zrobicie coś gwałtownego.'
          });
          break;
      }
    });

    return recs;
  }
}
