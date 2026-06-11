'use client';

import { useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useCreateWithdrawal } from '@/hooks/useWithdrawals';
import { ActionButton, Field, SectionHeader, Surface, TextField } from '@/components/ui/Surface';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [payoutDetails, setPayoutDetails] = useState('');
  const { mutate: withdraw, isPending } = useCreateWithdrawal();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    withdraw({ amount: Number(amount), payoutDetails });
    setAmount('');
    setPayoutDetails('');
  };

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <SectionHeader
        eyebrow="Withdraw"
        title="Payout request"
        description="Submit a withdrawal without leaving the player experience."
      />

      <Surface className="max-w-2xl p-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Amount">
            <TextField
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
              min="1"
            />
          </Field>
          <Field label="Payout details" hint="Bank account, mobile money, or crypto address">
            <TextField
              type="text"
              value={payoutDetails}
              onChange={(e) => setPayoutDetails(e.target.value)}
              placeholder="Optional"
            />
          </Field>
          <ActionButton type="submit" disabled={isPending} variant="danger" className="w-full">
            {isPending ? 'Submitting...' : 'Request withdrawal'}
          </ActionButton>
        </form>
      </Surface>
    </ProtectedRoute>
  );
}
