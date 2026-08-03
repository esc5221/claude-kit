# Ratio Line (A / B)

## 언제 쓰나

"비율이 악화/개선되고 있다"가 메시지일 때.
예: ₩/1K credit, cost/revenue, errors/requests, p95/p50.

indexed timeseries는 "벌어진다"를 보여주고, ratio-line은 그 벌어짐을 **한 숫자**로 압축한다.
판단 기준선(목표치, 손익분기, 과거 baseline)이 있으면 반드시 함께 그린다.

## 데이터 준비

```js
// 두 시리즈를 나눠서 ratio 계산. 0 나누기 주의.
const ratio = A.map((a, i) => B[i] > 0 ? a / B[i] : null);

// 24h rolling 권장
const roll = (arr, w=24) => arr.map((_, i) =>
  i < w - 1 ? null : arr.slice(i - w + 1, i + 1)
    .filter(v => v != null)
    .reduce((s, v) => s + v, 0) / w
);
```

## Plotly 코드

```js
const L = {{X_LABELS}};
const GCP = {{GCP_KRW_SERIES}};    // 원 단위
const CR  = {{CREDIT_SERIES}};     // 크레딧 수

// ₩ per 1K credit (1K 단위가 읽기 편함)
const ratio = GCP.map((g, i) => CR[i] > 0 ? (g / CR[i]) * 1000 : null);

// 기준선 (정상 운영 시 목표 값)
const TARGET = 500;  // 예: 500₩/1K credit

Plotly.newPlot('chart2', [
  {
    x: L, y: ratio, name: '₩ / 1K credit',
    type: 'scatter', mode: 'lines',
    line: { color: '#111', width: 2.5 },
    hovertemplate: '%{x}<br>%{y:.2f}<extra></extra>',
  },
  // 기준선
  {
    x: [L[0], L[L.length - 1]], y: [TARGET, TARGET],
    name: `목표 ${TARGET}`, type: 'scatter', mode: 'lines',
    line: { color: '#bbb', width: 1, dash: 'dash' },
    hoverinfo: 'skip',
  },
], {
  ...pl,
  height: 260,
  xaxis: { gridcolor: grid },
  yaxis: {
    title: '₩ / 1K credit',
    gridcolor: grid, zeroline: false,
    dtick: 100,           // 눈금 간격 (단위에 맞게)
    tickformat: ',d',
  },
  legend: { x: 0, y: 1.12, orientation: 'h', font: { size: 10 } },
  hovermode: 'x unified',
}, { responsive: true });
```

## 규칙

- **y축 dtick 수동 설정**: 자동이면 "1K", "1.5K" 같은 축약이 나와 해상도가 떨어진다. 읽고 싶은 단위(예: 0.1, 100)로 고정.
- **기준선/목표선은 필수**. 숫자만으로는 "이게 나쁜가 좋은가" 판단 불가.
- **단위를 명확히**: `₩ / 1K credit`, `ratio (×)`, `errors per 1M req` 등. 라벨에 단위 포함.
- **비율 차트는 보조**: 보통 indexed-timeseries 아래에 작은 높이(260~280px)로 배치.
- 0으로 나누기 방어 필수 (`null` 사용, Plotly는 gap으로 처리).
- 단일 라인이므로 색은 `#111`만 사용.

## 변형

- **1.x 스케일로 보이기**: `ratio = A/B` (×1000 없이), `yaxis.dtick: 0.1`.
- **여러 비율 겹치기**: 두 번째 라인은 `#999` 또는 `#bbb`. 네 개 이상이면 메시지가 흐려진다.
- **기준 구간 (밴드)**: 목표가 범위면 `annotation-overlays.md`의 `fillcolor` 기법 사용.
