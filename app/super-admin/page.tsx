'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAgents, useFundRequests } from '@/hooks/useAgents';
import { useActiveGames } from '@/hooks/useGames';
import { useRevenueReport } from '@/hooks/useReports';

export default function SuperAdminDashboard() {
  const { data: agents } = useAgents();
  const { data: games } = useActiveGames();
  const { data: revenue } = useRevenueReport();
  const { data: fundRequests } = useFundRequests();

  const activeAgents = agents?.filter((a) => a.active) ?? [];
  const pendingFunds = fundRequests?.filter((r) => r.status === 'PENDING') ?? [];

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Total Agents</h3>
          <p className="text-3xl font-bold mt-2">{agents?.length ?? '--'}</p>
          <p className="text-xs text-zinc-500 mt-1">{activeAgents.length} active</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Active Games</h3>
          <p className="text-3xl font-bold mt-2">{games?.length ?? '--'}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Revenue</h3>
          <p className="text-3xl font-bold mt-2">{revenue ? String(revenue.totalRevenue ?? revenue) : '--'}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Pending Fund Requests</h3>
          <p className="text-3xl font-bold mt-2">{pendingFunds.length}</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
