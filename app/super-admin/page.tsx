'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAgents, useFundRequests } from '@/hooks/useAgents';
import { useActiveGames } from '@/hooks/useGames';
import { useRevenueReport } from '@/hooks/useReports';
import { MetricCard, Surface } from '@/components/ui/Surface';

export default function SuperAdminDashboard() {
  const { data: agents } = useAgents();
  const { data: games } = useActiveGames();
  const { data: revenue } = useRevenueReport();
  const { data: fundRequests } = useFundRequests();

  const activeAgents = agents?.filter((a) => a.active) ?? [];
  const pendingFunds = fundRequests?.filter((r) => r.status === 'PENDING') ?? [];
  const revenueValue = revenue ? String(revenue.totalRevenue ?? revenue) : '—';

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <h1 className="mb-4 text-2xl font-bold text-bp-text">Platform Overview</h1>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Total Agents"
          value={agents?.length ?? '—'}
          accent="primary"
          note={`${activeAgents.length} active`}
          trend="+12%"
        />
        <MetricCard label="Total Players" value="—" accent="gold" trend="+8%" />
        <MetricCard label="Active Games" value={games?.length ?? '—'} accent="success" />
        <MetricCard label="Platform Revenue" value={revenueValue} accent="gold" trend="+15%" />
      </div>

      <Surface className="mt-4 p-4">
        <p className="text-sm font-semibold text-bp-text">Revenue Overview</p>
        <p className="mt-1 text-xs text-bp-muted">Weekly trend</p>
        <div className="mt-4 flex h-32 items-end justify-between gap-2">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
            <div key={day} className="flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-bp-primary/60"
                style={{ height: `${30 + (i % 4) * 18}%` }}
              />
              <span className="text-[10px] text-bp-muted">{day}</span>
            </div>
          ))}
        </div>
      </Surface>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <MetricCard label="Pending fund requests" value={pendingFunds.length} accent="warning" />
        <MetricCard label="Active agents" value={activeAgents.length} accent="success" />
      </div>
    </ProtectedRoute>
  );
}
