// Build step: goldens/*.golden -> src/generated/goldens/<Name>.html, goldens/keys.go -> src/generated/keys.md
import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const FG = '#cdd6f4', BG = '#1e1e2e'; // Catppuccin Mocha defaults used by the 30/37/40/7 codes
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function applySGR(params, st) {
  const p = params === '' ? [0] : params.split(';').map(Number);
  for (let i = 0; i < p.length; i++) {
    const c = p[i];
    if (c === 0) { st.fg = st.bg = null; st.bold = false; }
    else if (c === 1) st.bold = true;
    else if (c === 7) { const f = st.fg ?? FG; st.fg = st.bg ?? BG; st.bg = f; }
    else if (c === 30) st.fg = BG;
    else if (c === 37) st.fg = FG;
    else if (c === 40) st.bg = BG;
    else if ((c === 38 || c === 48) && p[i + 1] === 2) {
      const rgb = `rgb(${p[i + 2]},${p[i + 3]},${p[i + 4]})`;
      if (c === 38) st.fg = rgb; else st.bg = rgb;
      i += 4;
    } else throw new Error(`unhandled SGR code ${c} in "${params}"`);
  }
}

function style(st) {
  const s = [];
  if (st.fg) s.push(`color:${st.fg}`);
  if (st.bg) s.push(`background:${st.bg}`);
  if (st.bold) s.push('font-weight:700');
  return s.join(';');
}

export function convert(text) {
  const st = { fg: null, bg: null, bold: false };
  let out = '', open = false;
  for (const part of text.split(/(\x1b\[[0-9;]*m)/)) {
    const m = /^\x1b\[([0-9;]*)m$/.exec(part);
    if (m) { if (open) { out += '</span>'; open = false; } applySGR(m[1], st); continue; }
    if (!part) continue;
    const s = style(st);
    if (s) { out += `<span style="${s}">`; open = true; }
    out += esc(part);
    if (open) { out += '</span>'; open = false; }
  }
  return out;
}

// Field -> [group, description]; null = intentionally undocumented. Unknown field = drift, throws.
const GROUPS = ['Move', 'Panes and layout', 'Staging', 'Commit editor', 'Branches', 'Views', 'Global'];
const DESC = {
  Up: ['Move', 'Move the cursor up'],
  Down: ['Move', 'Move the cursor down'],
  Top: ['Move', 'Jump to the first row'],
  Bottom: ['Move', 'Jump to the last row'],
  PageUp: ['Move', 'Scroll up half a page'],
  PageDown: ['Move', 'Scroll down half a page'],
  Left: ['Panes and layout', 'Move the splitter left'],
  Right: ['Panes and layout', 'Move the splitter right'],
  NextPane: ['Panes and layout', 'Focus the next pane'],
  PrevPane: ['Panes and layout', 'Focus the previous pane'],
  Stage: ['Staging', 'Stage or unstage what is under the cursor: the file in the list, the line in the diff, or the hunk when on a @@ header'],
  StageHunk: ['Staging', 'Stage or unstage the hunk under the cursor from anywhere inside it'],
  ToggleStaged: ['Staging', 'Toggle the diff between the worktree and staged side'],
  Commit: ['Commit editor', 'Open the commit message editor'],
  Amend: ['Commit editor', "Open the editor pre-filled with HEAD's message, to amend"],
  Confirm: ['Commit editor', 'Commit (in editor)'],
  Cancel: ['Commit editor', 'Cancel and drop the message (in editor)'],
  Branch: ['Branches', 'Check out the branch under the cursor (branch view only)'],
  StatusView: ['Views', 'Show the working tree view'],
  LogView: ['Views', 'Show the log view'],
  BranchView: ['Views', 'Show the branch view'],
  Help: null,
  Quit: ['Global', 'Quit'],
};

export function keysMarkdown(go) {
  const body = go.slice(go.indexOf('func Default()')).match(/\{([\s\S]*?)\n\}/)[1];
  const rows = Object.fromEntries(GROUPS.map((g) => [g, []]));
  for (const [, field, list] of body.matchAll(/^\s*(\w+):\s*\[\]string\{([^}]*)\}/gm)) {
    const d = DESC[field];
    if (d === undefined) throw new Error(`keys.go field "${field}" has no entry in DESC (scripts/goldens.mjs)`);
    if (d === null) continue;
    const keys = [...list.matchAll(/"([^"]*)"/g)].map(([, k]) => `<kbd>${esc(k)}</kbd>`).join(' / ');
    rows[d[0]].push(`| ${keys} | ${esc(d[1])} |`);
  }
  return GROUPS.map((g) => `## ${g}\n\n| Key | Action |\n| --- | --- |\n${rows[g].join('\n')}\n`).join('\n');
}

if (process.argv[1] === new URL(import.meta.url).pathname) {
  assert.equal(convert('\x1b[1;38;2;1;2;3mx\x1b[m'), '<span style="color:rgb(1,2,3);font-weight:700">x</span>');
  const src = process.env.GOLDENS_DIR ?? 'goldens';
  mkdirSync('src/generated/goldens', { recursive: true });
  const names = readdirSync(src).filter((f) => f.endsWith('.golden'));
  for (const f of names) {
    const html = convert(readFileSync(`${src}/${f}`, 'utf8').replace(/\n$/, ''));
    assert.equal(html.split('\n').length, 24, `${f}: expected 24 rows`);
    writeFileSync(`src/generated/goldens/${f.replace(/\.golden$/, '.html')}`, html);
  }
  writeFileSync('src/generated/keys.md', keysMarkdown(readFileSync(`${src}/keys.go`, 'utf8')));
  console.log(`goldens: wrote ${names.length} html fragments + keys.md to src/generated/`);
}
