'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';

interface FlashcardProps {
  frontText: string;
  backImageUrl: string;
}

export function Flashcard({ frontText, backImageUrl }: FlashcardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  return (
    <div 
      className="relative w-full aspect-square md:aspect-[4/3] max-w-2xl cursor-pointer [perspective:1000px] group mx-auto"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${isFlipped ? '[transform:rotateY(180deg)]' : ''}`}
      >
        {/* Front */}
        <Card className="absolute inset-0 flex flex-col items-center justify-center p-8 md:p-12 [backface-visibility:hidden] bg-white dark:bg-slate-900 border-2 border-brand-100 dark:border-brand-900 shadow-xl overflow-hidden hover:shadow-2xl transition-shadow">
          <div className="absolute inset-0 bg-gradient-to-br from-brand-50/50 to-transparent dark:from-brand-950/20 pointer-events-none" />
          <h3 className="text-3xl md:text-5xl font-bold text-slate-800 dark:text-slate-100 text-center leading-tight break-keep shadow-sm">
            {frontText}
          </h3>
          <div className="absolute bottom-6 flex flex-col items-center gap-2 text-brand-500/70 dark:text-brand-400/60 font-medium text-sm animate-pulse">
            <div>Click to flip</div>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="animate-spin" style={{ animationDuration: '3s' }}><path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/></svg>
          </div>
        </Card>

        {/* Back */}
        <Card className="absolute inset-0 flex flex-col items-center justify-center p-2 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-white dark:bg-slate-900 border-2 border-brand-200 dark:border-brand-800 shadow-xl overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={backImageUrl} 
            alt={frontText}
            className="w-full h-full object-cover rounded-xl"
          />
        </Card>
      </div>
    </div>
  );
}
