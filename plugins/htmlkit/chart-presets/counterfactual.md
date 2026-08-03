# Counterfactual (가정 시나리오 오버레이)

## 언제 쓰나

"만약 그 변경을 안 했으면 어땠을까?"라는 질문에 답할 때.
예: 모델 전환 없었으면 GCP 비용은 얼마였을지. 실험 안 돌렸으면 p95는 얼마였을지.

실제값 라인 옆에 **가정값 라인을 함께 그려** 격차 = 해당 변경의 영향을 시각화한다.
이 차트 한 장으로 "이 변경이 전체 상승의 X%를 설명한다"를 증명할 수 있다.

## 데이터 준비

가정선은 수작업 또는 계산 기반:

1. **수작업**: 변경 전 구간의 추세(평균, 기울기)를 이어 그린다.
2. **계산 기반** (권장): 변경 전후 비용 구조 차이를 모델링.
   ```
   counterfactual[t] = actual[t] - (new_cost[t] - old_cost[t])
                     = actual[t] - Σ (events × (new_unit_price - old_unit_price))
   ```

```js
// 예: 4/6 15:00 이후 per-event 차이만큼 빼기
const SPLIT = '2026-04-06 15:00';
const DELTA_PER_EVENT = 0.10;  // 예: 0.10 credit/event 상승분

const cf = actual.map((v, i) => {
  if (L[i] < SPLIT) return v;
  const eventsSince = eventCount.slice(0, i + 1).reduce((a, b) => a + b, 0);
  return v - eventsSince * DELTA_PER_EVENT;
});
```

## Plotly 코드 (indexed-timeseries 위에 덧붙임)

```js
const traces = [
  {
    x: L, y: ACTUAL, name: 'GCP 실비용 (실제)',
    type: 'scatter', mode: 'lines',
    line: { color: '#111', width: 2.5 },
  },
  {
    x: L, y: CREDITS, name: 'DB 크레딧 소비',
    type: 'scatter', mode: 'lines',
    line: { color: '#999', width: 2 },
  },
  // counterfactual 라인
  {
    x: L, y: CF, name: '모델 전환 없었으면 (가정)',
    type: 'scatter', mode: 'lines',
    line: { color: '#1e8449', width: 2, dash: 'dash' },
  },
];

// 두 라인 사이 면적을 옅게 채워 "격차" 강조
const gap = [
  { x: L, y: ACTUAL, line: { width: 0 }, showlegend: false,
    hoverinfo: 'skip', type: 'scatter', mode: 'lines' },
  { x: L, y: CF, fill: 'tonexty',
    fillcolor: 'rgba(30,132,73,0.08)',
    line: { width: 0 }, showlegend: false,
    hoverinfo: 'skip', type: 'scatter', mode: 'lines' },
];

Plotly.newPlot('chart1', [...traces, ...gap], {
  ...pl,
  height: 320,
  xaxis: { gridcolor: grid },
  yaxis: { title: 'Indexed (Day 1 = 100)', gridcolor: grid, zeroline: false },
  legend: { x: 0, y: 1.08, orientation: 'h', font: { size: 10 } },
  hovermode: 'x unified',
}, { responsive: true });
```

## 규칙

- **실제 라인은 #111 실선**, 가정 라인은 **점선(`dash: 'dash'`)**. 독자가 실측/가정을 구분해야 함.
- **가정선 색**:
  - `#1e8449` (녹색) — 가정이 더 낮음 (실제가 악화)
  - `#c0392b` (빨강) — 가정이 더 높음 (실제가 개선)
  - `#e67e22` (주황) — 중립 대안 가정
- **격차 shading**: `fill: 'tonexty'`로 두 라인 사이 영역을 옅게 채워 격차를 시각화. opacity 0.05~0.10.
- 가정 라인의 **분기 시점을 meta 또는 annotation에 명시**: "4/6 15:00 모델 전환 없었다고 가정".
- **가정 계산 방법을 note에 반드시 밝혀라**. 독자가 "이거 어떻게 계산했어?"라고 물을 수 있으면 실패.
- 두 라인 모두 Day1=100 정규화가 되어 있어야 의미가 맞는다 (또는 둘 다 원단위).

## 함정

- 가정선이 실제보다 **위에 있으면 독자는 혼란**. 실제가 악화된 경우 가정선이 아래여야 자연스럽다.
- 가정선이 **rolling window 때문에 시작 시점이 지연**될 수 있음 — 그 경우 둘 다 같은 rolling 적용.
- 여러 counterfactual을 겹치지 말 것. 한 차트에 가정선 1개.
