/*
 * Builds the two Pillar 3 (Speed to Decision™) demos for the results page
 * from the redesigned CRPV features component, CRPVFeaturesSection.tsx
 * (C-RPV Feature Section folder). Yemi, Oct 1: demo 1 = the Conversion Quiz™
 * tab, demo 2 = the Diagnostic Workshop + Skepticism Sequence tabs.
 *
 * The tabs go in exactly as designed: markup, CSS and scripts are sliced out
 * of the component untouched. The only edits are mechanical:
 *   - each demo keeps only its own panel(s), scripts and tab buttons
 *   - the Workshop tab's two inline base64 images (~245 KB) become files in
 *     public/assets, so they don't sit inside the JS chunk
 *
 * Usage:
 *   node scripts/build-crpv-embed.cjs ["path/to/CRPVFeaturesSection.tsx"]
 * Defaults to ../C-RPV Feature Section/CRPVFeaturesSection.tsx next to this
 * repo. Regenerate (never hand-edit) src/results/crpv/{crpv.css,
 * runCrpvScripts.js, demoQuiz.js, demoWorkSkep.js}.
 */
const fs = require('fs');
const path = require('path');

const repo = path.join(__dirname, '..');
const src =
  process.argv[2] ||
  path.join(repo, '..', 'C-RPV Feature Section', 'CRPVFeaturesSection.tsx');
const outDir = path.join(repo, 'src', 'results', 'crpv');
const assetDir = path.join(repo, 'public', 'assets');

const text = fs.readFileSync(src, 'utf8').replace(/\r\n/g, '\n');
const lines = text.split('\n');

function fail(msg) {
  console.error('build-crpv-embed: ' + msg);
  process.exit(1);
}
function must(cond, msg) {
  if (!cond) fail(msg);
}

/* ---- the component's CSS and HTML string constants ---- */
function constString(name) {
  const prefix = 'const ' + name + ': string = ';
  const line = lines.find((l) => l.startsWith(prefix));
  must(line, 'constant ' + name + ' not found');
  return JSON.parse(line.slice(prefix.length).replace(/;\s*$/, ''));
}
const HTML = constString('HTML');

/* The component's CSS. build.py's scoper mis-scopes an @media block that
   follows a comment, emitting ".crpv-scope @media(...){ .map{...} }" — an
   invalid rule browsers drop, so the quiz map's ≤900px reflow (2 columns
   instead of sideways scrolling, per the brand skin) was lost. Repair it by
   scoping the block's selectors the way every other @media block is. */
function repairScopedMedia(css) {
  const BAD = '.crpv-scope @media';
  let out = css;
  let at;
  while ((at = out.indexOf(BAD)) >= 0) {
    const open = out.indexOf('{', at);
    let depth = 1;
    let i = open + 1;
    for (; i < out.length && depth > 0; i++) {
      if (out[i] === '{') depth++;
      else if (out[i] === '}') depth--;
    }
    const query = out.slice(at + '.crpv-scope '.length, open);
    const inner = out.slice(open + 1, i - 1).replace(/([^{}]+)\{([^{}]*)\}/g, (m, sel, decl) => {
      const scoped = sel
        .split(',')
        .map((s) => '.crpv-scope ' + s.trim())
        .join(',');
      return '\n' + scoped + '{' + decl + '}';
    });
    out = out.slice(0, at) + query + '{' + inner + '\n}' + out.slice(i);
  }
  return out;
}
/* The demos were designed against Google Fonts' Montserrat 400–900 + 500
   italic and Roboto Mono 500/600. Giving them private family names (served
   by src/results/crpv/crpvFonts.css with exactly those faces) keeps their
   rendering identical without adding faces to the page's own Montserrat /
   Roboto Mono families — a Roboto Mono 600 face there would change every
   700-weight mono chip on the results page. */
function privateFonts(s) {
  return s
    .replace(/(?<!CRPV )\bMontserrat\b/g, 'CRPV Montserrat')
    .replace(/(?<!CRPV )\bRoboto Mono\b/g, 'CRPV Roboto Mono');
}

const CSS = privateFonts(repairScopedMedia(constString('CSS')));
must(!CSS.includes('.crpv-scope @'), 'unrepaired at-rule left in CSS');

/* ---- the five scripts, each a function(document, window, ...) ---- */
const FN_HEAD = 'function (document, window, setInterval, setTimeout, ResizeObserver) {';
const starts = lines.map((l, i) => (l === FN_HEAD ? i : -1)).filter((i) => i >= 0);
must(starts.length === 5, 'expected 5 scripts, found ' + starts.length);
const arrayEnd = lines.indexOf(']', starts[4]);
must(arrayEnd > 0, 'end of SCRIPTS array not found');
const scripts = starts.map((s, k) => {
  const end = k < 4 ? starts[k + 1] - 1 : arrayEnd - 1; // the "}," / "}" line
  const body = lines.slice(s, end + 1).join('\n').replace(/\},\s*$/, '}');
  must(body.trimEnd().endsWith('}'), 'script ' + (k + 1) + ' is not closed');
  return body;
});
const [S1, S2, S3, S4] = scripts;
must(S2.includes('CONVERSION QUIZ TAB'), 'script 2 is not the Conversion Quiz tab');
must(S3.includes('DIAGNOSTIC WORKSHOP TAB'), 'script 3 is not the Diagnostic Workshop tab');
must(S4.includes('SKEPTICISM SEQUENCE TAB'), 'script 4 is not the Skepticism Sequence tab');

/* ---- the per-instance script runner, verbatim ---- */
const shimStart = lines.indexOf('function __runCrpvScripts(host, scripts) {');
must(shimStart > 0, 'runner not found');
const shimEnd = lines.indexOf('}', shimStart);
const shim = lines.slice(shimStart, shimEnd + 1).join('\n');

/* ---- demo 2's tab bar wiring: script 1's tablist() helper and the
   feature-tab block, verbatim, without the Contrarian POV code ---- */
function slice(hay, from, to, label) {
  const a = hay.indexOf(from);
  must(a >= 0, label + ': start not found');
  const b = hay.indexOf(to, a);
  must(b >= 0, label + ': end not found');
  return hay.slice(a, b + to.length);
}
const tablistFn = slice(S1, '  function tablist(buttons,onSelect){', '\n  }\n', 'tablist()');
const tabWiring = slice(
  S1,
  "  const tabs=[...document.querySelectorAll('.tab')];",
  '  }));',
  'feature tabs'
);
const S1tabs =
  FN_HEAD +
  '\n\n/* ================= FEATURE TABS (from script 1) ================= */\n(function(){\n' +
  tablistFn +
  '\n' +
  tabWiring +
  '\n})();\n\n}';

/* ---- Workshop images: inline base64 -> files ---- */
let S3out = S3;
for (const [name, file] of [
  ['WHEEL', 'crpv-wheel.webp'],
  ['THUMB', 'crpv-workshop-thumb.webp'],
]) {
  const re = new RegExp("const " + name + "='data:image/webp;base64,([^']+)';");
  const m = S3out.match(re);
  must(m, name + ' data URI not found');
  fs.writeFileSync(path.join(assetDir, file), Buffer.from(m[1], 'base64'));
  S3out = S3out.replace(re, "const " + name + "='/assets/" + file + "';");
}

/* ---- markup ---- */
const SECTION_OPEN = '<section class="crpv" aria-label="What\'s inside the CRPV OS">';
must(HTML.startsWith(SECTION_OPEN), 'section opening tag changed');
const panelAt = (id) => {
  const i = HTML.indexOf('<div class="panel" role="tabpanel" id="' + id + '"');
  must(i > 0, 'panel ' + id + ' not found');
  return HTML.lastIndexOf('\n', i) + 1; // keep the line's indentation
};
const quizPanel = HTML.slice(panelAt('p-quiz'), panelAt('p-work'));
const workPanel = HTML.slice(panelAt('p-work'), panelAt('p-skep'));
const skepPanel = HTML.slice(panelAt('p-skep'), panelAt('p-loop'));

const tabButton = (id) => {
  const m = HTML.match(new RegExp('\\n\\s*<button class="tab" role="tab" id="' + id + '"[^\\n]*'));
  must(m, 'tab button ' + id + ' not found');
  return m[0];
};
const tabsOpen = HTML.match(/\n\s*<div class="tabs" role="tablist"[^>]*>/);
must(tabsOpen, 'tab bar not found');

function swap(str, from, to, label) {
  must(str.includes(from), label + ': "' + from + '" not found');
  return str.replace(from, to);
}

// demo 1: the Conversion Quiz™ panel on its own — no tab bar, shown
const quizHTML =
  '<section class="crpv" aria-label="Conversion Quiz™">\n\n' +
  swap(quizPanel, ' aria-labelledby="t-quiz" hidden>', ' aria-label="Conversion Quiz™">', 'quiz panel') +
  '</section>\n';

// demo 2: a two-button tab bar, Workshop selected first
const workTab = swap(
  swap(tabButton('t-work'), 'aria-selected="false"', 'aria-selected="true"', 't-work'),
  ' tabindex="-1"',
  '',
  't-work'
);
const workSkepHTML =
  '<section class="crpv" aria-label="Diagnostic Workshop and Skepticism Sequence">\n' +
  tabsOpen[0] +
  workTab +
  tabButton('t-skep') +
  '\n  </div>\n\n' +
  swap(workPanel, ' aria-labelledby="t-work" hidden>', ' aria-labelledby="t-work">', 'work panel') +
  skepPanel +
  '</section>\n';

/* ---- write ---- */
const HEADER =
  '// GENERATED by scripts/build-crpv-embed.cjs from CRPVFeaturesSection.tsx.\n' +
  '// Do not edit by hand — change the component and regenerate.\n';

function writeDemo(file, html, fns) {
  const body =
    HEADER +
    '/* eslint-disable */\n\n' +
    'export const HTML = ' +
    JSON.stringify(html) +
    ';\n\n' +
    'export const SCRIPTS = [\n' +
    fns.join(',\n') +
    '\n];\n';
  fs.writeFileSync(path.join(outDir, file), body);
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, 'crpv.css'),
  '/* GENERATED by scripts/build-crpv-embed.cjs from CRPVFeaturesSection.tsx —\n' +
    '   the component\'s own .crpv-scope CSS, verbatim. Do not edit by hand. */\n' +
    CSS +
    '\n'
);
fs.writeFileSync(
  path.join(outDir, 'runCrpvScripts.js'),
  HEADER + '/* eslint-disable */\n\nexport default ' + shim + '\n'
);
writeDemo('demoQuiz.js', privateFonts(quizHTML), [S2].map(privateFonts));
writeDemo('demoWorkSkep.js', privateFonts(workSkepHTML), [S1tabs, S3out, S4].map(privateFonts));

console.log('crpv embed built from ' + src);
for (const f of ['crpv.css', 'runCrpvScripts.js', 'demoQuiz.js', 'demoWorkSkep.js']) {
  console.log('  src/results/crpv/' + f + '  ' + fs.statSync(path.join(outDir, f)).size + ' bytes');
}
for (const f of ['crpv-wheel.webp', 'crpv-workshop-thumb.webp']) {
  console.log('  public/assets/' + f + '  ' + fs.statSync(path.join(assetDir, f)).size + ' bytes');
}
