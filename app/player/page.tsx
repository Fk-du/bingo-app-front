'use client';

import { useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus } from '@/types/enums';
import { useActiveGames, useRegisterForGame } from '@/hooks/useGames';
import { GameList } from '@/components/games/GameList';
import { TabBar } from '@/components/ui/Surface';

type LobbyTab = 'all' | 'upcoming' | 'my';

export default function PlayerGamesPage() {
  const { data: games, isLoading } = useActiveGames();
  const { mutate: register } = useRegisterForGame();
  const [tab, setTab] = useState<LobbyTab>('all');

  const jackpotTotal = useMemo(
    () => games?.reduce((sum, g) => sum + g.prizePool, 0) ?? 0,
    [games]
  );

  const filteredGames = useMemo(() => {
    if (!games) return [];
    if (tab === 'upcoming') {
      return games.filter((g) => g.status === GameStatus.REGISTRATION_OPEN);
    }
    if (tab === 'my') {
      return games.filter(
        (g) => g.status === GameStatus.IN_PROGRESS || g.status === GameStatus.CLAIM_PENDING
      );
    }
    return games;
  }, [games, tab]);

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <div className="bp-jackpot-banner mb-4 overflow-hidden rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-bp-gold/80">Jackpot</p>
            <p className="mt-1 text-3xl font-black text-bp-gold">
              {jackpotTotal > 0 ? jackpotTotal.toLocaleString() : '50,000'}
            </p>
            <p className="mt-0.5 text-xs text-bp-muted">Total prize pool across active games</p>
          </div>
          <div className="text-4xl opacity-80">🎉</div>
        </div>
      </div>

      <TabBar
        tabs={[
          { id: 'all', label: 'All Games' },
          { id: 'upcoming', label: 'Upcoming' },
          { id: 'my', label: 'My Games' },
        ]}
        active={tab}
        onChange={(id) => setTab(id as LobbyTab)}
      />

      <div className="mt-4">
        {isLoading ? (
          <div className="space-y-3">
            <div className="h-28 animate-pulse rounded-2xl bg-bp-surface" />
            <div className="h-28 animate-pulse rounded-2xl bg-bp-surface" />
          </div>
        ) : (
          <GameList games={filteredGames} role="player" onRegister={register} />
        )}
      </div>
    </ProtectedRoute>
  );
}
