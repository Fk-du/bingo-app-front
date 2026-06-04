'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuthStore } from '@/store/auth.store';

export default function SuperAdminLayout({ children }: { children: ReactNode }) {
  const { user, logout } = useAuthStore();

  return (
    <div className="flex min-h-screen">
      <nav className="w-60 bg-zinc-900 text-white p-4 flex flex-col">
        <h2 className="text-lg font-bold">BingoPlus Admin</h2>
        <p className="text-xs text-zinc-400 mb-4">{user?.username ?? 'Super Admin'}</p>
        <ul className="flex-1 space-y-1">
          <li><Link href="/super-admin" className="block text-zinc-300 hover:text-white py-2">Dashboard</Link></li>
          <li><Link href="/super-admin/agents" className="block text-zinc-300 hover:text-white py-2">Agents</Link></li>
          <li><Link href="/super-admin/reports" className="block text-zinc-300 hover:text-white py-2">Reports</Link></li>
          <li><Link href="/super-admin/broadcast" className="block text-zinc-300 hover:text-white py-2">Broadcast</Link></li>
          <li><Link href="/super-admin/config" className="block text-zinc-300 hover:text-white py-2">Config</Link></li>
        </ul>
        <button onClick={logout} className="bg-rose-600 text-white px-4 py-2 rounded cursor-pointer text-sm hover:bg-rose-700">
          Logout
        </button>
      </nav>
      <main className="flex-1 p-6 bg-zinc-50 dark:bg-black">{children}</main>
    </div>
  );
}
