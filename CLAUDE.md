# CLAUDE.md — VisualLang 프로젝트 지침

## 프로젝트 개요

**VisualLang** — 그림으로 배우는 언어 학습 서비스
OKKY 제1회 바이브코딩 해커톤 참가작.

사용자가 입력한 다국어 문장을 LLM이 시각적 의미 단위(VSU)로 분해하고, 각 단위에 생성형 이미지를 매칭하여 플래시카드 형태로 제공하는 언어 학습 앱.

---

## 기술 스택

| 항목 | 버전/도구 |
|------|-----------|
| Framework | Next.js 16.1.6 (App Router, Turbopack) |
| Runtime | React 19.2.3 |
| Language | TypeScript 5 (strict mode) |
| Styling | Tailwind CSS 4 |
| Font | Inter, Outfit (next/font/google) |
| Linter | ESLint 9 |
| Package Manager | npm |

---

## 프로젝트 구조

```
okky-vibe/
├── okky-vibe-web/          # Next.js 앱
│   ├── src/
│   │   └── app/            # App Router
│   │       ├── layout.tsx  # 루트 레이아웃
│   │       ├── page.tsx    # 홈 페이지
│   │       └── globals.css # 글로벌 스타일
│   ├── public/
│   ├── next.config.ts
│   ├── tsconfig.json       # @/* → ./src/* alias
│   └── package.json
├── CLAUDE.md               # 이 파일
├── AGENTS.md               # AI 에이전트 지침
├── PRD.md                  # 제품 요구사항 문서
├── SPEC.md                 # 기능 명세서 (작업마다 업데이트)
├── ADR.md                  # 설계/아키텍처 결정 기록 (작업마다 업데이트)
├── ROADMAP.md              # 로드맵
└── okky-guide/             # 해커톤 가이드라인
```

---

## 개발 명령어

```bash
# 프로젝트 루트: okky-vibe-web/
npm run dev        # 개발 서버 (http://localhost:3000)
npm run build      # 프로덕션 빌드
npm run start      # 프로덕션 서버
npm run lint       # ESLint 검사
```

---

## 코딩 규칙

### TypeScript
- `strict: true` — any 타입 사용 금지, unknown 사용
- 컴포넌트 props는 반드시 interface로 정의
- type-only import 사용: `import type { Foo } from '@/types'`
- import alias: `@/` → `src/`

### Next.js App Router
- Server Components를 기본으로 사용 (interactivity 없으면 'use client' 불필요)
- 클라이언트 컴포넌트는 `'use client'` 명시
- 데이터 패칭은 Server Component에서 async/await로 처리
- 로딩: `loading.tsx`, 에러: `error.tsx` 활용

### 스타일링
- Tailwind CSS 4 유틸리티 클래스 사용
- 조건부 클래스는 `cn()` 유틸리티 활용
- 다크모드: `dark:` prefix

### 컴포넌트
- named export 사용 (`export function Foo`)
- 파일명은 PascalCase (컴포넌트), camelCase (유틸리티)

---

## Git 커밋 규칙 (Vibe Coding Rule)

```
<type>(<scope>): <subject>

Why:
- <변경 배경/문제>

What:
- <핵심 변경 사항>

Verify:
- npm run lint
- npm run build

Refs:
- #<이슈번호 또는 링크>
```

**타입**: `feat` | `fix` | `docs` | `refactor` | `test` | `chore` | `ci`

- 작업의 변경점마다 커밋 수행
- main 브랜치에 직접 커밋 또는 feature 브랜치 후 --no-ff 머지

---

## 해커톤 필수 지침

작업마다 아래 두 문서를 업데이트해야 합니다.

- **`SPEC.md`** — 결정된 기능적 요구사항 명세
- **`ADR.md`** — 설계/아키텍처/기술 결정 기록

해커톤 관련 정보:
- 가이드: `okky-guide/01-guide.md`
- 공정성 가이드: https://vibecoding.okky.kr/docs/fairness-guide
- 행동강령: https://vibecoding.okky.kr/docs/code-of-conduct

---

## 핵심 기능 (PRD 요약)

1. **원스텝 파이프라인** — LLM으로 문장을 VSU 단위로 분해 → 병렬 이미지 생성 (Promise.all)
2. **캐러셀 플래시카드** — 이미지 + 텍스트 스와이프 UI
3. **다국어 감지** — 영어, 일본어, 스페인어 등 자동 감지
4. **SSE 스트리밍** — 첫 VSU 완성 즉시 첫 이미지 요청으로 레이턴시 최소화
5. **Graceful Degradation** — 이미지 생성 실패 시 플레이스홀더로 대체
