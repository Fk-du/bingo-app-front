import apiClient from './client';
import { ApiResponse, CoinRequestResponse, CoinRequestAction } from '@/types';

export const coinsApi = {
  createRequest: async (data: { amount: number; screenshotUrl?: string }) => {
    const res = await apiClient.post<ApiResponse<CoinRequestResponse>>('/coins/requests', data);
    return res.data;
  },
  getRequests: async () => {
    const res = await apiClient.get<ApiResponse<CoinRequestResponse[]>>('/coins/requests');
    return res.data;
  },
  handleRequest: async (id: number, data: CoinRequestAction) => {
    const res = await apiClient.patch<ApiResponse<string>>(`/coins/requests/${id}`, data);
    return res.data;
  },
};
