'use client';

import { useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useFundRequests, useCreateFundRequest } from '@/hooks/useAgents';

export default function FundRequestsPage() {
  const { data: requests, isLoading } = useFundRequests();
  const { mutate: createRequest, isPending } = useCreateFundRequest();
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createRequest({ amount: Number(amount) });
    setAmount('');
  };

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Fund Requests</h1>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount"
          required
          min="0"
          className="p-2 border border-zinc-300 rounded dark:bg-zinc-800 dark:border-zinc-600"
        />
        <button
          type="submit"
          disabled={isPending}
          className="bg-rose-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
        >
          {isPending ? 'Requesting...' : 'Request Funds'}
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {requests?.map((req: any) => (
            <div key={req.id} className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow flex justify-between items-center">
              <div>
                <strong>{req.amount} coins</strong>
                <span className="ml-2 text-sm text-zinc-500">{req.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
}
