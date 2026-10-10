import { useQuery } from '@tanstack/react-query';
import { shiftRepository } from './shiftRepository';

/**
 * TanStack Query = the RN/React answer to Angular's HttpClient +
 * a caching interceptor combined. `useQuery` gives you loading/error/data
 * state AND caches the result by `queryKey`, so if two components ask for
 * the same shift, only one network (mock) call fires.
 */
export function useShiftById(shiftId: string | undefined) {
  return useQuery({
    queryKey: ['shift', shiftId],
    queryFn: () => shiftRepository.getShiftById(shiftId as string),
    enabled: Boolean(shiftId),
  });
}
