# Dual Axis (두 단위 절대값)

## 언제 쓰나

**절대값** 자체를 보여줘야 하는데 단위가 다를 때.
예: 비용($) + 요청수(건), 지연시간(ms) + throughput(rps).

indexed-timeseries는 변화율만 보여주고 실제 값은 숨기는 반면,
dual-axis는 두 축을 같이 띄워 독자가 원래 값을 읽을 수 있게 한다.
단점: 두 축 스케일을 내가 정하기 때문에 선을 겹쳐서 **의도적인 프레이밍**이 되기 쉽다.
가능하면 indexed-timeseries를 선호하고, 절대값이 꼭 필요할 때만 dual-axis.

## Plotly 코드

```js
const L = {{X_LABELS}};
const COST = {{COST_SERIES}};    // 단위 1: 달러
const REQ  = {{REQ_SERIES}};     // 단위 2: 건수

Plotly.newPlot('chart3', [
  {
    x: L, y: COST, name: 'GCP cost ($)',
    type: 'scatter', mode: 'lines',
    line: { color: '#111', width: 2.5 },
    yaxis: 'y',
  },
  {
    x: L, y: REQ, name: 'Requests',
    type: 'scatter', mode: 'lines',
    line: { color: '#999', width: 2 },
    yaxis: 'y2',
  },
], {
  ...pl,
  height: 320,
  xaxis: { gridcolor: grid },
  yaxis: {
    title: 'GCP cost ($)',
    gridcolor: grid, zeroline: false,
    titlefont: { color: '#111' },
    tickfont:  { color: '#111' },
  },
  yaxis2: {
    title: 'Requests',
    overlaying: 'y', side: 'right',
    showgrid: false, zeroline: false,
    titlefont: { color: '#777' },
    tickfont:  { color: '#777' },
  },
  legend: { x: 0, y: 1.08, orientation: 'h', font: { size: 10 } },
  hovermode: 'x unified',
}, { responsive: true });
```

## 규칙

- **왼쪽 축 = 주 지표 (#111)**, 오른쪽 축 = 부 지표 (#777 또는 #999).
- 오른쪽 축은 `showgrid: false` — grid가 두 벌 겹치면 지저분하다.
- 두 축의 `title` 텍스트 색상을 각 라인 색과 맞춰 시각적 매핑 제공.
- **3개 이상의 축은 금지**. 세 번째 시리즈가 필요하면 차트를 쪼개라.
- 두 시리즈가 서로 다른 y 범위를 갖더라도 억지로 0부터 시작하지 말 것 (`rangemode: 'tozero'` 피하기) — 변화가 납작해진다.
- 대신 이 차트의 한계(두 축은 스케일이 임의)를 `note`에 명시해라.

## 변형

- **주 지표에 컬러 강조**: 악화 구간만 `#c0392b` 색 → `annotation-overlays.md` 참고.
- **bar + line 조합**: 한쪽을 `type: 'bar'`로. 단 monospace 보고서 톤에선 line+line이 더 깔끔.
