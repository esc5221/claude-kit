# Deck Blocks

`formats/deck.html` 의 `{{SLIDES}}` 자리에 채우는 슬라이드 `<section>` 블록 모음. 전부 look 비종속(클래스만 사용, CSS는 shell이 제공). 필요한 것만 골라 순서대로 이어 붙인다.

선택 가이드:
```
표지                      → cover
한 장 요약 / 핵심 결론     → bluf  (메트릭 동반 가능)
2~3개 병렬 항목            → card-grid (g2 / g3)
좌우 대비 / before-after  → two-col
나열식 핵심                → bullets
코드 · 다이어그램 · 표     → codeblock
강조 인용 · 한마디         → quote
숫자 임팩트                → metric-strip (보통 bluf/closing 안에)
PART 전환                  → section-divider (풀블리드 컬러)
마무리 · 한 문장 + 노트    → closing
```
공통: 우상단 `slide-meta`(쪽수/섹션), 하단 `foot`(좌우 라벨)는 선택. `kicker`에 `.good/.warn/.bad`로 색 변형.

---

## cover — 표지

```html
<section data-background-color="var(--bg)">
  <div class="slide-wrap center cover">
    <div class="eyebrow">{말머리 라벨}</div>
    <h1>{제목 1행<br>제목 2행}</h1>
    <div class="sub">{한 문단 요약 — 무엇을 다루는 덱인지}</div>
    <div class="period">{기간 / 부제}</div>
    <div class="stamp">
      <span>{라벨} <b>{값}</b></span>
      <span>{라벨} <b>{값}</b></span>
    </div>
  </div>
</section>
```

## bluf — 한 장 요약

```html
<section>
  <div class="slide-wrap">
    <div class="slide-meta">01 · BLUF</div>
    <div class="kicker">한눈에</div>
    <h2>{핵심 메시지 한 줄}</h2>
    <div class="two">
      <div>
        <h3 style="color:var(--accent)">{축 A}</h3>
        <p class="lead">{설명}</p>
      </div>
      <div>
        <h3 style="color:var(--good)">{축 B}</h3>
        <p class="lead">{설명}</p>
      </div>
    </div>
    <div class="metrics">
      <div class="metric"><div class="v">142<span class="u">회</span></div><div class="l">{라벨}</div></div>
      <div class="metric"><div class="v">378</div><div class="l">{라벨}</div></div>
    </div>
    <div class="foot"><span>{좌}</span><span>{우}</span></div>
  </div>
</section>
```

## card-grid — 병렬 카드 (g2 / g3)

```html
<section>
  <div class="slide-wrap">
    <div class="kicker">{섹션 라벨}</div>
    <h2>{제목}</h2>
    <div class="grid g2">   <!-- 3개면 g3 -->
      <div class="card">
        <h3><span class="num">01</span> {카드 제목}</h3>
        <p>{내용. <strong>강조</strong>·<code>code</code>·<em>형광</em> 사용 가능}</p>
      </div>
      <div class="card">
        <h3><span class="num">02</span> {카드 제목}</h3>
        <p>{내용}</p>
      </div>
    </div>
    <div class="foot"><span>{좌}</span><span>{우}</span></div>
  </div>
</section>
```

## two-col — 좌우 대비

```html
<section>
  <div class="slide-wrap">
    <div class="kicker">{라벨}</div>
    <h2>{제목}</h2>
    <div class="two">
      <div>
        <h3 style="color:var(--accent)">{왼쪽 제목}</h3>
        <ul><li><strong>키</strong> — 설명</li><li>...</li></ul>
      </div>
      <div>
        <h3 style="color:var(--good)">{오른쪽 제목}</h3>
        <ul><li><strong>키</strong> — 설명</li><li>...</li></ul>
      </div>
    </div>
  </div>
</section>
```

## bullets — 나열식

```html
<section>
  <div class="slide-wrap">
    <div class="kicker">{라벨}</div>
    <h2>{제목}</h2>
    <ul style="max-width:40em;">
      <li><strong>{키}</strong> — {설명}</li>
      <li><strong>{키}</strong> — {설명}</li>
    </ul>
  </div>
</section>
```

## codeblock — 코드 / 다이어그램 / ASCII 표

`.codeblock`은 `white-space:pre`. 색 span: `.c`(accent) `.g`(good) `.a`(warn) `.r`(bad) `.d`(faint) `.q`(인용).

```html
<section>
  <div class="slide-wrap">
    <div class="kicker">{라벨}</div>
    <h2>{제목}</h2>
    <div class="codeblock"><span class="d"># 주석</span>
<span class="c">key</span> → <span class="g">value</span>
<span class="a">▸ 강조 라인</span></div>
    <p class="note">{보조 설명}</p>
  </div>
</section>
```

## quote — 강조 인용

```html
<section>
  <div class="slide-wrap">
    <div class="kicker bad">{라벨}</div>
    <h2>{제목}</h2>
    <div class="quote">"{인용문}"<span class="who">— {출처/맥락}</span></div>
  </div>
</section>
```
부정/경고 톤이면 `class="quote bad"`.

## section-divider — PART 전환 (풀블리드)

```html
<section data-background-color="#2f6df0">
  <div class="slide-wrap center" style="color:#fff">
    <div style="font-family:var(--font-mono);font-size:.5em;letter-spacing:.2em;opacity:.75;margin-bottom:18px;">PART I</div>
    <h1 style="color:#fff;font-size:1.7em;">{섹션 대제목}</h1>
    <p style="color:rgba(255,255,255,.82);font-size:.72em;max-width:22em;margin-top:14px;">{한 줄 소개}</p>
  </div>
</section>
```
배경색은 accent(`#2f6df0`)·good(`#1f9d6b`)·dark(`#1a1a1a`)를 PART마다 번갈아. mono look에서는 풀블리드 자제 — 일반 헤딩 슬라이드로 대체.

## closing — 마무리

```html
<section data-background-color="#1a1a1a">
  <div class="slide-wrap center" style="color:#fff">
    <div style="font-family:var(--font-mono);font-size:.5em;letter-spacing:.2em;color:#6fa0ff;margin-bottom:18px;">CLOSING</div>
    <h1 style="color:#fff;font-size:1.5em;max-width:18em;">{마무리 한 줄}</h1>
    <p style="color:rgba(255,255,255,.85);font-size:.82em;max-width:26em;line-height:1.55;">{요약 문장}</p>
    <!-- 선택: 경고/노트 박스 -->
    <div style="margin-top:34px;background:var(--bad-soft);border:1px solid var(--bad);border-radius:12px;padding:18px 24px;max-width:30em;">
      <div style="font-family:var(--font-mono);font-size:.46em;letter-spacing:.1em;color:var(--bad);margin-bottom:8px;">⚠ NOTE</div>
      <p style="font-size:.6em;line-height:1.5;margin:0;color:rgba(255,255,255,.8);">{노트 내용}</p>
    </div>
  </div>
</section>
```
