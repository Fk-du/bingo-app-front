'use client';

import { useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { broadcastApi } from '@/api';

export default function BroadcastPage() {
  const [target, setTarget] = useState('all');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      const res = await broadcastApi.send({ target, message });
      setResult(res.message);
      setMessage('');
    } catch {
      setResult('Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Broadcast Message</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div>
          <label className="block mb-1 text-sm">Target</label>
          <select
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full p-2 border border-zinc-300 rounded dark:bg-zinc-800 dark:border-zinc-600"
          >
            <option value="all">All Users</option>
            <option value="agents">Agents</option>
            <option value="players">Players</option>
          </select>
        </div>
        <div>
          <label className="block mb-1 text-sm">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
            className="w-full p-2 border border-zinc-300 rounded resize-y dark:bg-zinc-800 dark:border-zinc-600"
          />
        </div>
        <button
          type="submit"
          disabled={sending}
          className="bg-rose-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
        >
          {sending ? 'Sending...' : 'Send Broadcast'}
        </button>
      </form>
      {result && <p className="mt-3 text-emerald-500">{result}</p>}
    </ProtectedRoute>
  );
}
