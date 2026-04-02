const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const PL_DIR = path.join(ROOT, 'content', 'packs', 'pl');
const MOJIBAKE_PATTERN = /(?:\u00C3.|\u00C5.|\u00C4.|\u0102.|\u0139.|\u00E2\u20AC|\u00C2|\uFFFD)/g;

const cp1250Decoder = new TextDecoder('windows-1250');
const utf8Decoder = new TextDecoder('utf-8');
const byteByChar = new Map();
for (let b = 0; b < 256; b += 1) {
  const ch = cp1250Decoder.decode(Uint8Array.from([b]));
  if (!byteByChar.has(ch)) {
    byteByChar.set(ch, b);
  }
}

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

function scoreMojibake(text) {
  const matches = text.match(MOJIBAKE_PATTERN);
  return matches ? matches.length : 0;
}

function scorePolish(text) {
  const matches = text.match(/[\u0105\u0107\u0119\u0142\u0144\u00F3\u015B\u017A\u017C\u0104\u0106\u0118\u0141\u0143\u00D3\u015A\u0179\u017B]/g);
  return matches ? matches.length : 0;
}

function decodeAsUtf8FromWindows1250Bytes(value) {
  const bytes = [];
  for (const ch of value) {
    const b = byteByChar.get(ch);
    if (b === undefined) {
      return null;
    }
    bytes.push(b);
  }
  return utf8Decoder.decode(Uint8Array.from(bytes));
}

function decodeAsUtf8FromLatin1Bytes(value) {
  try {
    return Buffer.from(value, 'latin1').toString('utf8');
  } catch {
    return null;
  }
}

function bestRepair(value) {
  const candidates = new Set([value]);
  const c1 = decodeAsUtf8FromWindows1250Bytes(value);
  const c2 = decodeAsUtf8FromLatin1Bytes(value);
  if (c1) candidates.add(c1);
  if (c2) candidates.add(c2);
  if (c1) {
    const c11 = decodeAsUtf8FromWindows1250Bytes(c1);
    const c12 = decodeAsUtf8FromLatin1Bytes(c1);
    if (c11) candidates.add(c11);
    if (c12) candidates.add(c12);
  }
  if (c2) {
    const c21 = decodeAsUtf8FromWindows1250Bytes(c2);
    const c22 = decodeAsUtf8FromLatin1Bytes(c2);
    if (c21) candidates.add(c21);
    if (c22) candidates.add(c22);
  }

  let best = value;
  let bestMojibake = scoreMojibake(value);
  let bestPolish = scorePolish(value);

  for (const candidate of candidates) {
    const mojibake = scoreMojibake(candidate);
    const polish = scorePolish(candidate);
    if (mojibake < bestMojibake) {
      best = candidate;
      bestMojibake = mojibake;
      bestPolish = polish;
      continue;
    }
    if (mojibake === bestMojibake && polish > bestPolish) {
      best = candidate;
      bestPolish = polish;
    }
  }

  return best;
}

function repairNode(node, stats) {
  if (typeof node === 'string') {
    if (scoreMojibake(node) === 0) {
      return node;
    }
    const repaired = bestRepair(node);
    if (repaired !== node) {
      stats.repairedStrings += 1;
    }
    return repaired;
  }
  if (Array.isArray(node)) {
    return node.map((item) => repairNode(item, stats));
  }
  if (node && typeof node === 'object') {
    const out = {};
    for (const [key, value] of Object.entries(node)) {
      out[key] = repairNode(value, stats);
    }
    return out;
  }
  return node;
}

function parseJsonFromBytes(rawBytes, filePath) {
  const utf8Text = rawBytes.toString('utf8');
  try {
    return { parsed: JSON.parse(utf8Text), source: 'utf8' };
  } catch {
    const cp1250Text = cp1250Decoder.decode(rawBytes);
    try {
      return { parsed: JSON.parse(cp1250Text), source: 'windows-1250' };
    } catch (err) {
      throw new Error(`[fix-polish-encoding] Cannot parse JSON from ${filePath}: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

function run() {
  const files = listJsonFiles(PL_DIR);
  if (files.length === 0) {
    console.log('[fix-polish-encoding] No PL JSON files found.');
    return;
  }

  let changedFiles = 0;
  let repairedStrings = 0;

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath);
    const beforeText = raw.toString('utf8');
    const beforeScore = scoreMojibake(beforeText);

    const { parsed, source } = parseJsonFromBytes(raw, filePath);
    const stats = { repairedStrings: 0 };
    const repaired = repairNode(parsed, stats);
    const afterText = `${JSON.stringify(repaired, null, 2)}\n`;
    const afterScore = scoreMojibake(afterText);

    if (afterScore > beforeScore) {
      throw new Error(`[fix-polish-encoding] Repair made mojibake worse in ${filePath}`);
    }

    if (afterText !== beforeText) {
      fs.writeFileSync(filePath, afterText, 'utf8');
      changedFiles += 1;
      repairedStrings += stats.repairedStrings;
      console.log(`[fix-polish-encoding] Updated ${path.relative(ROOT, filePath)} (source=${source}, repairedStrings=${stats.repairedStrings}, mojibake ${beforeScore} -> ${afterScore})`);
    } else {
      console.log(`[fix-polish-encoding] No changes in ${path.relative(ROOT, filePath)} (source=${source}, mojibake=${beforeScore})`);
    }
  }

  console.log(`[fix-polish-encoding] Done. changedFiles=${changedFiles}, repairedStrings=${repairedStrings}`);
}

run();
