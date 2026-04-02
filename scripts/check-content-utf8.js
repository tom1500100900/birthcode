const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PL_DIR = path.join(ROOT, 'content', 'packs', 'pl');
const SENTINEL = '\u005A\u0061\u017C\u00F3\u0142\u0107 \u0067\u0119\u015B\u006C\u0105 \u006A\u0061\u017A\u0144';
const MOJIBAKE_PATTERN = /(?:\u00C3.|\u00C5.|\u00C4.|\u0102.|\u0139.|\u00E2\u20AC|\u00C2|\uFFFD)/;
const POLISH_DIACRITICS = /[\u0105\u0107\u0119\u0142\u0144\u00F3\u015B\u017A\u017C\u0104\u0106\u0118\u0141\u0143\u00D3\u015A\u0179\u017B]/;

function listJsonFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listJsonFiles(fullPath));
      continue;
    }
    if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }
  return files;
}

function walkStrings(node, out) {
  if (typeof node === 'string') {
    out.push(node);
    return;
  }
  if (Array.isArray(node)) {
    for (const item of node) {
      walkStrings(item, out);
    }
    return;
  }
  if (node && typeof node === 'object') {
    for (const value of Object.values(node)) {
      walkStrings(value, out);
    }
  }
}

function fail(message) {
  console.error(`[content:check-utf8] ${message}`);
  process.exit(1);
}

function run() {
  if (Buffer.from(SENTINEL, 'utf8').toString('utf8') !== SENTINEL) {
    fail('UTF-8 sentinel roundtrip failed for "Za\u017C\u00F3\u0142\u0107 g\u0119\u015Bl\u0105 ja\u017A\u0144".');
  }

  const files = listJsonFiles(PL_DIR);
  if (files.length === 0) {
    fail('No JSON files found under content/packs/pl.');
  }

  for (const filePath of files) {
    const relative = path.relative(ROOT, filePath);
    const raw = fs.readFileSync(filePath);

    if (raw.length >= 3 && raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
      fail(`${relative} has UTF-8 BOM. Save as UTF-8 without BOM.`);
    }

    let parsed;
    try {
      parsed = JSON.parse(raw.toString('utf8'));
    } catch (err) {
      fail(`${relative} is not valid UTF-8 JSON: ${err instanceof Error ? err.message : String(err)}`);
    }

    const strings = [];
    walkStrings(parsed, strings);

    if (strings.length === 0) {
      fail(`${relative} has no string values to validate.`);
    }

    const mojibakeHit = strings.find((value) => MOJIBAKE_PATTERN.test(value));
    if (mojibakeHit) {
      fail(`${relative} contains mojibake-like text: ${JSON.stringify(mojibakeHit.slice(0, 120))}`);
    }

    const hasPolishDiacritics = strings.some((value) => POLISH_DIACRITICS.test(value));
    if (!hasPolishDiacritics) {
      fail(`${relative} does not contain expected Polish diacritics.`);
    }
  }

  console.log('[content:check-utf8] OK - PL content is valid UTF-8 JSON and no mojibake patterns were found.');
}

run();
