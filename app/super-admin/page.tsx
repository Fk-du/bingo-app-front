'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAgents, useFundRequests } from '@/hooks/useAgents';
import { useGamesReport } from '@/hooks/useReports';
import { MetricCard, SectionHeader, Surface } from '@/components/ui/Surface';
import { GameStatus } from '@/types';

export default function SuperAdminDashboard() {
  const { data: agents, isLoading: loadingAgents } = useAgents();
  const { data: allGames, isLoading: loadingAllGames } = useGamesReport();
  const { data: fundRequests, isLoading: loadingFunds } = useFundRequests();

  const activeAgents = agents?.filter((a) => a.active) ?? [];
  const pendingApproval = agents?.filter((a) => !a.approved && a.active) ?? [];
  const pendingFunds = fundRequests?.filter((r) => r.status === 'PENDING') ?? [];

  const endedGames = allGames?.filter((g) => g.status === GameStatus.ENDED) ?? [];
  const inProgressGames = allGames?.filter((g) => g.status === GameStatus.IN_PROGRESS) ?? [];
  const totalEntryFees = endedGames.reduce((sum, g) => sum + g.entryFee, 0);

  const barData = [
    { label: 'Agents', value: agents?.length ?? 0, color: 'bg-bp-primary/60' },
    { label: 'Games', value: allGames?.length ?? 0, color: 'bg-bp-warning/60' },
    { label: 'Live', value: inProgressGames.length, color: 'bg-bp-gold/60' },
    { label: 'Ended', value: endedGames.length, color: 'bg-bp-success/60' },
  ];

  const maxBarValue = Math.max(...barData.map((b) => b.value), 1);

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <SectionHeader
        eyebrow="Dashboard"
        title="Platform Overview"
        description="Key metrics and activity across all agents."
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/super-admin/agents">
          <MetricCard
            label="Total Agents"
            value={loadingAgents ? '...' : agents?.length ?? 0}
            accent="primary"
            note={`${activeAgents.length} active`}
          />
        </Link>
        <MetricCard
          label="Total Games"
          value={loadingAllGames ? '...' : allGames?.length ?? 0}
          accent="warning"
          note={`${endedGames.length} completed`}
        />
        <MetricCard
          label="Live Games"
          value={loadingAllGames ? '...' : inProgressGames.length}
          accent="success"
        />
        <Link href="/super-admin/agents">
          <MetricCard
            label="Pending Approvals"
            value={pendingApproval.length}
            accent="gold"
            note={pendingApproval.length > 0 ? `${pendingApproval.length} agent(s) waiting` : 'All approved'}
          />
        </Link>
      </div>

      <Surface className="mt-4 p-4">
        <p className="text-sm font-semibold text-bp-text">Platform Summary</p>
        <p className="mt-1 text-xs text-bp-muted">Aggregate metrics across all agents</p>
        <div className="mt-4 flex h-32 items-end justify-between gap-2">
          {barData.map((bar) => (
            <div key={bar.label} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-medium text-bp-text">{bar.value}</span>
              <div
                className={`w-full rounded-t-md ${bar.color}`}
                style={{ height: `${(bar.value / maxBarValue) * 100}%`, minHeight: bar.value > 0 ? '8px' : '0' }}
              />
              <span className="text-[10px] text-bp-muted">{bar.label}</span>
            </div>
          ))}
        </div>
      </Surface>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Link href="/super-admin/agents">
          <Surface className="p-4 transition hover:border-bp-primary/40">
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-bp-muted">Fund Requests</p>
            <p className="mt-1.5 text-2xl font-bold text-bp-text">
              {loadingFunds ? '...' : pendingFunds.length}
            </p>
            <p className="mt-1 text-xs text-bp-muted">
              {pendingFunds.length > 0 ? 'pending approval across agents' : 'No pending requests'}
            </p>
          </Surface>
        </Link>
        <Surface className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-bp-muted">Entry Fees Collected</p>
          <p className="mt-1.5 text-2xl font-bold text-bp-gold">
            {loadingAllGames ? '...' : totalEntryFees.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-bp-muted">
            from {endedGames.length} completed game{endedGames.length !== 1 ? 's' : ''}
          </p>
        </Surface>
      </div>

      <Surface className="mt-4 p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-bp-text">Recent Agents</p>
          <Link href="/super-admin/agents" className="text-sm text-bp-primary">View all</Link>
        </div>
        <div className="mt-3 space-y-2">
          {agents?.slice(0, 5).map((agent) => (
            <div
              key={agent.adminUserId}
              className="flex items-center justify-between rounded-xl border border-bp-border bg-bp-bg px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-bp-text">
                  {agent.firstName ?? agent.username ?? `Agent #${agent.adminUserId}`}
                </p>
                <p className="text-xs text-bp-muted">
                  Balance: {agent.balance.toLocaleString()}
                </p>
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                agent.approved ? 'bg-bp-success/10 text-bp-success' : 'bg-bp-warning/10 text-bp-warning'
              }`}>
                {agent.approved ? 'Approved' : 'Pending'}
              </span>
            </div>
          ))}
          {(!agents || agents.length === 0) && (
            <p className="py-4 text-center text-sm text-bp-muted">No agents yet. Create an invite from the Agents page.</p>
          )}
        </div>
      </Surface>
    </ProtectedRoute>
  );
}
