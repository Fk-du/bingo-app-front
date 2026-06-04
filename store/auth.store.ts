import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfileResponse, Role } from '@/types';

interface AuthState {
  user: UserProfileResponse | null;
  isAuthenticated: boolean;
  role: Role | null;
  setUser: (user: UserProfileResponse) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      role: null,
      setUser: (user) => set({ user, isAuthenticated: true, role: user.role }),
      logout: () => set({ user: null, isAuthenticated: false, role: null }),
    }),
    {
      name: 'bingo-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        role: state.role,
      }),
    }
  )
);
