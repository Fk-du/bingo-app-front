'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';

export default function ReportsPage() {
  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <p className="text-zinc-600 dark:text-zinc-400">Revenue and game reports will be displayed here.</p>
    </ProtectedRoute>
  );
}
