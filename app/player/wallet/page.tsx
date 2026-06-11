'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAuthStore } from '@/store/auth.store';
import { useCreateCoinRequest, useCoinRequests } from '@/hooks/useCoins';
import { ActionButton, StatusPill, Surface, TextField } from '@/components/ui/Surface';
import { IconCoin } from '@/components/ui/Icons';

const COIN_PACKAGES = [
  { coins: 1000, bonus: 0, price: '$9.99', bestValue: false },
  { coins: 5000, bonus: 500, price: '$49.99', bestValue: false },
  { coins: 10000, bonus: 1500, price: '$99.99', bestValue: true },
  { coins: 25000, bonus: 5000, price: '$199.99', bestValue: false },
];

export default function WalletPage() {
  const user = useAuthStore((s) => s.user);
  const [showBuy, setShowBuy] = useState(false);
  const [amount, setAmount] = useState('');
  const { mutate: topUp, isPending } = useCreateCoinRequest();
  const { data: requests, isLoading: loadingRequests } = useCoinRequests();

  const handlePackageBuy = (coins: number) => {
    topUp({ amount: coins });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    topUp({ amount: Number(amount) });
    setAmount('');
  };

  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <Surface className="relative overflow-hidden p-5">
        <div className="absolute -right-4 -top-4 opacity-20">
          <IconCoin className="h-24 w-24" />
        </div>
        <p className="text-sm text-bp-muted">Your Balance</p>
        <p className="mt-1 text-4xl font-black text-bp-gold">
          {(user?.balance ?? 0).toLocaleString()}
        </p>
        <p className="mt-0.5 text-xs text-bp-muted">coins available</p>
      </Surface>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <ActionButton variant="primary" className="w-full" onClick={() => setShowBuy((v) => !v)}>
          Buy Coins
        </ActionButton>
        <Link href="/player/withdraw">
          <ActionButton variant="ghost" className="w-full">
            Withdraw
          </ActionButton>
        </Link>
      </div>

      {showBuy && (
        <div className="mt-4 space-y-3">
          <p className="text-sm font-semibold text-bp-text">Select Package</p>
          {COIN_PACKAGES.map((pkg) => (
            <Surface key={pkg.coins} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  {pkg.bestValue && (
                    <span className="mb-1 inline-block rounded-full bg-bp-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase text-bp-gold">
                      Best Value
                    </span>
                  )}
                  <p className="font-bold text-bp-text">{pkg.coins.toLocaleString()} coins</p>
                  {pkg.bonus > 0 && (
                    <p className="text-xs font-medium text-bp-success">+{pkg.bonus.toLocaleString()} bonus</p>
                  )}
                </div>
                <ActionButton
                  variant="success"
                  onClick={() => handlePackageBuy(pkg.coins + pkg.bonus)}
                  disabled={isPending}
                >
                  {pkg.price}
                </ActionButton>
              </div>
            </Surface>
          ))}

          <Surface className="p-4">
            <p className="mb-3 text-sm font-medium text-bp-muted">Or enter a custom amount</p>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <TextField
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Custom amount"
                required
                min="1"
                aria-label="Custom coin amount"
                className="flex-1"
              />
              <ActionButton type="submit" disabled={isPending} className="shrink-0">
                Request
              </ActionButton>
            </form>
          </Surface>
        </div>
      )}

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-bp-text">Recent Transactions</p>
        {loadingRequests ? (
          <div className="h-16 animate-pulse rounded-2xl bg-bp-surface" />
        ) : !requests || requests.length === 0 ? (
          <Surface className="p-4 text-center text-sm text-bp-muted">No transactions yet.</Surface>
        ) : (
          <div className="space-y-2">
            {requests.map((req) => (
              <Surface key={req.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium text-bp-text">Coin Request</p>
                  <p className="text-xs text-bp-muted">{new Date(req.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-bp-success">+{req.amount}</p>
                  <StatusPill status={req.status} />
                </div>
              </Surface>
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
