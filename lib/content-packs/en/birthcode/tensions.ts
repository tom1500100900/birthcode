import type { TensionKey } from '@/lib/content-engine/psychoNarrative';

// Short inline labels used inside section templates ({{tension_1}}, {{tension_2}})
export const EN_TENSION_SNIPPETS: Record<TensionKey, string> = {
  exploration_vs_control: 'Exploration vs. Control',
  analysis_vs_speed: 'Analysis vs. Speed',
  independence_vs_connection: 'Independence vs. Connection',
  intensity_vs_lightness: 'Intensity vs. Lightness',
  perfection_vs_progress: 'Perfection vs. Progress',
};

// Full psychological descriptions used in the Birthcode section and header
export const EN_TENSION_DESCRIPTIONS: Record<TensionKey, string> = {
  exploration_vs_control:
    'Your system simultaneously drives toward new territory and toward securing what already exists. You generate your best ideas in open space, but execute best within defined constraints. The key is not choosing one side, but scheduling both: protected exploration windows followed by hard commitment phases.',

  analysis_vs_speed:
    'Your system pulls toward thorough understanding and toward fast execution. Deep analysis increases accuracy but delays action; speed captures opportunity but increases error rate. The resolution is sequencing — define when the decision must be made before deciding what to decide.',

  independence_vs_connection:
    'Your system values autonomous ownership and relational belonging simultaneously. You perform best with clear solo accountability, but also need meaningful relational check-ins to sustain motivation. The resolution is structure: scheduled connection that does not compromise ownership.',

  intensity_vs_lightness:
    'Your system drives toward depth, focus, and full engagement, while also needing recovery, humor, and low-stakes interaction. High intensity produces your best work but depletes reserves quickly. The resolution is cycle design: deliberate light phases built into the rhythm, not added as afterthoughts.',

  perfection_vs_progress:
    'Your system drives toward high-quality output and toward maintaining forward momentum. Perfectionism raises the quality ceiling but slows iteration; progress orientation ships faster but risks quality debt. The resolution is threshold-setting: define the minimum quality bar before starting, then protect the iteration cadence from over-polish.',
};
