import { AstroSignals, AstroSnapshot, Placement, AstroTension, AstroMetrics } from '../../types/astro';

/**
 * birthcode/lib/engine/signalGenerator.ts
 *
 * Generuje warstwę "Signals" z surowych danych astrologicznych (placements i snapshot).
 * Przelicza stopnie planet na wskaźniki psychometryczne (0-100) i identyfikuje napięcia (Tensions).
 */

export class SignalGenerator {
  public static generateSignals(
    snapshot: AstroSnapshot,
    placements: { sun: Placement; moon: Placement; asc: Placement }
  ): AstroSignals {
    
    const elements = {
      sun: this.getElementForSign(placements.sun.sign),
      moon: this.getElementForSign(placements.moon.sign),
      asc: this.getElementForSign(placements.asc.sign)
    };

    const dominantEnergy = this.calculateDominantEnergy([elements.sun, elements.moon, elements.asc]);
    const archetype = this.determineArchetype(placements.sun.sign, dominantEnergy);
    
    const metrics = this.calculateMetrics(elements, placements);
    const tensions = this.identifyTensions(elements, metrics);

    return {
      sunSign: placements.sun.sign,
      moonSign: placements.moon.sign,
      ascSign: placements.asc.sign,
      degree: placements.sun.signDeg,
      archetype,
      dominantEnergy,
      tensions,
      metrics
    };
  }

  private static getElementForSign(sign: string): string {
    const fire = ['Aries', 'Leo', 'Sagittarius'];
    const earth = ['Taurus', 'Virgo', 'Capricorn'];
    const air = ['Gemini', 'Libra', 'Aquarius'];
    const water = ['Cancer', 'Scorpio', 'Pisces'];

    if (fire.includes(sign)) return 'Fire';
    if (earth.includes(sign)) return 'Earth';
    if (air.includes(sign)) return 'Air';
    if (water.includes(sign)) return 'Water';
    return 'Unknown';
  }

  private static calculateDominantEnergy(elements: string[]): string {
    const counts: Record<string, number> = {};
    let max = 0;
    let dominant = elements[0];

    for (const el of elements) {
      counts[el] = (counts[el] || 0) + 1;
      if (counts[el] > max) {
        max = counts[el];
        dominant = el;
      }
    }
    return dominant;
  }

  private static calculateMetrics(
    elements: { sun: string; moon: string; asc: string },
    placements: { sun: Placement; moon: Placement; asc: Placement }
  ): AstroMetrics {
    let structure = 50;
    let curiosity = 50;
    let stability = 50;
    let social = 50;

    const allElements = [elements.sun, elements.moon, elements.asc];
    
    // Structure: Wzrasta z Ziemią, spada z Powietrzem i Wodą
    structure += (allElements.filter(e => e === 'Earth').length * 15);
    structure -= (allElements.filter(e => e === 'Air').length * 10);
    
    // Curiosity: Wzrasta z Powietrzem i Ogniem
    curiosity += (allElements.filter(e => e === 'Air').length * 15);
    curiosity += (allElements.filter(e => e === 'Fire').length * 10);
    curiosity -= (allElements.filter(e => e === 'Earth').length * 10);

    // Stability: Wzrasta z Ziemią, spada z Wodą i Ogniem
    stability += (allElements.filter(e => e === 'Earth').length * 20);
    stability -= (allElements.filter(e => e === 'Water').length * 15);
    stability -= (allElements.filter(e => e === 'Fire').length * 5);

    // Social: Wzrasta z Powietrzem i Ogniem, spada z Wodą (introwersja) i Ziemią
    social += (allElements.filter(e => e === 'Air').length * 15);
    social += (allElements.filter(e => e === 'Fire').length * 15);
    social -= (allElements.filter(e => e === 'Water').length * 10);
    social -= (allElements.filter(e => e === 'Earth').length * 5);

    return {
      structure: this.clamp(structure),
      curiosity: this.clamp(curiosity),
      stability: this.clamp(stability),
      social: this.clamp(social)
    };
  }

  private static identifyTensions(
    elements: { sun: string; moon: string; asc: string },
    metrics: AstroMetrics
  ): AstroTension[] {
    const tensions: AstroTension[] = [];
    const allElements = [elements.sun, elements.moon, elements.asc];

    // Napięcie 1: Powietrze vs Woda (Umysł vs Emocje / Kontrola vs Relacje)
    if (allElements.includes('Air') && allElements.includes('Water')) {
      tensions.push({
        id: 'air_water_clash',
        type: 'internal',
        elements: ['Air', 'Water'],
        intensity: Math.abs(metrics.curiosity - metrics.stability) + 40
      });
    }

    // Napięcie 2: Ogień vs Ziemia (Impuls vs Struktura)
    if (allElements.includes('Fire') && allElements.includes('Earth')) {
      tensions.push({
        id: 'fire_earth_clash',
        type: 'internal',
        elements: ['Fire', 'Earth'],
        intensity: Math.abs(metrics.structure - 50) + 40
      });
    }
    
    // Napięcie 3: Ziemia vs Powietrze (Praktyczność vs Teoria)
    if (allElements.includes('Earth') && allElements.includes('Air')) {
      tensions.push({
        id: 'earth_air_clash',
        type: 'internal',
        elements: ['Earth', 'Air'],
        intensity: Math.abs(metrics.structure - metrics.curiosity) + 40
      });
    }

    return tensions.map(t => ({ ...t, intensity: this.clamp(t.intensity) }));
  }

  private static determineArchetype(sunSign: string, dominantEnergy: string): string {
    const archetypes: Record<string, string> = {
      Aries: 'The Pioneer', Taurus: 'The Builder', Gemini: 'The Curious Observer',
      Cancer: 'The Caregiver', Leo: 'The Creator', Virgo: 'The Analyst',
      Libra: 'The Diplomat', Scorpio: 'The Intense Strategist', Sagittarius: 'The Explorer',
      Capricorn: 'The Architect', Aquarius: 'The Visionary', Pisces: 'The Mystic'
    };
    return archetypes[sunSign] || 'The Wanderer';
  }

  private static clamp(value: number): number {
    return Math.max(0, Math.min(100, Math.round(value)));
  }
}