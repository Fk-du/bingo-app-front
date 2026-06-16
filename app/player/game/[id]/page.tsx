'use client';

import { use, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus } from '@/types';
import { useGameWebSocket } from '@/hooks/useWebSocket';
import { useGameStore } from '@/store/game.store';
import { useClaimBingo, useActiveGames, useRegisterForGame, useGameState } from '@/hooks/useGames';
import { BingoCard } from '@/components/games/BingoCard';
import { ActionButton, LiveBadge, Surface } from '@/components/ui/Surface';
import { IconBack } from '@/components/ui/Icons';

function numberToLetter(n: number): string {
  if (n >= 1 && n <= 15) return 'B';
  if (n >= 16 && n <= 30) return 'I';
  if (n >= 31 && n <= 45) return 'N';
  if (n >= 46 && n <= 60) return 'G';
  if (n >= 61 && n <= 75) return 'O';
  return '?';
}

function formatNumber(n: number): string {
  return `${n}`;
}

export default function PlayerGamePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const gameId = Number(id);
  const router = useRouter();
  useGameWebSocket(gameId);
  const { mutate: claimBingo, isPending: isClaiming } = useClaimBingo();
  const { mutate: register } = useRegisterForGame();
  const { data: games } = useActiveGames();
  const { data: gameState, isLoading: stateLoading } = useGameState(gameId);
  const {
    gameStatus,
    calledNumbers,
    prizePool,
    playerCard,
    isConnecting,
    setGameStatus,
    setCalledNumbers,
    setTotalNumbersCalled,
    setPrizePool,
    setPlayerCard,
  } = useGameStore();

  const calledSet = useMemo(() => new Set(calledNumbers.map((n) => n.number)), [calledNumbers]);
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<{ won: boolean } | null>(null);
  const [registering, setRegistering] = useState(false);
  const [autoDaub, setAutoDaub] = useState(true);

  useEffect(() => {
    if (!gameState) return;
    setGameStatus(gameState.status);
    setPrizePool(gameState.prizePool);
    setPlayerCard(gameState.playerCard);
    if (gameState.playerCard) {
      const calledAsObjects = gameState.calledNumbers.map((n, i) => ({
        id: i,
        gameId,
        number: n,
        sequenceIndex: i,
        calledAt: null,
      }));
      setCalledNumbers(calledAsObjects);
      setTotalNumbersCalled(gameState.calledNumbers.length);
    }
    setGameOver(gameState.isWinner && gameState.status === GameStatus.ENDED ? { won: true } : null);
  }, [gameState, gameId, setCalledNumbers, setGameStatus, setPlayerCard, setPrizePool, setTotalNumbersCalled]);

  useEffect(() => {
    if (calledNumbers.length > 0) {
      setLastCalledNumber(calledNumbers[calledNumbers.length - 1].number);
    }
  }, [calledNumbers]);

  useEffect(() => {
    if (gameStatus === GameStatus.ENDED) {
      setGameOver((prev) => prev ?? { won: false });
    } else {
      setGameOver(null);
    }
  }, [gameStatus]);

  const game = games?.find((g) => g.id === gameId);
  const hasCard = playerCard !== null;
  const isLive = gameStatus === GameStatus.IN_PROGRESS;

  const handleRegister = () => {
    setRegistering(true);
    register(gameId, {
      onSuccess: () => {
        setRegistering(false);
        router.refresh();
      },
      onError: (err) => {
        setRegistering(false);
        setError(err.message);
      },
    });
  };

  const handleClaim = () => {
    setError(null);
    claimBingo(gameId, {
      onSuccess: (res) => {
        if (res.data.pendingReview) {
          setClaimMessage('Bingo claimed! Waiting for admin review.');
        } else if (res.data.valid) {
          setClaimMessage(`Bingo! You won ${res.data.rewardAmount} coins.`);
        }
      },
      onError: (err) => setError(err.message),
    });
  };

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <div className="border-b border-bp-border bg-bp-surface/80 px-0 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-bp-border bg-bp-bg hover:border-bp-primary/50 transition"
          >
            <IconBack className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-bp-text">Game #{gameId}</p>
            <p className="text-xs text-bp-muted">Max {game?.maxPlayers ?? '—'} players</p>
          </div>
          {isLive && (
            <span className="bp-live-badge inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
              <span className="h-2 w-2 animate-pulse rounded-full bg-bp-danger shadow-[0_0_6px_rgba(235,87,87,0.6)]" />
              Live
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Surface className="relative overflow-hidden p-3 text-center before:absolute before:inset-0 before:bg-gradient-to-br before:from-bp-gold/5 before:to-transparent">
          <p className="text-[10px] uppercase tracking-wider text-bp-muted">Prize Pool</p>
          <p className="mt-1 text-2xl font-black text-bp-gold drop-shadow-[0_0_8px_rgba(242,201,76,0.2)]">
            {prizePool.toLocaleString()}
          </p>
          <p className="text-[10px] text-bp-gold/60 font-medium">coins</p>
        </Surface>
        <Surface className="relative overflow-hidden p-3 text-center before:absolute before:inset-0 before:bg-gradient-to-br before:from-bp-primary/5 before:to-transparent">
          <p className="text-[10px] uppercase tracking-wider text-bp-muted">Called</p>
          <p className="mt-1 text-2xl font-black text-bp-text">{calledNumbers.length}/75</p>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-bp-surface-elevated">
            <div
              className="h-full rounded-full bg-gradient-to-r from-bp-primary to-bp-primary-hover transition-all duration-500"
              style={{ width: `${(calledNumbers.length / 75) * 100}%` }}
            />
          </div>
        </Surface>
      </div>

      {isConnecting && (
        <div className="mt-3 rounded-xl border border-bp-primary/30 bg-bp-primary/10 px-4 py-2 text-sm text-bp-primary flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-bp-primary" />
          Connecting to game server...
        </div>
      )}
      {stateLoading && !gameState && (
        <div className="mt-3 rounded-xl bg-bp-surface px-4 py-2 text-sm text-bp-muted flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-bp-muted" />
          Loading game state...
        </div>
      )}

      {lastCalledNumber && isLive && (
        <div className="mt-4">
          <div className="flex items-center justify-between gap-2 mb-3">
            <p className="text-xs font-bold uppercase tracking-wider text-bp-muted">Last Called</p>
            <p className="text-[10px] text-bp-muted">{calledNumbers.length} numbers drawn</p>
          </div>
          <div className="bp-number-slide mb-3 flex flex-col items-center rounded-2xl border border-bp-danger/30 bg-gradient-to-br from-bp-danger/10 via-bp-danger/5 to-transparent p-4">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-bp-danger/80 mb-1">Number</p>
            <p className="text-5xl font-black text-bp-text drop-shadow-[0_0_12px_rgba(235,87,87,0.3)]">
              <span className="text-bp-danger">{numberToLetter(lastCalledNumber)}</span>-{lastCalledNumber}
            </p>
          </div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-bp-muted">Recent Calls</p>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
            {calledNumbers.slice(-15).reverse().map((n, i) => (
              <span
                key={n.id}
                className="bp-number-pop flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bp-danger/40 bg-gradient-to-br from-bp-danger/20 to-bp-danger/5 text-sm font-bold text-red-200 shadow-lg"
                style={{ animationDelay: `${i * 30}ms` }}
              >
                {formatNumber(n.number)}
              </span>
            ))}
          </div>
        </div>
      )}

      {claimMessage && (
        <div className="mt-3 rounded-xl border border-bp-warning/40 bg-bp-warning/15 px-4 py-3 text-sm text-amber-200 flex items-center gap-2">
          <span className="text-lg">⚡</span>
          {claimMessage}
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-xl border border-bp-danger/40 bg-bp-danger/15 px-4 py-3 text-sm text-red-200 flex items-center gap-2">
          <span className="text-lg">✕</span>
          {error}
        </div>
      )}
      {gameOver && (
        <div
          className={`mt-3 rounded-xl border px-4 py-4 text-center text-base font-bold ${
            gameOver.won
              ? 'border-bp-success/40 bg-gradient-to-br from-bp-success/15 to-bp-success/5 text-emerald-300 drop-shadow-[0_0_12px_rgba(39,174,96,0.2)]'
              : 'border-bp-border bg-bp-surface text-bp-muted'
          }`}
        >
          {gameOver.won ? '🎉 BINGO! You Won! 🎉' : 'Game Over'}
        </div>
      )}

      <div className="mt-4">
        {gameStatus === GameStatus.REGISTRATION_OPEN && !hasCard && (
          <Surface className="relative overflow-hidden p-6 text-center before:absolute before:inset-0 before:bg-gradient-to-br before:from-bp-primary/5 before:via-transparent before:to-bp-gold/5">
            <div className="relative">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-bp-muted">Registration Open</p>
              <p className="mt-2 text-3xl font-black text-bp-gold drop-shadow-[0_0_8px_rgba(242,201,76,0.2)]">
                {game?.entryFee ?? '?'}
              </p>
              <p className="text-sm text-bp-muted">coins to enter</p>
              <ActionButton variant="primary" onClick={handleRegister} disabled={registering} className="mt-5 w-full py-3 text-base font-bold tracking-wider">
                {registering ? '✦ Joining...' : '✦ Join This Game'}
              </ActionButton>
            </div>
          </Surface>
        )}

        {hasCard && playerCard && (
          <>
            <BingoCard numbers={playerCard} calledNumbers={calledSet} />
            <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-bp-border bg-bp-surface-elevated px-3 py-2 text-bp-muted hover:border-bp-primary/30 transition">
                <input
                  type="checkbox"
                  checked={autoDaub}
                  onChange={(e) => setAutoDaub(e.target.checked)}
                  className="h-4 w-4 rounded border-bp-border accent-bp-primary"
                />
                Auto Daub
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-bp-border bg-bp-surface-elevated px-3 py-2 text-bp-muted hover:border-bp-primary/30 transition">
                <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-bp-border accent-bp-primary" />
                Sound
              </label>
            </div>
          </>
        )}
      </div>

      {isLive && hasCard && (
        <div className="fixed inset-x-0 bottom-16 z-20 mx-auto max-w-lg px-4">
          <button
            onClick={handleClaim}
            disabled={isClaiming}
            className="bp-bingo-gradient w-full rounded-2xl py-4 text-lg font-black tracking-[0.15em] text-white shadow-[0_0_32px_rgba(235,87,87,0.5)] transition hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
          >
            {isClaiming ? '✦ CHECKING...' : '✦ BINGO! ✦'}
          </button>
        </div>
      )}
    </ProtectedRoute>
  );
}
