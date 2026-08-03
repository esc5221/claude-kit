# Annotation Overlays (이벤트 영역/수직선/라벨)

## 언제 쓰나

**다른 차트 프리셋 위에 겹쳐서** 쓰는 레시피.
"이 시점에 뭐가 있었다 → 그래서 데이터가 이렇게 움직였다"를 시각적으로 연결.

단독 차트 프리셋이 아니라, `indexed-timeseries`/`ratio-line`/`dual-axis` 등의 layout 객체에
`shapes` 및 `annotations` 배열을 추가하는 방식.

## shapes (영역 + 수직선)

```js
const layout = {
  ...pl,
  height: 320,
  xaxis: { gridcolor: grid },
  yaxis: { gridcolor: grid, zeroline: false },
  shapes: [
    // 1) 이벤트 구간 (수직 밴드)
    {
      type: 'rect', xref: 'x', yref: 'paper',
      x0: '2026-04-01 12:00', x1: '2026-04-02 09:00',
      y0: 0, y1: 1,
      fillcolor: 'rgba(192,57,43,0.10)',   // 빨강 10%
      line: { width: 0 },
      layer: 'below',
    },
    // 2) 영향권 (rolling 때문에 이벤트 이후 N시간도 영향)
    {
      type: 'rect', xref: 'x', yref: 'paper',
      x0: '2026-04-02 09:00', x1: '2026-04-03 09:00',
      y0: 0, y1: 1,
      fillcolor: 'rgba(192,57,43,0.05)',
      line: { color: 'rgba(192,57,43,0.15)', width: 1, dash: 'dot' },
      layer: 'below',
    },
    // 3) 배포 시점 (수직 점선)
    {
      type: 'line', xref: 'x', yref: 'paper',
      x0: '2026-04-06 15:26', x1: '2026-04-06 15:26',
      y0: 0, y1: 1,
      line: { color: '#e67e22', width: 1.5, dash: 'dash' },
    },
  ],
  annotations: [
    {
      x: '2026-04-01 20:00', y: 1, xref: 'x', yref: 'paper',
      yshift: -6,
      text: 'April Smart 실험', showarrow: false,
      font: { size: 10, color: '#c0392b' },
      align: 'left',
    },
    {
      x: '2026-04-06 15:26', y: 1, xref: 'x', yref: 'paper',
      yshift: -6,
      text: 'illust-pro 배포', showarrow: false,
      font: { size: 10, color: '#e67e22' },
      xanchor: 'left',
    },
  ],
};
```

## 규칙

- **색상 역할 고정**:
  ```
  #c0392b (rgba(...,0.10))  악화/문제 이벤트 구간
  #e67e22                    배포/변경 시점 (수직 점선)
  #8e44ad                    실험/A/B 시점 (대안)
  #1e8449                    개선/복구 시점
  ```
- **layer: 'below'** 필수 — 데이터 라인을 가리지 않도록.
- **yref: 'paper'** 로 차트 전체 높이 덮음. `y0: 0, y1: 1`.
- **영향권(dim) 밴드**: 24h rolling 차트에선 이벤트 이후 24시간 동안 잔상이 있으니 옅은 밴드로 표시해라.
- **annotation 라벨**: 차트 **상단** (y=1, yshift 음수)에만 배치. 차트 내부 금지 (데이터 가림).
- **라벨 수 제한**: 3개 이하. 그 이상이면 라벨이 겹치거나 시선이 분산된다.
- `hovertemplate` 있는 라인이면 shapes hover와 충돌하지 않게 `hoverinfo: 'skip'`.

## 수직선만 필요한 경우 (가장 단순)

```js
shapes: [{
  type: 'line', xref: 'x', yref: 'paper',
  x0: EVENT_TIME, x1: EVENT_TIME, y0: 0, y1: 1,
  line: { color: '#e67e22', width: 1.5, dash: 'dash' },
}],
annotations: [{
  x: EVENT_TIME, y: 1, xref: 'x', yref: 'paper', yshift: -6,
  text: '{이벤트 이름}', showarrow: false,
  font: { size: 10, color: '#e67e22' }, xanchor: 'left',
}],
```

## 함정

- `x0/x1`은 **차트의 x축 자료형과 일치**해야 한다. 시간축이면 `'YYYY-MM-DD HH:mm'` 문자열, datetime 객체, 또는 숫자 인덱스.
- 인덱스 기반 x (`L = ['D1', 'D2', ...]`)에선 x0/x1에 **문자열 그대로** 전달.
- 24h rolling 차트면 이벤트 **시작 시점**이 아니라 **rolling window가 이벤트를 완전히 포함하기 시작하는 시점**으로 고려.
