import apiClient from './client';
import { ApiResponse, WithdrawalResponse, WithdrawalPayRequest } from '@/types';

export const withdrawalsApi = {
  create: async (data: { amount: number; payoutDetails?: string }) => {
    const res = await apiClient.post<ApiResponse<WithdrawalResponse>>('/withdrawals', data);
    return res.data;
  },
  list: async () => {
    const res = await apiClient.get<ApiResponse<WithdrawalResponse[]>>('/withdrawals');
    return res.data;
  },
  pay: async (id: number, data?: WithdrawalPayRequest) => {
    const res = await apiClient.patch<ApiResponse<string>>(`/withdrawals/${id}/pay`, data);
    return res.data;
  },
};
