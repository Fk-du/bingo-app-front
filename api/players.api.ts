import apiClient from './client';
import { ApiResponse, PlayerResponse, FundPlayerRequest, WalletResponse } from '@/types';

export const playersApi = {
  list: async () => {
    const res = await apiClient.get<ApiResponse<PlayerResponse[]>>('/players');
    return res.data;
  },
  get: async (id: number) => {
    const res = await apiClient.get<ApiResponse<PlayerResponse>>(`/players/${id}`);
    return res.data;
  },
  fund: async (id: number, data: FundPlayerRequest) => {
    const res = await apiClient.post<ApiResponse<string>>(`/players/${id}/fund`, data);
    return res.data;
  },
  getWallet: async (id: number) => {
    const res = await apiClient.get<ApiResponse<WalletResponse>>(`/players/${id}/wallet`);
    return res.data;
  },
};

export const walletApi = {
  get: async () => {
    const res = await apiClient.get<ApiResponse<WalletResponse>>('/wallet');
    return res.data;
  },
};
