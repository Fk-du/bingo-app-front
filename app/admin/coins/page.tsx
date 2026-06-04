'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useCoinRequests, useHandleCoinRequest } from '@/hooks/useCoins';

export default function AdminCoinsPage() {
  const { data: requests, isLoading } = useCoinRequests();
  const { mutate: handleRequest } = useHandleCoinRequest();

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Coin Requests</h1>
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
              {req.status === 'PENDING' && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRequest({ id: req.id, action: 'APPROVE' })}
                    className="bg-emerald-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRequest({ id: req.id, action: 'REJECT' })}
                    className="bg-rose-500 text-white px-3 py-1 rounded text-sm cursor-pointer"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
}
