'use client';

import { use, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus } from '@/types';
import { useGameWebSocket } from '@/hooks/useWebSocket';
import { useGameStore } from '@/store/game.store';
import { useClaimBingo, useActiveGames, useRegisterForGame, useGameState } from '@/hooks/useGames';
import { BingoCard } from '@/components/games/BingoCard';
import { NumberBoard } from '@/components/games/NumberBoard';

function numberToLetter(n: number): string {
  if (n >= 1 && n <= 15) return 'B';
  if (n >= 16 && n <= 30) return 'I';
  if (n >= 31 && n <= 45) return 'N';
  if (n >= 46 && n <= 60) return 'G';
  if (n >= 61 && n <= 75) return 'O';
  return '?';
}

function formatNumber(n: number): string {
  return `${numberToLetter(n)}-${n}`;
}

function cardProgress(numbers: number[][], calledNumbers: Set<number>): { marks: number; total: number } {
  let marks = 0;
  let total = 0;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (r === 2 && c === 2) continue;
      const n = numbers[r][c];
      if (n > 0) {
        total++;
        if (calledNumbers.has(n)) marks++;
      }
    }
  }
  return { marks, total };
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
    claimPending,
    setGameStatus,
    setCalledNumbers,
    setTotalNumbersCalled,
    setPrizePool,
    setPlayerCard,
  } = useGameStore();

  const calledSet = new Set(calledNumbers.map((n) => n.number));
  const [claimMessage, setClaimMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastCalledNumber, setLastCalledNumber] = useState<number | null>(null);
  const [gameOver, setGameOver] = useState<{ won: boolean; reward?: number } | null>(null);
  const [registering, setRegistering] = useState(false);

  // Load game state into store on first fetch
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
    if (gameState.isWinner && gameState.status === GameStatus.ENDED) {
      setGameOver({ won: true });
    }
  }, [gameState]);

  // Track last called number for the animated display
  useEffect(() => {
    if (calledNumbers.length > 0) {
      setLastCalledNumber(calledNumbers[calledNumbers.length - 1].number);
    }
  }, [calledNumbers]);

  // Track game over state
  useEffect(() => {
    if (gameStatus === GameStatus.ENDED) {
      if (!gameOver) {
        setGameOver({ won: false });
      }
    } else {
      setGameOver(null);
    }
  }, [gameStatus]);

  const pulseClass = 'animate-pulse';

  const game = games?.find((g) => g.id === gameId);
  const hasCard = playerCard !== null;
  const gameOverStatus = gameOver;
  const progress = hasCard ? cardProgress(playerCard!, calledSet) : { marks: 0, total: 24 };
  const progressPct = progress.total > 0 ? Math.round((progress.marks / progress.total) * 100) : 0;

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
          setClaimMessage('BINGO claimed! Waiting for admin review.');
        } else if (res.data.valid) {
          setClaimMessage(`BINGO! You won ${res.data.rewardAmount} points!`);
        }
      },
      onError: (err) => setError(err.message),
    });
  };

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <button onClick={() => router.back()} className="text-zinc-400 hover:text-white text-sm cursor-pointer">
          ← Back
        </button>
        <h1 className="text-xl font-bold">Game #{gameId}</h1>
        {gameStatus && (
          <span className={`px-3 py-1 rounded text-sm font-medium text-white ${
            gameStatus === GameStatus.IN_PROGRESS ? 'bg-blue-500' :
            gameStatus === GameStatus.REGISTRATION_OPEN ? 'bg-emerald-500' :
            gameStatus === GameStatus.CLAIM_PENDING ? 'bg-amber-500' :
            'bg-zinc-500'
          }`}>
            {gameStatus === GameStatus.REGISTRATION_OPEN ? 'OPEN' :
             gameStatus === GameStatus.CLAIM_PENDING ? 'PENDING REVIEW' :
             gameStatus === GameStatus.ENDED ? 'ENDED' : gameStatus}
          </span>
        )}
        <span className="text-zinc-400 ml-auto">Prize: {prizePool}</span>
      </div>

      {isConnecting && <p className="text-zinc-400 mb-2">Connecting to game...</p>}
      {stateLoading && !gameState && <p className="text-zinc-400 mb-2">Loading game state...</p>}

      {/* Game over banner */}
      {gameOverStatus && (
        <div className={`mb-4 px-4 py-3 rounded-lg text-center font-bold text-lg ${
          gameOverStatus.won
            ? 'bg-yellow-900/30 border border-yellow-600 text-yellow-200'
            : 'bg-zinc-800 border border-zinc-600 text-zinc-300'
        }`}>
          {gameOverStatus.won ? '🎉 Congratulations! You won! 🎉' : 'Game Over'}
        </div>
      )}

      {/* Registration prompt */}
      {gameStatus === GameStatus.REGISTRATION_OPEN && !hasCard && (
        <div className="mb-4 p-6 bg-zinc-800 rounded-xl text-center">
          <p className="mb-3 text-zinc-300">Registration is open. Join to get your bingo card!</p>
          <p className="text-sm text-zinc-500 mb-4">Entry Fee: {game?.entryFee ?? '?'} coins</p>
          <button
            onClick={handleRegister}
            disabled={registering}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold cursor-pointer disabled:opacity-50 hover:bg-emerald-700"
          >
            {registering ? 'Joining...' : 'Join Game'}
          </button>
        </div>
      )}

      {/* Claim message */}
      {claimMessage && (
        <div className="mb-4 px-4 py-3 bg-amber-900/30 border border-amber-600 rounded-lg text-amber-200">
          {claimMessage}
        </div>
      )}

      {error && (
        <div className="mb-4 px-4 py-3 bg-rose-900/30 border border-rose-600 rounded-lg text-rose-200">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column - Card */}
        <div className="flex-1 space-y-4">
          {/* Last Number Called */}
          {lastCalledNumber && gameStatus === GameStatus.IN_PROGRESS && (
            <div className="bg-zinc-800 rounded-xl p-4 text-center">
              <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Last Number</p>
              <div className={`text-4xl sm:text-5xl font-black text-white ${pulseClass}`}>
                {formatNumber(lastCalledNumber)}
              </div>
            </div>
          )}

          {/* The Bingo Card */}
          {hasCard && playerCard ? (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold">Your Card</h2>
                <span className="text-sm text-zinc-400">
                  {progress.marks}/{progress.total} marks
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-zinc-700 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
              <BingoCard numbers={playerCard} calledNumbers={calledSet} />
            </>
          ) : gameStatus !== GameStatus.REGISTRATION_OPEN && !stateLoading ? (
            <div className="p-6 bg-zinc-800 rounded-xl text-center text-zinc-500">
              No card assigned for this game.
            </div>
          ) : null}

          {/* BINGO Button */}
          {gameStatus === GameStatus.IN_PROGRESS && hasCard && (
            <button
              onClick={handleClaim}
              disabled={isClaiming}
              className={`w-full py-4 bg-rose-600 text-white rounded-xl text-2xl font-black cursor-pointer disabled:opacity-50 hover:bg-rose-700 transition-all ${
                !isClaiming ? 'hover:scale-105 active:scale-95' : ''
              }`}
            >
              {isClaiming ? 'Checking...' : '🎯 BINGO!'}
            </button>
          )}

          {gameStatus === GameStatus.CLAIM_PENDING && (
            <div className="p-4 bg-amber-900/30 border border-amber-600 rounded-xl text-amber-200 text-center">
              <p className="font-semibold">Claim Pending Review</p>
              <p className="text-sm mt-1">An admin is verifying your BINGO claim. Please wait...</p>
            </div>
          )}
        </div>

        {/* Right column - Number Board & Called Numbers */}
        <div className="w-full lg:w-80 space-y-4">
          <div className="hidden sm:block">
            <NumberBoard calledNumbers={calledSet} />
          </div>

          {/* Called numbers history (collapsible on mobile) */}
          <details className="bg-zinc-800 rounded-xl p-3" open>
            <summary className="font-semibold text-sm cursor-pointer text-zinc-300">
              Called Numbers ({calledNumbers.length}/75)
            </summary>
            <div className="flex flex-wrap gap-1.5 mt-3 max-h-48 overflow-y-auto">
              {calledNumbers.map((n) => (
                <span
                  key={n.id}
                  className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded text-xs font-mono"
                >
                  {formatNumber(n.number)}
                </span>
              ))}
            </div>
          </details>
        </div>
      </div>
    </ProtectedRoute>
  );
}
