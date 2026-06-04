import { useQuery } from '@tanstack/react-query';
import { playersApi } from '@/api';

export function usePlayers() {
  return useQuery({
    queryKey: ['players'],
    queryFn: async () => {
      const res = await playersApi.list();
      return res.data;
    },
  });
}
