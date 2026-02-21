# VisualLang: Current State & Development Roadmap

## 📍 현재 구현 상태 (Current State)

지금까지 우리는 프로젝트의 아주 단단한 **"기초 뼈대(Foundation)"**를 완성했습니다. 현재 구현된 내역은 다음과 같습니다:

1. **프레임워크 및 설정**: `Next.js 15+ (App Router)`, `TypeScript`, `Tailwind CSS v4`, `ESLint`가 세팅된 `okky-vibe-web/` 앱 워크스페이스 구축.
2. **코드 퀄리티**: Vercel의 `next-best-practices` 모범 사례 가이드를 따르도록 설정됨.
3. **디자인 시스템 (Global CSS)**: Glassmorphism(유리 질감) 유틸리티(`.glass`), Modern Gradient 텍스트 설정, 다크모드 대응 등 '바이브 코딩'을 위한 프리미엄 Vibe CSS 기반 완성 (`globals.css`).
4. **글로벌 폰트**: `Inter`(본문용)와 `Outfit`(제목용) 폰트를 Next.js 방식(`next/font`)으로 최적화하여 렌더링하도록 `layout.tsx` 구성.
5. **메인 랜딩 스켈레톤 (MVP UI)**: `page.tsx`에 문장을 입력할 수 있는 (현재는 비활성화된) 검색창 UI와 타이틀 화면 배치.

---

## 🚀 앞으로의 구현 절차 (Roadmap)

`SPEC.md`와 `PRD.md`에 명시된 핵심 가치를 달성하기 위해 다음 순서로 개발을 진행해야 합니다.

### 단계 1: UI 벤치마킹 및 퍼블리싱 (Frontend)
원하시는 사이트를 벤치마킹하여 화면 개편을 진행합니다. (상세 내용은 아래 **벤치마킹 절차** 참고)
- 메인 입력창 활성화 및 상태 관리 (`useState`, `useActionState` 등 활용)
- 생성 진행율을 보여줄 **Skeleton UI / 로딩 애니메이션** 컴포넌트 개발
- **대형 플래시카드 캐러셀(Swipe 뷰)** UI 퍼블리싱 (이미지와 텍스트가 예쁘게 담길 카드 프레임)

### 단계 2: 백엔드 API 라우트 구축 (Backend Bridge)
- `src/app/api/generate/route.ts` 등에 API 라우트 핸들러 생성.
- **LLM 파이프라인**: 
  - (가) Gemini API를 호출하여 입력된 원문을 N개의 "의미 단위(VSU)" 프롬프트 배열로 쪼개기.
  - (나) `Promise.all`을 사용하여 N개의 단위별 이미지 생성(Imagen 등) API를 병렬(동시) 호출.
- 응답 데이터(`[ {text: "...", imageUrl: "..."} ]`) 구조화 후 프론트엔드 반환.

### 단계 3: 프론트-백엔드 연동 및 지연 최적화 (Integration)
- 사용자가 "생성" 버튼 클릭 시 API 호출.
- 응답을 받아 플래시카드 캐러셀에 데이터 바인딩.
- 에러 핸들링(생성 실패 시 기본 플레이스홀더 표시 등) 처리.

---

## 🎨 원하는 사이트 벤치마킹 절차 (How to Benchmark)

바이브 코딩 스타일로 타겟 사이트의 느낌을 가져오려면 다음 절차를 따릅니다.

1. **레퍼런스 제시**: 
   - 벤치마킹하고 싶은 웹사이트의 **URL**이나, 핵심 키워드(예: "Toss 앱처럼 둥글고 부드럽게", "Apple 홈처럼 블랙 앤 화이트의 미니멀리즘")를 저(AI)에게 알려주세요.
2. **분석 및 디자인 토큰 추출**: 
   - 제가 해당 URL(혹은 레퍼런스 이미지/키워드)을 바탕으로 해당 사이트의 메인 컬러, 둥글기(Border-radius) 느낌, 여백(Spacing), 폰트 스타일, 애니메이션(트랜지션 듀레이션 등)을 분석하여 Tailwind CSS 변수로 변환합니다.
3. **Draft (UI 시안) 생성**: 
   - 제가 `generate_image` 툴을 사용해 우리가 만들 플래시카드나 메인 화면의 예상 UI 렌더링 시안을 직접 그려서 보여드릴 수 있습니다.
4. **tailwind 컴포넌트화**: 
   - 시안이 마음에 드시면 그 느낌 그대로 컴포넌트(`Card.tsx`, `Hero.tsx`)들을 Tailwind 클래스를 입혀 바로 코드로 짜드립니다.

**💡 지금 바로 시작하려면?** 
> *"플래시카드 캐러셀 부분은 `[벤치마킹할 사이트 주소]` 느낌으로 둥글고 입체감 있게 만들어줘!"* 라고 지시해 주시면 됩니다!
