import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { withdrawalsApi } from '@/api';

export function useWithdrawals() {
  return useQuery({
    queryKey: ['withdrawals'],
    queryFn: async () => {
      const res = await withdrawalsApi.list();
      return res.data;
    },
  });
}

export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { amount: number; payoutDetails?: string }) => withdrawalsApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['withdrawals'] }),
  });
}

export function usePayWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => withdrawalsApi.pay(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['withdrawals'] }),
  });
}
