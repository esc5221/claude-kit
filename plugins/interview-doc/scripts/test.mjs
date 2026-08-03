#!/usr/bin/env node
// 회귀 테스트 — 픽스처를 다시 렌더해 golden과 비교한다.
// 렌더러/CSS/레이아웃을 고칠 때마다 실행. 의도한 변경이면 golden을 갱신한다.
//   node scripts/test.mjs           비교
//   node scripts/test.mjs --update  golden 갱신
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..');
const json = join(ROOT, 'fixtures', 'sample-note-app.json');
const golden = join(ROOT, 'fixtures', 'sample-note-app.golden.html');
const tmp = join(ROOT, 'fixtures', '.tmp.html');

execFileSync('node', [join(HERE, 'render.mjs'), json, tmp], { stdio: 'ignore' });
const out = readFileSync(tmp, 'utf-8');

if (process.argv.includes('--update') || !existsSync(golden)) {
  writeFileSync(golden, out);
  console.log('✓ golden 갱신');
  process.exit(0);
}
const exp = readFileSync(golden, 'utf-8');
if (out === exp) { console.log('✓ 회귀 통과 — 렌더 결과가 golden과 동일'); process.exit(0); }

const a = exp.split('\n'), b = out.split('\n');
console.log('✗ 회귀 실패');
let shown = 0;
for (let i = 0; i < Math.max(a.length, b.length) && shown < 12; i++) {
  if (a[i] !== b[i]) { console.log(`  L${i + 1}\n    - ${(a[i] ?? '').slice(0, 140)}\n    + ${(b[i] ?? '').slice(0, 140)}`); shown++; }
}
process.exit(1);
