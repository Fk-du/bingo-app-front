'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useActiveGames, useRegisterForGame } from '@/hooks/useGames';
import { GameList } from '@/components/games/GameList';
import { useAuthStore } from '@/store/auth.store';

export default function PlayerGamesPage() {
  const { data: games, isLoading } = useActiveGames();
  const { mutate: register } = useRegisterForGame();
  const user = useAuthStore((s) => s.user);

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <h1 className="text-xl font-bold mb-4">Available Games</h1>
      <p className="text-zinc-400 mb-4">Balance: {user?.balance ?? 0} coins</p>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <GameList games={games ?? []} role="player" onRegister={register} />
      )}
    </ProtectedRoute>
  );
}
