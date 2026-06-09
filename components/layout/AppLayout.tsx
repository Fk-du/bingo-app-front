'use client';

import { ReactNode, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';

export type NavItem = {
  href: string;
  label: string;
};

export default function AppLayout({
  children,
  title,
  navItems,
  showBalance,
}: {
  children: ReactNode;
  title: string;
  navItems: NavItem[];
  showBalance?: boolean;
}) {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const isActive = (href: string) =>
    href === '/' ? pathname === href : pathname.startsWith(href);

  const bottomNav = navItems.slice(0, 5);

  return (
    <div className="flex min-h-screen">
      {drawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-zinc-800 text-white z-50 transform transition-transform duration-200 md:translate-x-0 md:static md:flex md:flex-col ${
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-zinc-700 shrink-0">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-xs text-zinc-400 mt-1">
            {user?.username ?? user?.firstName ?? ''}
          </p>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setDrawerOpen(false)}
                  className={`block px-3 py-2 rounded text-sm transition-colors ${
                    isActive(item.href)
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-300 hover:bg-zinc-700/50 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-zinc-700 shrink-0">
          <button
            onClick={logout}
            className="w-full bg-rose-600 text-white px-4 py-2 rounded text-sm cursor-pointer hover:bg-rose-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex items-center justify-between px-4 py-3 bg-zinc-800 text-white md:hidden shrink-0">
          <button
            onClick={() => setDrawerOpen(true)}
            className="p-1 cursor-pointer"
            aria-label="Open menu"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-base font-bold">{title}</h1>
          {showBalance ? (
            <span className="text-sm text-rose-400">{user?.balance ?? 0}</span>
          ) : (
            <div className="w-6" />
          )}
        </header>

        <main className="flex-1 p-4 bg-zinc-50 dark:bg-black">{children}</main>

        <nav className="flex bg-zinc-800 border-t border-zinc-700 md:hidden shrink-0">
          {bottomNav.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex-1 flex flex-col items-center py-3 text-xs transition-colors ${
                  active ? 'text-rose-400' : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
