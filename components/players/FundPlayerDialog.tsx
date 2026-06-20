'use client';

import { useState } from 'react';
import { ActionButton, Surface, TextField, Field } from '@/components/ui/Surface';

interface FundPlayerDialogProps {
  playerId: number;
  playerName: string;
  currentBalance: number;
  onClose: () => void;
  onConfirm: (amount: number) => void;
  isPending?: boolean;
}

export function FundPlayerDialog({
  playerId,
  playerName,
  currentBalance,
  onClose,
  onConfirm,
  isPending,
}: FundPlayerDialogProps) {
  const [amount, setAmount] = useState('');

  const numericAmount = Number(amount);
  const isValid = amount.length > 0 && numericAmount > 0 && Number.isFinite(numericAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close"
      />
      <Surface className="relative w-full max-w-sm p-5">
        <p className="text-lg font-bold text-bp-text">Fund Player</p>
        <p className="mt-1 text-sm text-bp-muted">
          {playerName} &middot; Balance: {currentBalance.toLocaleString()} coins
        </p>

        <div className="mt-5 space-y-3">
          <Field label="Amount">
            <TextField
              type="number"
              min="1"
              step="1"
              placeholder="Enter coin amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              autoFocus
            />
          </Field>

          <div className="flex gap-2 pt-2">
            <ActionButton variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </ActionButton>
            <ActionButton
              variant="gold"
              onClick={() => onConfirm(numericAmount)}
              disabled={!isValid || isPending}
              className="flex-1"
            >
              {isPending ? 'Funding...' : 'Fund'}
            </ActionButton>
          </div>
        </div>
      </Surface>
    </div>
  );
}
