'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { QUOTES } from '@/data/quotes';

interface Bubble {
  id: string;
  text: string;
  left: number; // 0-100%
  duration: number; // seconds
  scale: number;
}

interface FloatingBubblesProps {
  onSelect: (text: string) => void;
}

export function FloatingBubbles({ onSelect }: FloatingBubblesProps) {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const nextIdRef = useRef(0);

  const spawnBubble = useCallback(() => {
    const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    const isLeft = Math.random() > 0.5;
    const sideMargin = 5; // minimum margin from edge (was 2)
    const centerAvoid = 35; // avoid center 70% (35% from each side of center)
    
    // Calculate left position:
    // Left: 5% + random(0~10%) -> 5~15%
    // Right: 100% - 5% - random(0~10%) -> 85~95%
    const randomOffset = Math.random() * (50 - centerAvoid - sideMargin); 
    const left = isLeft 
      ? sideMargin + randomOffset 
      : 100 - sideMargin - randomOffset;

    const newBubble: Bubble = {
      id: `bubble-${nextIdRef.current++}`,
      text: randomQuote.text,
      left: left,
      duration: Math.random() * 10 + 15, // 15-25s
      scale: Math.random() * 0.3 + 0.85, // 0.85 - 1.15
    };

    setBubbles((prev) => [...prev, newBubble]);

    // Remove bubble after animation (roughly duration)
    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== newBubble.id));
    }, newBubble.duration * 1000);
  }, []);

  useEffect(() => {
    // Initial spawn
    spawnBubble();
    
    const interval = setInterval(() => {
      if (document.hidden) return; // Don't spawn when tab is hidden
      spawnBubble();
    }, 2500); // Every 2.5 seconds

    return () => clearInterval(interval);
  }, [spawnBubble]);

  const handleBubbleClick = (id: string, text: string) => {
    // Immediate removal for "pop" effect (can add animation later)
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    onSelect(text);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute bottom-[-100px] pointer-events-auto cursor-pointer animate-bubble hover:z-[60]"
          style={{
            left: `${bubble.left}%`,
            animationDuration: `${bubble.duration}s`,
            transform: `scale(${bubble.scale})`,
          }}
          onClick={() => handleBubbleClick(bubble.id, bubble.text)}
        >
          <div className="bg-white/40 dark:bg-slate-800/40 backdrop-blur-md border border-white/30 dark:border-white/10 px-6 py-3 rounded-full text-slate-700 dark:text-slate-200 shadow-sm hover:shadow-md hover:bg-white/60 dark:hover:bg-slate-700/60 transition-all duration-300 max-w-xs text-center text-sm font-medium select-none">
            {bubble.text}
          </div>
        </div>
      ))}
    </div>
  );
}
