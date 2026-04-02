/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const MODULES_ROOT = path.join(ROOT, 'content', 'modules');
const OUTPUT_DIR = path.join(ROOT, 'content', 'generated');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'index.ts');

function getLocales(): string[] {
  if (!fs.existsSync(MODULES_ROOT)) {
    return [];
  }
  return fs
    .readdirSync(MODULES_ROOT, { withFileTypes: true })
    .filter((entry: { isDirectory: () => boolean }) => entry.isDirectory())
    .map((entry: { name: string }) => entry.name)
    .sort();
}

function getJsonFiles(locale: string): string[] {
  const localeDir = path.join(MODULES_ROOT, locale);
  return fs
    .readdirSync(localeDir, { withFileTypes: true })
    .filter((entry: { isFile: () => boolean; name: string }) => entry.isFile() && entry.name.endsWith('.json'))
    .map((entry: { name: string }) => entry.name.replace('.json', ''))
    .sort();
}

function toIdent(locale: string, fileName: string): string {
  const normalized = `${locale}_${fileName}`.replace(/[^a-zA-Z0-9_]/g, '_');
  return normalized.replace(/_([a-z])/g, (_: string, char: string) => char.toUpperCase());
}

function toModuleKey(fileName: string): string {
  return fileName
    .replace(/_([a-z])/g, (_: string, char: string) => char.toUpperCase());
}

function generate(): void {
  const locales = getLocales();
  if (locales.length === 0) {
    throw new Error('No locales found in content/modules');
  }

  const imports: string[] = [];
  const localeBlocks: string[] = [];

  locales.forEach((locale) => {
    const files = getJsonFiles(locale);
    const pairs = files.map((fileName) => {
      const ident = toIdent(locale, fileName);
      const importPath = `../modules/${locale}/${fileName}.json`;
      imports.push(`import ${ident} from '${importPath}';`);
      return { ident, fileName };
    });

    const contentLines = pairs.map(({ ident, fileName }) => `    ${toModuleKey(fileName)}: ${ident},`);
    localeBlocks.push(`  ${locale}: {\n${contentLines.join('\n')}\n  },`);
  });

  const source = `/* AUTO-GENERATED FILE. DO NOT EDIT.\n * Run: node scripts/generate-content-index.ts\n */\n\n${imports.join('\n')}\n\nexport const contentModulesByLocale = {\n${localeBlocks.join('\n')}\n} as const;\n\nexport type GeneratedContentLocale = keyof typeof contentModulesByLocale;\n`;

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  fs.writeFileSync(OUTPUT_FILE, source);
  console.log(`Generated ${path.relative(ROOT, OUTPUT_FILE)}`);
}

generate();
