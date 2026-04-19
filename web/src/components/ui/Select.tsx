import { SelectHTMLAttributes, forwardRef, useId } from 'react';
import { cn } from '@/lib/utils';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id: propId, ...props }, ref) => {
    const generatedId = useId();
    const selectId = propId ?? generatedId;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground',
            'transition-colors duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-sunken',
            error && 'border-danger focus-visible:ring-danger',
            className,
          )}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
