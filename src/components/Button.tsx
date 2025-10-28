import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-heading font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed button-glow active:scale-95';
    
    const variants = {
      primary: 'bg-secondary hover:bg-secondary/90 text-secondary-foreground hover:shadow-lg hover:scale-105 hover:shadow-secondary/25',
      secondary: 'bg-accent hover:bg-accent/90 text-accent-foreground hover:glow-neon hover:scale-105',
      ghost: 'bg-transparent hover:bg-secondary/20 text-foreground hover:scale-105 border border-transparent hover:border-secondary/30',
      outline: 'bg-secondary/10 border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground hover:scale-105 hover:shadow-lg',
      danger: 'bg-destructive hover:bg-destructive/90 text-destructive-foreground hover:shadow-lg hover:scale-105 hover:shadow-destructive/25'
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
