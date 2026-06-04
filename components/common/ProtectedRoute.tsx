import { ReactNode } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { Role } from '@/types';

interface ProtectedRouteProps {
  children: ReactNode;
  roles?: Role[];
}

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { isAuthenticated, role } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>Please authenticate via Telegram to continue.</p>
      </div>
    );
  }

  if (roles && role && !roles.includes(role)) {
    return (
      <div style={{ padding: 20, textAlign: 'center' }}>
        <p>You do not have permission to access this page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
