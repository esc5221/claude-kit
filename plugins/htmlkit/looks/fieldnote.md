# Look: fieldnote

낡은 종이 풀블리드 위에 그래파이트 잉크로 쓴 야전 노트/작전 문서 테마. 종이 노이즈 텍스처 + 전면 monospace + 주홍(#E8503A)·청록(#1B7A78) 2색 강조 + 하드 오프셋 그림자의 "도장 찍은 스탬프" 물성. paper가 "사내 격식 문서"라면 fieldnote는 "현장에서 만든 계획서" — 손맛 있고 단호하다. 게임·프로토타입 계획서, 밸런스 리포트, 목업 문서처럼 만드는 맛이 살아야 하는 문서에 맞는다.

> 태생은 salvo 게임의 종이·연필 전술판 UI. 레퍼런스 구현: `salvo/docs/260806_deploy_capacitor_plan.html`(리포트형), `salvo/docs/260806_ux_overhaul_mocks.html`(목업 그리드형).

## 변수 계약 (CONTRACT)

light-modern·mono·paper와 동일한 변수 키를 전부 채운다. format shell의 `{{LOOK_VARS}}` 자리에 아래 `:root{...}` 블록을 그대로 주입한다.

```css
:root{
  /* 색 — 표면: 낡은 종이 풀블리드. 카드를 띄우지 않는다 (데스크가 곧 종이) */
  --bg:#EDE6D8;
  --surface:rgba(255,255,255,.38);
  /* 잉크 — 그래파이트 3단계 */
  --ink:#3A3733;
  --ink-soft:#5B5750;
  --ink-faint:rgba(58,55,51,.45);
  --line:rgba(58,55,51,.25);
  --line-soft:rgba(58,55,51,.12);
  /* 강조 — 주홍(행동·경고) + 청록(확인·상대측) 2색 체계 */
  --accent:#E8503A;      --accent-soft:rgba(232,80,58,.08);
  --good:#1B7A78;        --good-soft:rgba(27,122,120,.07);
  --warn:#A05E12;        --warn-soft:rgba(160,94,18,.09);
  --bad:#C03A26;         --bad-soft:rgba(192,58,38,.10);
  --info:#5B5750;        --info-soft:rgba(58,55,51,.07);
  /* 코드 — 문서 안의 유일한 다크 표면 (석판) */
  --code-bg:#2E2C28;
  --code-ink:#E8E2D4;
  /* 폰트 — 전면 mono (본문 포함) */
  --font-body:'SF Mono',ui-monospace,'JetBrains Mono',Menlo,Consolas,monospace;
  --font-mono:'SF Mono',ui-monospace,'JetBrains Mono',Menlo,Consolas,monospace;
  /* 형태 — 스탬프 물성: 블러 없는 하드 오프셋 그림자 */
  --radius:8px;
  --radius-sm:4px;
  --shadow:4px 4px 0 rgba(58,55,51,.18);
  --weight-strong:800;
  --weight-base:500;     /* mono 한글 폴백 보정 (mono look과 동일) */
  --mark-bg:rgba(232,80,58,.14);
  --mark-ink:#B03722;
}
```

## 폰트 로딩

웹폰트 불필요(system mono). `{{FONT_LINKS}}`는 비워둔다.

## 종이 노이즈 — 이 look의 서명 (필수)

body에 SVG turbulence 데이터 URI를 깐다. 이미지 파일 0개. 이게 빠지면 그냥 베이지 화면이다.

```css
body{
  background-color:var(--bg);
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.23 0 0 0 0 0.21 0 0 0 0 0.19 0 0 0 0.045 0'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E");
}
```

## 톤 규칙

- **스탬프 마스트헤드**: 제목(h1)은 `inline-block` + `border:4px solid var(--ink)` + `transform:rotate(-0.8deg)` + `box-shadow:var(--shadow)`. 도장을 찍은 물성 — 이 look의 얼굴.
- **섹션 번호 칩**: h2 앞에 `background:var(--ink); color:var(--bg); transform:rotate(-1deg)` 칩. paper의 모노 액센트 번호 대신 물리적 칩.
- **회전은 세 군데만** — 마스트헤드 · 섹션 칩 · (있다면) 결과 스탬프. 본문 요소를 돌리기 시작하면 유치해진다.
- **그림자는 항상 하드 오프셋** (`4px 4px 0`) — 블러 그림자를 섞지 않는다. 종이 위에 종이를 겹친 물성 하나로 통일.
- **콜아웃 2종**: 경고 = `border-left:4px solid var(--accent)` + `--accent-soft` 배경, 확인/결정 = `var(--good)` 계열. 좌보더+연한 배경, radius는 `0 8px 8px 0`.
- **코드 블록이 유일한 다크 표면** — `--code-bg` 석판 위 `--code-ink`. 주석은 `#8a857b`, 강조 토큰은 주홍(`#ff8a75`)·청록(`#7fd3d1`) 밝은 변형.
- **표**: 헤더 `background:var(--ink); color:var(--bg)`, 본문 보더 `1.5px solid var(--line)`, 배경 `var(--surface)`.
- **이모지 금지** — 활자 기호(`▸ · ● ✕ ✓ ★ —`)만. 이 look의 세계에 컬러 이모지는 이물질이다.
- **em대시 허용** — "사실 — 결과" 구조의 짧은 절 연결은 이 look의 하우스 문체다 (다른 look의 대시 절제 규칙보다 우선).
- **차트**(필요시): line `var(--accent)`, 보조 series `var(--good)`, font mono 11px, grid `var(--line-soft)`. 배경 투명.

## 금지

- 흰 카드 띄우기(그건 paper) · 블러 그림자 · 컬러 이모지 · 3색 이상 강조 · 본문 요소 회전 · 웹폰트 로딩
