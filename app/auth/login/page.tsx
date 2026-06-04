'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLogin } from '@/hooks/useAuth';
import { readyTelegramApp, expandTelegramApp } from '@/lib/telegram';

export default function LoginPage() {
  const router = useRouter();
  const { mutate: login, isPending, error } = useLogin();

  useEffect(() => {
    readyTelegramApp();
    expandTelegramApp();
    login(undefined, {
      onSuccess: () => router.replace('/'),
    });
  }, []);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Authenticating...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-rose-500">Authentication failed.</p>
        <button
          onClick={() => router.refresh()}
          className="px-4 py-2 bg-rose-600 text-white rounded-lg cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  return null;
}
