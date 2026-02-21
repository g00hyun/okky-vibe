# ADR (Architecture Decision Record): VisualLang

## 1. 프론트엔드 프레임워크 선정: Next.js (App Router)
- **결정**: Next.js 15+ App Router를 기반으로 프로젝트 구성
- **이유**: `next-best-practices` 스킬을 활용하여 최신 React Server Components (RSC) 패러다임과 App Router의 장점(서버 사이드 렌더링, 라우팅 최적화)을 극대화하기 위함.

## 2. API 통신 및 비동기 처리 구조 (원스텝 파이프라인)
- **결정**: LLM 분석 결과(VSU 배열)를 수신한 후 프론트엔드/백엔드 브릿지에서 `Promise.all`을 사용하여 병렬로 이미지 생성 API를 호출.
- **이유**: 사용자의 대기 시간(Latency) 최소화가 핵심 가치이므로, 직렬 처리가 아닌 병렬 비동기 처리를 강제함. (PRD 5. 아키텍처 및 퍼포먼스 고려사항 반영)
- **대안 고려**: 완전한 SSE(Server-Sent Events) 스트리밍을 통한 순차적 렌더링도 추후 고려 가능하나, MVP 단계에서는 `Promise.all` 기반의 병렬 레이턴시 최적화 적용.

## 3. UI/UX 및 스타일링
- **결정**: '바이브 코딩'의 풍부한 미적(Aesthetics) 감각을 살리기 위해, 다이나믹한 애니메이션과 세련된 Skeletion UI를 포함한 프리미엄 디자인 설계.
- **이유**: 프롬프트 제출 후 이미지가 생성되기까지 필연적으로 발생하는 지연 시간을 사용자 경험으로 상쇄하기 위함.
