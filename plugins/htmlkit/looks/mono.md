# Look: mono

monospace 정보밀집 테마. 기술 분석문·데이터 대시보드용(SF Mono, 흰 배경, 각진 모서리, 그림자 없음). 기교 없이 기능 중심. 같은 blocks를 light-modern 대신 이 토큰으로 렌더하면 논문/보고서 룩이 된다.

> deck/report/adr 어느 format에도 monospace 룩을 입힐 수 있다. 데이터 대시보드 전용 스킬이 따로 설치돼 있다면 그쪽을 써도 되고, 없으면 report + mono + `chart-presets/`로 커버된다.

## 변수 계약 (CONTRACT)

light-modern과 동일한 변수 키를 채운다. format shell의 `{{LOOK_VARS}}` 자리에 주입.

```css
:root{
  /* 색 — 표면 */
  --bg:#ffffff;
  --surface:#ffffff;
  /* 색 — 텍스트 */
  --ink:#111111;
  --ink-soft:#35352f;    /* 본문 — 너무 옅으면 mono가 얇아 보임 (특히 한글) */
  --ink-faint:#8a8a83;
  --line:#c4c4be;        /* 보더/구분선 — 옅으면(#e7e7e4) 선이 안 보여 가독성↓ */
  --line-soft:#e2e2dd;   /* 2단계 라인 — 표 본문/meta 구분선 (adr format용) */
  /* 색 — 강조 */
  --accent:#2471a3;      --accent-soft:#eaf2f8;
  --good:#1e8449;        --good-soft:#e8f5ec;
  --warn:#e67e22;        --warn-soft:#fffbeb;
  --bad:#c0392b;         --bad-soft:#fef2f2;
  --info:#8e44ad;        --info-soft:#f5eef8;
  /* 코드 */
  --code-bg:#f5f5f5;
  --code-ink:#c0392b;
  /* 폰트 — body도 mono로 매핑(전체 monospace)
     ★ 한글 글꼴을 반드시 스택에 명시한다. mono 폰트에는 한글 글리프가 없어서
       빼먹으면 한글이 브라우저 기본 폰트로 폴백되고, 12px에서 유독 얇게 보인다. */
  --font-body:'SF Mono','Menlo','Consolas',ui-monospace,'Pretendard','Apple SD Gothic Neo','Malgun Gothic',monospace;
  --font-mono:'SF Mono','Menlo','Consolas',ui-monospace,'Pretendard','Apple SD Gothic Neo','Malgun Gothic',monospace;
  /* 한글 폴백이 얇아 보이는 것을 상쇄 — Medium 굵기로 base를 올린다 */
  --weight-base:500;
  /* 형태 — 각지고 평평하게 */
  --radius:2px;
  --radius-sm:2px;
  --shadow:none;
  --weight-strong:700;
  /* 강조(em) — 옅은 배경만 */
  --mark-bg:var(--warn-soft);
  --mark-ink:#8a5d05;
}
```

## 폰트 로딩

웹폰트 불필요(시스템 monospace). shell의 `{{FONT_LINKS}}`는 비워둔다.

## 톤 규칙

- **monospace 고정**. body까지 모노.
- **max-width**: 리포트 1050px 이하. 절대 full-width 금지.
- **숫자**: `font-variant-numeric: tabular-nums` (blocks의 `.num` 클래스가 처리).
- **제목 한국어 + 차트 axis 영어/숫자**.
- **강조색은 상태 신호 전용** — bad(악화/에러), good(개선), warn(가정/경고), info(변경시점).
- **반투명 영역 강조**가 필요하면 `rgba(192,57,43,0.10)` 처럼 강조색의 10% 알파를 쓴다.
- **섹션 디바이더 풀블리드 컬러는 자제**. mono는 평평함이 미덕 — `§N` 헤딩 + 하단 보더로 구분.

## 금지

- 그라데이션, box-shadow(--shadow:none 고정), border-radius>2px, 배경이미지.
- 이모지, SVG 아이콘, 애니메이션, 탭 UI.
- 화려한 카드 레이아웃. card는 얇은 1px 보더만.
