---
name: pr-gen
description: >
  Use PROACTIVELY whenever the user wants to create or open a Pull Request.
  Analyzes git diff and commit history, fills in the repository's PR template,
  and runs `gh pr create` to open the PR automatically.
  Trigger on any of: "PR 만들어줘", "PR 올려줘", "PR 생성", "pull request 만들어",
  "pr create", "pr gen", "PR 올리고 싶어", "PR 작성해줘".
  Even if the user only says "작업 끝났어" or "이제 머지하면 돼?" after a coding session,
  proactively suggest and offer to run this skill.
tools: bash
---

# PR Generator

Git diff를 분석하고 저장소의 PR 템플릿을 채워 `gh pr create`로 PR을 자동 생성하는 스킬.
**PR 제목과 본문은 반드시 한글로 작성한다. 영문 설명 금지.**

---

## Step 1. 컨텍스트 수집

```bash
# 현재 브랜치 및 원격 정보
git branch --show-current
git remote -v

# 베이스 브랜치 감지 (develop > dev > main > master 우선순위)
# `git branch -r`를 grep하면 첫 줄의 `origin/HEAD -> origin/main` 심볼릭 참조가 잡혀
# BASE에 "HEAD -> origin/main" 같은 값이 들어간다. ref 존재 여부로 직접 확인할 것.
BASE=""
for b in develop dev main master; do
  if git show-ref --verify --quiet "refs/remotes/origin/$b"; then BASE="$b"; break; fi
done
echo "Base branch: ${BASE:?베이스 브랜치를 찾지 못했습니다. git fetch 후 다시 시도하세요}"

# 로컬 base ref가 오래됐을 수 있으므로 항상 최신 원격을 기준으로 비교한다
git fetch origin "$BASE" --quiet
REF="refs/remotes/origin/$BASE"

# 새 커밋 목록 (머지 커밋 제외본도 함께 확인)
git log ${REF}..HEAD --oneline
git log ${REF}..HEAD --oneline --no-merges

# 변경 파일 목록과 규모
git diff ${REF}...HEAD --name-status
git diff ${REF}...HEAD --shortstat

# 전체 diff (규모가 크면 --stat으로 먼저 훑고 필요한 파일만 확인)
git diff ${REF}...HEAD

# 스테이징/워킹트리 상태
git status --short
```

> **주의 사항**
>
> - 새 커밋이 없으면 "베이스 브랜치 대비 새 커밋이 없습니다"라고 안내하고 종료.
>   (로컬 base가 낡아 커밋이 많아 보일 수 있으므로 반드시 `origin/$BASE` 기준으로 셀 것)
> - 커밋되지 않은 변경이 있으면 "먼저 커밋 또는 스태시 후 다시 실행해 주세요"라고 안내.

---

## Step 2. PR 템플릿 탐색

아래 순서로 템플릿을 찾는다. 발견 즉시 내용을 읽고 Step 3으로 이동.

```bash
cat .github/PULL_REQUEST_TEMPLATE.md   2>/dev/null
cat .github/pull_request_template.md   2>/dev/null
cat docs/pull_request_template.md      2>/dev/null
ls  .github/PULL_REQUEST_TEMPLATE/     2>/dev/null
```

- **템플릿 있음** → 모든 섹션과 체크박스를 그대로 유지하며 내용만 채운다.
- **템플릿 없음** → 아래 기본 템플릿을 사용한다.

```markdown
## 📝 변경 사항 요약

## 🖼️ 스크린샷 (UI 변경 시)
```

---

## Step 3. PR 제목 생성

**반드시 한글**로 작성. 먼저 기존 PR 패턴을 확인해 명명 규칙을 파악한다.

```bash
gh pr list --state all --limit 20 --json title --jq '.[].title'
```

### 형식

```
type(scope): 한글 설명
```

| type       | 용도             |
| ---------- | ---------------- |
| `feat`     | 새 기능          |
| `fix`      | 버그 수정        |
| `refactor` | 리팩토링         |
| `chore`    | 빌드·설정·의존성 |
| `docs`     | 문서             |
| `style`    | 코드 스타일      |
| `test`     | 테스트           |
| `perf`     | 성능 개선        |

**올바른 예**

```
feat(frontend): 번역 이력 처리 상태 복구 기능 구현
fix: 텍스트 분리 HTML 에디터 색상 오류 수정
refactor(ai): 파이프라인 폴더 구조 개편 및 테스트 추가
```

**잘못된 예 (영문 설명 금지)**

```
feat(auth): add OAuth2 login with Google provider  ❌
```

---

## Step 4. PR 본문 작성

템플릿의 각 섹션을 채운다.

| 섹션               | 작성 내용                                         |
| ------------------ | ------------------------------------------------- |
| Summary / Overview | 변경 이유와 내용 2–3문장                          |
| Changes            | 파일명 포함 변경 사항 bullet list (동사로 시작)   |
| Testing            | 검증 방법, 테스트 시나리오                        |
| Screenshots        | UI 변경 없으면 "N/A", 있으면 사용자에게 첨부 요청 |
| Checklist          | 실제 변경에 해당하는 항목만 체크                  |

**Breaking change** 가 있으면 반드시 `💥 BREAKING CHANGE:` 접두사를 붙인다.
이슈가 연관되어 있으면 `Closes #<번호>` 또는 `Refs #<번호>`를 포함한다.

---

## Step 5. 브랜치 푸시 및 PR 생성

> **중요**: 본문은 셸을 거치지 않고 **파일 쓰기 도구(Write)로 직접 파일에 작성**한 뒤
> `--body-file`로 넘긴다. `cat` heredoc은 `bat` alias 환경에서 깨지고, `python3 -c`도
> 본문에 백틱·따옴표·`${}`가 들어가면 셸/파이썬 양쪽에서 이스케이프가 꼬인다.
> PR 본문에는 코드 조각이 자주 들어가므로 파일로 직접 쓰는 방식이 가장 안전하다.
> 저장 위치는 시스템 `/tmp`가 아니라 세션 스크래치패드 디렉터리를 쓴다.

```bash
# 1. 현재 브랜치 푸시 (이미 푸시된 경우 자동 skip)
git push -u origin $(git branch --show-current)

# 2. 본문은 Write 도구로 <스크래치패드>/pr_body.md 에 작성해 둔다 (셸 명령 아님)

# 3. PR 생성 (--body 대신 --body-file 사용)
gh pr create \
  --title "<생성된 PR 제목>" \
  --body-file "<스크래치패드>/pr_body.md" \
  --base "$BASE"
# WIP이면 --draft 추가

# 4. 생성 결과와 본문이 정상 반영됐는지 확인
gh pr view --json number,title,baseRefName,isDraft,changedFiles,additions,deletions
gh pr view --json body -q .body | head -10
```

> **베이스가 `main`이면 여기서 끝내지 말 것.**
> 이 저장소는 `release-label-check.yml`이 `release:*` 라벨 없는 `main` PR의 머지를 막는다.
> PR 생성 직후 `release-checklist` 스킬로 라벨을 붙인다. 라벨이 없으면 CI가 실패해
> 머지 버튼 자체가 비활성화된다.

### 베이스 브랜치 결정 규칙

1. 사용자가 명시한 브랜치 → 최우선 사용
2. `develop` 또는 `dev` 존재 여부 확인
3. 없으면 `main` 또는 `master` 사용

---

## Step 6. 출력 형식

PR 생성 전, 다음 형식으로 미리보기를 출력한다.

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📋 PR Preview
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Title : feat(frontend): 번역 이력 처리 상태 복구 기능 구현
Base  : develop ← feature/restore-translation-status
Draft : No

[본문 미리보기]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 PR을 생성합니다...
```

생성 완료 후:

```
✅ PR이 성공적으로 생성되었습니다!
🔗 <gh 출력 PR URL>
```

---

## 오류 처리

| 상황               | 대응                                          |
| ------------------ | --------------------------------------------- |
| `gh` 미설치        | `brew install gh` 후 `gh auth login` 안내     |
| 미인증             | `gh auth status` 실행 후 인증 요청            |
| 새 커밋 없음       | "베이스 대비 새 커밋이 없습니다" 안내 후 종료 |
| 머지 충돌 감지     | 충돌 해결 후 재시도 요청                      |
| 커밋되지 않은 변경 | 커밋 또는 스태시 후 재시도 요청               |

---

## 추가 지침

- diff만으로 "왜" 변경했는지 불명확하면, PR 생성 전에 한 가지 핵심 질문만 한다.
- `--draft`: 사용자가 "작업 중" 또는 "WIP"를 언급한 경우에만 사용.
- NextJS / TypeScript 변경 시 Server/Client 컴포넌트 경계 변경 여부, 타입 변경 여부를 본문에 명시한다.
