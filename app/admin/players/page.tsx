'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { usePlayers } from '@/hooks/usePlayers';

export default function AdminPlayersPage() {
  const { data: players, isLoading } = usePlayers();

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Players</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-2">
          {players?.map((player: any) => (
            <div key={player.id} className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow">
              <strong>Player #{player.userId}</strong>
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
}
