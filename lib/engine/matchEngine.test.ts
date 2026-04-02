import { PersonProfile, AstroSignals } from '../../types/astro';
import { MatchEngine } from './matchEngine';

/**
 * birthcode/lib/engine/matchEngine.test.ts
 *
 * Plik testujący symulację silnika astro-tindera.
 * Uruchom komendą np: npx ts-node lib/engine/matchEngine.test.ts (jeśli masz zainstalowane ts-node)
 */

const personA: PersonProfile = {
  id: 'user_A_girl',
  label: 'Dziewczyna (Ja)',
  birthInput: { dateISO: '1979-06-04', timeHHmm: '17:30', placeName: 'Warszawa' },
  profileContext: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  astroResult: {
    // Symulujemy sygnały Słońca, Księżyca w Powietrzu i Asc w Wodzie
    signals: {
      sunSign: 'Gemini',
      moonSign: 'Libra',
      ascSign: 'Scorpio',
      degree: 14,
      archetype: 'The Curious Observer',
      dominantEnergy: 'Air',
      tensions: [
        { id: 'air_water_clash', type: 'internal', elements: ['Air', 'Water'], intensity: 85 }
      ],
      metrics: {
        structure: 40,   // Niska struktura, dużo chaosu / pomysłów
        curiosity: 88,   // Bardzo duża ciekawość i potrzeba nowości
        stability: 45,   // Niska stabilność emocjonalna (skorpioniczny radar + overthinking wagi)
        social: 90       // Bardzo towarzyska
      }
    },
    chart: {} as any, profile: {} as any, insights: [], acts: [], context: {} as any
  }
};

const personB: PersonProfile = {
  id: 'user_B_boy',
  label: 'Chłopak (Match)',
  birthInput: { dateISO: '1982-01-15', timeHHmm: '12:00', placeName: 'Kraków' },
  profileContext: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  astroResult: {
    // Symulujemy kogoś z mocną, stabilną Ziemią (Koziorożec/Byk dominant)
    signals: {
      sunSign: 'Capricorn',
      moonSign: 'Taurus',
      ascSign: 'Taurus',
      degree: 25,
      archetype: 'The Builder',
      dominantEnergy: 'Earth',
      tensions: [
        { id: 'earth_earth_rigidity', type: 'internal', elements: ['Earth', 'Earth'], intensity: 70 }
      ],
      metrics: {
        structure: 85,   // Bardzo ułożony, planujący
        curiosity: 40,   // Mniejsza potrzeba nowości, woli rutynę
        stability: 90,   // Niewzruszona stabilność
        social: 50       // Introwertyk
      }
    },
    chart: {} as any, profile: {} as any, insights: [], acts: [], context: {} as any
  }
};

try {
  console.log('--- Rozpoczynam wyliczanie Match Score dla profili: "Dziewczyna" i "Chłopak" ---');
  const matchResult = MatchEngine.computeMatch(personA, personB);

  console.log('\n✅ Karta Relacji (Match Score):');
  console.log(`Ogółem: ${matchResult.score.total}/100`);
  console.log(`- Komunikacja: ${matchResult.score.communication}/100`);
  console.log(`- Stabilność emocjonalna: ${matchResult.score.emotional}/100`);
  console.log(`- Potencjał Wzrostu (Growth): ${matchResult.score.growth}/100`);

  console.log('\n🧩 Dynamiki psychologiczne między Wami:');
  matchResult.dynamics.forEach(dyn => {
    console.log(`[${dyn.type.toUpperCase()}] ${dyn.title}`);
    console.log(`⚙️ Mechanizm:\n${dyn.mechanism}`);
    console.log(`🌪️ Konsekwencja (Cień):\n${dyn.consequence}`);
  });

  console.log('\n💡 Rekomendacje dla (Person A - Ty):');
  matchResult.recommendations.forEach(rec => {
    console.log(`👉 Praktyka: ${rec.text}`);
    console.log(`Dlaczego to działa: ${rec.rationale}`);
  });

} catch (error) {
  console.error('Błąd wyliczania:', error);
}