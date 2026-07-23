# CLAUDE.md — AI 어시스턴트 협업 규칙

이 파일은 Claude, Cursor 등 AI 도구가 이 레포에서 작업할 때 반드시 따라야 하는 규칙을 정의합니다.
코드를 생성하기 전에 이 파일을 먼저 읽으세요.

---

## AI Behavioral Guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:

- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:

- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:

- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:

- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:

```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

## AI가 하면 안 되는 것

- 신규 코드에 `any` 타입 사용 금지 → `unknown` 또는 정확한 타입 사용 (기존 코드에 `any`가 다수 남아있으나 신규 작성분부터 지킬 것)
- `useEffect`로 데이터 패칭 금지 → `react-query`(`useQuery`/`useMutation`) 사용
- `React.FC` 타입 사용 금지 → 명시적 props 타입 + function declaration/화살표 함수 (현재 컨벤션 그대로 유지, 이미 `React.FC` 미사용)
- `src/` 외부에 파일 생성 금지 (루트 설정 파일 제외)
- PR 설명 없이 새 의존성 추가 금지
- `console.log` commit 금지 → `console.warn` / `console.error`만 허용
- `tsconfig.json`의 `paths` alias와 `next.config.js`의 webpack alias 중 한쪽만 수정 금지 → 두 파일 항상 동기화
- `next.config.js`의 이미지 `domains` 목록 임의 삭제 금지 (S3/CloudFront 캐시 전략과 연결되어 있음)

---

## 프로젝트 개요

- **스택**: Next.js 12.2.2 (Pages Router) + TypeScript 4.9.4
- **스타일링**: styled-components v5 + styled-reset
- **전역 상태**: Zustand (Recoil v0.7에서 마이그레이션 중 — 신규 코드는 Zustand, 기존 `src/utils/state.ts`의 Recoil atom은 점진적으로 이전)
- **서버 상태**: TanStack Query(react-query) v3 + axios (커스텀 `authAxios` 인터셉터)
- **CMS**: Notion (`@notionhq/client`, `notion-client`, `react-notion`)
- **테스트**: 미도입 (테스트 프레임워크 없음 — 신규 도입 시 별도 논의 필요)
- **배포**: AWS Amplify (Managed Hosting, Git 기반 CI/CD)

---

## 폴더 구조

```
src/
├── pages/               # Pages Router
├── apis/                # API 함수 + axios 인스턴스 (도메인별: account, attendance, gallery, mypage, project, session, signUp)
├── components/          # 공용 UI / 기능별 컴포넌트 (기능 단위 하위 폴더)
├── hooks/               # 공용 훅
├── lib/                 # gtag 등 외부 연동 설정
├── store/                # Zustand 스토어 (신규 클라이언트 전역 상태)
├── utils/               # 공용 유틸 + 기존 Recoil atom (state.ts, 마이그레이션 전까지 유지), localStorage 래퍼
├── styles/              # 전역 스타일
├── types/               # 전역 타입 정의
└── test/                # 실험/임시 코드 (GA.tsx 등 — 프로덕션 사용 여부 확인 필요, 신규 코드 추가 지양)
```

**import alias**: 단일 `@/`가 아니라 **기능별로 세분화된 alias**를 사용합니다: `@common`, `@home`, `@gallery`, `@project`, `@session`, `@signup`, `@login`, `@attendance`, `@mypage`, `@archiving`, `@pages`, `@styles`, `@utils`, `@@types`, `@image`.
alias는 `tsconfig.json`의 `paths`와 `next.config.js`의 webpack `resolve.alias` **두 곳에 동일하게** 등록되어 있으므로, alias를 추가/변경할 때는 두 파일을 함께 수정합니다.

```ts
import LayoutDefault from '@common/layout/LayoutDefault';
import { token } from '@utils/state';
import { getAttendanceList } from '../../apis/attendance';
```

---

## 코드 스타일 규칙

- 컴포넌트는 화살표 함수 또는 `function` 선언 모두 사용 중 (`React.FC`는 사용하지 않음) — 신규 컴포넌트는 명시적 props 타입 선언 필수
- default export: 이 프로젝트는 페이지뿐 아니라 일반 컴포넌트에도 default export를 광범위하게 사용 중인 기존 컨벤션 → 유지
- `console.log` 커밋 금지 (`console.warn`/`console.error`만 허용, 현재 2곳 잔존 — 리팩토링 시 정리 대상)
- Prettier 설정 그대로 따름: `singleQuote`, `semi`, `trailingComma: all`, `printWidth: 120`, `arrowParens: always`
- ESLint: `next/core-web-vitals` 기준

---

## 상태 관리 원칙

### Zustand — 클라이언트/전역 상태

- Recoil에서 마이그레이션 중. 신규 클라이언트 전역 상태는 `src/store/`에 Zustand 스토어로 작성
- 기존 `src/utils/state.ts`의 Recoil atom은 마이그레이션 전까지 유지 — 해당 코드를 건드리지 않는 PR에서는 그대로 두고, 손대는 경우에 한해 Zustand로 옮기는 것을 고려
- 서버에서 받아온 데이터를 그대로 스토어에 저장하지 않음 — 로그인 토큰, UI 플래그 등 클라이언트 상태만

### react-query — 서버 상태

- `src/apis/[도메인].ts`에 axios 기반 API 함수를 정의하고, 컴포넌트/훅에서 `useQuery`/`useMutation`으로 호출
- 인증이 필요한 요청은 `getAuthAxios(token)` 사용 (401 응답 시 refresh token으로 자동 재발급)
- ⚠️ 알려진 이슈: `src/apis/authAxios.ts`의 401 재시도 로직이 원본 HTTP 메서드를 무시하고 항상 GET으로 재요청하는 버그가 있음 — 이 파일을 건드릴 때는 함께 수정할 것
- `src/hooks/`에는 순수 클라이언트 훅만 두고, 서버 상태 훅은 `src/apis/` 옆에 두거나 컴포넌트 내부에 정의

---

## 스타일링 규칙 (styled-components)

- 전역 리셋은 `styled-reset` 사용, 전역 스타일은 `src/styles/`에 위치
- 컴포넌트 파일이 길어지면 (예: `MainSection.tsx`처럼 styled 정의가 절반 이상을 차지하는 경우) 스타일을 별도 파일로 분리 고려
- SVG는 `@svgr/webpack`으로 컴포넌트화해서 사용, mp4 등 미디어 파일은 `file-loader` 사용

---

## 커밋 컨벤션

기존 로그는 `fix:`, `FEAT:`, `DESIGN:` 등 대소문자가 혼재되어 있습니다. 앞으로는 Conventional Commits 소문자 규칙으로 통일합니다.

형식: `<type>: <subject>` (scope는 선택)

| type     | 사용 시점                                    |
| -------- | -------------------------------------------- |
| feat     | 새로운 기능                                  |
| fix      | 버그 수정                                    |
| chore    | 빌드, 툴링, 패키지 (프로덕션 코드 변경 없음) |
| refactor | 동작 변경 없는 리팩터링                      |
| style    | 포매팅/디자인 변경                           |
| docs     | 문서 변경                                    |
| ci       | CI/CD 파이프라인 변경                        |

예시:

```
fix: 출석 생성 대상 인원을 14기 회장단으로 수정
feat: 아카이빙 갤러리 탭 노출
chore: sharp 0.31.3으로 업그레이드
```

---

## 브랜치 네이밍

```
main              ← 프로덕션 (main push/merge 시 Amplify 자동 빌드+배포)
dev               ← 스테이징 / 통합
feat/#123         ← 기능 브랜치 (123 = GitHub 이슈 번호)
fix/설명          ← 버그 수정 브랜치 (이슈 번호 없이 설명형으로도 사용, 예: fix/attendance)
refactor/설명     ← 리팩토링 브랜치 (예: refactor/token)
```

`dev`에 작업 PR을 올리고, `main`에는 릴리즈 시 병합합니다.

---

## PR 규칙

- PR 작성 시 `.github/PULL_REQUEST_TEMPLATE.md` 형식 준수: 한 줄 요약 → 상세(바꾼거 / 같이 상의할 만한 것) → 작업리스트
- 새 의존성을 추가하는 PR은 설명에 사유를 반드시 명시

---

## 테스트

- 현재 테스트 프레임워크가 도입되어 있지 않습니다. 테스트를 추가하게 될 경우 이 문서에 컨벤션(파일 위치, 러너, 커버리지 목표)을 먼저 정의하고 진행합니다.
