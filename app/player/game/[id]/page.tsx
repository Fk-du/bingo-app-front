'use client';

import { use } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useGameWebSocket } from '@/hooks/useWebSocket';
import { useGameStore } from '@/store/game.store';
import { useClaimBingo } from '@/hooks/useGames';
import { BingoCard } from '@/components/games/BingoCard';

export default function PlayerGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const gameId = Number(id);
  useGameWebSocket(gameId);
  const { mutate: claimBingo, isPending } = useClaimBingo();
  const { gameStatus, calledNumbers, prizePool, isConnecting } = useGameStore();
  const calledSet = new Set(calledNumbers.map((n) => n.number));

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <h1 className="text-xl font-bold mb-4">Game #{gameId}</h1>
      {isConnecting && <p className="text-zinc-400">Connecting to game...</p>}
      <p className="mb-4">Status: {gameStatus ?? 'N/A'} | Prize Pool: {prizePool}</p>
      <div className="flex gap-6 flex-wrap">
        <BingoCard numbers={mockCard()} calledNumbers={calledSet} />
        <div>
          <h3 className="font-semibold mb-2">Called Numbers ({calledNumbers.length})</h3>
          <div className="flex flex-wrap gap-1 max-w-xs">
            {calledNumbers.map((n) => (
              <span key={n.id} className="px-2 py-1 bg-emerald-500 text-white rounded text-sm">
                {n.number}
              </span>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={() => claimBingo(gameId)}
        disabled={isPending}
        className="mt-4 px-6 py-3 bg-rose-600 text-white rounded-lg text-lg font-bold cursor-pointer disabled:opacity-50 hover:bg-rose-700"
      >
        {isPending ? 'Checking...' : 'BINGO!'}
      </button>
    </ProtectedRoute>
  );
}

function mockCard(): number[][] {
  return [
    [1, 16, 31, 46, 61],
    [5, 20, 35, 50, 65],
    [10, 25, 0, 55, 70],
    [14, 29, 44, 59, 74],
    [8, 23, 38, 53, 68],
  ];
}
