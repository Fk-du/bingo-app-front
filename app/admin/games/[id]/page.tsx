'use client';

import { use, useEffect, useState, useMemo } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role, GameStatus, BingoClaimResultResponse, CalledNumberResponse } from '@/types';
import { useGameWebSocket } from '@/hooks/useWebSocket';
import { useGameStore } from '@/store/game.store';
import { usePendingClaims, useApproveClaim, useRejectClaim, useAdminGameState } from '@/hooks/useGames';
import { ClaimReviewCard } from '@/components/games/ClaimReviewCard';
import { NumberBoard } from '@/components/games/NumberBoard';
import { MetricCard, SectionHeader, Surface, StatusPill } from '@/components/ui/Surface';

const MAX_WINNERS = 3;

export default function AdminGameDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const gameId = Number(id);
  useGameWebSocket(gameId);

  const {
    gameStatus, calledNumbers, totalNumbersCalled, prizePool, isConnecting,
    setGameStatus, setCalledNumbers, setTotalNumbersCalled, setPrizePool,
  } = useGameStore();

  const { data: pendingClaims, refetch: refetchClaims } = usePendingClaims(gameId);
  const { mutate: approveClaim, isPending: isApproving } = useApproveClaim();
  const { mutate: rejectClaim, isPending: isRejecting } = useRejectClaim();
  const { data: adminState } = useAdminGameState(gameId);

  const [actionMsg, setActionMsg] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [approvedCount, setApprovedCount] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);

  // Populate store from REST fallback when WebSocket hasn't delivered data yet
  useEffect(() => {
    if (!adminState) return;
    if (calledNumbers.length === 0 && adminState.calledNumbers.length > 0) {
      const mapped: CalledNumberResponse[] = adminState.calledNumbers.map((n, i) => ({
        id: i, gameId, number: n, sequenceIndex: i, calledAt: null,
      }));
      setCalledNumbers(mapped);
      setTotalNumbersCalled(adminState.totalNumbersCalled);
    }
    if (gameStatus === null) {
      setGameStatus(adminState.status);
    }
    if (prizePool === 0 && adminState.prizePool > 0) {
      setPrizePool(adminState.prizePool);
    }
  }, [adminState, gameId, calledNumbers.length, gameStatus, prizePool,
      setCalledNumbers, setGameStatus, setPrizePool, setTotalNumbersCalled]);

  const calledSet = useMemo(() => new Set(calledNumbers.map((n) => n.number)), [calledNumbers]);

  const remainingSlots = MAX_WINNERS - approvedCount;
  const isProcessing = isApproving || isRejecting || processingId !== null;

  useEffect(() => {
    if (gameStatus === GameStatus.CLAIM_PENDING) {
      refetchClaims();
    }
    if (gameStatus === GameStatus.ENDED) {
      setGameEnded(true);
    }
  }, [gameStatus, refetchClaims]);

  const handleApprove = (claimId: number) => {
    setProcessingId(claimId);
    approveClaim(
      { gameId, claimId },
      {
        onSuccess: (res) => {
          const data = res.data as BingoClaimResultResponse;
          const newCount = data.approvedCount ?? approvedCount + 1;
          setApprovedCount(newCount);
          setGameEnded(Boolean(data.gameEnded));
          setActionMsg(
            data.gameEnded
              ? `Winner ${newCount}/${MAX_WINNERS} paid. Game ended.`
              : `Winner ${newCount}/${MAX_WINNERS} paid. ${MAX_WINNERS - newCount} slot(s) remain.`
          );
          setProcessingId(null);
          refetchClaims();
        },
        onError: (err) => {
          setActionMsg(`Failed: ${err.message}`);
          setProcessingId(null);
        },
      }
    );
  };

  const handleReject = (claimId: number, reason?: string) => {
    setProcessingId(claimId);
    rejectClaim(
      { gameId, claimId, reason },
      {
        onSuccess: (res) => {
          setActionMsg(res.message || 'Claim rejected');
          setProcessingId(null);
          refetchClaims();
        },
        onError: (err) => {
          setActionMsg(`Failed: ${err.message}`);
          setProcessingId(null);
        },
      }
    );
  };

  const claimCount = pendingClaims?.length ?? 0;

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <SectionHeader
        eyebrow="Claim review"
        title={`Game #${gameId}`}
        description="Review pending bingo claims, confirm winners, and close the table when the limit is reached."
      />

      {isConnecting && (
        <div className="mb-4 rounded-[18px] border border-cyan-500/20 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-200">
          Connecting to game server...
        </div>
      )}

      {actionMsg && (
        <div className="mb-4 rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-3 text-sm text-slate-200">
          {actionMsg}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-4">
        <MetricCard
          label="Status"
          value={<StatusPill status={gameStatus ?? 'UNKNOWN'} />}
          accent="primary"
        />
        <MetricCard label="Progress" value={`${totalNumbersCalled}/75`} accent="success" />
        <MetricCard label="Prize pool" value={prizePool} accent="gold" />
        <MetricCard
          label="Winners"
          value={approvedCount}
          accent="warning"
          note={gameStatus === GameStatus.CLAIM_PENDING ? `${remainingSlots} slots left` : `${approvedCount} approved`}
        />
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Surface className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">Called numbers</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-100">{calledNumbers.length} total</h2>
            </div>
            <StatusPill status={gameStatus ?? 'UNKNOWN'} />
          </div>
          <div className="mt-4 flex max-h-56 flex-wrap gap-1.5 overflow-y-auto">
            {calledNumbers.map((n) => (
              <span
                key={n.id}
                className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-1 text-xs font-semibold text-emerald-200"
              >
                {n.number}
              </span>
            ))}
          </div>
        </Surface>

        <div className="hidden lg:block">
          <NumberBoard calledNumbers={calledSet} />
        </div>
      </div>

      {gameEnded && (
        <div className="mt-4 rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-3 text-center text-sm text-slate-300">
          Game ended. {approvedCount} winner(s) approved.
        </div>
      )}

      {gameStatus === GameStatus.CLAIM_PENDING && !gameEnded && (
        <div className="mt-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-amber-200">Pending claims ({claimCount})</h2>
            <span className="text-sm text-slate-400">
              Winner slots: {approvedCount}/{MAX_WINNERS}
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
            <Surface className="p-6 text-center text-slate-400">Loading claims...</Surface>
          )}
        </div>
      )}

      {gameStatus !== GameStatus.CLAIM_PENDING && !gameEnded && (
        <Surface className="mt-6 p-6 text-center text-slate-400">
          No pending claims. Game is {gameStatus ?? 'not running'}.
        </Surface>
      )}
    </ProtectedRoute>
  );
}
