---
name: schematic
description: 시스템 로직·아키텍처·제품 전략을 Bold-Outline Flat 스타일(순백 배경·Material 원색·검정 4px 직각 외곽선·단일 크기 굵은 고딕)의 단일 HTML 도식으로 그린다. 스윔레인 파이프라인, threshold-shift 바, 플로우차트, 시퀀스, 매트릭스, 한 장 빽빽한 전략 슬라이드까지. '도식으로 그려줘', 'schematic', '스키매틱', '아키텍처 그림', 'bold-outline flat', '파이프라인 그림으로' 언급 시 사용. (글이 주인공인 발표덱·리포트는 htmlkit)
---

# schematic

시스템·전략을 **개념도(schematic)** 로 그리는 스킬. 데이터 차트가 아니라 관계·구조·경계를 전달하는 그림이다. 산출물은 외부 의존성 없는 단일 HTML.

**스타일 정체성 — Bold-Outline Flat**: 순백 배경 + 고채도 평면색 + 검정 4px 직각 외곽선 + 전 요소 동일 크기의 굵은 고딕 + 그림자·그라데이션·라운딩 0. 손그림(xkcd)풍이 아니라 정밀한 디지털 벡터다. **위계는 크기가 아니라 위치와 색으로만 표현한다** — 이게 이 스타일의 문법이다.

## 프로세스 (순서 고정)

1. **대상을 실제로 읽는다.** 코드면 grep/Read로 심볼·흐름·계약을 확인. 추측으로 박스를 그리지 않는다 — 도식의 신뢰는 내용 정확성에서 나온다.
2. **무엇이 본질인지 판단한다.** 단계 나열이 본질인지(파이프라인), 경계 이동인지(threshold bar), 불변식인지(플로우차트/매트릭스), 전략 프레이밍인지(dense slide). 아래 선택표 참조.
3. **`references/style.md`의 토큰·공통 CSS를 그대로 쓴다.** 색·선굵기 임의 변경 금지.
4. **좌표를 설계하고 그린다.** CSS로 되는 것은 CSS로(`recipes-css.md`), 박스+화살표가 필요하면 SVG로(`recipes-svg.md` — 좌표계 관례 필수 숙지).
5. **스크린샷 검증 루프 (필수).** playwright로 full-page 캡처 → Read로 직접 눈으로 확인 → 겹침·오버플로 수정 → 재캡처. 한 번에 끝나는 경우가 없다. 통상 2~3회.
6. 저장 위치는 작업 중인 프로젝트 안 맥락에 맞는 곳(예: docs/). Artifact 금지, 경로 보고. (사용자 전역 규칙)

## 도식 유형 선택

```
전달하려는 것                         도식                        레시피
──────────────────────────────────────────────────────────────────────────
경계·비중이 어떻게 변했나/나뉘나        segmented bar (이전/이후 2단)  css §bar
축 위에 요소들이 어떻게 퍼져 있나       스펙트럼 bar + 축 라벨         css §bar
단계별 시간·비용은 어디에 쓰이나        비례폭 segmented bar          css §bar
커버리지·갭                           bar + 흰 empty 세그먼트        css §bar
실행 주체가 여럿인 파이프라인/시스템     가로 스윔레인 + 박스·화살표     svg §swimlane
분기·판정 로직, 파생 규칙, 불변식       플로우차트(다이아몬드)          svg §flowchart
시간축 위 주체 간 메시지               시퀀스 다이어그램              svg §sequence
선형 처리 단계 (주체 하나)             체브론 파이프라인              svg §chevron
항목 × 속성 비교                      매트릭스(검정 gap 그리드)       css §matrix
포함 관계·배포 구조                    중첩 컨테이너 + 칩             css §nest
계층 구조                             레이어 스택                   css §stack
두 축 위의 선택지                      2×2 사분면                   css §quad
전환·감소                             퍼널                         css §funnel
전략 프레이밍·비유 (발표 1장)           dense slide (패널 그리드)      css §slide
```

복합 문서는 "메인 도식 1개(시스템 전체) + 보조 섹션 3~5개(불변식·비교·시간분포)" 구성이 정석. 섹션마다 `section-tag`로 번호를 붙인다.

## 판단 규칙 (스타일 문법 — 어기면 이 스타일이 아니다)

- **위계는 위치로.** 제목이든 본문이든 같은 급의 텍스트는 같은 크기·같은 웨이트. 강조하고 싶으면 크게 만들지 말고 자리를 옮기거나 색을 바꾼다.
- **빈 영역(미커버·아직 없음)은 회색/빗금이 아니라 흰 채움 + 검정 외곽선.**
- **색은 의미론이다.** 문서 안에서 일관되게: 빨강=무거운 처리(LLM 등), 노랑=가벼운 모델·서비스 호출, 초록=결정적(순수함수·DB), 보라=큐·과금·격리, 파랑=입출력·게이트, 흰색=저장소·경계·빈 것. 범례를 항상 붙인다.
- **선은 두 급뿐.** 흐름(conn, 4px) vs 신호·부가(wire, 2.5px). 점선 금지 — 예외는 발자국 같은 의도적 도트뿐.
- **색 영역 사이 구분선은 기본 없음.** 같은 바 안 세그먼트는 맞닿는다. 구분이 필요하면 검정 `--outline` 선 하나.
- **라벨을 경계선 위에 얹지 않는다.** 레인 경계 y, 박스 모서리, 화살표 선과 텍스트가 겹치면 검증 루프에서 반드시 잡는다. (가장 흔한 결함)
- **세로로 길어지면 접는다.** 단계가 15개를 넘는 세로 흐름은 가로 스윔레인 × 블록 적층(PASS 1 위, PASS 2 아래)으로 재배치. 목표 종횡비는 화면 한두 화면.
- 하드코딩 색 금지 — 반드시 `var(--*)`. 텍스트 파싱·변환이 아니라 그림이므로 이모지·아이콘·장식 금지.

## 검증 루프 스니펫

```python
# playwright 설치된 프로젝트가 아니어도 캐시된 chromium headless shell로 동작
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
    try:
        b = p.chromium.launch()
    except Exception:
        import glob
        shell = sorted(glob.glob('/Users/*/Library/Caches/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-mac-arm64/chrome-headless-shell'))[-1]
        b = p.chromium.launch(executable_path=shell)
    pg = b.new_page(viewport={'width': 1920, 'height': 1000})
    pg.goto('file:///abs/path/out.html')
    h = pg.evaluate('document.body.scrollHeight')
    pg.screenshot(path='shot.png', full_page=True)   # 길면 clip으로 나눠 찍기
    b.close()
```

캡처를 Read로 직접 보고: ① 박스가 레인/패널 경계를 넘는가 ② 라벨이 선에 걸치는가 ③ 텍스트가 박스를 넘치는가(sub 텍스트가 단골) ④ 화살표가 박스를 관통하는가 — 이 4개는 매번 검사한다.

## references

경로는 모두 `${CLAUDE_PLUGIN_ROOT}` 기준이다.

- `references/style.md` — 토큰 정본 + 공통 CSS/SVG 클래스 (복사해서 시작)
- `references/recipes-css.md` — CSS만으로 되는 도식 부품
- `references/recipes-svg.md` — SVG 좌표계 관례 + 스윔레인·플로우차트·시퀀스·체브론
- `references/examples/gallery.html` — **완성 예시. 처음 쓸 때 반드시 한 번 열어 구조를 본다.**
  13가지 도식 유형 카탈로그: bar 6변형 · 레이어 스택 · 2×2 사분면 · 타임라인 · 아키텍처 · 플로우차트 · 시퀀스 · 체브론 · 퍼널 · 매트릭스 · 중첩 컨테이너.
  복합 문서(메인 도식 1개 + 보조 섹션 3~5개)를 만들 때는 여기서 유형을 골라 조합한다.

## 다른 스킬과의 경계

```
schematic    시스템 도식·아키텍처·전략 프레이밍 그림 (이 스킬)
htmlkit      글이 주인공인 발표 덱·리포트·ADR (format×look 조립). 같은 마켓플레이스.
dataviz      실측 데이터 차트를 그릴 때의 색·형태 규칙 (별도 스킬)
```

도식은 관계·구조·경계를 전달한다. 실측 수치를 보여주는 게 목적이면 차트지 도식이 아니다.
