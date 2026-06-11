'use client';

import Link from 'next/link';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus } from '@/types/enums';
import { useActiveGames } from '@/hooks/useGames';
import { usePlayers } from '@/hooks/usePlayers';
import { useCoinRequests } from '@/hooks/useCoins';
import { useWithdrawals } from '@/hooks/useWithdrawals';
import { useAuthStore } from '@/store/auth.store';
import { ActionButton, LiveBadge, MetricCard, Surface, StatusPill } from '@/components/ui/Surface';

export default function AdminDashboard() {
  const { data: games } = useActiveGames();
  const { data: players } = usePlayers();
  const { data: coinRequests } = useCoinRequests();
  const { data: withdrawals } = useWithdrawals();
  const user = useAuthStore((s) => s.user);

  const pendingCoins = coinRequests?.filter((r) => r.status === 'PENDING') ?? [];
  const pendingWithdrawals = withdrawals?.filter((r) => r.status === 'PENDING') ?? [];
  const activeGame = games?.find((g) => g.status === GameStatus.IN_PROGRESS);
  const displayName = user?.firstName ?? user?.username ?? 'Agent';

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <div className="mb-4">
        <p className="text-sm text-bp-muted">Welcome back,</p>
        <h1 className="text-2xl font-bold text-bp-text">Agent {displayName}</h1>
      </div>

      {activeGame && (
        <Surface className="mb-4 border-bp-primary/30 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-bp-muted">Active Game</p>
              <p className="mt-1 text-lg font-bold text-bp-text">Game #{activeGame.id}</p>
              <p className="text-sm text-bp-gold">{activeGame.prizePool.toLocaleString()} coin pool</p>
            </div>
            <LiveBadge />
          </div>
          <div className="mt-3 flex gap-2">
            <Link href={`/admin/games/${activeGame.id}`} className="flex-1">
              <ActionButton variant="outline" className="w-full">
                Manage
              </ActionButton>
            </Link>
          </div>
        </Surface>
      )}

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Link href="/admin/games">
          <MetricCard label="Pending Claims" value="—" accent="warning" note="Review in game" />
        </Link>
        <Link href="/admin/coins">
          <MetricCard label="Coin Requests" value={pendingCoins.length} accent="primary" />
        </Link>
        <Link href="/admin/withdrawals">
          <MetricCard label="Withdrawals" value={pendingWithdrawals.length} accent="danger" />
        </Link>
        <MetricCard label="Active Games" value={games?.length ?? 0} accent="success" />
      </div>

      <Surface className="mt-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-bp-text">Recent Games</h2>
          <Link href="/admin/games" className="text-sm text-bp-primary">
            View all
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {games?.slice(0, 4).map((game) => (
            <Link
              key={game.id}
              href={`/admin/games/${game.id}`}
              className="flex items-center justify-between rounded-xl border border-bp-border bg-bp-bg px-3 py-2.5 transition hover:border-bp-primary/40"
            >
              <div>
                <p className="text-sm font-medium text-bp-text">Game #{game.id}</p>
                <p className="text-xs text-bp-muted">
                  Entry {game.entryFee} · Pool {game.prizePool}
                </p>
              </div>
              {game.status === GameStatus.IN_PROGRESS ? (
                <LiveBadge />
              ) : (
                <StatusPill status={game.status} />
              )}
            </Link>
          ))}
          {(!games || games.length === 0) && (
            <p className="py-4 text-center text-sm text-bp-muted">No games yet.</p>
          )}
        </div>
      </Surface>

      <Surface className="mt-4 p-4">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-semibold text-bp-text">Players ({players?.length ?? 0})</h2>
          <Link href="/admin/players" className="text-sm text-bp-primary">
            View all
          </Link>
        </div>
        <div className="mt-3 space-y-2">
          {players?.slice(0, 3).map((player) => (
            <div
              key={player.id}
              className="flex items-center justify-between rounded-xl border border-bp-border bg-bp-bg px-3 py-2.5"
            >
              <p className="text-sm font-medium text-bp-text">Player #{player.id}</p>
              <p className="text-xs text-bp-muted">User {player.userId}</p>
            </div>
          ))}
        </div>
      </Surface>
    </ProtectedRoute>
  );
}
