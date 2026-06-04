import apiClient from './client';
import { ApiResponse, LoginRequest, UserProfileResponse } from '@/types';

export const authApi = {
  login: async (data: LoginRequest) => {
    const res = await apiClient.post<ApiResponse<UserProfileResponse>>('/auth/login', data);
    return res.data;
  },
  me: async () => {
    const res = await apiClient.get<ApiResponse<UserProfileResponse>>('/users/me');
    return res.data;
  },
};
