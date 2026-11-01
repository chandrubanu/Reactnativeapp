import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AdminDashboardRepository } from './AdminDashboardRepository';
import { useSessionStore } from '../../store/sessionStore';
import { CenterSettings } from '../../types/admin';
import { isSuperAdmin } from '../../utils/roles';

export function useCenterSettings() {
  const employee = useSessionStore((s) => s.employee);
  return useQuery({
    queryKey: ['adminCenterSettings'],
    queryFn: () => AdminDashboardRepository.getCenterSettings(employee!),
    enabled: isSuperAdmin(employee), // never even fire the request for non-admins
  });
}
export function getDashboardCount(dateLabel:string) {
  const employee = useSessionStore((s) => s.employee);
  return useQuery({
    queryKey: ['getDashboardCount'],
    queryFn: () => AdminDashboardRepository.getDashboardCount(dateLabel),
    enabled: isSuperAdmin(employee), // never even fire the request for non-admins
  });
}


export function useSaveCenterSettings() {
  const employee = useSessionStore((s) => s.employee);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (centers: CenterSettings[]) =>
      AdminDashboardRepository.saveCenterSettings(employee!, centers),
    onSuccess: (saved) => queryClient.setQueryData(['adminCenterSettings'], saved),
  });
}



export function useGetAllActivities(todayDate:string) {
  const employee = useSessionStore((s) => s.employee);
  return useQuery({
    queryKey: ['admingetAllRecentActivities'],
    queryFn: () => AdminDashboardRepository.getAllRecentActivities(todayDate),
    enabled: isSuperAdmin(employee), // never even fire the request for non-admins
  });
}

/** Triggers GET /api/admin/activity/export and downloads the CSV file. */
export function useExportAttendanceCsv() {
  return useMutation({
    mutationFn: ({ officeId, date, search }: { officeId: string; date: string; search?: string }) =>
      AdminDashboardRepository.exportAttendanceCsv(officeId, date, search),
  });
}

/** Fetch all offices for the assign-office dropdown (no actor needed). */
export function useAllOffices() {
  const employee = useSessionStore((s) => s.employee);
  return useQuery({
    queryKey: ['allOffices'],
    queryFn: () => AdminDashboardRepository.getAllOffices(),
    enabled: isSuperAdmin(employee),
    staleTime: 5 * 60 * 1000, // offices rarely change — cache for 5 min
  });
}

/** Assign an employee to an office. */
export function useAssignOffice() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ employeeId, officeId }: { employeeId: string; officeId: number }) =>
      AdminDashboardRepository.assignOffice(employeeId, officeId),
    onSuccess: () => {
      // Refresh the activity list so the table reflects any office change
      queryClient.invalidateQueries({ queryKey: ['admingetAllRecentActivities'] });
    },
  });
}