'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAuthStore } from '@/store/auth.store';
import { ActionButton, Surface } from '@/components/ui/Surface';
import { IconProfile } from '@/components/ui/Icons';

const MENU_ITEMS = [
  { href: '/player/profile', label: 'My Profile' },
  { href: '/player/history', label: 'Game History' },
  { href: '/player/wallet', label: 'Refer & Earn' },
  { href: '#', label: 'How to Play' },
  { href: '#', label: 'Support' },
  { href: '#', label: 'About BingoPlus' },
];

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(' ') ||
    user?.username ||
    'Player';

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <div className="flex flex-col items-center py-4">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-bp-primary bg-bp-primary/20">
          <IconProfile className="h-10 w-10 text-bp-primary" />
        </div>
        <h1 className="mt-3 text-xl font-bold text-bp-text">{displayName}</h1>
        <p className="text-sm text-bp-muted">Player</p>
        {user?.username && <p className="text-xs text-bp-muted">@{user.username}</p>}
      </div>

      <Surface className="divide-y divide-bp-border overflow-hidden p-0">
        {MENU_ITEMS.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex items-center justify-between px-4 py-3.5 text-sm text-bp-text transition hover:bg-bp-surface-elevated"
          >
            <span>{item.label}</span>
            <span className="text-bp-muted">›</span>
          </Link>
        ))}
      </Surface>

      <ActionButton variant="ghost" onClick={logout} className="mt-6 w-full text-bp-danger">
        Log Out
      </ActionButton>
    </ProtectedRoute>
  );
}
