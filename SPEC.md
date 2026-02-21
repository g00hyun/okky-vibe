# SPEC: VisualLang (그림으로 배우는 언어)

## 1. 개요
사용자가 입력한 다국어 텍스트를 LLM을 통해 '시각적 의미 단위(VSU)'로 분할하고, 각 단위에 매칭되는 이미지를 생성하여 플래시카드 캐러셀 형태로 제공하는 언어 학습 서비스.

## 2. 핵심 요구사항 (MVP)
1. **텍스트 입력 인터페이스**: 다국어 입력을 지원하는 메인 프롬프트 창
2. **원스텝 파이프라인 (백엔드)**:
   - 텍스트 입력 수신
   - LLM (Gemini) 호출을 통한 문장 분석 및 VSU(Visual Semantic Unit) 분할
   - 분할된 단위별 이미지 생성 비동기 동시 호출 (병렬 처리)
3. **학습 UI (프론트엔드)**:
   - 비동기 로딩 스켈레톤 UI (생성 진행율 시각화)
   - 텍스트 + 생성된 이미지가 결합된 대형 플래시카드 캐러셀(스와이프) 뷰

## 3. 기술 스택
- **Framework**: Next.js 15+ (App Router)
- **Styling**: Tailwind CSS (또는 사용자 정의 Vanilla CSS 권장)
- **AI Integration**:
  - LLM: Google Gemini API (Text to VSU)
  - Image Gen: Imagen 또는 기타 TTI API
- **Deployment**: Vercel (권장)

## 4. 확장 요구사항 (추후 단계)
- TTS (Text-to-Speech) 연동
- 화풍(스타일) 커스터마이징
- 사용자 단어장 보관함 (DB 연동 필요)
- 인터랙티브 단어 툴팁 (Hover/Click)
- 학습 퀴즈 모드

## 5. 기능 명세: Floating Sentence Bubbles (떠다니는 문장 추천)

### 5.1. 개요 (Overview)
- **목적**: 사용자가 직접 타이핑하지 않아도, 흥미로운 영어 문장을 발견하고 클릭 한 번으로 입력을 완료하여 VisualLang의 핵심 기능(이미지 생성)을 빠르게 경험하게 함.
- **형태**: 화면 하단에서 생성되어 상단으로 자연스럽게 떠오르는 비눗방울 형태의 말풍선 UI.

### 5.2. 사용자 경험 (UX Flow)
1.  **노출**: 앱 접속 시 또는 대기 상태일 때, 화면 하단 영역(Input Bar 위쪽)에서 문장이 담긴 반투명한 말풍선들이 랜덤한 속도와 위치로 솟아오름.
2.  **탐색**: 사용자는 떠오르는 문장들을 구경함 (예: "Time flies like an arrow", "Stay hungry, stay foolish").
3.  **선택**: 마음에 드는 문장 풍선을 클릭/터치.
4.  **반응**:
    - **시각**: 풍선이 '톡' 터지는 애니메이션(Pop effect)과 함께 사라짐.
    - **기능**: 해당 문장이 하단 입력창(Input Field)에 자동으로 **덮어쓰기(Replace)** 됨.

### 5.3. 상세 기능 요구사항 (Functional Requirements)

#### 5.3.1. 문장 추천 데이터 (Sentence Data)
- **데이터 소스**: 내장된 영문 명언/이디엄 데이터셋 (약 30개).
- **데이터 구조**: `{ id: string, text: string, category?: string }`
- **카테고리**: 감성, 비즈니스, 일상 회화, 속담 등.

#### 5.3.2. 애니메이션 로직 (Animation Physics)
- **생성(Spawn)**:
    - 주기: 2~4초 간격으로 랜덤 생성.
    - 위치: 화면 하단(bottom: -50px)의 랜덤 X축(left: 5% ~ 95%).
- **이동(Float)**:
    - Y축: 아래 → 위로 이동 (duration: 10s ~ 20s 랜덤).
    - X축: `Sine` 웨이브 등을 적용하여 좌우로 살짝 흔들리며 올라가는 자연스러운 무빙.
    - 투명도: 올라갈수록 서서히 사라짐(fade-out).
- **소멸(Despawn)**:
    - 클릭 시 즉시 제거.
    - 화면 상단 일정 높이(예: 70vh)를 넘어가거나 애니메이션 종료 시 제거.

#### 5.3.3. 인터랙션 (Interaction)
- **클릭 시 동작**:
    - 즉시 `Pop` 파티클 효과 재생 (Scale 1.2 -> 0 -> Remove).
    - `page.tsx`의 입력 상태(`inputText`)를 해당 문장으로 교체.
    - 입력창에 포커스 이동 (선택 사항).
- **접근성(A11y)**:
    - '동작 줄이기(Reduced Motion)' 설정 시 기능을 끄거나 정적인 리스트로 대체 고려.

### 5.4. 기술 구현 전략 (Tech Strategy)
- **컴포넌트 구조**:
    - `FloatingBubbles.tsx`: 전체 풍선 관리 컨테이너 및 개별 풍선 컴포넌트 포함.
- **상태 관리**:
    - `bubbles[]` state로 화면에 존재하는 풍선 객체 관리.
    - `useEffect` 내에서 `setInterval`로 주기적 생성.
    - `handleBubbleClick(text)` 콜백을 통해 상위 컴포넌트(`page.tsx`)에 텍스트 전달.
- **스타일링**:
    - Tailwind CSS의 `animate-` 유틸리티 또는 커스텀 `@keyframes` 활용.
    - `style` prop을 통해 동적인 위치(`left`)와 속도(`animationDuration`) 제어.
