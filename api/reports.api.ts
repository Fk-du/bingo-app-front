import apiClient from './client';
import { ApiResponse, GameResponse, RevenueReportResponse } from '@/types';

export const reportsApi = {
  revenue: async () => {
    const res = await apiClient.get<ApiResponse<RevenueReportResponse>>('/reports/revenue');
    return res.data;
  },
  games: async () => {
    const res = await apiClient.get<ApiResponse<GameResponse[]>>('/reports/games');
    return res.data;
  },
};
