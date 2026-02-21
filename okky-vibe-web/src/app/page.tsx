'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

interface VSUResult {
  text: string;
  imageUrl: string;
}

export default function Home() {
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VSUResult[]>([]);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsLoading(true);
    setError('');
    setResults([]);

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
        <div className="w-full max-w-6xl mt-16 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between border-b border-foreground/10 pb-4">
             <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-300">
               시각화 결과
             </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
               // Skeletons while loading
               Array.from({ length: 3 }).map((_, i) => (
                <Card key={i} className="flex flex-col gap-4">
                  <Skeleton className="aspect-square w-full rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[80%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                </Card>
              ))
            ) : (
              // Actual results
              results.map((result, i) => (
                <Card key={i} className="flex flex-col gap-4 overflow-hidden group">
                  <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={result.imageUrl} 
                      alt={result.text}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1 text-slate-900 dark:text-white">{result.text}</h3>
                    <p className="text-foreground/60 text-sm font-medium">Concept Block {i + 1}</p>
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
