# Look: paper

회색 배경 위에 흰 종이 카드를 띄우는 ADR/설계기록 테마. 무딘 네이비 액센트(#1f5fa8) + 따뜻한 회색 잉크, 굵은 ink 괘선(masthead·footer), SF Mono 라벨/숫자 + system sans 본문. "사내 엔지니어링 문서" 톤 — 차분하고 격식 있고 정보가 또렷하다. light-modern보다 채도가 낮고 mono보다 따뜻하다.

> 이 look은 `adr` format과 묶여 프리셋 **adr**이 된다. 하지만 직교하므로 `report`·`deck` format에도 그대로 입힐 수 있고(차분한 종이 팔레트), 반대로 `adr` format을 `mono`로 렌더하면 풀 monospace 논문체 ADR이 된다.

## 변수 계약 (CONTRACT)

light-modern·mono와 동일한 변수 키를 전부 채운다(+공통 토큰 `--line-soft`). format shell의 `{{LOOK_VARS}}` 자리에 아래 `:root{...}` 블록을 그대로 주입한다.

```css
:root{
  /* 색 — 표면 */
  --bg:#f3f4f6;          /* 회색 배경(데스크) */
  --surface:#ffffff;     /* 흰 종이 카드 */
  /* 색 — 텍스트 (3단계) */
  --ink:#16181d;
  --ink-soft:#3a3e46;
  --ink-faint:#9aa0a8;
  --line:#dcdee2;
  --line-soft:#ebedf0;   /* 2단계 라인 — meta/표 본문 구분선 */
  /* 색 — 강조 (무딘 네이비) */
  --accent:#1f5fa8;      --accent-soft:#eaf1f9;
  --good:#1f6b3a;        --good-soft:#eaf5ee;
  --warn:#9a5b00;        --warn-soft:#fbf2e3;
  --bad:#a3301f;         --bad-soft:#fbeeec;
  --info:#5b4a9a;        --info-soft:#efecf8;
  /* 코드 */
  --code-bg:#f1f2f4;
  --code-ink:#2c2f36;
  /* 폰트 */
  --font-body:-apple-system,BlinkMacSystemFont,'Segoe UI','Pretendard',Inter,Roboto,sans-serif;
  --font-mono:'SF Mono',ui-monospace,'JetBrains Mono',Menlo,Consolas,monospace;
  /* 형태 — 살짝 둥글게, 그림자 미세 */
  --radius:5px;
  --radius-sm:3px;
  --shadow:0 1px 3px rgba(0,0,0,.05);
  --weight-strong:660;
  --weight-base:400;     /* 본문 기본 굵기 (mono look만 한글 폴백 보정으로 500) */
  /* 강조(em) — adr format은 italic로 렌더(형광 미사용). 타 format용 토큰만 채움 */
  --mark-bg:var(--warn-soft);
  --mark-ink:#7a4a00;
}
```

## 폰트 로딩

웹폰트 불필요(system sans + system mono). shell의 `{{FONT_LINKS}}`는 비워둔다. (Pretendard가 설치돼 있으면 자동 사용, 없으면 system-ui로 폴백 — 한국어 포함.)

## 톤 규칙

- **종이 카드 띄우기**: `--bg`는 회색 데스크, `--surface`는 흰 카드. 카드 외 영역에 콘텐츠를 두지 않는다.
- **굵은 ink 괘선**: masthead와 footer는 `2px solid var(--ink)`로 문서의 위·아래를 못박는다. 섹션 구분은 `1px var(--line)` 윗선.
- **번호 매긴 섹션**: h2 앞에 `<span class="no">1.0</span>` 모노 액센트 번호. 부록은 `A.0`.
- **2단계 라인**: 구조 경계는 `--line`, 표 본문·meta 행 구분은 `--line-soft`. 섞지 말 것.
- **액센트는 한 색**(무딘 네이비). good/warn/bad는 *상태 신호 전용* — callout 변형(decision/constraint)과 status 배지, 채택행(.chosen)에만.
- **em은 italic** — adr format에서 강조는 형광펜이 아니라 기울임. 차분함 유지.
- **차트**(Plotly)가 필요하면: line `var(--accent)`, font `--font-mono` size 11, grid `var(--line)`.

## 금지

- 그라데이션, 이모지, 요란한 아이콘, 무지개 색.
- 그림자 남용(--shadow는 카드 한 장에만, 거의 안 보이게).
- 본문에서 good/warn/bad 색을 장식으로 사용(상태 신호 전용).
- 액센트 네이비를 더 밝거나 채도 높게 바꾸기 — 무딤이 이 look의 정체성.
