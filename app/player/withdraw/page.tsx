'use client';

import { useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useCreateWithdrawal } from '@/hooks/useWithdrawals';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [payoutDetails, setPayoutDetails] = useState('');
  const { mutate: withdraw, isPending } = useCreateWithdrawal();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    withdraw({ amount: Number(amount), payoutDetails });
    setAmount('');
    setPayoutDetails('');
  };

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <h1 className="text-xl font-bold mb-4">Withdraw</h1>
      <form onSubmit={handleSubmit} className="max-w-sm space-y-4">
        <div>
          <label className="block mb-1 text-sm">Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            className="w-full p-2 border border-zinc-600 rounded bg-zinc-800 text-white"
          />
        </div>
        <div>
          <label className="block mb-1 text-sm">Payout Details (optional)</label>
          <input
            type="text"
            value={payoutDetails}
            onChange={(e) => setPayoutDetails(e.target.value)}
            className="w-full p-2 border border-zinc-600 rounded bg-zinc-800 text-white"
            placeholder="Bank account, crypto address, etc."
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="bg-rose-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
        >
          {isPending ? 'Submitting...' : 'Request Withdrawal'}
        </button>
      </form>
    </ProtectedRoute>
  );
}
