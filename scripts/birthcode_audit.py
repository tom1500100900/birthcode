from pathlib import Path
import re
import json
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "audit"
OUT_DIR.mkdir(exist_ok=True)

TEXT_EXT = {".ts", ".tsx", ".js", ".jsx", ".json", ".md"}

LONG_STRING_RE = re.compile(r"(['\"`])(.{60,}?)\1", re.DOTALL)
POLISH_CHARS_RE = re.compile(r"[ąćęłńóśżźĄĆĘŁŃÓŚŻŹ]")
EN_HINT_RE = re.compile(r"\b(the|and|your|you|with|for|this|that|recommendations|strengths|risks)\b", re.I)

KEYWORDS = [
    "locales", "i18n", "translations", "expo-router", "react-navigation",
    "copy", "Clipboard", "accordion", "expand", "collapse",
    "birth", "ascendant", "sun", "moon", "insight", "profile",
]

def is_text_file(p: Path) -> bool:
    return p.suffix in TEXT_EXT and "node_modules" not in str(p)

def read_text(p: Path) -> str:
    try:
        return p.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""

def rel(p: Path) -> str:
    return str(p.relative_to(ROOT))

def list_routes(app_dir: Path):
    routes = []
    if not app_dir.exists():
        return routes
    for p in app_dir.rglob("*"):
        if p.is_file() and p.suffix in {".ts", ".tsx"}:
            r = rel(p)
            if r.endswith("_layout.tsx") or r.endswith("_layout.ts"):
                kind = "layout"
            elif r.endswith("index.tsx") or r.endswith("index.ts"):
                kind = "index"
            else:
                kind = "screen"
            routes.append((r, kind))
    routes.sort()
    return routes

def scan_files():
    results = []
    for p in ROOT.rglob("*"):
        if not p.is_file() or not is_text_file(p):
            continue
        txt = read_text(p)
        if not txt.strip():
            continue

        long_strings = LONG_STRING_RE.findall(txt)
        long_count = len(long_strings)

        has_pl = bool(POLISH_CHARS_RE.search(txt))
        has_en_hint = bool(EN_HINT_RE.search(txt))
        mixed_lang_hint = has_pl and has_en_hint

        kw_hits = {k: len(re.findall(re.escape(k), txt, re.I)) for k in KEYWORDS}
        kw_total = sum(kw_hits.values())

        results.append({
            "path": rel(p),
            "long_strings": long_count,
            "mixed_lang_hint": mixed_lang_hint,
            "has_polish_chars": has_pl,
            "has_en_hint": has_en_hint,
            "keyword_total": kw_total,
            "keyword_hits": {k:v for k,v in kw_hits.items() if v},
        })
    return results

def top_by(results, key, n=20):
    return sorted(results, key=lambda x: x.get(key, 0), reverse=True)[:n]

def md_table(rows, cols):
    out = []
    out.append("| " + " | ".join(cols) + " |")
    out.append("| " + " | ".join(["---"] * len(cols)) + " |")
    for r in rows:
        out.append("| " + " | ".join(str(r.get(c, "")) for c in cols) + " |")
    return "\n".join(out)

def main():
    app_dir = ROOT / "app"
    routes = list_routes(app_dir)
    scan = scan_files()

    top_long = top_by(scan, "long_strings", 25)
    top_kw = top_by(scan, "keyword_total", 25)
    mixed = [x for x in scan if x["mixed_lang_hint"]]

    locales_dir = (ROOT / "locales").exists()
    has_i18n = any("i18n" in x["path"].lower() for x in scan) or locales_dir

    report = []
    report.append(f"# Birthcode Audit Report\n")
    report.append(f"- Generated: {datetime.now().isoformat(timespec='seconds')}\n")
    report.append(f"- Repo root: `{ROOT}`\n")

    report.append("## Quick signals\n")
    report.append(f"- `app/` exists: **{app_dir.exists()}**\n")
    report.append(f"- `locales/` exists: **{locales_dir}**\n")
    report.append(f"- i18n hints found: **{has_i18n}**\n")
    report.append(f"- Files scanned: **{len(scan)}**\n")
    report.append(f"- Mixed language heuristic hits: **{len(mixed)}**\n")

    report.append("## Route map (from `app/`)\n")
    if routes:
        for r, kind in routes[:200]:
            report.append(f"- `{r}` ({kind})")
        if len(routes) > 200:
            report.append(f"\n… plus {len(routes)-200} more\n")
    else:
        report.append("_No routes found (or `app/` missing)._")

    report.append("\n## Top files by long strings (likely hardcoded content)\n")
    report.append(md_table(
        [{"path": x["path"], "long_strings": x["long_strings"], "mixed_lang_hint": x["mixed_lang_hint"]} for x in top_long],
        ["path", "long_strings", "mixed_lang_hint"]
    ))

    report.append("\n## Top files by keyword density (likely logic / content hotspots)\n")
    report.append(md_table(
        [{"path": x["path"], "keyword_total": x["keyword_total"], "hits": json.dumps(x["keyword_hits"], ensure_ascii=False)} for x in top_kw],
        ["path", "keyword_total", "hits"]
    ))

    report.append("\n## Mixed-language heuristic candidates\n")
    if mixed:
        report.append(md_table(
            [{"path": x["path"], "long_strings": x["long_strings"]} for x in mixed[:40]],
            ["path", "long_strings"]
        ))
        if len(mixed) > 40:
            report.append(f"\n… plus {len(mixed)-40} more\n")
    else:
        report.append("_None detected by heuristic._")

    out_path = OUT_DIR / "BIRTHCODE_AUDIT.md"
    out_path.write_text("\n".join(report), encoding="utf-8")

    print(f"✅ Wrote {out_path}")

if __name__ == "__main__":
    main()

