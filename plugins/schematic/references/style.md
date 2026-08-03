# style.md — Bold-Outline Flat 토큰 정본 + 공통 CSS

이 블록을 그대로 복사해 시작한다. 색·선굵기·폰트를 임의로 바꾸지 않는다.
(원류: 스타일 추출 실측 — 파랑 #80D8FF = Material Light Blue A100, 빨강 #F44336 = Material Red 500,
외곽선 4px 실측, 폰트는 Apple SD Gothic Neo 계열 700으로 판정)

## 토큰 + 문서 뼈대

```css
:root {
  --blue:   #80D8FF;  /* 입출력 · 게이트 */
  --red:    #F44336;  /* 무거운 처리 (LLM 등) — 텍스트는 흰색 */
  --amber:  #FFC107;  /* 가벼운 모델·서비스 호출 */
  --green:  #A5D6A7;  /* 결정적 (순수함수·DB) */
  --purple: #CE93D8;  /* 큐 · 과금 · 격리 */
  --ink:    #000000;
  --paper:  #FFFFFF;
  --outline: 4px;
}

* { margin: 0; padding: 0; box-sizing: border-box; }

body {
  background: var(--paper);
  color: var(--ink);
  font-family: "Apple SD Gothic Neo", "Pretendard", "Noto Sans KR", "Malgun Gothic", sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  line-height: 1.25;
  padding: 64px 48px 120px;
}

.page-title { font-size: 34px; margin-bottom: 8px; }
.page-sub   { font-size: 18px; font-weight: 500; color: #555; margin-bottom: 56px; }

section { margin-bottom: 110px; }
.section-tag {           /* 섹션 번호표 — "1. 제목 — 부제" 형태로 쓴다 */
  display: inline-block;
  font-size: 15px;
  border: 3px solid var(--ink);
  padding: 4px 12px;
  margin-bottom: 28px;
}

/* 색 범례 — 색을 의미론으로 쓰므로 항상 페이지 상단에 붙인다 */
.legend { display: flex; flex-wrap: wrap; gap: 14px 28px; margin-bottom: 32px; font-size: 18px; }
.legend .key { display: flex; align-items: center; gap: 10px; }
.legend .sw { width: 34px; height: 24px; border: 3px solid var(--ink); display: inline-block; }
```

```html
<div class="legend">
  <span class="key"><span class="sw" style="background:var(--red)"></span>무거운 처리</span>
  <span class="key"><span class="sw" style="background:var(--amber)"></span>모델·서비스 호출</span>
  <span class="key"><span class="sw" style="background:var(--green)"></span>결정적</span>
  <span class="key"><span class="sw" style="background:var(--purple)"></span>큐 · 격리</span>
  <span class="key"><span class="sw" style="background:var(--blue)"></span>입출력 · 게이트</span>
  <span class="key"><span class="sw" style="background:var(--paper)"></span>저장소 · 경계</span>
</div>
```

## SVG 공통 클래스 (박스+화살표 도식 전부가 쓴다)

```css
svg { display: block; }
svg .box  { stroke: var(--ink); stroke-width: 4; }   /* rect·polygon 공통 */
svg .lane { stroke: var(--ink); stroke-width: 4; fill: var(--paper); }
svg .f-blue   { fill: var(--blue); }
svg .f-red    { fill: var(--red); }
svg .f-amber  { fill: var(--amber); }
svg .f-green  { fill: var(--green); }
svg .f-purple { fill: var(--purple); }
svg .f-paper  { fill: var(--paper); }
svg text {
  font-family: inherit;
  font-weight: 700;
  font-size: 21px;
  fill: var(--ink);
  text-anchor: middle;
  dominant-baseline: central;
}
svg text.t-white { fill: #fff; }          /* 빨강 박스 위 텍스트 */
svg text.bt { font-size: 19px; }          /* 박스 제목 */
svg text.bs { font-size: 13px; font-weight: 500; }  /* 박스 부제 (1줄) */
svg text.lbl { font-size: 17px; }         /* 화살표·축 라벨 */
svg text.lane-h { font-size: 16px; }      /* 레인 헤더 */
svg .conn {                                /* 흐름 화살표 — 4px */
  stroke: var(--ink); stroke-width: 4; fill: none;
  marker-end: url(#arrowhead);
}
svg .wire {                                /* 신호·부가 화살표 — 2.5px */
  stroke: var(--ink); stroke-width: 2.5; fill: none;
  marker-end: url(#arrowhead);
}
```

화살촉 정의 — **문서에서 한 번만**, 첫 svg의 defs에 넣으면 같은 문서의 다른 svg에서도 참조된다:

```html
<defs>
  <marker id="arrowhead" markerWidth="18" markerHeight="18" refX="14" refY="9"
          orient="auto" markerUnits="userSpaceOnUse">
    <path d="M2,2 L16,9 L2,16 Z" fill="#000"/>
  </marker>
</defs>
```

## 규칙 요약

- 색 6개가 전부다. 새 색을 만들지 않는다. 세그먼트가 6개를 넘으면 도식을 쪼갠다.
- radius 0 · shadow 없음 · gradient 없음 · 질감 없음. miter 직각.
- 빨강 배경 위 텍스트만 흰색(`t-white`), 나머지는 전부 검정.
- 축소 배포 시에도 외곽선은 최소 3px을 유지해야 같은 인상이 난다.
