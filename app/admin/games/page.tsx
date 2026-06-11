'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useActiveGames, useStartGame, useCancelGame, useEndGame } from '@/hooks/useGames';
import { CreateGameForm } from '@/components/games/CreateGameForm';
import { GameList } from '@/components/games/GameList';
import { SectionHeader, Surface } from '@/components/ui/Surface';

export default function AdminGamesPage() {
  const { data: games, isLoading } = useActiveGames();
  const { mutate: startGame } = useStartGame();
  const { mutate: cancelGame } = useCancelGame();
  const { mutate: endGame } = useEndGame();

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <SectionHeader
        eyebrow="Games"
        title="Game management"
        description="Open registrations, control live rounds, and close tables from one place."
      />

      <Surface className="p-4">
        <div className="mb-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Create game</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">New table setup</h2>
        </div>
        <CreateGameForm />
      </Surface>

      <Surface className="mt-4 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Active games</p>
            <h2 className="mt-1 text-lg font-semibold text-slate-100">Current queue</h2>
          </div>
          <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-300">
            {isLoading ? 'Loading' : games?.length ?? 0}
          </span>
        </div>
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-20 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
            <div className="h-20 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
          </div>
        ) : (
          <GameList games={games ?? []} role="admin" onStart={startGame} onCancel={cancelGame} onEnd={endGame} />
        )}
      </Surface>
    </ProtectedRoute>
  );
}
