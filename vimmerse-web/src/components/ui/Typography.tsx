import React from 'react';
import { cn } from './Button';

interface TypographyProps extends React.HTMLAttributes<HTMLElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'large' | 'small' | 'muted';
  as?: React.ElementType;
}

export function Typography({ className, variant = 'p', as, ...props }: TypographyProps) {
  const Component = as || (['h1', 'h2', 'h3', 'h4', 'p'].includes(variant) ? variant : 'p') as React.ElementType;

  const variants = {
    h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-foreground font-sans",
    h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight transition-colors first:mt-0 text-foreground font-sans",
    h3: "scroll-m-20 text-2xl font-semibold tracking-tight text-foreground font-sans",
    h4: "scroll-m-20 text-xl font-semibold tracking-tight text-foreground font-sans",
    p: "leading-7 [&:not(:first-child)]:mt-6 text-foreground font-sans",
    lead: "text-xl text-muted-foreground font-sans",
    large: "text-lg font-semibold text-foreground font-sans",
    small: "text-sm font-medium leading-none text-foreground font-sans",
    muted: "text-sm text-muted-foreground font-sans",
  };

  return (
    <Component
      className={cn(variants[variant], className)}
      {...props}
    />
  );
}

export function GradientText({ className, children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("text-gradient", className)} {...props}>
      {children}
    </span>
  );
}
