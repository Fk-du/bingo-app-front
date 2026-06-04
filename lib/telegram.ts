export function getTelegramInitData(): string | null {
  if (typeof window === 'undefined') return null;
  return window.Telegram?.WebApp?.initData ?? null;
}

export function getTelegramUser(): {
  id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
} | null {
  if (typeof window === 'undefined') return null;
  const user = window.Telegram?.WebApp?.initDataUnsafe?.user;
  return user ?? null;
}

export function readyTelegramApp(): void {
  if (typeof window !== 'undefined') {
    window.Telegram?.WebApp?.ready();
  }
}

export function expandTelegramApp(): void {
  if (typeof window !== 'undefined') {
    window.Telegram?.WebApp?.expand();
  }
}

export function showTelegramAlert(message: string): void {
  if (typeof window !== 'undefined') {
    window.Telegram?.WebApp?.showAlert(message);
  }
}

export function closeTelegramApp(): void {
  if (typeof window !== 'undefined') {
    window.Telegram?.WebApp?.close();
  }
}

export function isDevMode(): boolean {
  if (typeof window === 'undefined') return false;
  const isLocalhost =
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';
  return isLocalhost && !window.Telegram?.WebApp?.initData;
}
