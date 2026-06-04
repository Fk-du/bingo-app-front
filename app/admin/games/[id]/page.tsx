'use client';

import { use, useState, useEffect, useCallback } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus, BingoClaimResultResponse } from '@/types';
import { useGameWebSocket } from '@/hooks/useWebSocket';
import { useGameStore } from '@/store/game.store';
import { usePendingClaims, useApproveClaim, useRejectClaim } from '@/hooks/useGames';
import { ClaimReviewCard } from '@/components/games/ClaimReviewCard';
import { NumberBoard } from '@/components/games/NumberBoard';

const MAX_WINNERS = 3;

export default function AdminGameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const gameId = Number(id);
  useGameWebSocket(gameId);
  const { gameStatus, calledNumbers, totalNumbersCalled, prizePool, isConnecting } = useGameStore();
  const { data: pendingClaims, refetch: refetchClaims } = usePendingClaims(gameId);
  const { mutate: approveClaim, isPending: isApproving } = useApproveClaim();
  const { mutate: rejectClaim, isPending: isRejecting } = useRejectClaim();
  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const calledSet = new Set(calledNumbers.map((n) => n.number));

  const remainingSlots = MAX_WINNERS - approvedCount;
  const isProcessing = isApproving || isRejecting || processingId !== null;

  // Refetch claims when game status changes or on approve/reject
  const refresh = useCallback(() => {
    refetchClaims();
  }, [refetchClaims]);

  useEffect(() => {
    if (gameStatus === GameStatus.CLAIM_PENDING) refresh();
    if (gameStatus === GameStatus.ENDED) setGameEnded(true);
  }, [gameStatus, refresh]);

  const handleApprove = (claimId: number) => {
    setProcessingId(claimId);
    approveClaim({ gameId, claimId }, {
      onSuccess: (res) => {
        const data = res.data as BingoClaimResultResponse;
        const newCount = data.approvedCount ?? approvedCount + 1;
        setApprovedCount(newCount);
        if (data.gameEnded) {
          setGameEnded(true);
          setActionMsg(`Winner #${newCount}/${MAX_WINNERS} paid. Max winners reached, game ended.`);
        } else {
          setActionMsg(`Winner #${newCount}/${MAX_WINNERS} paid. ${MAX_WINNERS - newCount} slot(s) remaining.`);
        }
        setProcessingId(null);
        refresh();
      },
      onError: (err) => {
        setActionMsg('Failed: ' + err.message);
        setProcessingId(null);
      },
    });
  };

  const handleReject = (claimId: number, reason?: string) => {
    setProcessingId(claimId);
    rejectClaim({ gameId, claimId, reason }, {
      onSuccess: (res) => {
        const msg = res.message || 'Claim rejected';
        setActionMsg(msg);
        setProcessingId(null);
        refresh();
      },
      onError: (err) => {
        setActionMsg('Failed: ' + err.message);
        setProcessingId(null);
      },
    });
  };

  const claimCount = pendingClaims?.length ?? 0;
  const displayApproved = approvedCount;

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Game #{gameId}</h1>
      {isConnecting && <p className="text-zinc-500 mb-2">Connecting to game server...</p>}

      {actionMsg && (
        <div className="mb-4 px-4 py-2 bg-zinc-800 text-white rounded">{actionMsg}</div>
      )}

      {/* Game Info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4 mb-6">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold">Status</h3>
          <span className={`inline-block mt-1 px-3 py-1 rounded text-sm font-medium text-white ${
            gameStatus === GameStatus.IN_PROGRESS ? 'bg-blue-500' :
            gameStatus === GameStatus.CLAIM_PENDING ? 'bg-amber-500' :
            gameStatus === GameStatus.ENDED ? 'bg-zinc-500' :
            gameStatus === GameStatus.REGISTRATION_OPEN ? 'bg-emerald-500' :
            'bg-zinc-500'
          }`}>
            {gameStatus ?? 'N/A'}
          </span>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold">Progress</h3>
          <p className="mt-1 text-2xl font-bold">{totalNumbersCalled} / 75</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold">Prize Pool</h3>
          <p className="mt-1 text-2xl font-bold">{prizePool}</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold">Winners {gameStatus === GameStatus.CLAIM_PENDING && `(${displayApproved}/${MAX_WINNERS})`}</h3>
          <p className="mt-1 text-2xl font-bold">{displayApproved}</p>
        </div>
      </div>

      {/* Number Board + Called Numbers */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="hidden sm:block">
          <NumberBoard calledNumbers={calledSet} />
        </div>
        <div className="flex-1 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Called Numbers ({calledNumbers.length})</h3>
          <div className="flex flex-wrap gap-1 max-h-60 overflow-y-auto">
            {calledNumbers.map((n) => (
              <span key={n.id} className="px-2 py-1 bg-emerald-500 text-white rounded text-sm">
                {n.number}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Game Ended Banner */}
      {gameEnded && (
        <div className="mb-6 p-4 bg-zinc-800 border border-zinc-600 rounded-xl text-center">
          <p className="text-lg font-bold text-zinc-300">Game Ended</p>
          <p className="text-zinc-500">{displayApproved} winner(s) approved</p>
        </div>
      )}

      {/* Pending Claims Section */}
      {gameStatus === GameStatus.CLAIM_PENDING && !gameEnded && (
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-amber-400">
              Pending Bingo Claims ({claimCount})
            </h2>
            <span className="text-sm text-zinc-400">
              Winner slots: {displayApproved}/{MAX_WINNERS} filled
            </span>
          </div>
          {pendingClaims && pendingClaims.length > 0 ? (
            <div className="space-y-4">
              {pendingClaims.map((claim, i) => (
                <ClaimReviewCard
                  key={claim.id}
                  claim={claim}
                  index={i + 1}
                  remainingSlots={remainingSlots}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  isProcessing={isProcessing && processingId === claim.id}
                />
              ))}
            </div>
          ) : (
            <div className="bg-zinc-800 p-6 rounded-xl text-center text-zinc-500">
              Loading claims...
            </div>
          )}
        </div>
      )}

      {gameStatus !== GameStatus.CLAIM_PENDING && !gameEnded && (
        <div className="bg-zinc-800 p-6 rounded-xl text-center text-zinc-500">
          No pending claims. Game is {gameStatus ?? 'not running'}.
        </div>
      )}
    </ProtectedRoute>
  );
}
