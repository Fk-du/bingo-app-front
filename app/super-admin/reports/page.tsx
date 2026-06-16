'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useRevenueReport, useGamesReport } from '@/hooks/useReports';
import { GameStatus } from '@/types';
import { EmptyState, MetricCard, SectionHeader, StatusPill, Surface } from '@/components/ui/Surface';

export default function ReportsPage() {
  const { data: revenue, isLoading: loadingRevenue } = useRevenueReport();
  const { data: games, isLoading: loadingGames } = useGamesReport();

  const endedGames = games?.filter((g) => g.status === GameStatus.ENDED) ?? [];
  const totalFees = endedGames.reduce((sum, g) => sum + g.entryFee, 0);
  const totalPrize = endedGames.reduce((sum, g) => sum + g.prizePool, 0);

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <SectionHeader
        eyebrow="Reports"
        title="Revenue &amp; game history"
        description="Platform-wide earnings and completed game log."
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MetricCard
          label="Total Revenue"
          value={loadingRevenue ? '...' : revenue?.balance?.toLocaleString() ?? '0'}
          accent="gold"
        />
        <MetricCard
          label="Total Games"
          value={loadingGames ? '...' : games?.length ?? '0'}
          accent="primary"
        />
        <MetricCard
          label="Completed Games"
          value={endedGames.length}
          accent="success"
        />
        <MetricCard
          label="Total Entry Fees"
          value={totalFees}
          accent="slate"
        />
      </div>

      <SectionHeader
        eyebrow="History"
        title="Game History"
        description="All games played across the platform."
      />

      {loadingGames ? (
        <div className="space-y-2">
          <div className="h-12 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
          <div className="h-12 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
        </div>
      ) : !games || games.length === 0 ? (
        <EmptyState title="No games found" description="Games will appear here once they are created." />
      ) : (
        <Surface className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-bp-border text-left text-[11px] uppercase tracking-[0.18em] text-bp-muted">
                <th className="p-4 font-semibold">ID</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Entry Fee</th>
                <th className="p-4 font-semibold">Prize Pool</th>
                <th className="p-4 font-semibold">Max Players</th>
                <th className="p-4 font-semibold">Created</th>
              </tr>
            </thead>
            <tbody>
              {games.map((game) => (
                <tr key={game.id} className="border-b border-bp-border/50 last:border-0">
                  <td className="p-4 text-bp-text">#{game.id}</td>
                  <td className="p-4">
                    <StatusPill status={game.status} />
                  </td>
                  <td className="p-4 text-bp-text">{game.entryFee}</td>
                  <td className="p-4 text-bp-text">{game.prizePool}</td>
                  <td className="p-4 text-bp-text">{game.maxPlayers}</td>
                  <td className="p-4 text-bp-muted">{new Date(game.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Surface>
      )}
    </ProtectedRoute>
  );
}
