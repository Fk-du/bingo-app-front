'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useCoinRequests, useHandleCoinRequest } from '@/hooks/useCoins';
import { ActionButton, EmptyState, SectionHeader, Surface, StatusPill } from '@/components/ui/Surface';

export default function AdminCoinsPage() {
  const { data: requests, isLoading } = useCoinRequests();
  const { mutate: handleRequest } = useHandleCoinRequest();

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <SectionHeader
        eyebrow="Coin requests"
        title="Top-up approvals"
        description="Approve or reject wallet requests from players."
      />

      <Surface className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
            <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
          </div>
        ) : requests?.length ? (
          <div className="space-y-2">
            {requests.map((req) => (
              <div
                key={req.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{req.amount} coins</p>
                  <div className="mt-2">
                    <StatusPill status={req.status} />
                  </div>
                </div>
                {req.status === 'PENDING' && (
                  <div className="flex gap-2">
                    <ActionButton
                      variant="success"
                      onClick={() => handleRequest({ id: req.id, action: 'APPROVE' })}
                    >
                      Approve
                    </ActionButton>
                    <ActionButton
                      variant="danger"
                      onClick={() => handleRequest({ id: req.id, action: 'REJECT' })}
                    >
                      Reject
                    </ActionButton>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No coin requests" description="Pending approvals will appear here." />
        )}
      </Surface>
    </ProtectedRoute>
  );
}
