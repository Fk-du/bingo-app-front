'use client';

import { useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useFundRequests, useCreateFundRequest } from '@/hooks/useAgents';
import { ActionButton, EmptyState, Field, SectionHeader, Surface, StatusPill, TextField } from '@/components/ui/Surface';

export default function FundRequestsPage() {
  const { data: requests, isLoading } = useFundRequests();
  const { mutate: createRequest, isPending } = useCreateFundRequest();
  const [amount, setAmount] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    createRequest({ amount: Number(amount) });
    setAmount('');
  };

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <SectionHeader
        eyebrow="Fund requests"
        title="Agent funding queue"
        description="Request operating funds from the super admin side."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)]">
        <Surface className="p-4">
          <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">New request</p>
          <h2 className="mt-1 text-lg font-semibold text-slate-100">Request funds</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <Field label="Amount">
              <TextField
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount"
                required
                min="0"
              />
            </Field>
            <ActionButton type="submit" disabled={isPending} className="w-full">
              {isPending ? 'Requesting...' : 'Request funds'}
            </ActionButton>
          </form>
        </Surface>

        <Surface className="p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] uppercase tracking-[0.24em] text-slate-500">History</p>
              <h2 className="mt-1 text-lg font-semibold text-slate-100">Fund requests</h2>
            </div>
            <span className="rounded-full border border-slate-800 bg-slate-900/70 px-3 py-1 text-xs font-semibold text-slate-300">
              {requests?.length ?? 0}
            </span>
          </div>
          <div className="mt-4 space-y-2">
            {isLoading ? (
              <div className="space-y-2">
                <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
                <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
              </div>
            ) : requests?.length ? (
              requests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-100">{req.amount} coins</p>
                    <div className="mt-2">
                      <StatusPill status={req.status} />
                    </div>
                  </div>
                  <span className="text-xs text-slate-500">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
              ))
            ) : (
              <EmptyState title="No fund requests" description="New requests will appear here." />
            )}
          </div>
        </Surface>
      </div>
    </ProtectedRoute>
  );
}
