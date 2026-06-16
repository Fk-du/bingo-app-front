import Link from 'next/link';
import { GameResponse, GameStatus } from '@/types';
import { ActionButton, EmptyState, LiveBadge, Surface, StatusPill } from '@/components/ui/Surface';

const GAME_NAMES = ['Mega Bingo', 'Happy Hour', 'Night Owl', 'Golden Draw', 'Turbo Round', 'Classic 75'];
const GAME_EMOJIS = ['🔥', '🎯', '🦉', '👑', '⚡', '🎱'];
const GAME_COLORS = [
  'from-rose-500/20 to-rose-500/5 border-rose-500/30',
  'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30',
  'from-violet-500/20 to-violet-500/5 border-violet-500/30',
  'from-amber-500/20 to-amber-500/5 border-amber-500/30',
  'from-cyan-500/20 to-cyan-500/5 border-cyan-500/30',
  'from-bp-primary/20 to-bp-primary/5 border-bp-primary/30',
];

function gameDisplayName(id: number): string {
  return GAME_NAMES[id % GAME_NAMES.length];
}

function gameEmoji(id: number): string {
  return GAME_EMOJIS[id % GAME_EMOJIS.length];
}

function gameColor(id: number): string {
  return GAME_COLORS[id % GAME_COLORS.length];
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
  const colorStyle = gameColor(game.id);

  return (
    <Surface className={`overflow-hidden p-0 transition hover:brightness-110 bp-card-reveal ${isLive ? 'ring-1 ring-bp-danger/30' : ''}`}>
      <div className={`flex gap-3 p-3 bg-gradient-to-br ${isLive ? 'from-bp-danger/5 to-transparent' : ''}`}>
        <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${colorStyle} text-2xl shadow-lg`}>
          {gameEmoji(game.id)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div>
              <Link
                href={`/player/game/${game.id}`}
                className={`font-semibold transition ${isLive ? 'text-bp-danger hover:text-red-300' : 'text-bp-text hover:text-bp-primary'}`}
              >
                {gameDisplayName(game.id)}
              </Link>
              {isLive && (
                <span className="ml-2 inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-bp-danger">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-bp-danger" />
                  LIVE
                </span>
              )}
            </div>
            {isOpen && <StatusPill status={game.status} />}
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <p className={`text-xl font-black ${isLive ? 'text-bp-danger drop-shadow-[0_0_8px_rgba(235,87,87,0.3)]' : 'text-bp-gold'}`}>
              {game.prizePool.toLocaleString()}
            </p>
            <span className="text-xs text-bp-muted font-medium">coins</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-3 text-xs text-bp-muted">
            <span className="inline-flex items-center gap-1">
              <span className="text-bp-primary">◆</span>
              Entry {game.entryFee}
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="text-bp-muted">●</span>
              Max {game.maxPlayers}
            </span>
          </div>
        </div>
      </div>
      {(isOpen || isLive) && (
        <div className="flex gap-2 border-t border-bp-border p-3 bg-gradient-to-r from-transparent via-bp-surface-elevated/30 to-transparent">
          <Link href={`/player/game/${game.id}`} className="flex-1">
            <ActionButton variant={isLive ? 'danger' : 'primary'} className="w-full">
              {isLive ? '▶ Join Live' : 'View Game'}
            </ActionButton>
          </Link>
          {isOpen && onRegister && (
            <ActionButton variant="gold" onClick={() => onRegister(game.id)} className="flex-1 font-bold tracking-wide">
              ✦ Register
            </ActionButton>
          )}
        </div>
      )}
    </Surface>
  );
}
