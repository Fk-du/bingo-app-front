'use client';

import { useEffect } from 'react';

export function TelegramScript() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.Telegram?.WebApp) return;

    const script = document.createElement('script');
    script.src = 'https://telegram.org/js/telegram-web-app.js';
    script.async = true;
    script.onerror = () => console.warn('Telegram WebApp script failed to load');
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return null;
}