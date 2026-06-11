'use client';

import { ReactNode } from 'react';
import AppLayout, { NavItem } from '@/components/layout/AppLayout';
import { IconDashboard, IconGames, IconMore, IconPlayers, IconRequests } from '@/components/ui/Icons';

const navItems: NavItem[] = [
  { href: '/admin', label: 'Dashboard', icon: IconDashboard, exact: true },
  { href: '/admin/games', label: 'Games', icon: IconGames },
  { href: '/admin/players', label: 'Players', icon: IconPlayers },
  { href: '/admin/coins', label: 'Requests', icon: IconRequests },
  { href: '/admin/withdrawals', label: 'More', icon: IconMore },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout title="Agent Panel" navItems={navItems}>
      {children}
    </AppLayout>
  );
}
