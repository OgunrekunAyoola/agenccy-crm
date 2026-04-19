'use client';

import { useId } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export function Input({ label, error, helperText, className, id: propId, ...props }: InputProps) {
  const generatedId = useId();
  const inputId = propId ?? generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperTextId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperTextId].filter(Boolean).join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
          {props.required && (
            <span className="text-danger ml-1" aria-hidden="true">*</span>
          )}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(
          'flex h-10 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground',
          'placeholder:text-foreground-subtle',
          'transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:border-primary',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-surface-sunken',
          error && 'border-danger focus-visible:ring-danger',
          className,
        )}
        {...props}
      />
      {error && (
        <p id={errorId} className="text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p id={helperTextId} className="text-sm text-foreground-muted">
          {helperText}
        </p>
      )}
    </div>
  );
}
