---
name: interview-doc
description: 인터뷰 전사(음성 전사·회의록·통화 기록, 언어 무관)를 주석과 심층분석이 붙은 단일 HTML 리포트로 가공한다. 스크롤하며 대화 흐름을 따라가고, 각 대목 옆에 해설이, 챕터 끝에 종합 판단이 붙는다. '인터뷰 정리', '전사 분석', '인터뷰 리포트', '유저 인터뷰 문서화', 'interview-doc' 언급 시 사용.
---

# interview-doc

인터뷰 전사 → 주석판 HTML 리포트.

**핵심 원칙: 고정 템플릿이 아니라, 고정된 리포팅 문법 위에 인터뷰 유형별 분석 렌즈를 꽂는다.**
레이아웃·CSS·데이터 계약은 불변이고, 챕터 구성·분석 축·대조표·화자 라벨은 매번 새로 정한다.

HTML을 직접 쓰지 않는다. `report.json`을 작성하고 렌더러를 돌린다.

---

## 절차

### 1. 진단

전사를 끝까지 읽고 다음을 판정한다. 여기서 틀리면 뒤가 전부 틀어진다.

- **유형** → `references/lenses.md`에서 렌즈 선택 (사용자 리서치 / 이탈 / 전문가 자문 / 채용 / 회고 / 세일즈 디스커버리)
- **화자** — 몇 명인가. 발화가 뒤섞였는가. 순서가 어긋났는가. **주인공(tone: primary)은 누구인가**
- **결손** — 인사·소개 구간이 녹취에 없는가. 중간에 끊긴 데가 있는가 → `marker`로 명시한다
- **언어** — 원문 언어와 출력 언어. 번역이 필요한가

### 2. 정규화

- 화자 복원 + 시간순 재배열. **발화 내용은 축약하지 않는다**
- 화자가 불확실하면 추측하지 말고 그대로 표시하거나 별도 화자로 둔다
- 번역할 때 증거 가치가 있는 원문 표현은 살린다 (전문용어, 사용자가 고른 단어)
- 맞장구·간투사("네", "아 그렇군요")는 `bc: true` — 지우지 말고 접을 수 있게 둔다

### 3. 챕터 맵

- **3~10장.** 각 챕터에 "중심 긴장" 한 문장이 써져야 한다. 안 써지면 분할이 잘못됐다
- 실제 대화 순서를 크게 벗어나지 않는다. 주제별로 재배열하면 인터뷰의 감이 사라진다
- 각 챕터에 `flow`(누가 화제를 꺼냈나 / 어디서 이어졌나)를 붙인다 — 이게 흐름을 살리는 장치다
- `lede`는 "이 챕터에서 무슨 일이 일어나는가"이지 요약이 아니다

### 4. 주석과 분석

두 층의 밀도 차이가 곧 중요도 신호다. → 상세 규약은 `references/analysis-protocol.md`

- **주석(`note`)** — 관찰 → 해석 → 함의. 맞장구에는 절대 달지 않는다
- **심층분석(`analysis`)** — 전체 챕터의 절반 정도에만. 챕터의 종합 판단이며 제목은 판단문이어야 한다
- **마무리(`closing`)** — 최종 판단 + 대조표(축은 렌즈마다 다름) + follow-up + 전사 처리 고지

### 5. 렌더와 검수

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/check.mjs  <report.json>            # 구조·밀도 검수
node ${CLAUDE_PLUGIN_ROOT}/scripts/render.mjs <report.json> <out.html> # 단일 HTML 출력
```

ERROR는 반드시 고치고, WARN은 판단해서 수용하거나 근거를 갖고 무시한다.

---

## 데이터 계약

`schema/report.schema.json`이 정본. 형태만 요약하면:

```
meta      kicker, title, subtitle, facts[], lede, docTitle
speakers  [{ key, label, tone: primary|muted|alt }]     ← 3인 이상 좌담도 가능
strip     { type: timeline|raw|none, ... }              ← 리드 아래 시각 요소 하나
chapters  [{ id, num, title, lede, flow, marker, turns[], analysis }]
  turns   [{ who, paras[], bc?, note? }]  또는  { raw }
  analysis{ tag, title, blocks[{p|list|verdict|raw}] }
closing   { title, analysis, table, followups, footnote }
```

**인라인 마크업** (모든 텍스트 필드에서):

| 표기 | 결과 | 쓰임 |
|---|---|---|
| `**텍스트**` | 굵게 + 형광 밑줄 | 발화의 핵심 문장. 한 발화에 1~2개 |
| `__텍스트__` | 강조 | 주석 안의 핵심 판단 |
| `«텍스트»` | 인용 톤 | 분석 블록에서 발화를 되짚을 때 |
| `~~텍스트~~` | 흐리게 | 부연·보조 정보 |

**탈출구**: 정해진 컴포넌트로 안 되는 표현은 `{ raw: "<div class=...>" }`.
단 `style=` 인라인 금지, `assets/style.css`에 정의된 class만 쓴다.

---

## 저장 위치

임의로 정하지 말고 현재 작업 폴더의 맥락에 맞춘다.

- 프로젝트에 기존 문서 폴더가 있으면 그 안에. 리서치 산출물 폴더가 따로 있으면 그쪽
- 날짜 프리픽스 관례(`YYMMDD_`)를 쓰는 저장소면 따른다
- `report.json`도 HTML과 같은 위치에 남긴다. **재생성·수정의 원본이다**

---

## Do Not

- 레퍼런스 픽스처의 챕터 이름·대조표 축을 새 인터뷰에 그대로 이식하지 않는다
- 화자가 모호할 때 지어내지 않는다
- 모든 발화에 기계적으로 주석을 달지 않는다
- 사용자가 요청한 기능을 그대로 "문제"로 받아적지 않는다 — 요청 뒤의 JTBD를 찾는다
- 이 인터뷰가 아니어도 성립하는 문장을 분석이라고 쓰지 않는다
- 모순을 지워 서사를 매끄럽게 만들지 않는다
- CSS를 새로 쓰지 않는다. 컴포넌트가 부족하면 `raw`로 처리하거나 사용자에게 알린다

---

## 레퍼런스

`fixtures/sample-note-app.json` — 가상 인터뷰 샘플. 렌더러가 다루는 블록(챕터 lede·flow·marker, turn의 note·backchannel, 챕터 analysis, 종합 표·후속 질문)을 한 번씩 커버한다.
**구조와 밀도의 기준으로만 참고하고, 내용·챕터명·표 축은 베끼지 않는다.**

렌더러나 CSS를 고쳤다면 회귀를 돌린다:

```bash
node ${CLAUDE_PLUGIN_ROOT}/scripts/test.mjs            # golden 비교
node ${CLAUDE_PLUGIN_ROOT}/scripts/test.mjs --update   # 의도한 변경이면 갱신
```
