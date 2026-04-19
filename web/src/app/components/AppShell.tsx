'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { MobileDrawer } from './MobileDrawer';
import { NAV_ITEM_DEFS } from './Navbar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

const PUBLIC_PREFIXES = [
  '/portal',
  '/login',
  '/register',
  '/signup',
  '/forgot-password',
  '/reset-password',
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isPublic =
    pathname === '/' ||
    PUBLIC_PREFIXES.some((prefix) => pathname?.startsWith(prefix));

  if (isPublic) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Main content column */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile top bar (hidden on lg+) */}
        <header className="lg:hidden flex items-center gap-3 h-14 px-4 border-b border-border bg-surface shrink-0">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="h-9 w-9 flex items-center justify-center rounded-lg hover:bg-muted transition-colors text-foreground-muted hover:text-foreground"
            aria-label="Open navigation menu"
            aria-expanded={isMobileOpen}
            aria-controls="mobile-nav-drawer"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-xs">A</span>
            </div>
            <span className="font-bold text-sm text-foreground">Agency CRM</span>
          </Link>
        </header>

        {/* Scrollable page area */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 py-6 max-w-screen-xl mx-auto">
            <Breadcrumbs />
            {children}
          </div>
        </main>
      </div>

      {/* Mobile drawer */}
      <MobileDrawer
        id="mobile-nav-drawer"
        isOpen={isMobileOpen}
        onClose={() => setIsMobileOpen(false)}
        navItems={NAV_ITEM_DEFS.map(({ href, key, icon }) => ({
          href,
          label: t(key),
          icon,
        }))}
        logoutLabel={t('nav.logout')}
        currentPath={pathname}
        user={user}
        onLogout={() => {
          setIsMobileOpen(false);
          logout();
        }}
      />
    </div>
  );
}
