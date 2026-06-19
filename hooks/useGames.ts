import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { gamesApi } from '@/api';
import { CreateGameRequest } from '@/types';

export function useActiveGames() {
  return useQuery({
    queryKey: ['games', 'active'],
    queryFn: async () => {
      const res = await gamesApi.getActive();
      return res.data;
    },
    refetchInterval: 10000,
  });
}

export function useCreateGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGameRequest) => gamesApi.create(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
}

export function useStartGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gamesApi.start(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
}

export function useCancelGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gamesApi.cancel(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
}

export function usePauseGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gamesApi.pause(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
}

export function useResumeGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gamesApi.resume(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
}

export function useEndGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gamesApi.end(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
}

export function useRegisterForGame() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => gamesApi.register(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
}

export function usePendingClaims(gameId: number) {
  return useQuery({
    queryKey: ['games', 'claims', 'pending', gameId],
    queryFn: async () => {
      const res = await gamesApi.getPendingClaims(gameId);
      return res.data;
    },
    enabled: !!gameId,
    refetchInterval: 5000,
  });
}

export function useClaimBingo() {
  return useMutation({
    mutationFn: (id: number) => gamesApi.claim(id),
  });
}

export function useApproveClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gameId, claimId }: { gameId: number; claimId: number }) =>
      gamesApi.approveClaim(gameId, claimId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
}

export function useRejectClaim() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ gameId, claimId, reason }: { gameId: number; claimId: number; reason?: string }) =>
      gamesApi.rejectClaim(gameId, claimId, reason),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['games'] }),
  });
}

export function useGameState(id: number) {
  return useQuery({
    queryKey: ['games', 'state', id],
    queryFn: async () => {
      const res = await gamesApi.getState(id);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: 15000,
  });
}

export function useAdminGameState(id: number) {
  return useQuery({
    queryKey: ['games', 'admin-state', id],
    queryFn: async () => {
      const res = await gamesApi.getAdminState(id);
      return res.data;
    },
    enabled: !!id,
    refetchInterval: 5000,
  });
}

export function useGameAudit(id: number) {
  return useQuery({
    queryKey: ['games', 'audit', id],
    queryFn: async () => {
      const res = await gamesApi.audit(id);
      return res.data;
    },
    enabled: !!id,
  });
}
