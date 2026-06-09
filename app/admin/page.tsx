'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useActiveGames } from '@/hooks/useGames';
import { usePlayers } from '@/hooks/usePlayers';
import { useCoinRequests } from '@/hooks/useCoins';
import { useWithdrawals } from '@/hooks/useWithdrawals';
import { useAuthStore } from '@/store/auth.store';

export default function AdminDashboard() {
  const { data: games } = useActiveGames();
  const { data: players } = usePlayers();
  const { data: coinRequests } = useCoinRequests();
  const { data: withdrawals } = useWithdrawals();
  const user = useAuthStore((s) => s.user);

  const pendingCoins = coinRequests?.filter((r) => r.status === 'PENDING') ?? [];
  const pendingWithdrawals = withdrawals?.filter((r) => r.status === 'PENDING') ?? [];

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Agent Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Active Games</h3>
          <p className="text-3xl font-bold mt-2">{games?.length ?? '--'}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Total Players</h3>
          <p className="text-3xl font-bold mt-2">{players?.length ?? '--'}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Balance</h3>
          <p className="text-3xl font-bold mt-2">{user?.balance ?? '--'}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow border-l-4 border-amber-500">
          <h3 className="font-semibold text-sm">Pending Requests</h3>
          <p className="text-3xl font-bold mt-2">{pendingCoins.length + pendingWithdrawals.length}</p>
          <p className="text-xs text-zinc-500 mt-1">{pendingCoins.length} coin · {pendingWithdrawals.length} withdrawal</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
