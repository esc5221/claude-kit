# Indexed Time Series (Day 1 = 100)

## 언제 쓰나

스케일이 전혀 다른 여러 시계열을 **변화율로 비교**하고 싶을 때.
예: GCP 비용($천) vs Credits(백만) — 단위가 달라 같은 축에 못 올림.

모든 시리즈의 첫 값을 100으로 정규화하면 "누가 얼마나 올랐는가"만 남는다.
이 차트의 메시지는 항상 **"선들이 벌어진다"**.

## 데이터 준비

각 시리즈를 첫 값으로 나눈 뒤 ×100:

```js
function indexSeries(arr) {
  const base = arr[0];
  return arr.map(v => (v / base) * 100);
}
```

시간 해상도는 일별 또는 시간별(24h rolling 권장 — 노이즈 제거).

## Plotly 코드

```js
// x축 공통 라벨 (일자 또는 hour)
const L = {{X_LABELS}};

// 원본 (backfill 전)
const GCP_RAW = {{GCP_SERIES}};
const CR_RAW  = {{CREDIT_SERIES}};

// 인덱싱
const idx = arr => { const b = arr[0]; return arr.map(v => v / b * 100); };
const GCP = idx(GCP_RAW);
const CR  = idx(CR_RAW);

Plotly.newPlot('chart1', [
  {
    x: L, y: GCP, name: 'GCP 실비용',
    type: 'scatter', mode: 'lines',
    line: { color: '#111', width: 2.5 },
  },
  {
    x: L, y: CR, name: 'DB 크레딧 소비',
    type: 'scatter', mode: 'lines',
    line: { color: '#999', width: 2 },
  },
  // 기준선 (Day 1 = 100)
  {
    x: [L[0], L[L.length - 1]], y: [100, 100],
    name: 'Day 1 기준', type: 'scatter', mode: 'lines',
    line: { color: '#bbb', width: 1, dash: 'dot' },
    hoverinfo: 'skip', showlegend: false,
  },
], {
  ...pl,
  height: 320,
  xaxis: { gridcolor: grid, tickcolor: grid },
  yaxis: {
    title: 'Indexed (Day 1 = 100)',
    gridcolor: grid, zeroline: false,
    tickformat: ',d',
  },
  legend: { x: 0, y: 1.08, orientation: 'h', font: { size: 10 } },
  hovermode: 'x unified',
}, { responsive: true });
```

## 규칙

- **주 라인은 #111 width 2.5**, 부 라인은 `#999` width 2. 3개 이상이면 `#bbb` 추가.
- **강조색(#c0392b 등)은 데이터 라인에 쓰지 말 것**. 이벤트 영역 강조 전용.
- `yaxis.title`에 "(Day 1 = 100)" 명시. 독자가 이해해야 함.
- 첫 값이 0이거나 비정상이면 다른 baseline 고르고 그 시점을 `meta`에 명시.
- 모바일 고려할 필요 없음. max-width 1050이면 legend가 잘 보임.
- hover는 `x unified`로 통일. 같은 시점의 모든 값 동시 표시.

## 변형

- **베이스라인 이동**: `const base = arr[i0]`에서 i0를 원하는 시점으로.
- **24h rolling으로 노이즈 제거** (권장):
  ```js
  const roll = (arr, w=24) => arr.map((_, i) =>
    i < w - 1 ? null : arr.slice(i - w + 1, i + 1).reduce((a, b) => a + b, 0) / w
  );
  ```
- **이벤트 오버레이** 필요하면 `annotation-overlays.md` 레시피 덧붙임.
- **가정선 (counterfactual)** 필요하면 `counterfactual.md` 레시피 덧붙임.
