'use client';

import { ComponentType, ReactNode, SVGProps, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { ActionButton } from '@/components/ui/Surface';
import { IconProfile } from '@/components/ui/Icons';

export type NavItem = {
  href: string;
  label: string;
  icon?: ComponentType<SVGProps<SVGSVGElement>>;
  exact?: boolean;
};

export default function AppLayout({
  children,
  title,
  navItems,
  showBalance = false,
  variant = 'admin',
  hideHeader = false,
}: {
  children: ReactNode;
  title: string;
  navItems: NavItem[];
  showBalance?: boolean;
  variant?: 'player' | 'admin';
  hideHeader?: boolean;
}) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isPlayer = variant === 'player';

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    if (item.href === '/') return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  };

  const bottomNav = navItems.slice(0, 5);
  const displayName = user?.username ?? user?.firstName ?? 'Guest';
  const balance = user?.balance ?? 0;

  return (
    <div className="min-h-screen bg-bp-bg text-bp-text">
      {drawerOpen && !isPlayer && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {!isPlayer && (
        <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 flex-col border-r border-bp-border bg-bp-surface px-3 py-4 md:flex">
          <div className="rounded-2xl border border-bp-border bg-bp-surface-elevated p-4">
            <p className="text-lg font-bold tracking-tight">
              <span className="text-bp-gold">Bingo</span>
              <span className="text-bp-text"> Plus</span>
            </p>
            <h2 className="mt-2 text-sm font-semibold text-bp-muted">{title}</h2>
            <p className="mt-0.5 text-sm text-bp-text">{displayName}</p>
          </div>

          <nav className="mt-3 flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const active = isActive(item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
                    active
                      ? 'bg-bp-primary/15 text-bp-primary'
                      : 'text-bp-muted hover:bg-bp-surface-elevated hover:text-bp-text'
                  }`}
                >
                  {Icon && <Icon className="h-5 w-5 shrink-0" />}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <ActionButton variant="danger" onClick={logout} className="mt-3 w-full">
            Logout
          </ActionButton>
        </aside>
      )}

      <div className={`min-h-screen ${isPlayer ? '' : 'md:pl-64'}`}>
        {!hideHeader && (
          <header className="sticky top-0 z-30 border-b border-bp-border/80 bg-bp-bg/90 backdrop-blur-xl">
            <div className={`mx-auto flex max-w-lg items-center gap-3 px-4 py-3 ${isPlayer ? '' : 'max-w-[1440px] sm:px-6 lg:px-8'}`}>
              {!isPlayer && (
                <button
                  type="button"
                  onClick={() => setDrawerOpen(true)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-bp-border bg-bp-surface text-bp-text md:hidden"
                  aria-label="Open menu"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              )}

              {isPlayer ? (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-lg font-bold tracking-tight">
                      <span className="text-bp-gold">Bingo</span>
                      <span> Plus</span>
                    </p>
                  </div>
                  {showBalance && (
                    <div className="flex items-center gap-1.5 rounded-full border border-bp-gold/30 bg-bp-gold/10 px-3 py-1.5">
                      <span className="text-sm font-bold text-bp-gold">{balance.toLocaleString()}</span>
                      <span className="text-[10px] text-bp-gold/70">coins</span>
                    </div>
                  )}
                  <Link
                    href="/player/profile"
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-bp-border bg-bp-surface-elevated text-bp-muted"
                  >
                    <IconProfile className="h-5 w-5" />
                  </Link>
                </>
              ) : (
                <>
                  <div className="min-w-0 flex-1">
                    <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-bp-muted">{title}</p>
                    <h1 className="truncate text-base font-semibold text-bp-text">
                      {navItems.find((item) => isActive(item))?.label ?? title}
                    </h1>
                  </div>
                  {showBalance && (
                    <div className="rounded-xl border border-bp-gold/30 bg-bp-gold/10 px-3 py-1.5 text-right">
                      <p className="text-[10px] uppercase text-bp-gold/70">Balance</p>
                      <p className="text-sm font-bold text-bp-gold">{balance.toLocaleString()}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </header>
        )}

        <main
          className={`mx-auto px-4 py-4 pb-24 ${
            isPlayer ? 'max-w-lg' : 'max-w-[1440px] pb-8 sm:px-6 lg:px-8'
          }`}
        >
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-bp-border bg-bp-surface/95 backdrop-blur-xl md:hidden">
        <div
          className={`mx-auto grid gap-1 px-2 py-2 ${isPlayer ? 'max-w-lg' : ''}`}
          style={{ gridTemplateColumns: `repeat(${Math.max(bottomNav.length, 1)}, minmax(0, 1fr))` }}
        >
          {bottomNav.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 rounded-xl px-1 py-1.5 text-[10px] font-medium transition ${
                  active ? 'text-bp-primary' : 'text-bp-muted'
                }`}
              >
                {Icon ? (
                  <Icon className={`h-5 w-5 ${active ? 'text-bp-primary' : ''}`} />
                ) : (
                  <span className="h-5 w-5" />
                )}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
