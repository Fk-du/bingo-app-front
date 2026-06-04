'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex min-h-screen">
      <nav className="w-60 bg-zinc-800 text-white p-4 flex flex-col">
        <h2 className="text-lg font-bold">Agent Panel</h2>
        <p className="text-xs text-zinc-400 mb-4">{user?.username ?? 'Agent'}</p>
        <ul className="flex-1 space-y-1">
          <li><Link href="/admin" className="block text-zinc-300 hover:text-white py-2">Dashboard</Link></li>
          <li><Link href="/admin/games" className="block text-zinc-300 hover:text-white py-2">Games</Link></li>
          <li><Link href="/admin/players" className="block text-zinc-300 hover:text-white py-2">Players</Link></li>
          <li><Link href="/admin/coins" className="block text-zinc-300 hover:text-white py-2">Coin Requests</Link></li>
          <li><Link href="/admin/withdrawals" className="block text-zinc-300 hover:text-white py-2">Withdrawals</Link></li>
          <li><Link href="/admin/fund-requests" className="block text-zinc-300 hover:text-white py-2">Fund Requests</Link></li>
        </ul>
        <button onClick={logout} className="bg-rose-600 text-white px-4 py-2 rounded cursor-pointer text-sm hover:bg-rose-700">
          Logout
        </button>
      </nav>
      <main className="flex-1 p-6 bg-zinc-50 dark:bg-black">{children}</main>
    </div>
  );
}
