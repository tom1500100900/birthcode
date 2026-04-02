/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

type JsonValue = null | boolean | number | string | JsonValue[] | { [k: string]: JsonValue };

const ROOT = process.cwd();
const CONTENT_ROOT = path.join(ROOT, 'content');
const MODULES_ROOT = path.join(CONTENT_ROOT, 'modules');
const LOCALES_ROOT = path.join(ROOT, 'locales');

const PL_STOPWORDS = [' the ', ' and ', ' your ', ' recommendations', ' strengths', ' risks'];
const PL_DIACRITICS_REGEX = /[ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]/;

function readJson(filePath: string): JsonValue {
  const raw = fs.readFileSync(filePath, 'utf8');
  try {
    return JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid JSON: ${path.relative(ROOT, filePath)} (${String(error)})`);
  }
}

function getType(value: JsonValue): string {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value === null) {
    return 'null';
  }
  return typeof value;
}

function compareShape(enValue: JsonValue, plValue: JsonValue, label: string, keyPath: string[], errors: string[]): void {
  const enType = getType(enValue);
  const plType = getType(plValue);
  const pathLabel = keyPath.length > 0 ? keyPath.join('.') : '(root)';

  if (enType !== plType) {
    errors.push(`Type mismatch at ${label}:${pathLabel} (en=${enType}, pl=${plType})`);
    return;
  }

  if (enType === 'array') {
    const enArray = enValue as JsonValue[];
    const plArray = plValue as JsonValue[];
    const len = Math.min(enArray.length, plArray.length);
    for (let i = 0; i < len; i += 1) {
      compareShape(enArray[i], plArray[i], label, [...keyPath, String(i)], errors);
    }
    return;
  }

  if (enType !== 'object') {
    return;
  }

  const enObject = enValue as { [k: string]: JsonValue };
  const plObject = plValue as { [k: string]: JsonValue };
  const enKeys = Object.keys(enObject);
  const plKeys = Object.keys(plObject);

  enKeys.forEach((key) => {
    if (!(key in plObject)) {
      errors.push(`Missing key in PL at ${label}:${[...keyPath, key].join('.')}`);
      return;
    }
    compareShape(enObject[key], plObject[key], label, [...keyPath, key], errors);
  });

  plKeys.forEach((key) => {
    if (!(key in enObject)) {
      errors.push(`Extra key in PL at ${label}:${[...keyPath, key].join('.')}`);
    }
  });
}

function collectJsonFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const out: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  entries.forEach((entry: { name: string; isDirectory: () => boolean; isFile: () => boolean }) => {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      out.push(...collectJsonFiles(fullPath));
      return;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      out.push(fullPath);
    }
  });
  return out.sort();
}

function parityCheck(errors: string[]): void {
  const moduleLocales = fs.existsSync(MODULES_ROOT)
    ? fs.readdirSync(MODULES_ROOT, { withFileTypes: true })
      .filter((entry: { isDirectory: () => boolean }) => entry.isDirectory())
      .map((entry: { name: string }) => entry.name)
    : [];

  if (!moduleLocales.includes('en') || !moduleLocales.includes('pl')) {
    errors.push('content/modules must contain both en and pl directories');
    return;
  }

  const enModuleFiles = collectJsonFiles(path.join(MODULES_ROOT, 'en'))
    .map((p) => path.relative(path.join(MODULES_ROOT, 'en'), p));
  const plModuleFiles = collectJsonFiles(path.join(MODULES_ROOT, 'pl'))
    .map((p) => path.relative(path.join(MODULES_ROOT, 'pl'), p));

  enModuleFiles.forEach((rel) => {
    if (!plModuleFiles.includes(rel)) {
      errors.push(`Missing file in content/modules/pl: ${rel}`);
    }
  });
  plModuleFiles.forEach((rel) => {
    if (!enModuleFiles.includes(rel)) {
      errors.push(`Extra file in content/modules/pl: ${rel}`);
    }
  });

  enModuleFiles.forEach((rel) => {
    if (!plModuleFiles.includes(rel)) {
      return;
    }
    const enPath = path.join(MODULES_ROOT, 'en', rel);
    const plPath = path.join(MODULES_ROOT, 'pl', rel);
    compareShape(readJson(enPath), readJson(plPath), `content/modules/${rel}`, [], errors);
  });

  const enLocalePath = path.join(LOCALES_ROOT, 'en.json');
  const plLocalePath = path.join(LOCALES_ROOT, 'pl.json');
  if (fs.existsSync(enLocalePath) && fs.existsSync(plLocalePath)) {
    compareShape(readJson(enLocalePath), readJson(plLocalePath), 'locales', [], errors);
  } else {
    errors.push('Missing locales/en.json or locales/pl.json');
  }
}

function detectMixedLanguage(errors: string[]): void {
  const plFiles = [
    ...collectJsonFiles(path.join(CONTENT_ROOT, 'pl')),
    ...collectJsonFiles(path.join(MODULES_ROOT, 'pl')),
    path.join(LOCALES_ROOT, 'pl.json'),
  ];
  const enFiles = [
    ...collectJsonFiles(path.join(CONTENT_ROOT, 'en')),
    ...collectJsonFiles(path.join(MODULES_ROOT, 'en')),
    path.join(LOCALES_ROOT, 'en.json'),
  ];

  plFiles.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      return;
    }
    const raw = fs.readFileSync(filePath, 'utf8').toLowerCase();
    for (const needle of PL_STOPWORDS) {
      if (raw.includes(needle)) {
        errors.push(`Possible EN phrase in PL file: ${path.relative(ROOT, filePath)} (contains "${needle.trim()}")`);
        break;
      }
    }
  });

  enFiles.forEach((filePath) => {
    if (!fs.existsSync(filePath)) {
      return;
    }
    const raw = fs.readFileSync(filePath, 'utf8');
    if (PL_DIACRITICS_REGEX.test(raw)) {
      errors.push(`Possible PL characters in EN file: ${path.relative(ROOT, filePath)}`);
    }
  });
}

function hasStringArray(value: JsonValue): boolean {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function validateModuleSchema(errors: string[]): void {
  const locales = ['en', 'pl'];
  locales.forEach((locale) => {
    const decanPath = path.join(MODULES_ROOT, locale, 'decan_overlays.json');
    const cuspPath = path.join(MODULES_ROOT, locale, 'cusp_overlays.json');

    if (fs.existsSync(decanPath)) {
      const decan = readJson(decanPath) as { [k: string]: JsonValue };
      const requiredDecanPaths = [
        ['decans', '1', 'byRole', 'sun'],
        ['decans', '1', 'byRole', 'moon'],
        ['decans', '1', 'byRole', 'asc'],
        ['decans', '2', 'byRole', 'sun'],
        ['decans', '3', 'byRole', 'sun'],
        ['segments', 'early', 'byRole', 'sun'],
        ['segments', 'mid', 'byRole', 'sun'],
        ['segments', 'late', 'byRole', 'sun'],
      ];
      requiredDecanPaths.forEach((parts) => {
        let current: JsonValue = decan;
        for (const part of parts) {
          if (!current || typeof current !== 'object' || Array.isArray(current) || !(part in current)) {
            errors.push(`Invalid schema in ${path.relative(ROOT, decanPath)}: missing ${parts.join('.')}`);
            return;
          }
          current = (current as { [k: string]: JsonValue })[part];
        }
        if (!hasStringArray(current)) {
          errors.push(`Invalid schema in ${path.relative(ROOT, decanPath)}: ${parts.join('.')} must be string[]`);
        }
      });
    }

    if (fs.existsSync(cuspPath)) {
      const cusp = readJson(cuspPath) as { [k: string]: JsonValue };
      const threshold = (((cusp.cusp as { [k: string]: JsonValue } | undefined)?.thresholdDeg) ?? null);
      if (typeof threshold !== 'number') {
        errors.push(`Invalid schema in ${path.relative(ROOT, cuspPath)}: cusp.thresholdDeg must be number`);
      }
      const requiredCuspPaths = [
        ['cusp', 'shared'],
        ['cusp', 'byRole', 'sun'],
        ['cusp', 'byRole', 'moon'],
        ['cusp', 'byRole', 'asc'],
        ['nonCusp', 'shared'],
      ];
      requiredCuspPaths.forEach((parts) => {
        let current: JsonValue = cusp;
        for (const part of parts) {
          if (!current || typeof current !== 'object' || Array.isArray(current) || !(part in current)) {
            errors.push(`Invalid schema in ${path.relative(ROOT, cuspPath)}: missing ${parts.join('.')}`);
            return;
          }
          current = (current as { [k: string]: JsonValue })[part];
        }
        if (!hasStringArray(current)) {
          errors.push(`Invalid schema in ${path.relative(ROOT, cuspPath)}: ${parts.join('.')} must be string[]`);
        }
      });
    }
  });
}

function check(): void {
  const errors: string[] = [];
  try {
    parityCheck(errors);
    validateModuleSchema(errors);
    detectMixedLanguage(errors);
  } catch (error) {
    errors.push(String(error));
  }

  if (errors.length > 0) {
    console.error('content:check failed');
    errors.forEach((error) => console.error(`- ${error}`));
    process.exit(1);
  }

  console.log('content:check passed');
}

check();
