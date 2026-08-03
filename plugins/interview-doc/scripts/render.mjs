#!/usr/bin/env node
// interview-doc renderer — report.json -> 단일 HTML
// usage: node render.mjs <report.json> [out.html]

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ASSETS = join(HERE, '..', 'assets');

/* ---------- inline markup ---------- */
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

// **강조** -> <b>, __강조__ -> <em> (주석 안의 핵심 판단)
const inline = (s) =>
  esc(s)
    .replace(/\*\*(.+?)\*\*/g, '<b>$1</b>')
    .replace(/__(.+?)__/g, '<em>$1</em>')
    .replace(/~~(.+?)~~/g, '<span class="dim">$1</span>')
    .replace(/\u00ab(.+?)\u00bb/g, '<span class="q">$1</span>');

const TONES = new Set(['primary', 'muted', 'alt']);

/* ---------- blocks ---------- */
function analysisBlock(a) {
  if (!a) return '';
  const parts = [];
  if (a.tag) parts.push(`    <div class="an-tag">${esc(a.tag)}</div>`);
  if (a.title) parts.push(`    <h3>${inline(a.title)}</h3>`);
  for (const b of a.blocks ?? []) {
    if (b.p) parts.push(`    <p>${inline(b.p)}</p>`);
    else if (b.list) {
      const tag = b.list.ordered ? 'ol' : 'ul';
      const li = b.list.items.map((i) => `      <li>${inline(i)}</li>`).join('\n');
      parts.push(`    <${tag}>\n${li}\n    </${tag}>`);
    } else if (b.verdict) parts.push(`    <div class="verdict">${inline(b.verdict)}</div>`);
    else if (b.raw) parts.push(`    ${b.raw}`);
  }
  const extra = a.className ? ` ${a.className}` : '';
  return `  <div class="an${extra}">\n${parts.join('\n')}\n  </div>`;
}

function turnBlock(t, speakerMap) {
  if (t.raw) return `  <div class="turn"><div>${t.raw}</div></div>`;
  const sp = speakerMap.get(t.who);
  if (!sp) throw new Error(`unknown speaker key: ${t.who}`);
  const tone = TONES.has(sp.tone) ? sp.tone : 'muted';
  const paras = (t.paras ?? []).map((p) => `      <p>${inline(p)}</p>`).join('\n');
  const note = t.note
    ? `    <div class="note">${inline(t.note)}</div>`
    : '';
  return [
    `  <div class="turn${t.bc ? ' bc' : ''}">`,
    `    <div class="say tone-${tone}"><div class="who tone-${tone}">${esc(sp.label)}</div><div>`,
    paras,
    `    </div></div>`,
    note,
    `  </div>`,
  ]
    .filter(Boolean)
    .join('\n');
}

function chapterBlock(c, speakerMap) {
  const out = [`<section class="ch" id="${esc(c.id)}">`, `  <div class="ch-head">`];
  if (c.num) out.push(`    <span class="ch-num">${esc(c.num)}</span>`);
  out.push(`    <h2>${inline(c.title)}</h2>`);
  if (c.lede) out.push(`    <p class="ch-lede">${inline(c.lede)}</p>`);
  if (c.flow)
    out.push(
      `    <div class="ch-flow"><span>${esc(c.flow.lead)}</span>${inline(c.flow.detail ?? '')}</div>`
    );
  out.push(`  </div>`, `  <div class="ch-rule"></div>`, ``);
  if (c.marker) out.push(`  <div class="marker solo"><span>${esc(c.marker)}</span></div>`, ``);
  for (const t of c.turns ?? []) out.push(turnBlock(t, speakerMap), ``);
  for (const a of [].concat(c.analysis ?? [])) out.push(analysisBlock(a), ``);
  out.push(`</section>`);
  return out.join('\n');
}

function tableBlock(tb) {
  if (!tb) return '';
  const head = tb.headers.map((h) => `<th>${esc(h)}</th>`).join('');
  const rows = tb.rows
    .map((r) => {
      const cells = r.cells
        .map((c, i) => {
          const isObj = typeof c === 'object' && c !== null;
          const text = isObj ? c.t : c;
          const own = [tb.cellClasses?.[i], isObj ? c.cls : null].filter(Boolean).join(' ');
          return `<td${own ? ` class="${own}"` : ''}>${inline(text)}</td>`;
        })
        .join('');
      const rank = r.rank ? `<td class="r">${esc(r.rank)}</td>` : '';
      return `      <tr>${rank}${cells}</tr>`;
    })
    .join('\n');
  const hasRank = tb.rows.some((r) => r.rank);
  return [
    `  <table>`,
    `    <thead>`,
    `      <tr>${hasRank ? '<th></th>' : ''}${head}</tr>`,
    `    </thead>`,
    `    <tbody>`,
    rows,
    `    </tbody>`,
    `  </table>`,
  ].join('\n');
}

function closingBlock(cl, speakerMap) {
  if (!cl) return '';
  const out = [`<section class="ch close" id="${esc(cl.id ?? 'end')}">`];
  out.push(`  <h2>${inline(cl.title ?? '결론')}</h2>`);
  for (const t of cl.turns ?? []) out.push(turnBlock(t, speakerMap));
  for (const a of [].concat(cl.analysis ?? [])) out.push(analysisBlock(a));
  if (cl.table) out.push(tableBlock(cl.table));
  if (cl.followups) {
    const items = cl.followups.items.map((i) => `      <li>${inline(i)}</li>`).join('\n');
    out.push(
      `  <div class="todo">`,
      `    <h3>${esc(cl.followups.heading ?? 'Follow-up')}</h3>`,
      `    <ul>`,
      items,
      `    </ul>`,
      `  </div>`
    );
  }
  if (cl.footnote) out.push(`  <footer>${inline(cl.footnote)}</footer>`);
  out.push(`</section>`);
  return out.join('\n');
}

function stripBlock(strip) {
  if (!strip || strip.type === 'none') return '';
  if (strip.type === 'timeline') {
    const nodes = strip.items
      .map(
        (i) => `      <div class="tl-node${i.hot ? ' hot' : ''}">
        <div class="tl-when">${esc(i.when)}</div>
        <div class="tl-what">${inline(i.what)}</div>
      </div>`
      )
      .join('\n');
    return `  <div class="tl">
    <div class="tl-h">${esc(strip.heading ?? '')}</div>
    <div class="tl-track">
${nodes}
    </div>
  </div>`;
  }
  if (strip.type === 'raw') return `  ${strip.html}`;
  throw new Error(`unknown strip type: ${strip.type}`);
}

/* ---------- main ---------- */
function render(report) {
  const m = report.meta ?? {};
  const speakerMap = new Map((report.speakers ?? []).map((s) => [s.key, s]));

  const facts = (m.facts ?? [])
    .map((f) => `    <span><b>${esc(f.label)}</b> ${inline(f.value)}</span>`)
    .join('\n');

  const mast = [
    m.kicker ? `  <div class="kicker">${esc(m.kicker)}</div>` : '',
    `  <h1>${inline(m.title)}</h1>`,
    m.subtitle ? `  <p class="sub">${inline(m.subtitle)}</p>` : '',
    facts ? `  <div class="meta">\n${facts}\n  </div>` : '',
    m.lede ? `  <p class="lede">${inline(m.lede)}</p>` : '',
    stripBlock(report.strip),
  ]
    .filter(Boolean)
    .join('\n\n');

  const navItems = [
    ...(report.chapters ?? []).map((c) => ({
      id: c.id,
      n: c.navNum ?? c.num ?? '',
      label: c.navLabel ?? c.title,
    })),
    ...(report.closing ? [{ id: report.closing.id ?? 'end', n: '—', label: report.closing.navLabel ?? '결론' }] : []),
  ];
  const nav = navItems
    .map(
      (i) =>
        `  <a href="#${esc(i.id)}"><span class="n">${esc(i.n)}</span><span>${esc(i.label)}</span></a>`
    )
    .join('\n');

  const body = [
    ...(report.chapters ?? []).map((c) => chapterBlock(c, speakerMap)),
    closingBlock(report.closing, speakerMap),
  ]
    .filter(Boolean)
    .join('\n\n');

  const css = readFileSync(join(ASSETS, 'style.css'), 'utf-8').trim();
  const js = readFileSync(join(ASSETS, 'app.js'), 'utf-8').trim();
  let html = readFileSync(join(ASSETS, 'layout.html'), 'utf-8');

  const slots = {
    LANG: m.lang ?? 'ko',
    TITLE: esc(m.docTitle ?? m.title),
    CSS: css,
    JS: js,
    MAST: mast,
    NAV: nav,
    NAV_HEAD: esc(m.navHead ?? 'Contents'),
    BC_LABEL: esc(m.bcLabel ?? '맞장구·간투사 숨기기'),
    BODY: body,
  };
  for (const [k, v] of Object.entries(slots)) html = html.replaceAll(`{{${k}}}`, v);
  return html;
}

/* ---------- cli ---------- */
const [, , inPath, outPath] = process.argv;
if (!inPath) {
  console.error('usage: node render.mjs <report.json> [out.html]');
  process.exit(1);
}
const report = JSON.parse(readFileSync(resolve(inPath), 'utf-8'));
const html = render(report);
const out = outPath ? resolve(outPath) : resolve(inPath).replace(/\.json$/, '.html');
writeFileSync(out, html, 'utf-8');
console.log(`✓ ${out}  (${html.length.toLocaleString()} bytes, ${report.chapters?.length ?? 0} chapters)`);
