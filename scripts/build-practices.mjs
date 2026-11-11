#!/usr/bin/env node
// Generates spec/practices.json from the requirement tables in spec/spec.md.
//
//   node scripts/build-practices.mjs           write spec/practices.json
//   node scripts/build-practices.mjs --check   fail if it is missing or stale
//
// spec.md is the source of truth. The JSON is the machine-readable copy
// that agentready.org and other tooling read, so it is never edited by hand.
// No dependencies: runs on any Node 18+.

import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SPEC = join(root, "spec", "spec.md");
const OUT = join(root, "spec", "practices.json");

const LEVELS = ["MUST", "SHOULD", "MAY"];
const ID_RE = /^AR-(FIND|READ|ACT)-\d{2}$/;
const COLUMN_KEYS = { Evidence: "evidence", "Best practice": "bestPractice" };

const errors = [];
const fail = (line, msg) => errors.push(`spec/spec.md:${line}: ${msg}`);

/** Split a markdown table row on `|`, ignoring pipes inside backticks or escaped as `\|`. */
function cells(row) {
  const out = [];
  let cur = "";
  let inCode = false;
  for (let i = 0; i < row.length; i++) {
    const ch = row[i];
    if (ch === "\\" && row[i + 1] === "|") {
      cur += "|";
      i++;
    } else if (ch === "`") {
      inCode = !inCode;
      cur += ch;
    } else if (ch === "|" && !inCode) {
      out.push(cur.trim());
      cur = "";
    } else {
      cur += ch;
    }
  }
  out.push(cur.trim());
  return out.slice(1, -1); // drop the empty edges outside the outer pipes
}

export function parse(md) {
  const lines = md.split("\n");
  let version;
  let date;
  const stages = [];
  const requirements = [];
  const retired = [];

  let stage = null; // current "## N. Stage — Title (`AR-CAT-*`)" section
  let columns = null; // header cells of the current requirement table

  lines.forEach((line, i) => {
    const n = i + 1;

    const status = line.match(/^> \*\*Status:\*\* v(\d+\.\d+(?:\.\d+)?) — (.+)$/);
    if (status) [, version, date] = status;

    const section = line.match(/^## \d+\. (\w+) — (.+) \(`AR-([A-Z]+)-\*`\)$/);
    if (section) {
      const [, name, title, category] = section;
      stage = { category, name, title };
      stages.push(stage);
      columns = null;
      return;
    }
    if (/^## /.test(line)) {
      stage = null;
      columns = null;
    }

    for (const [, id] of line.matchAll(/`(AR-[A-Z]+-\d{2})` is retired/g)) retired.push(id);

    if (!stage || !line.startsWith("|")) {
      if (!line.startsWith("|")) columns = null;
      return;
    }

    const row = cells(line);
    if (row[0] === "ID") {
      columns = row;
      const extra = columns[3];
      if (columns[1] !== "Requirement" || columns[2] !== "Level" || !COLUMN_KEYS[extra]) {
        fail(n, `unexpected table header: ${line}`);
      }
      return;
    }
    if (!columns || /^-+$/.test(row[0].replace(/[:\s]/g, ""))) return;

    if (row.length !== 4) return fail(n, `expected 4 cells, found ${row.length}`);
    const [idCell, requirement, levelCell, note] = row;
    const id = idCell.replace(/^`|`$/g, "");
    const level = levelCell.replace(/^\*\*|\*\*$/g, "");

    if (!ID_RE.test(id)) fail(n, `malformed identifier ${idCell}`);
    else if (!id.startsWith(`AR-${stage.category}-`)) {
      fail(n, `${id} sits in the AR-${stage.category}-* section`);
    }
    if (!LEVELS.includes(level)) fail(n, `${id}: level must be MUST, SHOULD, or MAY, not ${levelCell}`);
    else if (!new RegExp(`\\*\\*${level}( NOT)?\\*\\*`).test(requirement)) {
      fail(n, `${id}: requirement text does not use **${level}** (or **${level} NOT**)`);
    }

    const entry = { id, category: stage.category, level, requirement };
    const key = COLUMN_KEYS[columns[3]];
    if (key && note && note !== "—") entry[key] = note;
    entry.line = n;
    requirements.push(entry);
  });

  if (!version) errors.push("spec/spec.md: no `> **Status:** vX.Y — Month YYYY` line");

  const seen = new Map();
  for (const r of requirements) {
    if (seen.has(r.id)) fail(r.line, `${r.id} is also defined on line ${seen.get(r.id)}`);
    seen.set(r.id, r.line);
    if (retired.includes(r.id)) fail(r.line, `${r.id} is listed as retired; retired identifiers are never reused`);
  }

  return {
    $comment:
      "Generated from spec/spec.md by scripts/build-practices.mjs. Do not edit by hand: change spec.md and run `node scripts/build-practices.mjs`.",
    version,
    date,
    stages,
    requirements: requirements.map(({ line, ...r }) => r),
    retired: [...new Set(retired)].sort(),
  };
}

const json = JSON.stringify(parse(readFileSync(SPEC, "utf8")), null, 2) + "\n";

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

if (process.argv.includes("--check")) {
  if (!existsSync(OUT) || readFileSync(OUT, "utf8") !== json) {
    console.error(
      "spec/practices.json is out of date with spec/spec.md.\nRun `node scripts/build-practices.mjs` and commit the result.",
    );
    process.exit(1);
  }
  console.log("spec/practices.json is up to date.");
} else {
  writeFileSync(OUT, json);
  console.log(`Wrote spec/practices.json (${JSON.parse(json).requirements.length} requirements).`);
}
