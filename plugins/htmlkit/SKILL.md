---
name: htmlkit
description: 단일 HTML 산출물(발표 슬라이드 덱 · narrative 리포트 · ADR/설계기록)을 상황에 맞는 템플릿으로 조립하는 슈퍼셋 스킬. 출력 구조(format)와 디자인(look)을 따로 골라 같은 블록으로 찍어낸다. 'htmlkit', 'ppt 만들어', '발표자료', '슬라이드 만들어', 'deck', '리포트 html로', '보고서 슬라이드', 'ADR 써줘' 언급 시 사용. (시스템 도식·아키텍처 그림이면 schematic)
---

# htmlkit

HTML 산출물을 만드는 **슈퍼셋 스킬**. 발표 덱이든 스크롤 리포트든, 라이트 모던이든 monospace든 — **구조(format)와 디자인(look)을 분리**해서 같은 블록으로 조립한다.

핵심 설계: `looks/*`는 CSS 변수(토큰)만 정의하고, `formats/*` shell이 컴포넌트 CSS를 변수 참조로 들고 있으며, `blocks/*`는 클래스만 가진 순수 HTML이다. → **같은 블록이 어느 look에도 그대로 꽂힌다.**

## 멘탈모델 — 프리셋 기본값 + 2축 오버라이드

```
프리셋을 고르면 (format, look)이 자동 세팅된다. 필요하면 축만 갈아끼운다.

  프리셋        format     look          용도                     상태
  ──────────────────────────────────────────────────────────────────
  deck (기본)   deck       light-modern  발표·회고·제품소개 슬라이드  ✅
  tech-report   report     mono          기술 분석·장문 문서          ✅
  brief         report     light-modern  임원 브리핑·제안서(narrative) ✅(blocks 공유)
  adr           adr        paper         ADR·설계기록·기술제안·스펙 문서 ✅
  survey        survey     press         서베이·카탈로그·후보비교·결정로그  ✅

오버라이드 예:
  "발표인데 monospace로"   → format=deck,   look=mono
  "리포트인데 모던하게"     → format=report, look=light-modern (= brief)
  "ADR을 논문체로"         → format=adr,    look=mono
  "리포트를 차분한 종이톤"  → format=report, look=paper
  "야전 노트/종이 스탬프 느낌으로" · 게임/프로토타입 계획서 → look=fieldnote
  "항목이 수십 개인 목록"·"뭐뭐 있었는지 정리" → format=survey (항목마다 상태 뱃지)
  "각지고 진한 문서 톤으로" · 웹폰트 없이      → look=press
```

format × look은 직교한다. 어떤 칸이든 `formats/<format>.html` + `looks/<look>.md` 조합으로 만든다.

## 조립 흐름

`formats/` · `looks/` · `blocks/` · `chart-presets/` 경로는 모두 `${CLAUDE_PLUGIN_ROOT}` 기준이다.

1. **무엇을 만드나** 판단 → 위 표에서 프리셋(=format·look) 결정. 애매하면 발표면 deck, 읽는 문서면 report.
2. `formats/<format>.html` 을 출력 파일로 복사.
3. `looks/<look>.md` 의 `:root{...}` 블록을 `{{LOOK_VARS}}` 자리에, 폰트 링크를 `{{FONT_LINKS}}` 자리에 주입(mono look은 폰트 비움).
4. `blocks/<format>-blocks.md` 에서 필요한 블록만 골라 `{{SLIDES}}`(deck) / `{{BODY}}`(report·adr)에 순서대로 채우고 내용 작성.
5. `{{TITLE}}` 채우기. report에서 차트 안 쓰면 head의 Plotly `<script>` 삭제. mono report는 `<body class="dense">`.
6. **open 하기 전 사용자에게 확인**받는다. (사용자 규칙)

## 블록 라이브러리

- 슬라이드(deck): `blocks/deck-blocks.md` — cover · bluf · card-grid · two-col · bullets · codeblock · quote · metric-strip · section-divider · closing
- 카탈로그(survey): `blocks/survey-blocks.md` — masthead · 계보맵 · section · 항목(h3+상태뱃지) · 실측표(pre) · 전환점 · 비교표 · foot
- 문서(report): `blocks/report-blocks.md` — header · kpi-strip · section-heading · data-table · note/finding · chart · card-grid · quote · ul.clean · foot
- ADR/설계기록(adr): `blocks/adr-blocks.md` — mast · meta-grid · section(번호h2) · codeblock · callout(기본/decision/constraint) · compare-table(.chosen) · bullets · revision-history · footer
- 차트(Plotly): `${CLAUDE_PLUGIN_ROOT}/chart-presets/*.md` (indexed-timeseries, ratio-line, dual-axis, stacked-area, annotation-overlays, counterfactual)

## 절대 규칙

- **look 토큰을 임의 변경하지 않는다.** 색·폰트·radius·shadow는 `looks/<look>.md` 값 그대로. 슬라이드별 1회성 색은 인라인 style로만(예: 풀블리드 divider 배경).
- **blocks에 하드코딩 색 금지.** 반드시 `var(--*)` 변수만. 새 색이 필요하면 변수 계약에 추가하고 두 look 모두 채운다.
- **섹션/슬라이드 남발 금지.** 핵심 메시지 1개를 향해 최소로.
- **Claude AI slop 금지** — 과한 그라데이션, 이모지, 요란한 카드, 의미 없는 아이콘.
- **reveal 전환**은 `fade` + `fast` 고정(deck shell에 이미 설정).

## 체크리스트

- [ ] 프리셋(format·look) 명확히 골랐나
- [ ] `{{LOOK_VARS}}` / `{{FONT_LINKS}}` / `{{TITLE}}` / 본문 placeholder 다 채웠나
- [ ] blocks에 하드코딩 색이 새지 않았나 (var만)
- [ ] mono report면 `dense`, 차트 없으면 Plotly script 제거했나
- [ ] 슬라이드/섹션이 핵심 메시지 1개를 향하나
- [ ] open 전 확인받았나

## 다른 스킬과의 경계

```
htmlkit       슬라이드 덱 / narrative 리포트 / ADR (구조×디자인 조립)  ← 이 스킬
schematic     시스템 도식·아키텍처·전략 프레이밍 그림 (bold-outline flat, SVG 스윔레인·바)
              같은 마켓플레이스에 있다. 글이 주인공이면 htmlkit, 그림이 주인공이면 schematic.
```

데이터 대시보드(Plotly 다수 + 표)나 TTS 나레이션 발표처럼 전용 스킬이 따로 설치돼 있다면 그쪽을 쓴다. 없으면 htmlkit의 report + mono look + `chart-presets/`로 충분히 커버된다.

## 확장하는 법

- **새 look 추가**(예: dark): `looks/dark.md`에 변수 계약 전부를 채운다. blocks/formats 수정 불필요.
- **새 format 추가**(예: poster): `formats/poster.html` shell + `blocks/poster-blocks.md`. 기존 look 그대로 적용됨.
- **변수 계약 확장**: 새 토큰은 모든 look(light-modern·mono·paper·fieldnote·press)에 동시에 추가(한쪽만 추가하면 그 look에서 깨짐).
