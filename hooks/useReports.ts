import { useQuery } from '@tanstack/react-query';
import { reportsApi } from '@/api';

export function useRevenueReport() {
  return useQuery({
    queryKey: ['reports', 'revenue'],
    queryFn: async () => {
      const res = await reportsApi.revenue();
      return res.data;
    },
  });
}

export function useGamesReport() {
  return useQuery({
    queryKey: ['reports', 'games'],
    queryFn: async () => {
      const res = await reportsApi.games();
      return res.data;
    },
  });
}
