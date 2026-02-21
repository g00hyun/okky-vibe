'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';

export default function ComponentShowcase() {
  const [loading, setLoading] = useState(false);

  const handleSimulateLoad = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="min-h-screen p-8 md:p-24 max-w-5xl mx-auto space-y-20 pb-40">
      
      {/* Header section */}
      <div className="space-y-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold font-heading text-gradient tracking-tight">
          Vibe OS System
        </h1>
        <p className="text-foreground/60 text-lg md:text-xl font-light">
          Premium UI components built with Glassmorphism, Fluid Animations, and Refined Gradients
        </p>
      </div>

      {/* Buttons */}
      <section className="space-y-8 animate-float" style={{ animationDuration: '8s' }}>
        <h2 className="text-2xl font-bold border-b border-foreground/10 pb-4 text-brand-600 dark:text-brand-300">
          Buttons (.brand-gradient / .glass)
        </h2>
        <div className="flex flex-wrap gap-6 items-center">
          <Button variant="primary">Primary Action</Button>
          <Button variant="secondary">Secondary Glass</Button>
          <Button variant="ghost">Subtle Ghost</Button>
        </div>
        <div className="flex flex-wrap gap-4 items-center bg-black/5 dark:bg-white/5 p-6 rounded-3xl">
          <Button size="sm">Small Size</Button>
          <Button size="md">Medium Default</Button>
          <Button size="lg">Large Scale</Button>
        </div>
        <div className="w-full max-w-sm">
          <Button variant="primary" fullWidth>Full Width Primary</Button>
        </div>
      </section>

      {/* Inputs */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold border-b border-foreground/10 pb-4 text-brand-600 dark:text-brand-300">
          Inputs & Forms
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground/80 pl-2">Standard Input</label>
            <Input placeholder="Enter something aesthetic..." />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium text-foreground/80 pl-2">Icon Input Focus Ring</label>
            <Input 
              placeholder="Search concepts..." 
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              } 
            />
          </div>
        </div>
      </section>

      {/* Cards */}
      <section className="space-y-8">
        <h2 className="text-2xl font-bold border-b border-foreground/10 pb-4 text-brand-600 dark:text-brand-300">
          Glass Cards & Surfaces
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold mb-3">Beautiful Surface Depth</h3>
              <p className="text-foreground/70 mb-8 leading-relaxed font-light">
                This card leverages the global <code className="bg-black/10 dark:bg-white/10 px-1 py-0.5 rounded text-sm text-brand-500">.glass</code> utility to apply backdrop blur, soft borders, and structural drop shadows.
              </p>
            </div>
            <Button variant="secondary" fullWidth>Explore Features</Button>
          </Card>
          
          <Card className="flex flex-col items-center justify-center text-center p-12 transition-transform hover:-translate-y-2">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-brand-400 to-purple-500 mb-6 shadow-xl shadow-brand-400/20 flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            </div>
            <h3 className="text-2xl font-bold font-heading mb-2">Engaging Interactions</h3>
            <p className="text-foreground/70 font-light">
              Combined with fluid micro-animations for an organic feel.
            </p>
          </Card>
        </div>
      </section>

      {/* Skeletons */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-foreground/10 pb-4 gap-4">
          <h2 className="text-2xl font-bold text-brand-600 dark:text-brand-300">Loading States (Skeletons)</h2>
          <Button size="sm" variant="secondary" onClick={handleSimulateLoad}>
            {loading ? "Loading..." : "Simulate Next Data Fetch"}
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="flex flex-col gap-4">
              {loading ? (
                <>
                  <Skeleton className="h-40 w-full rounded-2xl" />
                  <div className="space-y-2">
                    <Skeleton className="h-6 w-[80%]" />
                    <Skeleton className="h-4 w-[60%]" />
                  </div>
                </>
              ) : (
                <>
                  <div className="h-40 w-full bg-gradient-to-br from-brand-100 to-purple-100 dark:from-brand-900/50 dark:to-purple-900/50 rounded-2xl flex items-center justify-center border border-white/10 text-brand-500 font-medium">
                    Generated VSU
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">Concept Block {i}</h3>
                    <p className="text-foreground/60 text-sm">Translating syntax visually into meaning...</p>
                  </div>
                </>
              )}
            </Card>
          ))}
        </div>
      </section>

    </div>
  );
}
