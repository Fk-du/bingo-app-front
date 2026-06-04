'use client';

import { useState } from 'react';
import { BingoClaimResponse } from '@/types';
import { BingoCard } from './BingoCard';

interface ClaimReviewCardProps {
  claim: BingoClaimResponse;
  index: number;
  remainingSlots: number;
  onApprove: (claimId: number) => void;
  onReject: (claimId: number, reason?: string) => void;
  isProcessing?: boolean;
}

function parseCardSnapshot(json: string | null): number[][] {
  if (!json) return Array.from({ length: 5 }, () => Array(5).fill(0));
  try {
    return JSON.parse(json);
  } catch {
    return Array.from({ length: 5 }, () => Array(5).fill(0));
  }
}

function parseCalledSnapshot(json: string | null): Set<number> {
  if (!json) return new Set();
  try {
    return new Set<number>(JSON.parse(json));
  } catch {
    return new Set();
  }
}

function formatTimestamp(ts: string | null): string {
  if (!ts) return 'N/A';
  return new Date(ts).toLocaleString();
}

export function ClaimReviewCard({ claim, index, remainingSlots, onApprove, onReject, isProcessing }: ClaimReviewCardProps) {
  const [reason, setReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const cardNumbers = parseCardSnapshot(claim.cardSnapshot);
  const calledNumbers = parseCalledSnapshot(claim.calledNumbersSnapshot);

  const total = 24;
  let marks = 0;
  for (const row of cardNumbers) {
    for (const n of row) {
      if (n > 0 && calledNumbers.has(n)) marks++;
    }
  }

  return (
    <div className="border border-amber-400/40 bg-amber-900/10 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div>
          <span className="font-bold text-amber-200 text-lg">Claim #{index}</span>
          <span className="ml-3 text-sm text-zinc-400">ID: {claim.id}</span>
        </div>
        <span className="text-sm text-zinc-400">
          Player #{claim.playerId} &middot; {formatTimestamp(claim.claimedAt)}
        </span>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Card visualization */}
        <div>
          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">Player Card</p>
          <BingoCard numbers={cardNumbers} calledNumbers={calledNumbers} />
        </div>

        {/* Called numbers at claim time */}
        <div className="flex-1 min-w-0">
          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-1">
            Numbers Called at Claim ({calledNumbers.size}/75)
          </p>
          <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
            {[...calledNumbers].sort((a, b) => a - b).map((n) => (
              <span
                key={n}
                className="px-1.5 py-0.5 bg-zinc-700 text-zinc-200 rounded text-xs font-mono"
              >
                {n}
              </span>
            ))}
          </div>
          <p className="mt-2 text-sm text-zinc-400">
            {marks}/{total} card numbers matched
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-4 flex items-center gap-3 flex-wrap">
        <button
          onClick={() => onApprove(claim.id)}
          disabled={isProcessing}
          className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-semibold cursor-pointer disabled:opacity-50 hover:bg-emerald-700 text-sm"
        >
          {remainingSlots <= 1 ? 'Approve & Pay (last slot)' : `Approve & Pay (${remainingSlots} slots left)`}
        </button>

        {!showRejectInput ? (
          <button
            onClick={() => setShowRejectInput(true)}
            disabled={isProcessing}
            className="px-5 py-2 bg-rose-600 text-white rounded-lg font-semibold cursor-pointer disabled:opacity-50 hover:bg-rose-700 text-sm"
          >
            Reject
          </button>
        ) : (
          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Rejection reason..."
              className="px-3 py-2 bg-zinc-800 border border-zinc-600 rounded text-sm text-white w-48"
            />
            <button
              onClick={() => {
                onReject(claim.id, reason || undefined);
                setShowRejectInput(false);
              }}
              disabled={isProcessing}
              className="px-4 py-2 bg-rose-600 text-white rounded-lg font-semibold cursor-pointer disabled:opacity-50 hover:bg-rose-700 text-sm"
            >
              Confirm Reject
            </button>
            <button
              onClick={() => setShowRejectInput(false)}
              className="px-4 py-2 bg-zinc-700 text-white rounded-lg cursor-pointer hover:bg-zinc-600 text-sm"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
