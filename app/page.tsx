'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types/enums';
import { readyTelegramApp, expandTelegramApp, getTelegramInitData } from '@/lib/telegram';
import { useLogin } from '@/hooks/useAuth';

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, role } = useAuthStore();
  const { mutate: login, isPending, error } = useLogin();
  const [tgReady, setTgReady] = useState(false);

  useEffect(() => {
    const check = () => {
      if (getTelegramInitData()) {
        setTgReady(true);
        readyTelegramApp();
        expandTelegramApp();
      }
    };
    check();
    const interval = setInterval(check, 100);
    setTimeout(() => {
      clearInterval(interval);
      setTgReady(true);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isAuthenticated && role) {
      switch (role) {
        case Role.SUPER_ADMIN:
          router.replace('/super-admin');
          break;
        case Role.ADMIN:
          router.replace('/admin');
          break;
        case Role.PLAYER:
          router.replace('/player');
          break;
      }
    }
  }, [isAuthenticated, role, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg">Authenticating...</p>
      </div>
    );
  }

  if (!tgReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-zinc-500">Connecting to Telegram...</p>
      </div>
    );
  }

  const initData = getTelegramInitData();

  if (!initData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-8 text-center">
        <h1 className="text-3xl font-bold">BingoPlus</h1>
        <p className="text-zinc-600 dark:text-zinc-400 max-w-sm">
          This app must be opened from Telegram. If you are using Telegram, make sure the Mini App domain is configured in BotFather.
        </p>
        <p className="text-xs text-zinc-500">URL: {typeof window !== 'undefined' ? window.location.href : ''}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 p-8">
      <h1 className="text-3xl font-bold">BingoPlus</h1>
      <button
        onClick={() => login()}
        className="px-6 py-3 bg-rose-600 text-white rounded-lg text-lg cursor-pointer hover:bg-rose-700 transition-colors"
      >
        Login with Telegram
      </button>
      {error && (
        <p className="text-rose-500 mt-2">Authentication failed. Please try again.</p>
      )}
    </div>
  );
}
