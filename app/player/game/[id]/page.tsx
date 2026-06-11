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
      <div className="border-b border-bp-border bg-bp-surface px-0 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-bp-border bg-bp-bg"
          >
            <IconBack className="h-5 w-5" />
          </button>
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-bp-text">Game #{gameId}</p>
            <p className="text-xs text-bp-muted">Max {game?.maxPlayers ?? '—'} players</p>
          </div>
          {isLive && <LiveBadge />}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Surface className="p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-bp-muted">Prize Pool</p>
          <p className="mt-1 text-xl font-bold text-bp-gold">{prizePool.toLocaleString()}</p>
        </Surface>
        <Surface className="p-3 text-center">
          <p className="text-[10px] uppercase tracking-wider text-bp-muted">Called</p>
          <p className="mt-1 text-xl font-bold text-bp-text">{calledNumbers.length}/75</p>
        </Surface>
      </div>

      {isConnecting && (
        <div className="mt-3 rounded-xl border border-bp-primary/30 bg-bp-primary/10 px-4 py-2 text-sm text-bp-primary">
          Connecting...
        </div>
      )}
      {stateLoading && !gameState && (
        <div className="mt-3 rounded-xl bg-bp-surface px-4 py-2 text-sm text-bp-muted">Loading...</div>
      )}

      {lastCalledNumber && isLive && (
        <div className="mt-4">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-bp-muted">Called Numbers</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {calledNumbers.slice(-12).map((n) => (
              <span
                key={n.id}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-bp-danger/40 bg-bp-danger/20 text-sm font-bold text-red-200"
              >
                {formatNumber(n.number)}
              </span>
            ))}
          </div>
          {lastCalledNumber && (
            <p className="text-center text-2xl font-black text-bp-text">
              {numberToLetter(lastCalledNumber)}-{lastCalledNumber}
            </p>
          )}
        </div>
      )}

      {claimMessage && (
        <div className="mt-3 rounded-xl border border-bp-warning/40 bg-bp-warning/15 px-4 py-2 text-sm text-amber-200">
          {claimMessage}
        </div>
      )}
      {error && (
        <div className="mt-3 rounded-xl border border-bp-danger/40 bg-bp-danger/15 px-4 py-2 text-sm text-red-200">
          {error}
        </div>
      )}
      {gameOver && (
        <div
          className={`mt-3 rounded-xl border px-4 py-2 text-center text-sm font-semibold ${
            gameOver.won
              ? 'border-bp-success/40 bg-bp-success/15 text-emerald-300'
              : 'border-bp-border bg-bp-surface text-bp-muted'
          }`}
        >
          {gameOver.won ? 'You won!' : 'Game over'}
        </div>
      )}

      <div className="mt-4">
        {gameStatus === GameStatus.REGISTRATION_OPEN && !hasCard && (
          <Surface className="p-4 text-center">
            <p className="text-sm text-bp-muted">Registration is open</p>
            <p className="mt-1 text-lg font-bold text-bp-gold">Entry: {game?.entryFee ?? '?'} coins</p>
            <ActionButton variant="primary" onClick={handleRegister} disabled={registering} className="mt-4 w-full">
              {registering ? 'Joining...' : 'Join Game'}
            </ActionButton>
          </Surface>
        )}

        {hasCard && playerCard && (
          <>
            <BingoCard numbers={playerCard} calledNumbers={calledSet} />
            <div className="mt-3 flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 text-bp-muted">
                <input
                  type="checkbox"
                  checked={autoDaub}
                  onChange={(e) => setAutoDaub(e.target.checked)}
                  className="rounded border-bp-border"
                />
                Auto Daub
              </label>
              <label className="flex items-center gap-2 text-bp-muted">
                <input type="checkbox" defaultChecked className="rounded border-bp-border" />
                Sound
              </label>
            </div>
          </>
        )}
      </div>

      {isLive && hasCard && (
        <div className="fixed inset-x-0 bottom-16 z-20 mx-auto max-w-lg px-4">
          <ActionButton
            onClick={handleClaim}
            disabled={isClaiming}
            variant="danger"
            className="w-full py-4 text-lg font-black tracking-widest shadow-[0_0_24px_rgba(235,87,87,0.4)]"
          >
            {isClaiming ? 'CHECKING...' : 'BINGO!'}
          </ActionButton>
        </div>
      )}
    </ProtectedRoute>
  );
}
