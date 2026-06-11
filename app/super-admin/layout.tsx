'use client';

import { ReactNode } from 'react';
import AppLayout, { NavItem } from '@/components/layout/AppLayout';
import { IconDashboard, IconGames, IconMore, IconPlayers, IconRequests } from '@/components/ui/Icons';

const navItems: NavItem[] = [
  { href: '/super-admin', label: 'Dashboard', icon: IconDashboard, exact: true },
  { href: '/super-admin/agents', label: 'Agents', icon: IconPlayers },
  { href: '/super-admin/reports', label: 'Reports', icon: IconRequests },
  { href: '/super-admin/broadcast', label: 'Broadcast', icon: IconMore },
  { href: '/super-admin/config', label: 'Config', icon: IconGames },
];

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  return (
    <AppLayout title="Control Center" navItems={navItems}>
      {children}
    </AppLayout>
  );
}
