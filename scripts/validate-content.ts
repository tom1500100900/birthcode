/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const MODULES = ['definitions', 'big_three', 'dominants', 'traits', 'insights', 'practices', 'ui'];

type JsonObject = Record<string, unknown>;

function readJson(filePath: string): unknown {
  const raw = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(raw);
}

function getType(value: unknown): string {
  if (Array.isArray(value)) {
    return 'array';
  }
  if (value === null) {
    return 'null';
  }
  return typeof value;
}

function compareShape(
  enValue: unknown,
  plValue: unknown,
  moduleName: string,
  keyPath: string[],
  errors: string[]
): void {
  const enType = getType(enValue);
  const plType = getType(plValue);

  if (enType !== plType) {
    const pathLabel = keyPath.length > 0 ? keyPath.join('.') : '(root)';
    errors.push(`Type mismatch in ${moduleName}.json at ${pathLabel}: en=${enType}, pl=${plType}`);
    return;
  }

  if (enType !== 'object') {
    return;
  }

  const enObject = enValue as JsonObject;
  const plObject = plValue as JsonObject;
  const enKeys = Object.keys(enObject);
  const plKeys = Object.keys(plObject);

  for (const key of enKeys) {
    if (!(key in plObject)) {
      const fullPath = [...keyPath, key].join('.');
      errors.push(`Missing key in pl/${moduleName}.json: ${fullPath}`);
      continue;
    }
    compareShape(enObject[key], plObject[key], moduleName, [...keyPath, key], errors);
  }

  for (const key of plKeys) {
    if (!(key in enObject)) {
      const fullPath = [...keyPath, key].join('.');
      errors.push(`Extra key in pl/${moduleName}.json: ${fullPath}`);
    }
  }
}

function validate() {
  const root = process.cwd();
  const errors = [];

  for (const moduleName of MODULES) {
    const enPath = path.join(root, 'content', 'en', `${moduleName}.json`);
    const plPath = path.join(root, 'content', 'pl', `${moduleName}.json`);

    if (!fs.existsSync(enPath)) {
      errors.push(`Missing file: ${enPath}`);
      continue;
    }
    if (!fs.existsSync(plPath)) {
      errors.push(`Missing file: ${plPath}`);
      continue;
    }

    const enJson = readJson(enPath);
    const plJson = readJson(plPath);
    compareShape(enJson, plJson, moduleName, [], errors);
  }

  if (errors.length > 0) {
    console.error('Content validation failed:');
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exit(1);
  }

  console.log('Content validation passed (EN/PL key parity).');
}

validate();
