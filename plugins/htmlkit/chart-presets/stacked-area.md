# Stacked Area (구성 비중 추이)

## 언제 쓰나

"총량이 어떻게 쪼개져 있고, 그 구성이 어떻게 바뀌었나"가 메시지일 때.
예: 비용 → (gemini, claude, gpt, openrouter) 구성 변화. 트래픽 → (solver, chat, visual) 구성.

합계가 중요한 경우에만 써라. 개별 시리즈 변화 추적이 목적이면 `indexed-timeseries`가 낫다.

## 데이터 준비

각 시리즈는 절대값. Plotly가 `stackgroup`으로 쌓아준다.
비중(%)이 메시지면 시리즈를 미리 정규화:

```js
// 각 시점에서 비중(%)으로 변환
const total = L.map((_, i) => S1[i] + S2[i] + S3[i] + S4[i]);
const pct = arr => arr.map((v, i) => total[i] > 0 ? (v / total[i]) * 100 : 0);
const S1p = pct(S1), S2p = pct(S2), S3p = pct(S3), S4p = pct(S4);
```

## Plotly 코드

```js
const L = {{X_LABELS}};
const S1 = {{SERIES_1}};  // 예: gemini
const S2 = {{SERIES_2}};  // 예: claude
const S3 = {{SERIES_3}};  // 예: gpt
const S4 = {{SERIES_4}};  // 예: other

// monospace 보고서에선 grayscale 계단식이 깔끔
const SHADES = ['#111', '#555', '#999', '#ccc'];

Plotly.newPlot('chart4', [
  { x: L, y: S1, name: 'gemini', stackgroup: 'one',
    line: { width: 0 }, fillcolor: SHADES[0], type: 'scatter', mode: 'none' },
  { x: L, y: S2, name: 'claude', stackgroup: 'one',
    line: { width: 0 }, fillcolor: SHADES[1], type: 'scatter', mode: 'none' },
  { x: L, y: S3, name: 'gpt',    stackgroup: 'one',
    line: { width: 0 }, fillcolor: SHADES[2], type: 'scatter', mode: 'none' },
  { x: L, y: S4, name: 'other',  stackgroup: 'one',
    line: { width: 0 }, fillcolor: SHADES[3], type: 'scatter', mode: 'none' },
], {
  ...pl,
  height: 320,
  xaxis: { gridcolor: grid },
  yaxis: {
    title: 'Cost ($)', gridcolor: grid, zeroline: false,
    tickformat: ',d',
  },
  legend: { x: 0, y: 1.08, orientation: 'h', font: { size: 10 } },
  hovermode: 'x unified',
}, { responsive: true });
```

## 규칙

- **색상: grayscale 단계 (#111 → #555 → #999 → #ccc)**. 이 보고서 톤에서 유색을 쓰면 디자인이 시끄러워진다.
- 강조하고 싶은 한 세그먼트가 있으면 그것만 `#c0392b` 같은 강조색, 나머지는 grayscale.
- **시리즈 순서**: 가장 큰(또는 가장 중요한) 구성요소를 아래(첫 번째)에. 독자는 아래에서부터 읽는다.
- **시리즈 수**: 3~6개. 그 이상이면 "기타"로 묶어라.
- **normalized(100%) 모드**에선 `yaxis.range: [0, 100]`, `yaxis.ticksuffix: '%'`.
- 절대값 vs 비중 — **한 보고서에 둘 다 쓰지 마라**. 하나만 선택.

## 변형

- **누적 비중 (100%)**: 위의 pct 변환 사용 + `yaxis: { range: [0, 100], ticksuffix: '%' }`.
- **강조 한 층**: 나머지는 `#ccc/#999/#555`, 강조는 `#c0392b`. 가장 위 또는 가장 아래 배치.
