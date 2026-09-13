---
name: release-checklist
description: >
  main으로 향하는 PR을 열거나 머지하기 전에 release:* 라벨을 확인/부여하는 스킬.
  이 저장소는 release:major / release:minor / release:patch / release:skip 라벨이
  없으면 release-label-check.yml이 CI를 막아 main에 머지할 수 없다.
  Trigger on: "main에 올려줘", "main으로 PR 열어줘", "릴리즈 PR", "머지해도 돼?",
  "release 라벨", "배포해도 돼?", "이거 릴리즈 되나".
tools: bash
---

# Release Checklist

`main` PR은 `release:*` 라벨이 정확히 1개 있어야 머지 가능하다 (`.github/workflows/release-label-check.yml`).
라벨이 없거나 2개 이상이면 CI가 실패한다.

---

## Step 1. 대상 PR과 base 브랜치 확인

인자로 PR 번호를 받았으면 그것을 쓰고, 없으면 현재 브랜치의 열린 PR을 찾는다.
**PR이 없을 때 `gh pr view`를 그냥 호출하면 에러로 끝나므로** 먼저 존재 여부를 확인한다.

```bash
PR=$(gh pr list --head "$(git branch --show-current)" --state open --json number --jq '.[0].number')

if [ -z "$PR" ]; then
  echo "이 브랜치에 열린 PR이 없습니다."
  # 이미 머지된 PR인지도 확인해 본다 (머지 후 "머지해도 돼?"라고 묻는 경우가 있다)
  gh pr list --head "$(git branch --show-current)" --state merged --limit 3 \
    --json number,title,mergedAt,baseRefName
  exit 0
fi

gh pr view "$PR" --json number,baseRefName,labels,state,mergeable
```

- 열린 PR이 없으면: PR을 먼저 만들어야 한다고 안내하고 종료 (`pr-gen` 스킬 안내).
  이미 머지된 PR만 있으면 "이미 머지됨"을 알려주고 종료.
- `baseRefName`이 `main`이 아니면 이 스킬은 필요 없다. 안내만 하고 종료.
  (`dev`로 가는 PR은 라벨이 필요 없다)
- `baseRefName`이 `main`이면 Step 2로.

## Step 2. 현재 release 라벨 확인

`labels` 중 `release:` 접두사가 붙은 것을 센다.

| 상태       | 대응                                                                         |
| ---------- | ---------------------------------------------------------------------------- |
| 정확히 1개 | 이미 조건 충족. 어떤 라벨인지 알려주고 종료                                  |
| 0개        | Step 3로 — 라벨 선택 도움                                                    |
| 2개 이상   | 사용자에게 어떤 라벨을 남길지 물어보고, 나머지는 `gh pr edit --remove-label` |

## Step 3. 라벨 선택 기준

diff와 커밋 로그를 보고 판단 기준을 제시한다 (최종 선택은 사용자에게 확인받는다):

- **major**: breaking change, 기존 API/스토어 구조를 바꿔 하위 호환 깨짐
- **minor**: 새 기능 추가 (기존 동작은 그대로)
- **patch**: 버그 수정, 스타일/문서/CI 등 기능 변화 없는 작지 않은 변경
- **skip**: 프로덕션에 배포될 필요 없는 변경 (문서, CI 설정, 테스트 전용 코드 등)

```bash
git log ${BASE:-origin/main}..HEAD --oneline
gh pr diff
```

## Step 4. 라벨 부여

```bash
gh pr edit "$PR" --add-label "release:<major|minor|patch|skip>"
```

라벨이 저장소에 없으면 먼저 생성한다. 색상은 실제 hex 값을 넣어야 한다
(`<hex>` 플레이스홀더를 그대로 쓰면 실패):

```bash
gh label create "release:major" --color B60205 --description "하위 호환이 깨지는 변경" 2>/dev/null
gh label create "release:minor" --color 0E8A16 --description "기능 추가" 2>/dev/null
gh label create "release:patch" --color FBCA04 --description "버그 수정 등" 2>/dev/null
gh label create "release:skip"  --color BFDADC --description "릴리즈 생성 안 함" 2>/dev/null
```

라벨을 2개 이상 붙인 경우 나머지를 제거한다:

```bash
gh pr edit "$PR" --remove-label "release:<지울 라벨>"
```

## Step 5. 안내

라벨을 붙인 뒤, 다음을 사용자에게 알린다:

- `release:skip`이 아니면: 머지 즉시 semver 태그가 생성되고 GitHub Release가 자동으로 만들어짐 (`release.yml`)
- 머지 직후 **Vercel이 이 커밋을 자동 배포**하므로, 머지 = 프로덕션 반영이라는 것을 확인시킨다
- 라벨 없이 머지를 시도하면 `release-label-check.yml`이 실패해 머지 버튼 자체가 막힌다는 것도 필요하면 언급
