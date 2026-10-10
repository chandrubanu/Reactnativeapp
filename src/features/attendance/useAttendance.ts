import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { attendanceRepository } from './attendanceRepository';
import { PunchRequest } from '../../types/attendance';

/**
 * useTodayAttendance: server-state read, cached by TanStack Query.
 * useSubmitPunch: a "mutation" — TanStack Query's term for any call that
 * CHANGES server data (vs. a `query` which only reads). On success we
 * invalidate the 'todayAttendance' query so the dashboard refetches the
 * fresh status automatically — no manual state syncing needed, unlike
 * manually pushing values into multiple Angular services after a POST.
 */
export function useTodayAttendance(employeeId: string | undefined) {
  return useQuery({
    queryKey: ['todayAttendance', employeeId],
    queryFn: () => attendanceRepository.getTodayRecord(employeeId as string),
    enabled: Boolean(employeeId),
  });
}

export function useSubmitPunch() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (request: PunchRequest) => attendanceRepository.submitPunch(request),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['todayAttendance', variables.employeeId] });
      queryClient.invalidateQueries({ queryKey: ['dashboardSummary', variables.employeeId] });
    },
  });
}
