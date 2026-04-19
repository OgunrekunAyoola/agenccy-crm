import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export const Table = forwardRef<HTMLTableElement, HTMLAttributes<HTMLTableElement>>(
  ({ className = '', ...props }, ref) => (
    <div className="relative w-full overflow-auto rounded-xl border border-border bg-surface shadow-[var(--shadow-sm)]">
      <table ref={ref} className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
);
Table.displayName = 'Table';

export const TableHeader = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <thead ref={ref} className={cn('bg-surface-sunken border-b border-border', className)} {...props} />
  )
);
TableHeader.displayName = 'TableHeader';

export const TableBody = forwardRef<HTMLTableSectionElement, HTMLAttributes<HTMLTableSectionElement>>(
  ({ className = '', ...props }, ref) => (
    <tbody ref={ref} className={cn('[&_tr:last-child]:border-0', className)} {...props} />
  )
);
TableBody.displayName = 'TableBody';

export const TableRow = forwardRef<HTMLTableRowElement, HTMLAttributes<HTMLTableRowElement>>(
  ({ className = '', ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b border-border transition-colors duration-100',
        'hover:bg-surface-sunken data-[state=selected]:bg-primary-subtle',
        className,
      )}
      {...props}
    />
  )
);
TableRow.displayName = 'TableRow';

export const TableHead = forwardRef<HTMLTableCellElement, React.ThHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <th
      ref={ref}
      className={cn(
        'h-11 px-4 text-left align-middle text-xs font-semibold text-foreground-muted uppercase tracking-wider',
        '[&:has([role=checkbox])]:pr-0',
        className,
      )}
      {...props}
    />
  )
);
TableHead.displayName = 'TableHead';

export const TableCell = forwardRef<HTMLTableCellElement, React.TdHTMLAttributes<HTMLTableCellElement>>(
  ({ className = '', ...props }, ref) => (
    <td
      ref={ref}
      className={cn('px-4 py-3.5 align-middle text-sm [&:has([role=checkbox])]:pr-0', className)}
      {...props}
    />
  )
);
TableCell.displayName = 'TableCell';
