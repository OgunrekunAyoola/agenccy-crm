'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { NAV_ITEM_DEFS } from './Navbar';

const COLLAPSED_KEY = 'agenccy_sidebar_collapsed';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();

  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSED_KEY) === 'true');
    setMounted(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSED_KEY, String(next));
      return next;
    });
  };

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === href : pathname.startsWith(href);

  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : (user?.email?.[0]?.toUpperCase() ?? '?');

  if (!mounted) {
    return (
      <aside className="hidden lg:flex w-60 h-full bg-surface border-r border-border flex-col shrink-0" />
    );
  }

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col h-full bg-surface border-r border-border shrink-0 overflow-hidden',
        'transition-[width] duration-300 ease-in-out',
        collapsed ? 'w-[68px]' : 'w-60',
      )}
    >
      {/* Header */}
      <div
        className={cn(
          'flex items-center h-16 border-b border-border px-3 shrink-0',
          collapsed ? 'justify-center' : 'justify-between',
        )}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 min-w-0"
          title={collapsed ? 'Agency CRM' : undefined}
        >
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">A</span>
          </div>
          {!collapsed && (
            <span className="font-bold text-sm text-foreground truncate">Agency CRM</span>
          )}
        </Link>
        {!collapsed && (
          <button
            onClick={toggle}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-foreground-muted hover:bg-muted hover:text-foreground transition-colors shrink-0"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <div className="flex justify-center pt-2 px-2">
          <button
            onClick={toggle}
            className="h-8 w-8 flex items-center justify-center rounded-lg text-foreground-muted hover:bg-muted hover:text-foreground transition-colors"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {NAV_ITEM_DEFS.map(({ href, key, icon: Icon }) => {
          const active = isActive(href);
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? t(key) : undefined}
              className={cn(
                'flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 group',
                collapsed && 'justify-center',
                active
                  ? 'bg-primary-subtle text-primary'
                  : 'text-foreground-muted hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon
                className={cn(
                  'h-4 w-4 shrink-0',
                  active ? 'text-primary' : 'text-foreground-subtle group-hover:text-foreground',
                )}
              />
              {!collapsed && <span className="truncate">{t(key)}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="border-t border-border p-2 space-y-1 shrink-0">
        {/* Language toggle */}
        <button
          onClick={() => i18n.changeLanguage(i18n.language === 'en' ? 'bg' : 'en')}
          title={collapsed ? (i18n.language === 'en' ? 'Switch to BG' : 'Switch to EN') : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-xs font-semibold',
            'text-foreground-muted hover:bg-muted hover:text-foreground transition-colors',
            collapsed && 'justify-center',
          )}
          aria-label="Switch language"
        >
          <span className="text-sm font-bold leading-none">
            {i18n.language === 'en' ? 'BG' : 'EN'}
          </span>
          {!collapsed && <span className="font-medium text-sm">Switch language</span>}
        </button>

        {/* User row */}
        <div
          className={cn(
            'flex items-center gap-2.5 px-2 py-2',
            collapsed && 'justify-center',
          )}
        >
          <div className="h-7 w-7 rounded-full bg-primary-subtle flex items-center justify-center text-primary text-xs font-bold shrink-0">
            {initials}
          </div>
          {!collapsed && (
            <p className="text-xs font-medium text-foreground truncate flex-1 min-w-0">
              {user?.fullName || user?.email}
            </p>
          )}
        </div>

        {/* Logout */}
        <button
          onClick={() => logout()}
          title={collapsed ? t('nav.logout') : undefined}
          className={cn(
            'w-full flex items-center gap-3 px-2 py-2 rounded-lg text-sm font-medium transition-colors',
            'text-foreground-muted hover:bg-danger-subtle hover:text-danger',
            collapsed && 'justify-center',
          )}
          aria-label={t('nav.logout')}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>{t('nav.logout')}</span>}
        </button>
      </div>
    </aside>
  );
}
