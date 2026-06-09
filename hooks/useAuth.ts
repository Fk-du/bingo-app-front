import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/api';
import { useAuthStore } from '@/store/auth.store';
import { getTelegramInitData } from '@/lib/telegram';

export function useLogin() {
  const setUser = useAuthStore((s) => s.setUser);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const initData = getTelegramInitData();
      if (!initData) throw new Error('No Telegram initData found');
      const res = await authApi.login({ initData });
      if (!res.success) throw new Error(res.message);
      return res.data;
    },
    onSuccess: (user) => {
      if (!user) return;
      setUser(user);
      queryClient.invalidateQueries({ queryKey: ['me'] });
    },
  });
}

export function useMe() {
  const setUser = useAuthStore((s) => s.setUser);

  return useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await authApi.me();
      return res.data;
    },
    retry: false,
    staleTime: 5 * 60 * 1000,
    select: (data) => {
      setUser(data);
      return data;
    },
  });
}
