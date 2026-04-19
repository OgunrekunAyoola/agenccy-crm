'use client';

import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const titleId = `modal-title-${useRef(Math.random().toString(36).slice(2)).current}`;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) requestAnimationFrame(() => modalRef.current?.focus());
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const selectors = 'a[href], button:not([disabled]), textarea, input:not([type="hidden"]), select, [tabindex]:not([tabindex="-1"])';
    const modal = modalRef.current;
    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      const focusable = Array.from(modal.querySelectorAll<HTMLElement>(selectors));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey ? document.activeElement === first : document.activeElement === last) {
        e.preventDefault();
        (e.shiftKey ? last : first).focus();
      }
    };
    window.addEventListener('keydown', handleTab);
    return () => window.removeEventListener('keydown', handleTab);
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" aria-hidden="false">
      <div
        className="fixed inset-0 bg-overlay backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        className={cn(
          'relative w-full max-w-lg bg-surface rounded-xl border border-border',
          'shadow-[var(--shadow-xl)] max-h-[90vh] flex flex-col focus:outline-none',
          className,
        )}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0">
          <h2 id={titleId} className="text-base font-semibold text-foreground leading-none">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-foreground-muted hover:text-foreground"
            aria-label="Close dialog"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>,
    document.body,
  );
}
