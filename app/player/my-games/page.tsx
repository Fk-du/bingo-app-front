'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus } from '@/types/enums';
import { useActiveGames } from '@/hooks/useGames';
import { ActionButton, EmptyState, LiveBadge, Surface, StatusPill } from '@/components/ui/Surface';

export default function MyGamesPage() {
  const { data: games, isLoading } = useActiveGames();

  const myGames = useMemo(
    () =>
      games?.filter(
        (g) =>
          g.status === GameStatus.IN_PROGRESS ||
          g.status === GameStatus.CLAIM_PENDING ||
          g.status === GameStatus.REGISTRATION_OPEN
      ) ?? [],
    [games]
  );

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <h1 className="mb-4 text-xl font-bold text-bp-text">My Games</h1>

      {isLoading ? (
        <div className="space-y-3">
          <div className="h-24 animate-pulse rounded-2xl bg-bp-surface" />
          <div className="h-24 animate-pulse rounded-2xl bg-bp-surface" />
        </div>
      ) : myGames.length === 0 ? (
        <EmptyState
          title="No active games"
          description="Register for a game in the lobby to see it here."
        />
      ) : (
        <div className="space-y-3">
          {myGames.map((game) => (
            <Surface key={game.id} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-semibold text-bp-text">Game #{game.id}</p>
                  <p className="mt-1 text-sm font-bold text-bp-gold">
                    {game.prizePool.toLocaleString()} coins
                  </p>
                </div>
                {game.status === GameStatus.IN_PROGRESS ? (
                  <LiveBadge />
                ) : (
                  <StatusPill status={game.status} />
                )}
              </div>
              <Link href={`/player/game/${game.id}`} className="mt-3 block">
                <ActionButton variant="primary" className="w-full">
                  {game.status === GameStatus.IN_PROGRESS ? 'Continue Playing' : 'View Game'}
                </ActionButton>
              </Link>
            </Surface>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
}
