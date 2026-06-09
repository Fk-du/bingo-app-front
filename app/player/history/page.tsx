'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus } from '@/types/enums';
import { useGamesReport } from '@/hooks/useReports';

export default function HistoryPage() {
  const { data: games, isLoading } = useGamesReport();

  const endedGames = games?.filter((g) => g.status === GameStatus.ENDED) ?? [];

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <h1 className="text-xl font-bold mb-4">Game History</h1>

      {isLoading ? (
        <p>Loading...</p>
      ) : endedGames.length === 0 ? (
        <p className="text-zinc-400">No completed games yet.</p>
      ) : (
        <div className="space-y-3">
          {endedGames.map((game) => (
            <div key={game.id} className="bg-zinc-800 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <strong>Game #{game.id}</strong>
                <span className={`px-2 py-0.5 rounded text-xs text-white bg-zinc-500`}>
                  {game.status}
                </span>
              </div>
              <div className="mt-2 text-sm text-zinc-400 space-y-1">
                <p>Entry Fee: {game.entryFee} coins</p>
                <p>Prize Pool: {game.prizePool} coins</p>
                <p>Max Players: {game.maxPlayers}</p>
                {game.startTime && <p>Started: {new Date(game.startTime).toLocaleString()}</p>}
                {game.endTime && <p>Ended: {new Date(game.endTime).toLocaleString()}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
}
