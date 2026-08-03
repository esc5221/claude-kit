#!/usr/bin/env node
// interview-doc 검수기 — 구조 오류(ERROR)와 품질 신호(WARN)를 분리해 보고한다.
// usage: node check.mjs <report.json>

import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const errors = [];
const warns = [];
const E = (m) => errors.push(m);
const W = (m) => warns.push(m);

const [, , inPath] = process.argv;
if (!inPath) {
  console.error('usage: node check.mjs <report.json>');
  process.exit(1);
}
const r = JSON.parse(readFileSync(resolve(inPath), 'utf-8'));

/* ---------- 구조 ---------- */
if (!r.meta?.title) E('meta.title 없음');
if (!r.meta?.lede) W('meta.lede 없음 — 결론을 첫 화면에서 주지 못한다');
if (!Array.isArray(r.speakers) || !r.speakers.length) E('speakers 없음');

const keys = new Set((r.speakers ?? []).map((s) => s.key));
const primaries = (r.speakers ?? []).filter((s) => s.tone === 'primary');
if (primaries.length === 0) W('tone:primary 화자가 없다 — 누가 주인공인지 드러나지 않는다');
if (primaries.length > 1) W(`tone:primary 화자가 ${primaries.length}명 — 1명만 두는 편이 읽기 쉽다`);

const chapters = r.chapters ?? [];
if (chapters.length < 3) E(`챕터 ${chapters.length}개 — 최소 3개`);
if (chapters.length > 12) W(`챕터 ${chapters.length}개 — 너무 잘게 쪼갰을 가능성`);

const ids = new Set();
let turns = 0;
let subs = 0;
let notes = 0;
let withAnalysis = 0;
let noFlow = [];
let noLede = [];

for (const c of chapters) {
  if (!c.id) E('id 없는 챕터');
  if (ids.has(c.id)) E(`중복 id: ${c.id}`);
  ids.add(c.id);
  if (!c.flow) noFlow.push(c.id);
  if (!c.lede) noLede.push(c.id);
  if (c.analysis) withAnalysis++;

  const t = c.turns ?? [];
  if (!t.length) E(`${c.id}: turns 비어 있음`);
  for (const x of t) {
    if (x.raw) continue;
    turns++;
    if (!x.bc) subs++;
    if (!keys.has(x.who)) E(`${c.id}: 정의되지 않은 화자 키 "${x.who}"`);
    if (!x.paras?.length) E(`${c.id}: 빈 발화`);
    if (x.note) {
      notes++;
      if (x.note.length < 40) W(`${c.id}: 주석이 너무 짧다 — 요약에 그쳤을 가능성 ("${x.note.slice(0, 24)}…")`);
    }
    if (x.bc && x.note) W(`${c.id}: 맞장구에 주석이 달렸다 — 중요도 신호가 흐려진다`);
  }
}

if (noFlow.length) W(`flow 없는 챕터: ${noFlow.join(', ')} — 대화의 흐름이 드러나지 않는다`);
if (noLede.length) W(`lede 없는 챕터: ${noLede.join(', ')}`);

/* ---------- 밀도 ---------- */
const noteRatio = subs ? notes / subs : 0;   // 맞장구 제외 실질 발화 기준
const anRatio = chapters.length ? withAnalysis / chapters.length : 0;

if (noteRatio > 0.95) W(`주석 밀도 ${(noteRatio * 100) | 0}% — 실질 발화 전부에 달렸다. 기계적 주석이 아닌지 확인`);
if (noteRatio < 0.4) W(`주석 밀도 ${(noteRatio * 100) | 0}% — 해설이 부족하다`);
if (anRatio > 0.6) W(`심층분석 챕터 비율 ${(anRatio * 100) | 0}% — 모든 챕터에 분석을 달면 무게중심이 사라진다`);
if (withAnalysis === 0) W('심층분석 블록이 하나도 없다 — 주석만으로는 종합 판단이 안 남는다');

/* ---------- 마무리 ---------- */
const cl = r.closing;
if (!cl) W('closing 없음 — 결론 없이 끝난다');
else {
  if (!cl.analysis) W('closing.analysis 없음 — 최종 판단이 없다');
  if (!cl.table) W('closing.table 없음 — 대조 축이 제시되지 않는다');
  if (!cl.followups?.items?.length) W('closing.followups 없음 — 다음 행동이 남지 않는다');
  if (!cl.footnote) W('closing.footnote 없음 — 전사를 어떻게 손댔는지 고지되지 않는다');
}

/* ---------- 일반론 탐지 ---------- */
const GENERIC = ['사용자 경험을 개선', '중요한 인사이트', '시사하는 바가 크다', '전반적으로 긍정적', '개선이 필요하다', '고려해볼 필요가 있다'];
const scanText = JSON.stringify(r);
for (const g of GENERIC) if (scanText.includes(g)) W(`일반론 문구 감지: "${g}" — 이 인터뷰가 아니어도 성립하는 문장인지 확인`);

/* ---------- 출력 ---------- */
console.log(`\n  챕터 ${chapters.length} · 발화 ${turns} (실질 ${subs}) · 주석 ${notes} (실질 대비 ${(noteRatio * 100) | 0}%) · 분석 ${withAnalysis}/${chapters.length}장\n`);
for (const e of errors) console.log(`  ERROR  ${e}`);
for (const w of warns) console.log(`  WARN   ${w}`);
if (!errors.length && !warns.length) console.log('  통과 — 구조·밀도 모두 정상');
console.log('');
process.exit(errors.length ? 1 : 0);
