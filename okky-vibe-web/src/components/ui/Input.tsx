import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', icon, ...props }, ref) => {
    return (
      <div className="relative w-full group">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 transition-colors group-focus-within:text-brand-500">
            {icon}
          </div>
        )}
        <input
          ref={ref}
          className={`flex h-14 w-full rounded-2xl border border-white/20 bg-white/40 dark:bg-black/20 px-6 py-2 text-base shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)] backdrop-blur-xl transition-all duration-300 placeholder:text-foreground/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:border-transparent ${icon ? 'pl-12' : ''} ${className}`}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';
