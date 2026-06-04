import apiClient from './client';
import { ApiResponse, BroadcastRequest } from '@/types';

export const broadcastApi = {
  send: async (data: BroadcastRequest) => {
    const res = await apiClient.post<ApiResponse<string>>('/broadcast', data);
    return res.data;
  },
};
