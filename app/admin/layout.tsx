'use client';

import { ReactNode } from 'react';
import AppLayout, { NavItem } from '@/components/layout/AppLayout';

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard' },
  { href: '/admin/games', label: 'Games' },
  { href: '/admin/players', label: 'Players' },
  { href: '/admin/coins', label: 'Coin Requests' },
  { href: '/admin/withdrawals', label: 'Withdrawals' },
  { href: '/admin/fund-requests', label: 'Fund Requests' },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout title="Agent Panel" navItems={navItems}>
      {children}
    </AppLayout>
  );
}
