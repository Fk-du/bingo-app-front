import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { playersApi, walletApi } from '@/api';
import { FundPlayerRequest } from '@/types';

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const res = await playersApi.list();
      return res.data;
    },
  });
}

export function usePlayerWallet(id: number) {
  return useQuery({
    queryKey: ['player-wallet', id],
    queryFn: async () => {
      const res = await playersApi.getWallet(id);
      return res.data;
    },
  });
}

export function useFundPlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & FundPlayerRequest) =>
      playersApi.fund(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}

export function useAdminWallet() {
  return useQuery({
    queryKey: ['admin-wallet'],
    queryFn: async () => {
      const res = await walletApi.get();
      return res.data;
    },
  });
}
