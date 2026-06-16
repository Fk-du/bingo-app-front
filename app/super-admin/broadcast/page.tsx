'use client';

import { useState, FormEvent } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { broadcastApi } from '@/api';
import { ActionButton, Field, SectionHeader, SelectField, Surface, TextAreaField } from '@/components/ui/Surface';

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
      setResult(res.data ?? res.message ?? 'Broadcast sent');
      setMessage('');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to send broadcast';
      setResult(msg.includes('timeout') ? 'Broadcast timed out. Try a smaller target group.' : msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <SectionHeader
        eyebrow="Broadcast"
        title="Send a message"
        description="Broadcast a notification to all users, agents, or players."
      />

      <Surface className="max-w-lg p-5">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Target">
            <SelectField value={target} onChange={(e) => setTarget(e.target.value)}>
              <option value="all">All Users</option>
              <option value="agents">Agents</option>
              <option value="players">Players</option>
            </SelectField>
          </Field>

          <Field label="Message">
            <TextAreaField
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={5}
              placeholder="Type your broadcast message here..."
            />
          </Field>

          <div className="flex items-center gap-3">
            <ActionButton type="submit" disabled={sending} variant="primary">
              {sending ? 'Sending...' : 'Send Broadcast'}
            </ActionButton>
            {result && (
              <p className={`text-sm ${result.includes('Failed') || result.includes('timeout') || result.includes('error') ? 'text-bp-danger' : 'text-bp-success'}`}>
                {result}
              </p>
            )}
          </div>
        </form>
      </Surface>
    </ProtectedRoute>
  );
}
