'use client';

import { useState } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAgents, useInviteAgent, useUpdateAgentStatus, useFundRequests, useHandleFundRequest } from '@/hooks/useAgents';
import { useAdminWallet } from '@/hooks/usePlayers';
import { AgentResponse, AgentFundRequestResponse } from '@/types/agent';
import { ActionButton, EmptyState, MetricCard, SectionHeader, Surface, StatusPill } from '@/components/ui/Surface';
import { IconCoin } from '@/components/ui/Icons';

interface FundReviewDialogProps {
  requestId: number;
  amount: number;
  agentLabel: string;
  onClose: () => void;
  onApprove: (id: number) => void;
  onReject: (id: number) => void;
}

function FundReviewDialog({ requestId, amount, agentLabel, onClose, onApprove, onReject }: FundReviewDialogProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <Surface className="relative w-full max-w-sm p-5">
        <p className="text-lg font-bold text-bp-text">Review Fund Request</p>
        <p className="mt-1 text-sm text-bp-muted">
          {agentLabel} requested <span className="font-semibold text-bp-gold">{amount.toLocaleString()}</span> coins
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

export default function AgentsPage() {
  const { data: agents, isLoading } = useAgents();
  const { mutate: invite, isPending } = useInviteAgent();
  const { mutate: updateStatus } = useUpdateAgentStatus();
  const { data: fundRequests, isLoading: loadingFunds } = useFundRequests();
  const { data: adminWallet } = useAdminWallet();
  const { mutate: handleFund } = useHandleFundRequest();
  const [reviewTarget, setReviewTarget] = useState<{
    id: number;
    amount: number;
    agentId: number;
  } | null>(null);

  const pendingApproval = agents?.filter((a) => !a.approved && a.active) ?? [];
  const approvedAgents = agents?.filter((a) => a.approved) ?? [];
  const pendingFunds = fundRequests?.filter((r) => r.status === 'PENDING') ?? [];
  const approvedFunds = fundRequests?.filter((r) => r.status === 'APPROVED') ?? [];

  const agentLabel = (adminUserId: number) => {
    const agent = agents?.find((a) => a.adminUserId === adminUserId);
    return agent?.businessName ?? agent?.username ?? `Agent #${adminUserId}`;
  };

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <SectionHeader
        eyebrow="Agents"
        title="Agent management"
        description="Approve new agents and manage their funding requests."
        action={
          <ActionButton onClick={() => invite()} disabled={isPending} variant="primary">
            {isPending ? 'Generating...' : 'Invite agent'}
          </ActionButton>
        }
      />

      <div className="mb-4 grid grid-cols-3 gap-3">
        <MetricCard
          label="Your Balance"
          value={adminWallet?.balance.toLocaleString() ?? '—'}
          accent="gold"
        />
        <MetricCard label="Pending Funds" value={pendingFunds.length} accent="warning" />
        <MetricCard
          label="Approved Funds"
          value={approvedFunds.reduce((s, r) => s + r.amount, 0).toLocaleString()}
          accent="success"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="space-y-4">
          {pendingApproval.length > 0 && (
            <Surface className="p-4">
              <div className="mb-4">
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Pending approval</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-100">{pendingApproval.length} agent{pendingApproval.length !== 1 ? 's' : ''} awaiting review</h2>
              </div>

              {isLoading ? (
                <div className="space-y-2">
                  <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
                  <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
                </div>
              ) : (
                <div className="space-y-2">
                  {pendingApproval.map((agent: AgentResponse) => (
                    <div
                      key={agent.adminUserId}
                      className="rounded-[18px] border border-amber-500/30 bg-amber-500/5 px-4 py-3"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-slate-100">
                            {agent.businessName ?? `@${agent.username ?? `Agent #${agent.adminUserId}`}`}
                          </p>
                          <p className="text-xs text-slate-500">ID {agent.adminUserId}</p>
                        </div>
                        <StatusPill status="PENDING" />
                      </div>
                      <div className="mt-3 flex gap-2">
                        <ActionButton variant="success" onClick={() => updateStatus({ id: agent.adminUserId, status: 'APPROVE' })}>
                          Approve
                        </ActionButton>
                        <ActionButton variant="danger" onClick={() => updateStatus({ id: agent.adminUserId, status: 'REJECT' })}>
                          Reject
                        </ActionButton>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Surface>
          )}

          <Surface className="p-4">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Registered agents</p>
                <h2 className="mt-1 text-lg font-semibold text-slate-100">{agents?.length ?? 0} total</h2>
              </div>
            </div>

            {isLoading ? (
              <div className="space-y-2">
                <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
                <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
              </div>
            ) : approvedAgents.length ? (
              <div className="space-y-2">
                {approvedAgents.map((agent: AgentResponse) => (
                  <div
                    key={agent.adminUserId}
                    className="flex flex-wrap items-center gap-3 rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-100">
                        {agent.businessName ?? `@${agent.username ?? `Agent #${agent.adminUserId}`}`}
                      </p>
                      <p className="text-xs text-slate-500">ID {agent.adminUserId}</p>
                    </div>
                    <StatusPill status={agent.active ? 'ACTIVE' : 'INACTIVE'} />
                  </div>
                ))}
              </div>
            ) : !pendingApproval.length ? (
              <EmptyState title="No agents found" description="Invites will populate this list." />
            ) : null}
          </Surface>
        </div>

        <Surface className="p-4">
          <div className="mb-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Fund requests</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">
              Pending {pendingFunds.length} &bull; Approved {approvedFunds.length}
            </h2>
          </div>

          {loadingFunds ? (
            <div className="space-y-2">
              <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
              <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
            </div>
          ) : fundRequests?.length ? (
            <div className="space-y-2">
              {fundRequests.map((req: AgentFundRequestResponse) => (
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
                        {agentLabel(req.agentId)} &middot; {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                      <div className="mt-1">
                        <StatusPill status={req.status} />
                      </div>
                    </div>
                  </div>
                  {req.status === 'PENDING' && (
                    <ActionButton
                      variant="success"
                      onClick={() => setReviewTarget({ id: req.id, amount: req.amount, agentId: req.agentId })}
                    >
                      Review
                    </ActionButton>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No fund requests" description="Pending items will appear here." />
          )}
        </Surface>
      </div>

      {reviewTarget && (
        <FundReviewDialog
          requestId={reviewTarget.id}
          amount={reviewTarget.amount}
          agentLabel={agentLabel(reviewTarget.agentId)}
          onClose={() => setReviewTarget(null)}
          onApprove={(id) => handleFund({ id, action: 'APPROVE' })}
          onReject={(id) => handleFund({ id, action: 'REJECT' })}
        />
      )}
    </ProtectedRoute>
  );
}
