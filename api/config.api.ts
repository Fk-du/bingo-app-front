import apiClient from './client';
import { ApiResponse, ConfigUpdateRequest } from '@/types';

export const configApi = {
  get: async () => {
    const res = await apiClient.get<ApiResponse<Record<string, unknown>>>('/config');
    return res.data;
  },
  update: async (data: ConfigUpdateRequest) => {
    const res = await apiClient.patch<ApiResponse<string>>('/config', data);
    return res.data;
  },
};
