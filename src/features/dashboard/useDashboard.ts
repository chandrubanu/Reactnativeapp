import { useQuery } from '@tanstack/react-query';
import { dashboardRepository } from './dashboardRepository';

export function useDashboardSummary(employeeId: string | undefined) {
  return useQuery({
    queryKey: ['dashboardSummary', employeeId],
    queryFn: () => dashboardRepository.getSummary(employeeId as string),
    enabled: Boolean(employeeId),
  });
}
