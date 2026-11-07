# Look: press

흰 지면 위에 검정 잉크로 찍은 인쇄물 톤. 웹폰트 없이 시스템 sans 본문 + 시스템 mono 코드, 각진 모서리(radius 6), 그리고 **채도 높은 원색 상태 신호**. light-modern과 지면(배경·잉크·코드배경)은 거의 같지만 모서리를 깎고 상태색을 진하게 올려 "제품 페이지"가 아니라 "문서"로 읽히게 한다.

> 이 look은 `survey` format과 묶여 프리셋 **survey**가 된다. 직교하므로 `report`·`adr`·`deck` 에도 그대로 입힐 수 있다. 다만 카드 표면(`--surface`)을 거의 쓰지 않는 톤이라, 카드를 크게 쓰는 `adr` format과 묶으면 light-modern·paper 쪽이 더 어울린다.

## light-modern 과의 관계

지면은 같고 강도만 다르다. 델타는 넷뿐이다.

```
                light-modern      press          왜
--radius        14px              6px            항목이 수십 개 반복될 때 둥근 모서리가 시끄럽다
--good          #1f9d6b 민트      #15803d        상태 뱃지가 파스텔이면 훑을 때 구분이 안 선다
--bad           #d6486a 핑크      #b91c1c
--font-body     Inter 웹폰트      system         한글은 어차피 폴백된다. 로딩을 없앤다
```

## 변수 계약 (CONTRACT)

light-modern·mono·paper·fieldnote와 동일한 변수 키를 전부 채운다. format shell의 `{{LOOK_VARS}}` 자리에 아래 `:root{...}` 블록을 그대로 주입한다.

```css
:root{
  /* 색 — 표면 */
  --bg:#fbfaf8;          /* 종이. light-modern보다 미세하게 따뜻하다 */
  --surface:#ffffff;
  /* 색 — 텍스트 */
  --ink:#1a1a1a;
  --ink-soft:#4a4a4a;    /* light-modern(#52525b)보다 중성 — 파란기를 뺀다 */
  --ink-faint:#767676;
  --line:#e2e0dc;        /* 경계선도 warm */
  --line-soft:#eeece8;
  /* 색 — 강조 (진한 원색. 파스텔 금지) */
  --accent:#1d4ed8;      --accent-soft:#eff6ff;
  --good:#15803d;        --good-soft:#dcfce7;
  --warn:#92400e;        --warn-soft:#fef3c7;
  --bad:#b91c1c;         --bad-soft:#fee2e2;
  --info:#4338ca;        --info-soft:#e0e7ff;
  /* 코드 */
  --code-bg:#f4f3f0;
  --code-ink:#1a1a1a;    /* 인라인 code 를 물들이지 않는다 — 본문과 같은 잉크 */
  /* 폰트 — 웹폰트 없음 */
  --font-body:-apple-system,BlinkMacSystemFont,system-ui,'Pretendard','Apple SD Gothic Neo',Segoe UI,sans-serif;
  --font-mono:ui-monospace,SFMono-Regular,'SF Mono',Menlo,Consolas,monospace;
  /* 형태 — 각지게, 그림자 없이 */
  --radius:6px;
  --radius-sm:4px;
  --shadow:none;
  --weight-strong:650;
  --weight-base:400;
  /* 강조(em) */
  --mark-bg:var(--warn-soft);
  --mark-ink:#7a3c07;
}
```

## 폰트 로딩

웹폰트 불필요. shell의 `{{FONT_LINKS}}`는 **비워둔다**. (Pretendard가 설치돼 있으면 자동 사용, 없으면 system-ui로 폴백 — 한국어 포함.)

## 톤 규칙

- **카드를 쓰지 않는다.** 배경 위에 바로 글이 앉는다. `--shadow:none`이고 `--surface`는 표 헤더 같은 데만 쓴다. 지면을 넓게 쓰는 문서용이다.
- **섹션 경계는 검정 굵은 괘선.** 연회색 실선이 아니라 `2px solid var(--ink)`. 계보가 뚝뚝 끊겨야 훑을 수 있다.
- **본문은 검정.** `p{color:var(--ink)}`. 회색 본문(`--ink-soft`)은 부제·출처·설명 한 줄에만 쓴다. 본문까지 회색이면 문서 전체가 물러난다.
- **상태색은 신호 전용.** good/warn/bad/info를 장식으로 쓰지 않는다. 뱃지·표의 채택행에만.
- **인라인 `code`를 물들이지 않는다.** `--code-ink`가 본문과 같은 잉크다. 파일명·필드명이 문장 안에 자주 나오는 문서라 색이 붙으면 문장이 얼룩진다.
- **여백은 세로로 넉넉히, 가로로 넓게.** 실측표가 80자를 넘는 일이 잦아 `max-width`를 1080까지 연다.
