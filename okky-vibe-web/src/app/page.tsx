'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { Flashcard } from '@/components/ui/Flashcard';

interface VSUResult {
  text: string;
  imageUrl: string;
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VSUResult[]>([]);
  const [error, setError] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');
    setResults([]);
    setCurrentCardIndex(0);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate images');
      }

      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-start flex-grow py-12 md:py-20 px-4">
      <div className="w-full text-center space-y-6 max-w-3xl glass p-8 md:p-12 rounded-3xl animate-float">
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

        <div className="pt-8 w-full max-w-xl mx-auto">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-brand-400 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative flex items-center bg-white dark:bg-slate-900 rounded-2xl p-2 ring-1 ring-slate-200 dark:ring-slate-800 shadow-xl">
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="어떤 문장을 그림으로 배워볼까요?" 
                className="w-full bg-transparent px-4 py-3 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
                disabled={isLoading}
              />
              <button 
                type="submit"
                className="bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 px-6 rounded-xl transition-colors shadow-md disabled:opacity-50 whitespace-nowrap flex items-center justify-center min-w-[100px]"
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? (
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                   </svg>
                ) : (
                  "생성"
                )}
              </button>
            </div>
          </form>
          {error && (
            <p className="text-sm text-red-500 mt-4 font-medium animate-in fade-in slide-in-from-bottom-2">
              {error}
            </p>
          )}
        </div>
      </div>

      {/* Results Section */}
      {(isLoading || results.length > 0) && (
        <div className="w-full max-w-4xl mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 mx-auto">
          <div className="flex items-center justify-between border-b border-foreground/10 pb-4 px-4 sm:px-0">
             <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-300">
               시각화 결과
             </h2>
             {results.length > 0 && !isLoading && (
               <div className="text-sm font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
                 {currentCardIndex + 1} / {results.length}
               </div>
             )}
          </div>
          
          <div className="relative px-4 sm:px-12 pb-12">
            {isLoading ? (
               <Card className="flex flex-col gap-4 aspect-square md:aspect-[4/3] w-full max-w-2xl mx-auto items-center justify-center p-8 bg-white dark:bg-slate-900 border-2 border-brand-100 dark:border-brand-900 shadow-xl">
                 <Skeleton className="w-[80%] h-12 rounded-xl mb-8" />
                 <Skeleton className="w-[60%] h-8 rounded-xl" />
                 <div className="absolute inset-x-0 bottom-8 flex justify-center">
                   <Skeleton className="w-10 h-10 rounded-full" />
                 </div>
               </Card>
            ) : results.length > 0 ? (
               <div className="relative flex items-center justify-center group">
                 {/* Prev Button */}
                 {results.length > 1 && (
                   <button 
                     onClick={() => setCurrentCardIndex(prev => Math.max(0, prev - 1))}
                     disabled={currentCardIndex === 0}
                     className="absolute left-0 z-10 p-3 lg:p-4 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-[0_0_20px_rgba(0,0,0,0.1)] text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 -translate-x-2 sm:-translate-x-6 lg:-translate-x-12 backdrop-blur-sm focus:outline-none hover:scale-110 active:scale-95"
                     aria-label="Previous card"
                   >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                   </button>
                 )}
                 
                 <div className="w-full transition-all duration-300 relative z-0">
                   <Flashcard 
                     frontText={results[currentCardIndex].text}
                     backImageUrl={results[currentCardIndex].imageUrl}
                   />
                 </div>

                 {/* Next Button */}
                 {results.length > 1 && (
                   <button 
                     onClick={() => setCurrentCardIndex(prev => Math.min(results.length - 1, prev + 1))}
                     disabled={currentCardIndex === results.length - 1}
                     className="absolute right-0 z-10 p-3 lg:p-4 rounded-full bg-white/90 dark:bg-slate-800/90 shadow-[0_0_20px_rgba(0,0,0,0.1)] text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 disabled:opacity-0 disabled:pointer-events-none transition-all duration-300 translate-x-2 sm:translate-x-6 lg:translate-x-12 backdrop-blur-sm focus:outline-none hover:scale-110 active:scale-95"
                     aria-label="Next card"
                   >
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                   </button>
                 )}
               </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
