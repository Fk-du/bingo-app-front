'use client';

import { useMemo, useState } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus } from '@/types/enums';
import { useActiveGames, useRegisterForGame } from '@/hooks/useGames';
import { GameList } from '@/components/games/GameList';
import { TabBar } from '@/components/ui/Surface';
import { IconCoin } from '@/components/ui/Icons';

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

  const activeCount = games?.filter(g => g.status === GameStatus.IN_PROGRESS).length ?? 0;

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <div className="bp-jackpot-banner mb-4 overflow-hidden rounded-2xl p-4 bp-glow-pulse relative">
        <div className="absolute inset-0 bg-gradient-to-br from-bp-gold/5 via-transparent to-bp-primary/5" />
        <div className="relative flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-bp-gold/90">Jackpot Pool</p>
            <p className="mt-1 text-3xl font-black text-bp-gold drop-shadow-[0_0_12px_rgba(242,201,76,0.3)]">
              {(jackpotTotal > 0 ? jackpotTotal : 50000).toLocaleString()}
            </p>
            <div className="mt-1 flex items-center gap-2">
              <span className="bp-live-badge inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bp-danger" />
                {activeCount} live
              </span>
              <span className="text-xs text-bp-muted">{games?.length ?? 0} games available</span>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <IconCoin className="h-10 w-10 text-bp-gold drop-shadow-[0_0_8px_rgba(242,201,76,0.4)]" />
            <span className="text-[10px] text-bp-gold/60 font-medium uppercase tracking-wider">Total Pool</span>
          </div>
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
            <div className="h-32 animate-pulse rounded-2xl bg-bp-surface" />
            <div className="h-32 animate-pulse rounded-2xl bg-bp-surface" />
          </div>
        ) : (
          <GameList games={filteredGames} role="player" onRegister={register} />
        )}
      </div>
    </ProtectedRoute>
  );
}
