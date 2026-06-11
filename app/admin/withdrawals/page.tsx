'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useWithdrawals, usePayWithdrawal } from '@/hooks/useWithdrawals';
import { ActionButton, EmptyState, SectionHeader, Surface, StatusPill } from '@/components/ui/Surface';

export default function AdminWithdrawalsPage() {
  const { data: withdrawals, isLoading } = useWithdrawals();
  const { mutate: pay } = usePayWithdrawal();

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <SectionHeader
        eyebrow="Withdrawals"
        title="Payout queue"
        description="Process pending withdrawals in order."
      />

      <Surface className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
            <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
          </div>
        ) : withdrawals?.length ? (
          <div className="space-y-2">
            {withdrawals.map((w) => (
              <div
                key={w.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">{w.amount} coins</p>
                  <div className="mt-2">
                    <StatusPill status={w.status} />
                  </div>
                </div>
                {w.status === 'PENDING' && (
                  <ActionButton variant="success" onClick={() => pay(w.id)}>
                    Pay
                  </ActionButton>
                )}
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No withdrawals" description="Completed or pending items will show up here." />
        )}
      </Surface>
    </ProtectedRoute>
  );
}
