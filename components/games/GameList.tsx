import Link from 'next/link';
import { GameResponse, GameStatus } from '@/types';

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
    return <p style={{ color: '#666' }}>No games available.</p>;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {games.map((game) => (
        <div key={game.id} style={{ background: '#fff', borderRadius: 8, padding: 16, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Link href={role === 'admin' ? `/admin/games/${game.id}` : `/player/game/${game.id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}>
                <strong>Game #{game.id}</strong>
              </Link>
              <span style={{ marginLeft: 12, padding: '2px 8px', borderRadius: 4, fontSize: 12, background: statusColor(game.status), color: '#fff' }}>
                {game.status}
              </span>
            </div>
            <div style={{ fontSize: 14, color: '#666' }}>
              Fee: {game.entryFee} | Pool: {game.prizePool}
            </div>
          </div>
          <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
            {role === 'admin' && game.status === GameStatus.REGISTRATION_OPEN && onStart && (
              <button onClick={() => onStart(game.id)} style={btnStyle}>Start</button>
            )}
            {role === 'admin' && game.status === GameStatus.REGISTRATION_OPEN && onCancel && (
              <button onClick={() => onCancel(game.id)} style={{ ...btnStyle, background: '#e94560' }}>Cancel</button>
            )}
            {role === 'admin' && game.status === GameStatus.IN_PROGRESS && onEnd && (
              <button onClick={() => onEnd(game.id)} style={{ ...btnStyle, background: '#e94560' }}>End</button>
            )}
            {role === 'player' && game.status === GameStatus.REGISTRATION_OPEN && onRegister && (
              <button onClick={() => onRegister(game.id)} style={btnStyle}>Register</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function statusColor(status: GameStatus): string {
  switch (status) {
    case GameStatus.REGISTRATION_OPEN: return '#4ecca3';
    case GameStatus.IN_PROGRESS: return '#2196f3';
    case GameStatus.CLAIM_PENDING: return '#ff9800';
    case GameStatus.ENDED: return '#666';
  }
}

const btnStyle: React.CSSProperties = {
  background: '#4ecca3',
  color: '#fff',
  border: 'none',
  padding: '6px 12px',
  borderRadius: 4,
  cursor: 'pointer',
  fontSize: 13,
};
