# Report Blocks

`formats/report.html` 의 `{{BODY}}` 자리에 채우는 스크롤 문서 블록. look 비종속. 위에서 아래로 읽히는 단일 문서이므로 **핵심 메시지 1개**를 향해 섹션을 최소로 쌓는다.

```
용도                              블록
──────────────────────────────────────────
문서 제목 + 출처                   header
결론 숫자 먼저                     kpi-strip
섹션 경계                          section-heading
정확한 값 대조                     data-table
독자가 모르면 오해할 전제          note (주황)
이 섹션의 한 줄 결론               finding (빨강)
시계열/비율 그래프                 chart (Plotly, chart-presets/ 참조)
2~3개 병렬 항목                    card-grid
강조 인용                          quote
나열식 핵심                        ul.clean
```

mono look이면 `<body class="dense">`로 정보밀집(11px). light-modern이면 `<body>` 기본(15px narrative).

---

## header — 제목 + 메타

```html
<div class="kicker">{선택: 말머리 라벨}</div>
<h1>{문서 제목}</h1>
<div class="meta">
  {기간} · {데이터 소스, · 구분}<br>
  {맥락 없이 읽혀야 하는 부가설명/경고 1~2줄}
</div>
```

## kpi-strip — 결론 숫자

3~5개. 결론에 가까운 순서.
```html
<div class="kpi-row">
  <div class="kpi">
    <div class="kpi-label">{라벨}</div>
    <div class="kpi-val num">{값}</div>
    <div class="kpi-sub">{변화 — <span class="up">+38%</span> 또는 <span class="dn">개선</span>}</div>
  </div>
  <!-- 반복 -->
</div>
```

## section-heading — 섹션 경계

```html
<h2>§{N} {섹션 제목}</h2>
<div class="meta">{선택: 이 섹션의 결론 한 줄}</div>
```

## data-table — 값 대조

숫자 셀 `class="num"` 필수. 첫 컬럼 라벨 좌측 정렬(자동). 악화 `.up`(빨강)·개선 `.dn`(녹색).
```html
<table>
  <thead><tr><th>{라벨}</th><th>{지표 ($)}</th><th>{비율 (×)}</th><th>vs D-1</th></tr></thead>
  <tbody>
    <tr><td>{행}</td><td class="num">412,000</td><td class="num">2.15</td><td class="num"><span class="up">+4.6%</span></td></tr>
  </tbody>
  <tfoot><tr><td><strong>합계</strong></td><td class="num"><strong>...</strong></td><td class="num"></td><td class="num"></td></tr></tfoot>
</table>
```

## note / finding — 콜아웃

```html
<div class="note">{전제·가정·데이터 제약. 독자가 모르면 오해할 것.}</div>
<div class="finding">{이 섹션의 핵심 발견 한 줄.}</div>
```
섹션당 각 0~1개. 1~2문장. 넘으면 본문으로.

## chart — Plotly

`report.html` head의 Plotly `<script>`를 남겨둔 경우만. 레시피는 `${CLAUDE_PLUGIN_ROOT}/chart-presets/*.md` 사용(indexed-timeseries, ratio-line, dual-axis, stacked-area, annotation-overlays, counterfactual). 색은 토큰을 따른다:
```html
<div class="chart" id="chart1"></div>
<script>
const pl={ paper_bgcolor:'#fff', plot_bgcolor:'#fff',
  font:{ family:getComputedStyle(document.body).getPropertyValue('--font-mono'), size:11, color:'#333' },
  margin:{t:10,b:50,l:50,r:20} };
const grid=getComputedStyle(document.documentElement).getPropertyValue('--line')||'#eee';
Plotly.newPlot('chart1',[{x:L,y:S1,type:'scatter',mode:'lines',line:{width:2}}],
  {...pl,height:300,xaxis:{gridcolor:grid},yaxis:{gridcolor:grid,zeroline:false}},{responsive:true});
</script>
```

## card-grid

```html
<div class="grid g3">
  <div class="card"><h3>{제목}</h3><p>{내용}</p></div>
  <div class="card"><h3>{제목}</h3><p>{내용}</p></div>
  <div class="card"><h3>{제목}</h3><p>{내용}</p></div>
</div>
```

## quote

```html
<div class="quote">"{인용}"</div>
```
부정 톤이면 `class="quote bad"`.

## ul.clean — 나열

```html
<ul class="clean">
  <li><strong>{키}</strong> — {설명}</li>
</ul>
```

## foot

```html
<div class="foot">{생성일 · 출처 · 작성자}</div>
```
