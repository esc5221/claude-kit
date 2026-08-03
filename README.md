# claude-kit

Claude Code 마켓플레이스. 프롬프트 프로토콜 하나와, 단일 HTML 산출물을 만드는 스킬 넷.

공통점은 **외부 의존성 없이 파일 하나로 끝난다**는 것. 산출물은 `file://`로 열리고, 빌드 단계도 서버도 없다.

## 플러그인

```
플러그인        무엇                                              산출물
────────────── ───────────────────────────────────────────────── ──────────────
mantra-protocol 자기강제 프롬프트 프로토콜.                         (프롬프트)
               협상 불가 원칙 + 현재 목표를 한 줄 만트라로 고정하고
               매 응답 첫 줄에 복창해 스펙 드리프트를 막는다.

review-doc     아무 내용이나 항목별 승인/거절 + 코멘트가 달리는      단일 HTML
               검토 문서로. localStorage 자동 저장, 결과 마크다운 복사.
               한국어·영어 UI.

htmlkit        발표 덱 / narrative 리포트 / ADR.                   단일 HTML
               구조(format) × 디자인(look)을 분리해 같은 블록으로 조립.
               deck·report·adr × light-modern·mono·paper.

schematic      시스템 로직·아키텍처·전략을 Bold-Outline Flat 도식으로. 단일 HTML
               스윔레인, 플로우차트, 시퀀스, 매트릭스, 전략 슬라이드.

interview-doc  인터뷰 전사(언어 무관)를 주석과 심층분석이 붙은        단일 HTML
               리포트로. 대목마다 해설, 챕터마다 종합 판단.
```

## 설치

```bash
/plugin marketplace add esc5221/claude-kit
/plugin install mantra-protocol@lullu
/plugin install review-doc@lullu
/plugin install htmlkit@lullu
/plugin install schematic@lullu
/plugin install interview-doc@lullu
```

원하는 것만 골라 설치하면 된다. 서로 의존하지 않는다.

설치 후 스킬은 네임스페이스 없이 `/mantra-protocol`, `/review-doc`, `/htmlkit`, `/schematic`, `/interview-doc` 로 호출된다.

## 요구사항

대부분 없다. 두 가지 예외:

- **schematic** — 스크린샷 검증 루프에 playwright(chromium)를 쓴다. 없어도 도식은 생성되지만, 겹침·오버플로를 눈으로 잡는 단계가 빠진다. 폴백 경로가 macOS(arm64) 캐시를 가정한다.
- **interview-doc** — 렌더·검수 스크립트가 Node.js를 쓴다. 외부 패키지는 없고 표준 라이브러리만.

## mantra를 다른 도구에서

스킬 개념이 없는 도구(ChatGPT, Gemini, Codex 등)를 위해 원문 프롬프트를 그대로 넣어뒀다.

```
plugins/mantra-protocol/prompts/mantra.ko.md    한국어
plugins/mantra-protocol/prompts/mantra.en.md    영어
plugins/mantra-protocol/prompts/symbolized.md   보조 스니펫
```

## 직접 고쳐 쓰기

플러그인 하나는 디렉토리 하나다. 포크한 뒤 `~/.claude/skills/` 에 심링크하면 마켓플레이스 설치 없이 그 자리에서 로드되고, 편집이 즉시 반영된다.

```bash
git clone https://github.com/esc5221/claude-kit.git
ln -s "$PWD/claude-kit/plugins/htmlkit" ~/.claude/skills/htmlkit
```

`.claude-plugin/plugin.json` 이 있는 폴더는 `htmlkit@skills-dir` 로 자동 로드된다.

## 검증

```bash
claude plugin validate .                      # 마켓플레이스 매니페스트
claude plugin validate ./plugins/<name> --strict
node plugins/interview-doc/scripts/test.mjs   # golden 회귀
```

## 라이선스

MIT
