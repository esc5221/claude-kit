# recipes-css.md — CSS만으로 되는 도식 부품

박스+화살표가 필요 없는 도식은 전부 여기서 해결한다. 모든 부품은 style.md 토큰 위에서 동작.
실전 조합은 `examples/gallery.html`(카탈로그)과 `examples/strategy-slide.html`(dense slide)에 있다.

## §bar — segmented bar (이 스킬의 원형)

threshold shift(이전/이후) · 스펙트럼 · 시간분포 · 커버리지 · 타임라인이 전부 이것의 변형이다.

```css
.diagram { max-width: 1100px; font-size: 26px; }
.axis-title { font-size: 26px; margin-bottom: 10px; }
.axis-ends { display: grid; grid-template-columns: 1fr 1fr; font-size: 26px; margin-bottom: 22px; }
.axis-ends .right { text-align: right; }
.row { display: grid; grid-template-columns: 130px 1fr; column-gap: 40px; align-items: center; }
.row + .row { margin-top: 64px; }         /* 이전/이후 두 바 사이 간격 */
.row-label { font-size: 26px; }
.bar {
  display: flex; height: 104px;
  border: var(--outline) solid var(--ink);
  background: var(--paper); overflow: hidden;
}
.seg {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  min-width: 0; text-align: center; padding: 0 12px;
}
.seg .pct { font-size: 17px; font-weight: 500; }   /* 세그먼트 부제 줄 */
.seg.blue { background: var(--blue); }  .seg.red { background: var(--red); color: #fff; }
.seg.amber { background: var(--amber); } .seg.green { background: var(--green); }
.seg.purple { background: var(--purple); }
.seg.empty { background: var(--paper); border-left: var(--outline) solid var(--ink); }
.bar-note { font-size: 18px; font-weight: 500; color: #555; margin-top: 16px; }
```

```html
<!-- threshold shift: 같은 축 위 두 시점 — 원본 이미지의 문법 -->
<div class="diagram">
  <div class="axis-title">문제 난이도 →</div>
  <div class="axis-ends"><div>쉬움</div><div class="right">어려움</div></div>
  <div class="row"><div class="row-label">이전</div>
    <div class="bar"><div class="seg blue" style="width:59%">방식 A</div>
                     <div class="seg red" style="width:41%">방식 B</div></div></div>
  <div class="row"><div class="row-label">이후</div>
    <div class="bar"><div class="seg blue" style="width:30%"></div>
                     <div class="seg red" style="width:70%"></div></div></div>
</div>
```

변형 규칙:
- **세그먼트끼리는 맞닿는다** (구분선 없음). 같은 색이 이웃하거나 명시적 구획이 필요할 때만
  `border-left: var(--outline) solid var(--ink)` 하나.
- **비례폭 바**(시간·비용 분포): width%를 실측 비율로. 5% 미만 조각은 라벨 없이 두고 bar-note에 설명.
- **커버리지**: 미커버 구간은 `seg empty` — 흰 채움+검정 좌측선. 회색·빗금 금지.
- **핀(head·현재 위치)**: 바 위에 `<div style="margin-left:33%">▼ 라벨</div>`.
- **두 번째 시점의 라벨 생략 가능** — 이전 바에서 이미 말했으면 이후 바는 색만으로 읽힌다(원본 문법).

## §stack — 레이어 스택

```css
.stack { max-width: 720px; font-size: 28px; }
.stack .layer { display: flex; align-items: center; justify-content: center;
  height: 96px; border: var(--outline) solid var(--ink); }
.stack .layer + .layer { border-top: 0; }   /* 겹선 방지 */
```

## §quad — 2×2 사분면

```css
.quad-wrap { display: grid; grid-template-columns: 56px 1fr; grid-template-rows: 1fr 56px; max-width: 760px; }
.quad-y { display: flex; align-items: center; justify-content: center; font-size: 24px; }
.quad-y span { transform: rotate(-90deg); white-space: nowrap; }  /* writing-mode 세로쓰기는 깨진다 — rotate로 */
.quad-x { grid-column: 2; display: flex; align-items: center; justify-content: center; font-size: 24px; padding-top: 14px; }
.quad { display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: 200px 200px; border: var(--outline) solid var(--ink); }
.quad .cell { display: flex; align-items: center; justify-content: center; text-align: center; font-size: 26px; padding: 16px; }
```

셀은 `<div class="cell" style="background:var(--blue)">` 식으로 채운다. y축 라벨은 반드시 `<span>` 안에.

## §matrix — 비교표 (검정 gap 그리드)

표는 선을 긋는 게 아니라 **검정 배경 + gap** 으로 만든다 — 셀 사이가 자동으로 4px 검정선이 된다.

```css
.matrix { display: grid; gap: var(--outline); background: var(--ink);
  border: var(--outline) solid var(--ink); width: fit-content; font-size: 20px;
  /* grid-template-columns는 내용에 맞게 인라인으로: e.g. 170px 250px 210px 470px */ }
.matrix > div { display: flex; align-items: center; justify-content: center;
  background: var(--paper); min-height: 68px; padding: 10px 16px; text-align: center; }
.matrix .head { background: var(--amber); }
.matrix .name { background: var(--blue); }   /* 행 이름 열 */
.matrix .yes  { background: var(--blue); }   /* ✓ 셀 — 미지원은 흰 셀에 "—" */
.matrix .warn { background: var(--red); color: #fff; }  /* 전폭 경고행: style="grid-column: 1 / -1" */
```

## §nest — 중첩 컨테이너 (포함 관계·배포 구조)

```css
.nest { border: var(--outline) solid var(--ink); padding: 20px 24px 28px; width: fit-content; }
.nest-tag { display: inline-block; font-size: 18px; border: 3px solid var(--ink);
  padding: 3px 10px; margin-bottom: 18px; background: var(--paper); }  /* 컨테이너 이름표 */
.nest-row { display: flex; gap: 28px; align-items: stretch; }
.chip { display: inline-block; border: 3px solid var(--ink); background: var(--paper);
  padding: 8px 16px; font-size: 20px; margin: 0 10px 10px 0; }   /* 최말단 모듈 */
```

nest 안에 nest를 넣어 계층을 만들고, 배경색은 `style="background:var(--amber)"`로 층마다 지정.

## §funnel — 퍼널

```css
.funnel { display: flex; flex-direction: column; align-items: center; max-width: 940px; }
.funnel .step { display: flex; align-items: center; justify-content: center;
  height: 88px; border: var(--outline) solid var(--ink); font-size: 26px; }
.funnel .step + .step { margin-top: calc(-1 * var(--outline)); }  /* 테두리 겹침 상쇄 */
```

각 step은 `style="width:74%; background:var(--green)"` — 중앙 정렬 감소 폭.

## §slide — 한 장 빽빽한 슬라이드 (전략 프레이밍용)

섹션 스크롤 문서 대신 발표 1장에 다 넣을 때. `examples/strategy-slide.html`이 완성형.

```css
.slide { max-width: 1860px; border: 4px solid var(--ink); padding: 28px 32px;
  display: flex; flex-direction: column; gap: 22px; }
.hd { display: flex; align-items: baseline; justify-content: space-between; gap: 20px; }
.hd h1 { font-size: 27px; }
.hd .quote { font-size: 14px; font-weight: 500; color: #555; text-align: right; }
.panel { border: 3px solid var(--ink); padding: 14px 18px; }
.panel-tag { display: inline-block; font-size: 12.5px; border: 2.5px solid var(--ink);
  padding: 2px 9px; margin-bottom: 12px; }
.concl { background: var(--amber); border: 3px solid var(--ink); padding: 13px 20px; }
.concl p { font-size: 14.5px; }
```

구성 정석: 헤더(제목+인용) → 문제 정의 바(전폭) → 대비 패널 2개(grid 1fr 1fr)
→ 근거·비유 패널 3개(grid 1fr 1fr 1fr, 미니 SVG 컷) → 결론 밴드(노랑 전폭).
dense 모드에선 폰트를 한 단계 내린다: 본문 13~14px, 패널 제목 15~17px, 바 세그먼트 13px.
목표 높이 ≤ 1100px (한 화면).
