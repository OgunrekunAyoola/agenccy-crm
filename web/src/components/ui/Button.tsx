import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'success';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const base = [
      'inline-flex items-center justify-center gap-2 font-medium rounded-lg',
      'transition-all duration-150 ease-out',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      'disabled:pointer-events-none disabled:opacity-50',
      'active:scale-[0.98]',
    ].join(' ');

    const variants: Record<string, string> = {
      primary:     'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm hover:shadow-[var(--shadow-primary)] border border-transparent',
      secondary:   'bg-muted text-foreground hover:bg-border border border-transparent',
      outline:     'border border-border bg-surface text-foreground hover:bg-muted hover:border-border-strong',
      ghost:       'text-foreground-muted hover:bg-muted hover:text-foreground border border-transparent',
      destructive: 'bg-danger text-danger-foreground hover:bg-[var(--danger-hover)] shadow-sm border border-transparent',
      success:     'bg-success text-success-foreground hover:bg-[var(--success-hover)] shadow-sm border border-transparent',
    };

    const sizes: Record<string, string> = {
      sm:   'h-8 px-3 text-xs',
      md:   'h-9 px-4 text-sm',
      lg:   'h-11 px-6 text-base',
      icon: 'h-9 w-9 p-0',
    };

    return (
      <button
        ref={ref}
        className={cn(base, variants[variant], sizes[size], className)}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading || undefined}
        aria-disabled={isLoading || props.disabled || undefined}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 animate-spin shrink-0" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
