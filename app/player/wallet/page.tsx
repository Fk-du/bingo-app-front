'use client';

import { useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAuthStore } from '@/store/auth.store';
import { useCreateCoinRequest } from '@/hooks/useCoins';

export default function WalletPage() {
  const user = useAuthStore((s) => s.user);
  const [amount, setAmount] = useState('');
  const { mutate: topUp, isPending } = useCreateCoinRequest();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    topUp({ amount: Number(amount) });
    setAmount('');
  };

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <h1 className="text-xl font-bold mb-4">Wallet</h1>
      <div className="bg-zinc-800 p-4 rounded-lg mb-4 space-y-1">
        <p>Balance: <strong>{user?.balance ?? 0}</strong> coins</p>
        <p>Frozen: <strong>{user?.frozenBalance ?? 0}</strong> coins</p>
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          min="1"
          className="p-2 border border-zinc-600 rounded bg-zinc-800 text-white"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-rose-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
        >
          {isPending ? 'Requesting...' : 'Request Top Up'}
        </button>
      </form>
    </ProtectedRoute>
  );
}
