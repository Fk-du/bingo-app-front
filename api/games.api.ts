import apiClient from './client';
import {
  ApiResponse,
  GameResponse,
  GameStateResponse,
  BingoClaimResponse,
  BingoClaimResultResponse,
  RegisterResponse,
  CreateGameRequest,
} from '@/types';

export const gamesApi = {
  create: async (data: CreateGameRequest) => {
    const res = await apiClient.post<ApiResponse<GameResponse>>('/games', data);
    return res.data;
  },
  start: async (id: number) => {
    const res = await apiClient.post<ApiResponse<GameResponse>>(`/games/${id}/start`);
    return res.data;
  },
  cancel: async (id: number) => {
    const res = await apiClient.post<ApiResponse<string>>(`/games/${id}/cancel`);
    return res.data;
  },
  pause: async (id: number) => {
    const res = await apiClient.post<ApiResponse<string>>(`/games/${id}/pause`);
    return res.data;
  },
  resume: async (id: number) => {
    const res = await apiClient.post<ApiResponse<string>>(`/games/${id}/resume`);
    return res.data;
  },
  end: async (id: number) => {
    const res = await apiClient.post<ApiResponse<string>>(`/games/${id}/end`);
    return res.data;
  },
  getActive: async () => {
    const res = await apiClient.get<ApiResponse<GameResponse[]>>('/games/active');
    return res.data;
  },
  register: async (id: number) => {
    const res = await apiClient.post<ApiResponse<RegisterResponse>>(`/games/${id}/register`);
    return res.data;
  },
  claim: async (id: number) => {
    const res = await apiClient.post<ApiResponse<BingoClaimResultResponse>>(`/games/${id}/claim`);
    return res.data;
  },
  getPendingClaims: async (gameId: number) => {
    const res = await apiClient.get<ApiResponse<BingoClaimResponse[]>>(`/games/${gameId}/claims/pending`);
    return res.data;
  },
  approveClaim: async (gameId: number, claimId: number) => {
    const res = await apiClient.post<ApiResponse<BingoClaimResultResponse>>(`/games/${gameId}/claims/${claimId}/approve`);
    return res.data;
  },
  rejectClaim: async (gameId: number, claimId: number, reason?: string) => {
    const res = await apiClient.post<ApiResponse<string>>(`/games/${gameId}/claims/${claimId}/reject?reason=${reason ?? 'Rejected by admin'}`);
    return res.data;
  },
  getState: async (id: number) => {
    const res = await apiClient.get<ApiResponse<GameStateResponse>>(`/games/${id}/state`);
    return res.data;
  },
  audit: async (id: number) => {
    const res = await apiClient.get<ApiResponse<GameResponse>>(`/games/${id}/audit`);
    return res.data;
  },
};
