'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';

export default function HistoryPage() {
  return (
    <ProtectedRoute roles={[Role.PLAYER]}>
      <h1 className="text-xl font-bold mb-4">Game History</h1>
      <p className="text-zinc-400">Your past games and transactions will be displayed here.</p>
    </ProtectedRoute>
  );
}
