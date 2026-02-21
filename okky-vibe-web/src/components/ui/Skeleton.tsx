import React from 'react';

export const Skeleton = ({ className = '', ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-foreground/5 dark:bg-white/10 ${className}`}
      {...props}
    />
  );
};
