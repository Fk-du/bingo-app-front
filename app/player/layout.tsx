'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import AppLayout, { NavItem } from '@/components/layout/AppLayout';
import { IconGames, IconLobby, IconProfile, IconWallet } from '@/components/ui/Icons';

const navItems: NavItem[] = [
  { href: '/player', label: 'Lobby', icon: IconLobby, exact: true },
  { href: '/player/my-games', label: 'My Games', icon: IconGames },
  { href: '/player/wallet', label: 'Wallet', icon: IconWallet },
  { href: '/player/profile', label: 'Profile', icon: IconProfile },
];

export default function PlayerLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isLiveGame = pathname.startsWith('/player/game/');

  return (
    <AppLayout
      title="Player"
      navItems={navItems}
      showBalance={!isLiveGame}
      variant="player"
      hideHeader={isLiveGame}
    >
      {children}
    </AppLayout>
  );
}
