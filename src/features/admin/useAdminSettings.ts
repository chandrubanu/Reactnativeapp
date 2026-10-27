import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { adminSettingsRepository } from './adminSettingsRepository';
import { useSessionStore } from '../../store/sessionStore';
import { CenterSettings } from '../../types/admin';
import { isSuperAdmin } from '../../utils/roles';

export function useCenterSettings() {
  const employee = useSessionStore((s) => s.employee);
  return useQuery({
    queryKey: ['adminCenterSettings'],
    queryFn: () => adminSettingsRepository.getCenterSettings(employee!),
    enabled: isSuperAdmin(employee), // never even fire the request for non-admins
  });
}

export function useSaveCenterSettings() {
  const employee = useSessionStore((s) => s.employee);
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (centers: CenterSettings[]) =>
      adminSettingsRepository.saveCenterSettings(employee!, centers),
    onSuccess: (saved) => queryClient.setQueryData(['adminCenterSettings'], saved),
  });
}
