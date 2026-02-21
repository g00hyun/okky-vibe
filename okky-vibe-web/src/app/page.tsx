export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-grow py-20">
      <div className="text-center space-y-6 max-w-3xl glass p-12 rounded-3xl animate-float">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50/50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-300 text-sm font-medium tracking-wide mb-4">
          ✨ MVP Ready
        </div>
        <h1 className="text-5xl md:text-7xl font-bold font-[family-name:var(--font-outfit)] tracking-tight">
          Visual<span className="text-gradient">Lang</span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl mx-auto">
          복잡한 문장도 한 컷의 그림으로.<br/>
          텍스트를 <strong className="font-semibold text-foreground">시각적 의미 단위(VSU)</strong>로 변환하여<br className="hidden sm:block" />
          직관적이고 오래 기억되는 언어 학습을 경험하세요.
        </p>

        <div className="pt-8 w-full max-w-md mx-auto">
          {/* Placeholder for the input interface mentioned in PRD */}
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl p-2 ring-1 ring-slate-200 dark:ring-slate-800 shadow-xl">
              <input 
                type="text" 
                placeholder="어떤 문장을 그림으로 배워볼까요?" 
                className="w-full bg-transparent px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                disabled
              />
              <button 
                className="bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-md disabled:opacity-50"
                disabled
              >
                생성
              </button>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-4">
            (UI 프론트데스크 - 백엔드 파이프라인 연결 예정)
          </p>
        </div>
      </div>
    </div>
  );
}
