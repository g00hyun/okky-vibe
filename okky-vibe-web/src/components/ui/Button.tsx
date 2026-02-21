import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', fullWidth = false, children, ...props }, ref) => {
    
    const baseStyles = "inline-flex items-center justify-center rounded-2xl font-medium transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer";
    
    const variants = {
      primary: "bg-gradient-to-r from-brand-400 to-purple-500 text-white shadow-lg shadow-brand-400/20 hover:shadow-xl hover:shadow-brand-400/30 hover:-translate-y-0.5 border border-white/20",
      secondary: "glass text-foreground hover:bg-white/10 dark:hover:bg-white/5",
      ghost: "hover:bg-brand-50 dark:hover:bg-white/5 text-foreground"
    };
    
    const sizes = {
      sm: "h-9 px-4 text-sm",
      md: "h-11 px-8 text-base",
      lg: "h-14 px-10 text-lg"
    };

    const widthStyle = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthStyle} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
