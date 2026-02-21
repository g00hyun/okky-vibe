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
