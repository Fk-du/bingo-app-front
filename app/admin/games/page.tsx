'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useActiveGames, useStartGame, useCancelGame, useEndGame } from '@/hooks/useGames';
import { CreateGameForm } from '@/components/games/CreateGameForm';
import { GameList } from '@/components/games/GameList';

export default function AdminGamesPage() {
  const { data: games, isLoading } = useActiveGames();
  const { mutate: startGame } = useStartGame();
  const { mutate: cancelGame } = useCancelGame();
  const { mutate: endGame } = useEndGame();

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Games</h1>
      <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow mb-6">
        <h3 className="font-semibold mb-3">Create New Game</h3>
        <CreateGameForm />
      </div>
      <h3 className="font-semibold mb-3">Active Games</h3>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <GameList games={games ?? []} role="admin" onStart={startGame} onCancel={cancelGame} onEnd={endGame} />
      )}
    </ProtectedRoute>
  );
}
