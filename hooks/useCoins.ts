import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { coinsApi } from '@/api';
import { CoinRequestAction } from '@/types';

export function useCoinRequests() {
  return useQuery({
    queryKey: ['coin-requests'],
    queryFn: async () => {
      const res = await coinsApi.getRequests();
      return res.data;
    },
  });
}

export function useCreateCoinRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; screenshotUrl?: string }) => coinsApi.createRequest(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coin-requests'] }),
  });
}

export function useHandleCoinRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: { id: number } & CoinRequestAction) =>
      coinsApi.handleRequest(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['coin-requests'] }),
  });
}
