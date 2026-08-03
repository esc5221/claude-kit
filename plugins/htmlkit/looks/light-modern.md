# Look: light-modern

라이트 모던 테마. 발표 덱·narrative 리포트용. Inter 본문 + JetBrains Mono 코드, 차분한 인디고 액센트, 미세한 카드 그림자와 둥근 모서리. "디자인 좋다"는 인상을 주되 Claude AI slop(과한 그라데이션·이모지·요란한 카드)은 금지.

## 변수 계약 (CONTRACT)

모든 look은 아래 변수 전부를 채운다. format shell과 blocks는 이 변수만 참조한다. format shell의 `{{LOOK_VARS}}` 자리에 아래 `:root{...}` 블록을 그대로 주입한다.

```css
:root{
  /* 색 — 표면 */
  --bg:#fbfbfa;
  --surface:#ffffff;
  /* 색 — 텍스트 */
  --ink:#1a1a1a;
  --ink-soft:#52525b;
  --ink-faint:#8b8b94;
  --line:#e7e7e4;
  --line-soft:#f0f0ed;   /* 2단계 라인 — 표 본문/meta 구분선 (adr format용) */
  /* 색 — 강조 */
  --accent:#2f6df0;
  --accent-soft:#eef3ff;
  --good:#1f9d6b;        --good-soft:#e9f7f1;
  --warn:#c98a14;        --warn-soft:#fdf4e3;
  --bad:#d6486a;         --bad-soft:#fdeef2;
  --info:#8358e0;        --info-soft:#f1ecfd;
  /* 코드 */
  --code-bg:#f4f4f2;
  --code-ink:#b13a6d;
  /* 폰트 */
  --font-body:'Inter',-apple-system,system-ui,sans-serif;
  --font-mono:'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,monospace;
  /* 형태 */
  --radius:14px;
  --radius-sm:6px;
  --shadow:0 1px 2px rgba(0,0,0,.03);
  --weight-strong:700;
  --weight-base:400;     /* 본문 기본 굵기 (mono look만 한글 폴백 보정으로 500) */
  /* 강조(em) 표기 — 형광펜 느낌 */
  --mark-bg:var(--warn-soft);
  --mark-ink:#8a5d05;
}
```

## 폰트 로딩

`<head>`에 추가 (shell이 `{{FONT_LINKS}}` 자리에 주입):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

## 톤 규칙

- **여백을 넉넉히**. 슬라이드는 `74px 86px`, 리포트 섹션 간 `40px+`.
- **좌측 정렬** 기본. 표지·섹션 디바이더만 세로 가운데 정렬 허용.
- **액센트는 한 색**(--accent). good/warn/bad/info는 *상태 신호 전용* — 본문 장식에 쓰지 말 것.
- **켜다리(kicker)**: 모노 대문자 + 짧은 액센트 라인으로 섹션 라벨.
- **섹션 디바이더**는 풀블리드 컬러 배경(accent/good/dark)으로 호흡을 준다. 덱에서 PART 전환에 사용.
- **차트**(Plotly)가 필요하면: line `var(--accent)`, font `--font-mono` size 11, grid `var(--line)`.

## 금지

- 그라데이션 텍스트, 무지개 색, 이모지, 요란한 아이콘.
- 그림자 남용(--shadow는 거의 안 보일 만큼 미세하게 고정).
- 본문에서 good/warn/bad 색을 장식으로 사용.
