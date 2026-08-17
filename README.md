# claude-kit

## 플러그인

```
플러그인         무엇                                              산출물
──────────────── ───────────────────────────────────────────────── ──────────
mantra-protocol  자기강제 프롬프트 프로토콜.                          (프롬프트)
                 협상 불가 원칙 + 현재 목표를 한 줄 만트라로 고정하고
                 매 응답 첫 줄에 복창해 스펙 드리프트를 막는다.
                 원문 프롬프트: plugins/mantra-protocol/prompts/

relay-ko         한국어 산문을 백지에서 쓰지 않는다.                   (프롬프트)
                 일본어·터키어로 먼저 쓴 뒤 그것을 번역해 한국어를 만든다.
                 자유도를 뺏어 AI 문체 회귀를 막는다.
                 번역 규칙: plugins/relay-ko/references/rules.md

review-doc       아무 내용이나 항목별 승인/거절 + 코멘트가 달리는       단일 HTML
                 검토 문서로. localStorage 자동 저장, 결과 마크다운 복사.
                 한국어·영어 UI.

htmlkit          발표 덱 / narrative 리포트 / ADR.                    단일 HTML
                 구조(format) × 디자인(look)을 분리해 같은 블록으로 조립.
                 deck·report·adr × light-modern·mono·paper.

schematic        시스템 로직·아키텍처·전략을 Bold-Outline Flat 도식으로.  단일 HTML
                 스윔레인, 플로우차트, 시퀀스, 매트릭스, 전략 슬라이드.
                 스크린샷 검증 루프에 playwright(chromium).

interview-doc    인터뷰 전사(언어 무관)를 주석과 심층분석이 붙은         단일 HTML
                 리포트로. 대목마다 해설, 챕터마다 종합 판단.
                 렌더러가 Node.js. 외부 패키지 없음.
```

## 설치

```bash
/plugin marketplace add esc5221/claude-kit
/plugin install <name>@lullu
```

설치 후 네임스페이스 없이 `/htmlkit` 처럼 호출된다.

## 개발

심링크하면 마켓플레이스 설치 없이 그 자리에서 로드되고, 편집이 즉시 반영된다.

```bash
git clone https://github.com/esc5221/claude-kit.git
ln -s "$PWD/claude-kit/plugins/htmlkit" ~/.claude/skills/htmlkit
```

```bash
claude plugin validate ./plugins/<name> --strict
node plugins/interview-doc/scripts/test.mjs
```
