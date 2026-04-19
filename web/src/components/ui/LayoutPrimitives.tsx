import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

// ── Card ─────────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'raised' | 'flat' | 'bordered';
}

const cardVariants: Record<string, string> = {
  default:  'bg-surface border border-border shadow-[var(--shadow-sm)]',
  raised:   'bg-surface border border-border shadow-[var(--shadow-md)]',
  flat:     'bg-surface-sunken border border-transparent',
  bordered: 'bg-surface border-2 border-border',
};

export const Card = ({ children, className = '', variant = 'default' }: CardProps) => (
  <div className={cn('rounded-xl', cardVariants[variant], className)}>
    {children}
  </div>
);

export const CardHeader = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex flex-col space-y-1.5 p-6', className)}>{children}</div>
);

export const CardTitle = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <h3 className={cn('text-base font-semibold leading-none tracking-tight text-foreground', className)}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <p className={cn('text-sm text-foreground-muted leading-relaxed', className)}>{children}</p>
);

export const CardContent = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={cn('p-6 pt-0', className)}>{children}</div>
);

export const CardFooter = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={cn('flex items-center p-6 pt-0 gap-3', className)}>{children}</div>
);

// ── Layout ────────────────────────────────────────────────────────────────────

export const Container = ({ children, className = '' }: { children: ReactNode; className?: string }) => (
  <div className={cn('mx-auto w-full max-w-screen-xl px-4 md:px-6 lg:px-8', className)}>
    {children}
  </div>
);

interface SectionProps {
  children: ReactNode;
  title?: string;
  description?: string;
  className?: string;
}

export const Section = ({ children, title, description, className = '' }: SectionProps) => (
  <section className={cn('py-6', className)}>
    {(title || description) && (
      <div className="mb-5">
        {title && (
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
        )}
        {description && (
          <p className="mt-1 text-sm text-foreground-muted">{description}</p>
        )}
      </div>
    )}
    {children}
  </section>
);

// ── Divider ───────────────────────────────────────────────────────────────────

export const Divider = ({ className = '' }: { className?: string }) => (
  <hr className={cn('border-border', className)} />
);
