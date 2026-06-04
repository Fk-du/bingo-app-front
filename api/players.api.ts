import apiClient from './client';
import { ApiResponse, PlayerResponse, FundPlayerRequest, PlayerStatusRequest } from '@/types';

export const playersApi = {
  list: async () => {
    const res = await apiClient.get<ApiResponse<PlayerResponse[]>>('/players');
    return res.data;
  },
};
