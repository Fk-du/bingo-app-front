import Link from 'next/link';
import { GameResponse, GameStatus } from '@/types';
import { ActionButton, EmptyState, LiveBadge, Surface, StatusPill } from '@/components/ui/Surface';

const GAME_NAMES = ['Mega Bingo', 'Happy Hour', 'Night Owl', 'Golden Draw', 'Turbo Round', 'Classic 75'];

function gameDisplayName(id: number): string {
  return GAME_NAMES[id % GAME_NAMES.length];
}

interface GameListProps {
  games: GameResponse[];
  role: 'admin' | 'player';
  onStart?: (id: number) => void;
  onCancel?: (id: number) => void;
  onEnd?: (id: number) => void;
  onRegister?: (id: number) => void;
}

export function GameList({ games, role, onStart, onCancel, onEnd, onRegister }: GameListProps) {
  if (!games.length) {
    return (
      <EmptyState
        title="No games available"
        description="New games will appear here when your agent opens registration."
      />
    );
  }

  if (role === 'player') {
    return (
      <div className="space-y-3">
        {games.map((game) => (
          <PlayerGameCard key={game.id} game={game} onRegister={onRegister} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {games.map((game) => (
        <Surface key={game.id} className="p-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <Link
                  href={`/admin/games/${game.id}`}
                  className="text-base font-semibold text-bp-text transition hover:text-bp-primary"
                >
                  {gameDisplayName(game.id)} #{game.id}
                </Link>
                {game.status === GameStatus.IN_PROGRESS ? (
                  <LiveBadge />
                ) : (
                  <StatusPill status={game.status} />
                )}
              </div>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-bp-muted">
                <span className="rounded-full border border-bp-border bg-bp-bg px-3 py-1">
                  Fee {game.entryFee}
                </span>
                <span className="rounded-full border border-bp-gold/30 bg-bp-gold/10 px-3 py-1 text-bp-gold">
                  Pool {game.prizePool.toLocaleString()}
                </span>
                <span className="rounded-full border border-bp-border bg-bp-bg px-3 py-1">
                  Max {game.maxPlayers} players
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {game.status === GameStatus.REGISTRATION_OPEN && onStart && (
                <ActionButton variant="success" onClick={() => onStart(game.id)}>
                  Start
                </ActionButton>
              )}
              {game.status === GameStatus.REGISTRATION_OPEN && onCancel && (
                <ActionButton variant="danger" onClick={() => onCancel(game.id)}>
                  Cancel
                </ActionButton>
              )}
              {game.status === GameStatus.IN_PROGRESS && onEnd && (
                <ActionButton variant="danger" onClick={() => onEnd(game.id)}>
                  End Game
                </ActionButton>
              )}
            </div>
          </div>
        </Surface>
      ))}
    </div>
  );
}

function PlayerGameCard({
  game,
  onRegister,
}: {
  game: GameResponse;
  onRegister?: (id: number) => void;
}) {
  const isLive = game.status === GameStatus.IN_PROGRESS;
  const isOpen = game.status === GameStatus.REGISTRATION_OPEN;

  return (
    <Surface className="overflow-hidden p-0">
      <div className="flex gap-3 p-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-bp-primary/40 to-bp-primary/10 text-2xl">
          🎱
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <Link href={`/player/game/${game.id}`} className="font-semibold text-bp-text hover:text-bp-primary">
              {gameDisplayName(game.id)}
            </Link>
            {isLive ? <LiveBadge /> : isOpen ? <StatusPill status={game.status} /> : <StatusPill status={game.status} />}
          </div>
          <p className="mt-1 text-lg font-bold text-bp-gold">{game.prizePool.toLocaleString()} coins</p>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-bp-muted">
            <span>Entry {game.entryFee}</span>
            <span>Max {game.maxPlayers} players</span>
          </div>
        </div>
      </div>
      {(isOpen || isLive) && (
        <div className="flex gap-2 border-t border-bp-border p-3">
          <Link href={`/player/game/${game.id}`} className="flex-1">
            <ActionButton variant={isLive ? 'danger' : 'primary'} className="w-full">
              {isLive ? 'Join Live' : 'View Game'}
            </ActionButton>
          </Link>
          {isOpen && onRegister && (
            <ActionButton variant="gold" onClick={() => onRegister(game.id)} className="flex-1">
              Register
            </ActionButton>
          )}
        </div>
      )}
    </Surface>
  );
}
