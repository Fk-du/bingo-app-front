'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useCoinRequests, useHandleCoinRequest } from '@/hooks/useCoins';
import { usePlayers, useAdminWallet } from '@/hooks/usePlayers';
import { ActionButton, EmptyState, MetricCard, SectionHeader, Surface, StatusPill } from '@/components/ui/Surface';
import { IconCoin } from '@/components/ui/Icons';

interface ApproveDialogProps {
  requestId: number;
  amount: number;
  playerLabel: string;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

function ApproveDialog({ requestId, amount, playerLabel, onClose, onApprove, onReject }: ApproveDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <Surface className="relative w-full max-w-sm p-5">
        <p className="text-lg font-bold text-bp-text">Review Request</p>
        <p className="mt-1 text-sm text-bp-muted">
          {playerLabel} requested <span className="font-semibold text-bp-gold">{amount.toLocaleString()}</span> coins
        </p>

        <div className="mt-6 flex gap-2">
          <ActionButton variant="secondary" onClick={onClose} className="flex-1">
            Back
          </ActionButton>
          <ActionButton variant="danger" onClick={() => { onReject(requestId); onClose(); }} className="flex-1">
            Reject
          </ActionButton>
          <ActionButton variant="success" onClick={() => { onApprove(requestId); onClose(); }} className="flex-1">
            Approve
          </ActionButton>
        </div>
      </Surface>
    </div>
  );
}

export default function AdminCoinsPage() {
  const { data: requests, isLoading } = useCoinRequests();
  const { data: players } = usePlayers();
  const { data: adminWallet } = useAdminWallet();
  const { mutate: handleRequest } = useHandleCoinRequest();
  const [reviewTarget, setReviewTarget] = useState<{
    id: number;
    amount: number;
    userId: number;
  } | null>(null);

  const pending = requests?.filter((r) => r.status === 'PENDING') ?? [];
  const approved = requests?.filter((r) => r.status === 'APPROVED') ?? [];
  const totalApproved = approved.reduce((s, r) => s + r.amount, 0);

  const playerLabel = (userId: number) => {
    const player = players?.find((p) => p.userId === userId);
    return player ? `Player #${player.userId}` : `User #${userId}`;
  };

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <SectionHeader
        eyebrow="Coin requests"
        title="Top-up approvals"
        description="Approve or reject wallet requests from players."
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <MetricCard
          label="Your Balance"
          value={adminWallet?.balance.toLocaleString() ?? '—'}
          note="Available to fund"
          accent="gold"
        />
        <MetricCard label="Pending" value={pending.length} accent="warning" />
        <MetricCard label="Approved Total" value={totalApproved.toLocaleString()} accent="success" />
      </div>

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
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-slate-800 text-xs font-bold text-slate-400">
                    <IconCoin className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-100">
                      {req.amount.toLocaleString()} coins
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      {playerLabel(req.userId)} &middot; {new Date(req.createdAt).toLocaleDateString()}
                    </p>
                    <div className="mt-1">
                      <StatusPill status={req.status} />
                    </div>
                  </div>
                </div>
                {req.status === 'PENDING' && (
                  <div className="flex shrink-0 gap-2">
                    <ActionButton
                      variant="success"
                      onClick={() => setReviewTarget({ id: req.id, amount: req.amount, userId: req.userId })}
                    >
                      Review
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

      {reviewTarget && (
        <ApproveDialog
          requestId={reviewTarget.id}
          amount={reviewTarget.amount}
          playerLabel={playerLabel(reviewTarget.userId)}
          onClose={() => setReviewTarget(null)}
          onApprove={(id) => handleRequest({ id, action: 'APPROVE' })}
          onReject={(id) => handleRequest({ id, action: 'REJECT' })}
        />
      )}
    </ProtectedRoute>
  );
}
