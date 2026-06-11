'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { usePlayers } from '@/hooks/usePlayers';
import { EmptyState, SectionHeader, Surface } from '@/components/ui/Surface';

export default function AdminPlayersPage() {
  const { data: players, isLoading } = usePlayers();

  return (
    <ProtectedRoute roles={[Role.ADMIN]}>
      <SectionHeader
        eyebrow="Players"
        title="Player registry"
        description="A compact list of registered players in the current tenant."
      />

      <Surface className="p-4">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
            <div className="h-16 animate-pulse rounded-[18px] border border-slate-800 bg-slate-900/60" />
          </div>
        ) : players?.length ? (
          <div className="grid gap-2">
            {players.map((player) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-[18px] border border-slate-800 bg-slate-900/60 px-4 py-3"
              >
                <div>
                  <p className="text-sm font-semibold text-slate-100">Player #{player.userId}</p>
                  <p className="text-xs text-slate-500">Record #{player.id}</p>
                </div>
                <span className="rounded-full border border-slate-700 bg-slate-950/70 px-2.5 py-1 text-xs font-semibold text-slate-300">
                  Active
                </span>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="No players found" description="New players will appear here once they register." />
        )}
      </Surface>
    </ProtectedRoute>
  );
}
