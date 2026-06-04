'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useWithdrawals, usePayWithdrawal } from '@/hooks/useWithdrawals';

export default function AdminWithdrawalsPage() {
  const { data: withdrawals, isLoading } = useWithdrawals();
  const { mutate: pay } = usePayWithdrawal();

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Withdrawals</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {withdrawals?.map((w: any) => (
            <div key={w.id} className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow flex justify-between items-center">
              <div>
                <strong>{w.amount} coins</strong>
                <span className="ml-2 text-sm text-zinc-500">{w.status}</span>
              </div>
              {w.status === 'PENDING' && (
                <button
                  onClick={() => pay(w.id)}
                  className="bg-emerald-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
                >
                  Pay
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
}
