import apiClient from './client';
import { ApiResponse, GameResponse } from '@/types';

export const reportsApi = {
  revenue: async () => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>>>('/reports/revenue');
    return res.data;
  },
  games: async () => {
    const res = await apiClient.get<ApiResponse<GameResponse[]>>('/reports/games');
    return res.data;
  },
};
