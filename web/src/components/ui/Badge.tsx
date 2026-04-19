import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'default'
  | 'primary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'outline'
  | 'muted';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-muted text-foreground-muted border-transparent',
  primary: 'bg-primary-subtle text-primary border-primary/20',
  success: 'bg-success-subtle text-success border-success/20',
  warning: 'bg-warning-subtle text-warning border-warning/20',
  danger:  'bg-danger-subtle text-danger border-danger/20',
  info:    'bg-info-subtle text-info border-info/20',
  outline: 'bg-transparent text-foreground border-border',
  muted:   'bg-surface-sunken text-foreground-subtle border-transparent',
};

const dotColors: Record<BadgeVariant, string> = {
  default: 'bg-foreground-subtle',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  danger:  'bg-danger',
  info:    'bg-info',
  outline: 'bg-foreground-muted',
  muted:   'bg-foreground-subtle',
};

export function Badge({ children, variant = 'default', size = 'md', dot = false, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium border rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs',
        variantStyles[variant],
        className,
      )}
    >
      {dot && (
        <span className={cn('shrink-0 rounded-full', dotColors[variant], size === 'sm' ? 'h-1.5 w-1.5' : 'h-2 w-2')} />
      )}
      {children}
    </span>
  );
}

// ── Convenience status badge ──────────────────────────────────────────────────
// Maps common CRM status strings to the right variant automatically.

const STATUS_MAP: Record<string, BadgeVariant> = {
  // Invoice
  paid:           'success',
  partiallypaid:  'warning',
  overdue:        'danger',
  sent:           'info',
  draft:          'muted',
  cancelled:      'muted',

  // Contract
  signed:         'success',
  completed:      'success',
  archived:       'muted',

  // Lead
  new:            'primary',
  qualified:      'success',
  contacted:      'info',
  lost:           'danger',

  // Project / Task
  active:         'success',
  inprogress:     'info',
  todo:           'muted',
  done:           'success',
  pending:        'warning',
  inactive:       'muted',
};

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  const key = status.toLowerCase().replace(/\s+/g, '');
  const variant: BadgeVariant = STATUS_MAP[key] ?? 'default';
  return (
    <Badge variant={variant} dot className={className}>
      {status}
    </Badge>
  );
}
