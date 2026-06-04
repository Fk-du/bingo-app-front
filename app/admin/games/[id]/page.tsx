'use client';

import { use } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useGameWebSocket } from '@/hooks/useWebSocket';
import { useGameStore } from '@/store/game.store';

export default function AdminGameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const gameId = Number(id);
  useGameWebSocket(gameId);
  const { gameStatus, calledNumbers, totalNumbersCalled, prizePool, isConnecting } = useGameStore();

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Game #{gameId}</h1>
      {isConnecting && <p className="text-zinc-500">Connecting to game server...</p>}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold">Status: {gameStatus ?? 'N/A'}</h3>
          <p className="mt-2">Numbers Called: {totalNumbersCalled}</p>
          <p>Prize Pool: {prizePool}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Called Numbers</h3>
          <div className="flex flex-wrap gap-1">
            {calledNumbers.map((n) => (
              <span key={n.id} className="px-2 py-1 bg-emerald-500 text-white rounded text-sm">
                {n.number}
              </span>
            ))}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
