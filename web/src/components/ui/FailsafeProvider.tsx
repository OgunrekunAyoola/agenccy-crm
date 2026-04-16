'use client';

import React, { useEffect, useLayoutEffect, useState } from 'react';
import { signals } from '@/lib/signals';
import { SessionExpiredState, AccessDeniedState, ErrorState } from './StateVisuals';
import { usePathname } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// useLayoutEffect fires before the browser paints, so switching to it for the
// pathname-based signal reset eliminates the one-frame flash of SessionExpiredState
// when navigating to /login after a mid-session expiry.
//
// SSR caveat: useLayoutEffect is silently skipped on the server and React emits
// a warning. The isomorphic pattern below resolves to useEffect on the server
// (where signal is always null anyway) and useLayoutEffect in the browser.
// It must be a module-level constant so the hook identity is stable across renders.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export function FailsafeProvider({ children }: { children: React.ReactNode }) {
  const [signal, setSignal] = useState<'401' | '403' | '500' | null>(null);
  const pathname = usePathname();

  // Clear the signal before the browser paints when navigating to a new page.
  // useIsomorphicLayoutEffect ensures the stale signal is gone before the user
  // sees the new page — specifically prevents a flash of SessionExpiredState on
  // /login when navigating there from an expired protected page.
  useIsomorphicLayoutEffect(() => {
    setSignal(null);
  }, [pathname]);

  // Subscribe to global API signals once on mount. Stays as useEffect to avoid
  // running the subscription during SSR/hydration where it has no effect anyway.
  useEffect(() => {
    const unsubscribe = signals.subscribe((type) => {
      setSignal(type);
    });
    return () => { unsubscribe(); };
  }, []);

  if (signal === '401') {
    return (
      <div className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-card border shadow-2xl rounded-2xl max-w-lg w-full">
          <SessionExpiredState />
        </div>
      </div>
    );
  }

  if (signal === '403') {
    return <AccessDeniedState />;
  }

  if (signal === '500') {
    return <ErrorState reset={() => setSignal(null)} />;
  }

  return <>{children}</>;
}

/**
 * Full-screen loading overlay to prevent flicker during session restoration.
 */
export function LoadingOverlay() {
  return (
    <div className="fixed inset-0 z-[110] bg-background flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300">
      <div className="h-16 w-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
        <span className="text-white font-bold text-2xl">A</span>
      </div>
      <div className="flex items-center gap-2 text-muted-foreground font-medium">
        <Loader2 className="h-4 w-4 animate-spin" />
        Authenticating...
      </div>
    </div>
  );
}
