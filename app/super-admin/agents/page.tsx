'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAgents, useInviteAgent } from '@/hooks/useAgents';

export default function AgentsPage() {
  const { data: agents, isLoading } = useAgents();
  const { mutate: invite, isPending } = useInviteAgent();

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Agents</h1>
        <button
          onClick={() => invite()}
          disabled={isPending}
          className="bg-rose-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
        >
          {isPending ? 'Generating...' : 'Invite Agent'}
        </button>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3">
          {agents?.map((agent: any) => (
            <div key={agent.id} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow flex items-center gap-3">
              <strong>{agent.username ?? 'Unnamed'}</strong>
              <span className={`px-2 py-0.5 rounded text-xs text-white ${agent.active ? 'bg-emerald-500' : 'bg-zinc-400'}`}>
                {agent.active ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      )}
    </ProtectedRoute>
  );
}
