'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAgents, useFundRequests } from '@/hooks/useAgents';
import { useActiveGames } from '@/hooks/useGames';
import { useRevenueReport, useGamesReport } from '@/hooks/useReports';
import { EmptyState, MetricCard, SectionHeader, Surface } from '@/components/ui/Surface';
import { GameStatus } from '@/types';

export default function SuperAdminDashboard() {
  const { data: agents, isLoading: loadingAgents } = useAgents();
  const { data: games, isLoading: loadingGames } = useActiveGames();
  const { data: revenue, isLoading: loadingRevenue } = useRevenueReport();
  const { data: allGames, isLoading: loadingAllGames } = useGamesReport();
  const { data: fundRequests, isLoading: loadingFunds } = useFundRequests();

  const activeAgents = agents?.filter((a) => a.active) ?? [];
  const pendingFunds = fundRequests?.filter((r) => r.status === 'PENDING') ?? [];
  const totalPlayers = revenue?.totalPlayers ?? 0;
  const totalRevenue = revenue?.balance ?? 0;

  const endedGames = allGames?.filter((g) => g.status === GameStatus.ENDED) ?? [];
  const totalEntryFees = endedGames.reduce((sum, g) => sum + g.entryFee, 0);

  const barData = [
    { label: 'Games', value: allGames?.length ?? 0, color: 'bg-bp-primary/60' },
    { label: 'Ended', value: endedGames.length, color: 'bg-bp-success/60' },
    { label: 'Active', value: games?.length ?? 0, color: 'bg-bp-gold/60' },
    { label: 'Agents', value: agents?.length ?? 0, color: 'bg-bp-warning/60' },
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
        <MetricCard
          label="Total Agents"
          value={loadingAgents ? '...' : agents?.length ?? 0}
          accent="primary"
          note={`${activeAgents.length} active`}
        />
        <MetricCard
          label="Total Players"
          value={loadingRevenue ? '...' : totalPlayers}
          accent="gold"
        />
        <MetricCard
          label="Active Games"
          value={loadingGames ? '...' : games?.length ?? 0}
          accent="success"
        />
        <MetricCard
          label="Platform Revenue"
          value={loadingRevenue ? '...' : totalRevenue.toLocaleString()}
          accent="gold"
        />
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
        <Surface className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-bp-muted">Fund requests</p>
          <p className="mt-1.5 text-2xl font-bold text-bp-text">
            {loadingFunds ? '...' : pendingFunds.length}
          </p>
          <p className="mt-1 text-xs text-bp-muted">pending approval</p>
        </Surface>
        <Surface className="p-4">
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-bp-muted">Entry fees collected</p>
          <p className="mt-1.5 text-2xl font-bold text-bp-text">
            {loadingAllGames ? '...' : totalEntryFees.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-bp-muted">from {endedGames.length} completed game{endedGames.length !== 1 ? 's' : ''}</p>
        </Surface>
      </div>
    </ProtectedRoute>
  );
}
