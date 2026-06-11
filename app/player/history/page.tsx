'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus } from '@/types/enums';
import { useGamesReport } from '@/hooks/useReports';
import { EmptyState, SectionHeader, Surface, StatusPill } from '@/components/ui/Surface';

export default function HistoryPage() {
  const { data: games, isLoading } = useGamesReport();

  const endedGames = games?.filter((g) => g.status === GameStatus.ENDED) ?? [];

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <SectionHeader
        eyebrow="History"
        title="Completed games"
        description="A compact view of finished tables and settlement timing."
      />

      <Surface className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-20 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
            <div className="h-20 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
          </div>
        ) : endedGames.length === 0 ? (
          <EmptyState title="No completed games yet" description="Finished tables will show up here after they close." />
        ) : (
          <div className="space-y-2">
            {endedGames.map((game) => (
              <div key={game.id} className="rounded-[18px] border border-slate-800 bg-slate-900/60 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-100">Game #{game.id}</p>
                    <div className="mt-2">
                      <StatusPill status={game.status} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-right text-sm text-slate-400 sm:grid-cols-4">
                    <span>Fee {game.entryFee}</span>
                    <span>Pool {game.prizePool}</span>
                    <span>Players {game.maxPlayers}</span>
                    <span>{game.endTime ? new Date(game.endTime).toLocaleDateString() : '—'}</span>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-3 text-xs text-slate-500">
                  {game.startTime && <span>Started {new Date(game.startTime).toLocaleString()}</span>}
                  {game.endTime && <span>Ended {new Date(game.endTime).toLocaleString()}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </Surface>
    </ProtectedRoute>
  );
}
