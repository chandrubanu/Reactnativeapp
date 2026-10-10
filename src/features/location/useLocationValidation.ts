import { useCallback, useState } from 'react';
import { locationService } from '../../services/locationService';
import { locationRepository } from './locationRepository';
import { LocationValidationResult } from '../../types/location';
import { AppError, AppErrorCode, ERROR_MESSAGES } from '../../constants/errors';

interface UseLocationValidationState {
  isChecking: boolean;
  result: LocationValidationResult | null;
  errorMessage: string | null;
}

/**
 * Custom hook = React's answer to an Angular injectable service +
 * component-local subscription combined. Any screen can call
 * `useLocationValidation()` and get reactive state (isChecking, result,
 * errorMessage) plus a `checkLocation()` function to trigger it —
 * without duplicating GPS/geofence logic in every screen.
 */
export function useLocationValidation(employeeId: string) {
  const [state, setState] = useState<UseLocationValidationState>({
    isChecking: false,
    result: null,
    errorMessage: null,
  });

  const checkLocation = useCallback(async () => {
    setState({ isChecking: true, result: null, errorMessage: null });
    try {
      const [sample, authorizedLocations] = await Promise.all([
        locationService.getCurrentSample(),
        locationRepository.getAuthorizedLocationsForEmployee(employeeId),
      ]);

      const result = locationService.validateAgainstLocations(sample, authorizedLocations);
      console.log(result, 'validateAgainstLocations')
      setState({ isChecking: false, result, errorMessage: null });
    } catch (err) {
      const code = err instanceof AppError ? err.code : AppErrorCode.UNKNOWN;
      setState({
        isChecking: false,
        result: null,
        errorMessage: ERROR_MESSAGES[code],
      });
    }
  }, [employeeId]);

  return { ...state, checkLocation };
}
