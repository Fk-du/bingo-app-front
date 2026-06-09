'use client';

import { useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAuthStore } from '@/store/auth.store';
import { useCreateCoinRequest, useCoinRequests } from '@/hooks/useCoins';

export default function WalletPage() {
  const user = useAuthStore((s) => s.user);
  const [amount, setAmount] = useState('');
  const { mutate: topUp, isPending } = useCreateCoinRequest();
  const { data: requests, isLoading: loadingRequests } = useCoinRequests();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    topUp({ amount: Number(amount) });
    setAmount('');
  };

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <h1 className="text-xl font-bold mb-4">Wallet</h1>

      {/* Balance */}
      <div className="bg-zinc-800 p-4 rounded-lg mb-6 space-y-1">
        <p>Balance: <strong className="text-emerald-400">{user?.balance ?? 0}</strong> coins</p>
        <p>Frozen: <strong className="text-amber-400">{user?.frozenBalance ?? 0}</strong> coins</p>
      </div>

      {/* Top-up Form */}
      <h3 className="font-semibold mb-2">Request Top Up</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-8">
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

      {/* Request History */}
      <h3 className="font-semibold mb-3">Request History</h3>
      {loadingRequests ? (
        <p>Loading...</p>
      ) : !requests || requests.length === 0 ? (
        <p className="text-zinc-500 text-sm">No requests yet.</p>
      ) : (
        <div className="space-y-2">
          {requests.map((req) => (
            <div key={req.id} className="bg-zinc-800 p-3 rounded-lg flex justify-between items-center">
              <div>
                <strong>{req.amount} coins</strong>
                <span className={`ml-2 text-sm ${
                  req.status === 'APPROVED' ? 'text-emerald-400' :
                  req.status === 'REJECTED' ? 'text-rose-400' :
                  'text-amber-400'
                }`}>
                  {req.status}
                </span>
              </div>
              <span className="text-xs text-zinc-500">{new Date(req.createdAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
}
