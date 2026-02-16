/* AUTO-GENERATED FILE. DO NOT EDIT.
 * Run: node scripts/generate-content-index.ts
 */

import enAspectModules from '../modules/en/aspect_modules.json';
import enCuspOverlays from '../modules/en/cusp_overlays.json';
import enDecanOverlays from '../modules/en/decan_overlays.json';
import enDegreeModifiers from '../modules/en/degree_modifiers.json';
import enDominantOverlays from '../modules/en/dominant_overlays.json';
import enPairDynamics from '../modules/en/pair_dynamics.json';
import enRoleOverlays from '../modules/en/role_overlays.json';
import enSignCore from '../modules/en/sign_core.json';
import plAspectModules from '../modules/pl/aspect_modules.json';
import plCuspOverlays from '../modules/pl/cusp_overlays.json';
import plDecanOverlays from '../modules/pl/decan_overlays.json';
import plDegreeModifiers from '../modules/pl/degree_modifiers.json';
import plDominantOverlays from '../modules/pl/dominant_overlays.json';
import plPairDynamics from '../modules/pl/pair_dynamics.json';
import plRoleOverlays from '../modules/pl/role_overlays.json';
import plSignCore from '../modules/pl/sign_core.json';

export const contentModulesByLocale = {
  en: {
    aspectModules: enAspectModules,
    cuspOverlays: enCuspOverlays,
    decanOverlays: enDecanOverlays,
    degreeModifiers: enDegreeModifiers,
    dominantOverlays: enDominantOverlays,
    pairDynamics: enPairDynamics,
    roleOverlays: enRoleOverlays,
    signCore: enSignCore,
  },
  pl: {
    aspectModules: plAspectModules,
    cuspOverlays: plCuspOverlays,
    decanOverlays: plDecanOverlays,
    degreeModifiers: plDegreeModifiers,
    dominantOverlays: plDominantOverlays,
    pairDynamics: plPairDynamics,
    roleOverlays: plRoleOverlays,
    signCore: plSignCore,
  },
} as const;

export type GeneratedContentLocale = keyof typeof contentModulesByLocale;
