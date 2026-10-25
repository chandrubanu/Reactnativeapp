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