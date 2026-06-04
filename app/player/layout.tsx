'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function PlayerLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-zinc-900 text-white flex flex-col">
      <header className="flex justify-between items-center px-4 py-3 bg-zinc-800">
        <h2 className="text-lg font-bold m-0">BingoPlus</h2>
        <div className="flex items-center gap-3">
          <span className="text-sm">Balance: {user?.balance ?? 0}</span>
          <Link href="/player/wallet" className="text-rose-400 text-sm">Top Up</Link>
          <button onClick={logout} className="text-xs border border-rose-500 text-rose-500 px-2 py-1 rounded cursor-pointer bg-transparent">
            Logout
          </button>
        </div>
      </header>
      <nav className="flex gap-4 px-4 py-2 bg-zinc-800/50">
        <Link href="/player" className="text-zinc-300 text-sm hover:text-white">Games</Link>
        <Link href="/player/wallet" className="text-zinc-300 text-sm hover:text-white">Wallet</Link>
        <Link href="/player/withdraw" className="text-zinc-300 text-sm hover:text-white">Withdraw</Link>
        <Link href="/player/history" className="text-zinc-300 text-sm hover:text-white">History</Link>
      </nav>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
