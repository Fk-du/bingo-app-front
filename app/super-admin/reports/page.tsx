'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useRevenueReport, useGamesReport } from '@/hooks/useReports';
import { GameStatus } from '@/types';

export default function ReportsPage() {
  const { data: revenue, isLoading: loadingRevenue } = useRevenueReport();
  const { data: games, isLoading: loadingGames } = useGamesReport();

  const endedGames = games?.filter((g) => g.status === GameStatus.ENDED) ?? [];
  const totalFees = endedGames.reduce((sum, g) => sum + g.entryFee, 0);
  const totalPrize = endedGames.reduce((sum, g) => sum + g.prizePool, 0);

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>

      {/* Revenue Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold mt-2">
            {loadingRevenue ? '...' : revenue ? String(revenue.totalRevenue ?? revenue) : '0'}
          </p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Total Games</h3>
          <p className="text-2xl font-bold mt-2">{loadingGames ? '...' : games?.length ?? '0'}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Completed Games</h3>
          <p className="text-2xl font-bold mt-2">{endedGames.length}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold text-sm">Total Entry Fees</h3>
          <p className="text-2xl font-bold mt-2">{totalFees}</p>
        </div>
      </div>

      {/* Game History Table */}
      <h3 className="font-semibold mb-3">Game History</h3>
      {loadingGames ? (
        <p>Loading...</p>
      ) : !games || games.length === 0 ? (
        <p className="text-zinc-500">No games found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-zinc-800 rounded-lg shadow">
            <thead>
              <tr className="border-b border-zinc-200 dark:border-zinc-700 text-left">
                <th className="p-3 font-semibold">ID</th>
                <th className="p-3 font-semibold">Status</th>
                <th className="p-3 font-semibold">Entry Fee</th>
                <th className="p-3 font-semibold">Prize Pool</th>
                <th className="p-3 font-semibold">Max Players</th>
                <th className="p-3 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-b border-zinc-200 dark:border-zinc-700">
                  <td className="p-3">#{game.id}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded text-xs text-white ${
                      game.status === GameStatus.ENDED ? 'bg-zinc-500' :
                      game.status === GameStatus.IN_PROGRESS ? 'bg-blue-500' :
                      game.status === GameStatus.CLAIM_PENDING ? 'bg-amber-500' :
                      'bg-emerald-500'
                    }`}>
                      {game.status}
                    </span>
                  </td>
                  <td className="p-3">{game.entryFee}</td>
                  <td className="p-3">{game.prizePool}</td>
                  <td className="p-3">{game.maxPlayers}</td>
                  <td className="p-3">{new Date(game.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ProtectedRoute>
  );
}
