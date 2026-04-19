import React from 'react';
import {
  AlertTriangle,
  Lock,
  Clock,
  CheckCircle2,
  FileQuestion,
  RefreshCw,
  Home,
  LogIn,
  ArrowRight,
  LucideIcon,
} from 'lucide-react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface StateProps {
  title: string;
  description: string;
  cta?: {
    label: string;
    href?: string;
    onClick?: () => void;
    icon?: LucideIcon;
  };
  secondaryCta?: {
    label: string;
    href: string;
    icon?: LucideIcon;
  };
}

export function StatusState({
  icon: Icon,
  iconClass = 'text-foreground-muted',
  bgClass = 'bg-muted',
  title,
  description,
  cta,
  secondaryCta,
}: StateProps & { icon: LucideIcon; iconClass?: string; bgClass?: string }) {
  const primaryCls = cn(
    'inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all',
    'bg-primary text-primary-foreground hover:bg-primary-hover shadow-sm active:scale-[0.98]',
  );
  const secondaryCls = cn(
    'inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all',
    'border border-border bg-surface text-foreground hover:bg-muted active:scale-[0.98]',
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className={cn('h-16 w-16 rounded-full flex items-center justify-center mb-6', bgClass)}>
        <Icon className={cn('h-8 w-8', iconClass)} />
      </div>
      <h1 className="text-2xl font-bold tracking-tight mb-2 text-foreground">{title}</h1>
      <p className="text-foreground-muted max-w-md mb-8 leading-relaxed">{description}</p>

      <div className="flex flex-wrap gap-4 justify-center">
        {cta && (
          cta.href ? (
            <Link href={cta.href} className={primaryCls}>
              {cta.icon && <cta.icon className="h-4 w-4" />}
              {cta.label}
            </Link>
          ) : (
            <button onClick={cta.onClick} className={primaryCls}>
              {cta.icon && <cta.icon className="h-4 w-4" />}
              {cta.label}
            </button>
          )
        )}
        {secondaryCta && (
          <Link href={secondaryCta.href} className={secondaryCls}>
            {secondaryCta.icon && <secondaryCta.icon className="h-4 w-4 text-foreground-muted" />}
            {secondaryCta.label}
          </Link>
        )}
      </div>
    </div>
  );
}

export function ErrorState({ reset, description }: { reset?: () => void; description?: string }) {
  return (
    <StatusState
      icon={AlertTriangle}
      iconClass="text-danger"
      bgClass="bg-danger-subtle"
      title="Something went wrong"
      description={description ?? 'An unexpected error occurred. Our team has been notified. You can try again or return to the dashboard.'}
      cta={reset ? { label: 'Try Again', onClick: reset, icon: RefreshCw } : { label: 'Go to Dashboard', href: '/dashboard', icon: Home }}
      secondaryCta={reset ? { label: 'Back to Dashboard', href: '/dashboard', icon: Home } : undefined}
    />
  );
}

export function AccessDeniedState() {
  return (
    <StatusState
      icon={Lock}
      iconClass="text-warning"
      bgClass="bg-warning-subtle"
      title="Access Denied"
      description="You don't have permission to access this page. Please contact your agency administrator if you believe this is an error."
      cta={{ label: 'Return to Dashboard', href: '/dashboard', icon: Home }}
    />
  );
}

export function SessionExpiredState() {
  return (
    <StatusState
      icon={Clock}
      iconClass="text-primary"
      bgClass="bg-primary-subtle"
      title="Session Expired"
      description="Your session has timed out or you have been signed out. Please sign in again to continue working."
      cta={{ label: 'Sign In Again', href: '/login', icon: LogIn }}
    />
  );
}

export function InvalidLinkState({ title, description }: { title?: string; description?: string }) {
  return (
    <StatusState
      icon={FileQuestion}
      iconClass="text-foreground-muted"
      bgClass="bg-surface-sunken"
      title={title ?? 'Invalid or Expired Link'}
      description={description ?? 'This link is no longer valid or has expired. Please request a new link from your agency contact.'}
      secondaryCta={{ label: 'Home', href: '/', icon: Home }}
    />
  );
}

export function SuccessState({
  title,
  description,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <StatusState
      icon={CheckCircle2}
      iconClass="text-success"
      bgClass="bg-success-subtle"
      title={title}
      description={description}
      cta={ctaLabel && ctaHref ? { label: ctaLabel, href: ctaHref, icon: ArrowRight } : undefined}
    />
  );
}
