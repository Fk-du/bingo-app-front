'use client';

import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { useAgents, useInviteAgent, useFundRequests, useHandleFundRequest } from '@/hooks/useAgents';

export default function AgentsPage() {
  const { data: agents, isLoading } = useAgents();
  const { mutate: invite, isPending } = useInviteAgent();
  const { data: fundRequests, isLoading: loadingFunds } = useFundRequests();
  const { mutate: handleFund } = useHandleFundRequest();

  const pendingFunds = fundRequests?.filter((r) => r.status === 'PENDING') ?? [];
  const approvedFunds = fundRequests?.filter((r) => r.status === 'APPROVED') ?? [];

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

      {/* Agent List */}
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-3 mb-8">
          <h3 className="font-semibold">Registered Agents ({agents?.length ?? 0})</h3>
          {agents?.map((agent: any) => (
            <div key={agent.id} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow flex items-center gap-3">
              <strong>{agent.username ?? 'Unnamed'}</strong>
              <span className={`px-2 py-0.5 rounded text-xs text-white ${agent.active ? 'bg-emerald-500' : 'bg-zinc-400'}`}>
                {agent.active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-xs text-zinc-500 ml-auto">ID: {agent.id}</span>
            </div>
          ))}
        </div>
      )}

      {/* Pending Fund Requests */}
      <div className="mt-6">
        <h3 className="font-semibold mb-3">Pending Fund Requests ({pendingFunds.length})</h3>
        {loadingFunds ? (
          <p>Loading...</p>
        ) : pendingFunds.length === 0 ? (
          <p className="text-zinc-500 text-sm">No pending fund requests.</p>
        ) : (
          <div className="space-y-2">
            {pendingFunds.map((req) => (
              <div key={req.id} className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow flex items-center justify-between">
                <div>
                  <strong className="text-lg">{req.amount} coins</strong>
                  <span className="ml-3 text-sm text-zinc-500">Agent #{req.agentId}</span>
                  <span className="ml-2 text-xs text-zinc-400">{new Date(req.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleFund({ id: req.id, action: 'APPROVE' })}
                    className="bg-emerald-500 text-white px-3 py-1.5 rounded text-sm cursor-pointer hover:bg-emerald-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleFund({ id: req.id, action: 'REJECT' })}
                    className="bg-rose-500 text-white px-3 py-1.5 rounded text-sm cursor-pointer hover:bg-rose-600"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Approved Fund Requests */}
      {approvedFunds.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-3">Approved ({approvedFunds.length})</h3>
          <div className="space-y-2">
            {approvedFunds.map((req) => (
              <div key={req.id} className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow flex items-center gap-3 opacity-60">
                <strong>{req.amount} coins</strong>
                <span className="text-sm text-zinc-500">Agent #{req.agentId}</span>
                <span className="text-xs text-emerald-500">Approved</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}
