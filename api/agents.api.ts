import apiClient from './client';
import {
  ApiResponse,
  UserProfileResponse,
  AgentResponse,
  AgentFundRequestResponse,
  InviteCodeResponse,
  InviteCodeStatsResponse,
  TenantRegistryResponse,
  AgentStatusRequest,
  AgentFundRequestCreate,
} from '@/types';

export const agentsApi = {
  list: async () => {
    const res = await apiClient.get<ApiResponse<UserProfileResponse[]>>('/agents');
    return res.data;
  },
  invite: async () => {
    const res = await apiClient.post<ApiResponse<string>>('/agents/invite');
    return res.data;
  },
  updateStatus: async (id: number, data: AgentStatusRequest) => {
    const res = await apiClient.patch<ApiResponse<AgentResponse>>(`/agents/${id}/status`, data);
    return res.data;
  },
  createFundRequest: async (data: AgentFundRequestCreate) => {
    const res = await apiClient.post<ApiResponse<AgentFundRequestResponse>>('/agents/fund-requests', data);
    return res.data;
  },
  getFundRequests: async () => {
    const res = await apiClient.get<ApiResponse<AgentFundRequestResponse[]>>('/agents/fund-requests');
    return res.data;
  },
  handleFundRequest: async (id: number, data: { action: string; reason?: string }) => {
    const res = await apiClient.patch<ApiResponse<string>>(`/agents/fund-requests/${id}`, data);
    return res.data;
  },
};
