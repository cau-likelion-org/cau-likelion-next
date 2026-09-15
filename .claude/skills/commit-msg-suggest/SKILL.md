---
name: commit-msg-suggest
description: git 변경사항을 분석해 커밋 메시지를 추천. Trigger on '커밋 메시지', 'commit message', 'commit 추천', '커밋 추천', 'commit 메시지 추천'.
category: Code Quality
argument-hint: '[scope]  # 선택: staged(기본값) | all | HEAD~N'
disable-model-invocation: true
allowed-tools: Bash(git *)
---

# Commit Message Suggest

## When to use

- 코드 수정 후 커밋 메시지를 어떻게 쓸지 모를 때
- 변경 내용을 요약한 커밋 메시지 후보가 필요할 때
- `/commit-msg-suggest` 또는 `/commit-msg-suggest all` 형태로 호출할 때

## Rules

### 0. commitlint 규칙 (필수 — 위반하면 커밋 자체가 거부된다)

이 저장소는 husky `commit-msg` 훅에서 `@commitlint/config-conventional`을 강제한다.
아래를 어긴 후보는 절대 추천하지 말 것.

- **제목을 대문자로 시작하지 않는다.** `CI`, `API`, `PR`, `SEO` 같은 약어를 제목 맨 앞에 두면
  `subject-case` 규칙에 걸려 거부된다.
  - `docs: CI 체크 가이드 추가` ✗ → `docs: 릴리즈 CI 체크 가이드 추가` ✓
  - `fix: API 응답 처리 수정` ✗ → `fix: 프로필 API 응답 처리 수정` ✓
- **제목 끝에 마침표를 찍지 않는다.** (`subject-full-stop`)
- **type은 반드시 소문자**이고, 허용값은 다음 11개뿐이다.
  `build` `chore` `ci` `docs` `feat` `fix` `perf` `refactor` `revert` `style` `test`
  - `hotfix`, `update`, `add` 등은 거부된다.
- **헤더(type + 제목) 전체 100자 이내.** 가독성을 위해 50자 안쪽을 권장한다.
- 본문을 붙일 경우 제목과 본문 사이에 **빈 줄 한 줄**이 필요하다. (`body-leading-blank`)

확신이 서지 않으면 추천 전에 직접 검증한다:

```bash
printf '%s' "docs: 릴리즈 절차 가이드 추가" | npx --no -- commitlint
```

### 1. 변경사항 수집

- 인자가 없거나 `staged`이면: `git diff --staged` 실행
- 인자가 `all`이면: `git diff HEAD` 실행
- 인자가 `HEAD~N` 형태이면: `git diff HEAD~N HEAD` 실행
- 아무 변경도 없으면: "staged 변경사항이 없습니다. `git add` 후 다시 시도하거나 `/commit-msg-suggest all`을 사용하세요." 안내 후 종료

### 2. 변경 분석

- 수정된 파일 목록과 각 파일의 변경 성격(신규/수정/삭제) 파악
- 변경 규모가 크면 주요 변경 파일에 집중

### 3. 커밋 메시지 추천 (1~3개)

각 후보는 아래 형식으로 출력:

이 저장소의 커밋은 **모두 한국어**다. 영문 메시지는 추천하지 않는다.

```
**[후보 N]**
<type>: <한 줄 요약 (한국어, 50자 이내 권장 / 100자 초과 금지)>

이유: 이 메시지를 추천하는 이유
```

type 선택 기준 (commitlint 허용값 11개 전부):

| type       | 사용 시점                                    |
| ---------- | -------------------------------------------- |
| `feat`     | 새 기능, 새 파일 추가                        |
| `fix`      | 버그 수정                                    |
| `docs`     | 문서, 주석, README 변경                      |
| `refactor` | 기능 변경 없는 코드 구조 개선                |
| `perf`     | 동작은 같고 성능만 개선                      |
| `style`    | 포매팅, 공백 등 코드 의미 없는 변경          |
| `test`     | 테스트 추가/수정                             |
| `chore`    | 의존성, 설정 파일 등 프로덕션 코드 변경 없음 |
| `build`    | 빌드 시스템·번들러 설정 변경                 |
| `ci`       | GitHub Actions 등 CI 파이프라인 변경         |
| `revert`   | 이전 커밋 되돌리기                           |

### 4. 출력 예시

```
## 커밋 메시지 추천

**[후보 1]** ← 추천
feat: 커밋 메시지 추천 스킬 추가

이유: 새로운 SKILL.md 파일이 추가됐고, 기능 자체가 신규이므로 feat이 적합

**[후보 2]**
chore: skills 디렉터리에 commit-msg-suggest 추가

이유: 스킬 파일 추가를 단순 설정/도구 추가로 볼 경우

---
직접 커밋하려면: `git commit -m "feat: 커밋 메시지 추천 스킬 추가"`
```

## Gotchas

- `git diff --staged`가 비어있을 경우 staged가 아닌 unstaged 변경이 있을 수 있음 → `all` 옵션 안내
- 변경 파일이 10개 이상이면 스코프 분리 커밋을 권장하는 메모 추가
- binary 파일(이미지 등) 변경은 diff에 나타나지 않으므로 파일 목록(`git status`) 기준으로 보완
- 커밋은 **사용자가 직접** 한다. 이 스킬은 메시지를 제안하는 데서 멈추고 `git commit`을 실행하지 않는다
- pre-commit 훅(`lint-staged`)이 prettier·eslint로 스테이징 파일을 자동 수정하므로,
  커밋 후 diff가 제안 시점과 미세하게 달라질 수 있다
