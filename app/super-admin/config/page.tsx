'use client';

import { useEffect, useState } from 'react';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { Role } from '@/types/enums';
import { configApi } from '@/api';

export default function ConfigPage() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    configApi.get().then((res) => {
      if (res.data && typeof res.data === 'object') {
        const flat: Record<string, string> = {};
        for (const [k, v] of Object.entries(res.data)) {
          flat[k] = String(v ?? '');
        }
        setConfig(flat);
      }
      setLoading(false);
    }).catch(() => {
      setConfig({ maxWinners: '3', platformFee: '10', agentCommission: '5', cardSize: '25', numberRange: '75', autoCallInterval: '5' });
      setLoading(false);
    });
  }, []);

  const handleChange = (key: string, value: string) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await configApi.update({ config });
      setMessage('Config updated successfully.');
    } catch {
      setMessage('Failed to update config.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ProtectedRoute roles={[Role.SUPER_ADMIN]}>
      <h1 className="text-2xl font-bold mb-4">Platform Config</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="max-w-md space-y-4">
          {Object.entries(config).map(([key, value]) => (
            <div key={key}>
              <label className="block mb-1 text-sm font-medium capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full p-2 border border-zinc-300 rounded dark:bg-zinc-800 dark:border-zinc-600"
              />
            </div>
          ))}
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-rose-600 text-white px-4 py-2 rounded cursor-pointer disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Config'}
          </button>
          {message && (
            <p className={`text-sm ${message.includes('success') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {message}
            </p>
          )}
        </div>
      )}
    </ProtectedRoute>
  );
}
