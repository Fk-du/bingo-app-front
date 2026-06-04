'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';

export default function SuperAdminDashboard() {
  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Super Admin Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold">Total Agents</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold">Active Games</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow">
          <h3 className="font-semibold">Revenue</h3>
          <p className="text-2xl font-bold mt-2">--</p>
        </div>
      </div>
    </ProtectedRoute>
  );
}
