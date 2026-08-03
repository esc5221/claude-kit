# ADR Blocks

`formats/adr.html` 의 `{{BODY}}` 자리(흰 종이 카드 `.page` 안)에 채우는 문서 블록. 전부 look 비종속(클래스만, CSS는 shell 제공). 위에서 아래로 읽히는 단일 격식 문서이므로 **핵심 결정 1개**를 향해 섹션을 쌓는다. ADR뿐 아니라 설계기록·기술제안·스펙 문서에 두루 쓴다.

선택 가이드:
```
문서 머리(라벨+제목)            → mast
문서 메타데이터(ID·상태·소유…)   → meta-grid
번호 매긴 본문 섹션              → section  (h2 .no = 1.0, 2.0 … 부록은 A.0)
구조/파이프라인 다이어그램·코드   → codeblock (pre, white-space:pre)
강조 박스                       → callout (기본/decision/constraint)
값 대조·옵션 비교(+채택행)       → compare-table (.chosen 행 강조)
나열식 핵심                      → bullets
개정 이력                        → revision-history
문서 꼬리(굵은 ink 선)           → footer
```
공통: 섹션 안에서 `<h3>`로 하위 항목(6.1, 6.2…), `<p class="lead">`로 요약 첫 문단, `<p class="sm">`로 보조 설명. 강조는 `<strong>`·`<code>`·`<em>`(기울임).

---

## mast — 문서 머리

```html
<div class="mast">
  <div class="kicker">{말머리 라벨 · 분류}</div>
  <h1>{문서 제목 — 한 줄}</h1>
</div>
```

## meta-grid — 메타데이터 (2열 k/v)

```html
<div class="meta">
  <div><span class="k">문서 ID</span><span class="v">{ADR-XXX-001}</span></div>
  <div><span class="k">개정</span><span class="v">0.1</span></div>
  <div><span class="k">상태</span><span class="v"><span class="status">검토용 초안</span></span></div>
  <div><span class="k">분류</span><span class="v">{사내 · 엔지니어링}</span></div>
  <div><span class="k">소유</span><span class="v">{팀}</span></div>
  <div><span class="k">컴포넌트</span><span class="v">{모듈}</span></div>
</div>
```
status 배지 변형: 기본(warn) / `class="status good"`(승인·채택) / `class="status accent"`(정보).

## section — 번호 매긴 섹션

```html
<h2><span class="no">1.0</span>요약</h2>
<p class="lead">{섹션 첫 요약 문단}</p>
<p>{본문. <strong>강조</strong>·<code>code</code>·<em>기울임 강조</em> 사용 가능}</p>

<h3>1.1 &nbsp;{하위 항목}</h3>
<p>{하위 본문}</p>
```
번호는 직접 적는다(`1.0`, `2.0`, … 부록 `A.0`). h2 윗선·h3 소제목은 shell이 처리.

## codeblock — 다이어그램 / 코드 / 의사코드

`<pre>`는 `white-space:pre`(공백 보존), accent 좌측 보더. 인라인 span: `.c`(주석/faint) `.g`(good) `.a`(warn) `.r`(bad), `<b>`(강조 ink).

```html
<pre><span class="c"># 주석 / 파일 경로</span>
parse ──┬─▶ draft_text ──────────────┐   <span class="c"># 설명</span>
        └─▶ <b>style_spec</b> (1콜)    ┤   <span class="c"># 동시 실행</span>
                                      ▼
              <b>sem(k)</b>{ fig₁ │ fig₂ │ … │ fig_N }   <span class="c"># bounded</span></pre>
```

## callout — 라벨 달린 강조 박스 (3종)

```html
<!-- 기본 (accent) : 결과·관찰 -->
<div class="callout"><span class="lab">Result · 결과</span>
{내용. <strong>강조</strong> 가능.}</div>

<!-- decision (good) : 채택·결정 -->
<div class="callout decision"><span class="lab">Decision · 결정</span>
<strong>{결정}</strong>을 먼저 착수한다. {근거.}</div>

<!-- constraint (warn) : 제약·경고 -->
<div class="callout constraint"><span class="lab">Constraint · 제약</span>
{지켜야 할 불변식 / 기각 근거.}</div>
```

## compare-table — 비교 표 (채택행 강조)

`<th>`는 모노 대문자(shell 처리). 채택안 행에 `class="chosen"` → good 배경.

```html
<table>
  <thead><tr><th>옵션</th><th>일관성</th><th>병렬성</th><th>판정</th></tr></thead>
  <tbody>
    <tr><td>{대안 A}</td><td>{…}</td><td>{…}</td><td>기각 — {근거}</td></tr>
    <tr class="chosen"><td>{채택안}</td><td>{…}</td><td>{…}</td><td><strong>채택</strong> — {근거}</td></tr>
  </tbody>
</table>
```
일반 표(설계원칙·구현계획·위험완화 등)는 `class="chosen"` 없이 동일 구조로.

## bullets — 나열식

```html
<ul>
  <li><strong>{키}</strong> — {설명}</li>
  <li>{항목}</li>
</ul>
```

## revision-history — 개정 이력

```html
<h2><span class="no">A.0</span>개정 이력</h2>
<table class="rev">
  <thead><tr><th>Rev</th><th>변경</th><th>상태</th></tr></thead>
  <tbody>
    <tr><td>0.1</td><td>최초 초안 — 문제 · 원칙 · 제안 아키텍처 · 계획</td><td>검토용 초안</td></tr>
  </tbody>
</table>
```

## footer — 문서 꼬리

```html
<footer>{ADR-XXX-001 · Rev 0.1 · 사내 엔지니어링 · 팀}</footer>
```
