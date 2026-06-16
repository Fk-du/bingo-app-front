'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAgents, useInviteAgent, useUpdateAgentStatus, useFundRequests, useHandleFundRequest } from '@/hooks/useAgents';
import { AgentResponse, AgentFundRequestResponse } from '@/types/agent';
import { ActionButton, EmptyState, SectionHeader, Surface, StatusPill } from '@/components/ui/Surface';

export default function AgentsPage() {
  const { data: agents, isLoading } = useAgents();
  const { mutate: invite, isPending } = useInviteAgent();
  const { mutate: updateStatus } = useUpdateAgentStatus();
  const { data: fundRequests, isLoading: loadingFunds } = useFundRequests();
  const { mutate: handleFund } = useHandleFundRequest();

  const pendingApproval = agents?.filter((a) => !a.approved && a.active) ?? [];
  const approvedAgents = agents?.filter((a) => a.approved) ?? [];
  const pendingFunds = fundRequests?.filter((r) => r.status === 'PENDING') ?? [];
  const approvedFunds = fundRequests?.filter((r) => r.status === 'APPROVED') ?? [];

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
          ) : pendingFunds.length === 0 ? (
            <EmptyState title="No pending fund requests" description="Approved or pending items will appear here." />
          ) : (
            <div className="space-y-2">
              {pendingFunds.map((req: AgentFundRequestResponse) => (
                <div
                  key={req.id}
                  className="rounded-[18px] border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-100">{req.amount} coins</p>
                      <p className="text-xs text-slate-500">Agent #{req.agentId}</p>
                    </div>
                    <StatusPill status={req.status} />
                  </div>
                  <div className="mt-3 flex gap-2">
                    <ActionButton variant="success" onClick={() => handleFund({ id: req.id, action: 'APPROVE' })}>
                      Approve
                    </ActionButton>
                    <ActionButton variant="danger" onClick={() => handleFund({ id: req.id, action: 'REJECT' })}>
                      Reject
                    </ActionButton>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Surface>
      </div>
    </ProtectedRoute>
  );
}
