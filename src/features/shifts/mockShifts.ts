import { ShiftTemplate } from '../../types/shift';

/**
 * DUMMY shift catalog per fulfillment center — stands in for a backend
 * `/shifts` endpoint. Different centers legitimately have different
 * shift structures (TVM has 4 shift options, CHN/BLR have one each),
 * matching your spec's example table.
 */
export const MOCK_SHIFT_TEMPLATES: ShiftTemplate[] = [
  {
    id: 'TVM-MORNING',
    centerId: 'TVM001',
    name: 'Morning',
    startTime: '08:00',
    endTime: '17:00',
    gracePeriodMinutes: 10,
    breakDurationMinutes: 30,
    crossesMidnight: false,
  },
  {
    id: 'TVM-GENERAL',
    centerId: 'TVM001',
    name: 'General',
    startTime: '09:00',
    endTime: '18:00',
    gracePeriodMinutes: 10,
    breakDurationMinutes: 30,
    crossesMidnight: false,
  },
  {
    id: 'TVM-EVENING',
    centerId: 'TVM001',
    name: 'Evening',
    startTime: '14:00',
    endTime: '23:00',
    gracePeriodMinutes: 10,
    breakDurationMinutes: 30,
    crossesMidnight: false,
  },
  {
    id: 'TVM-NIGHT',
    centerId: 'TVM001',
    name: 'Night',
    startTime: '22:00',
    endTime: '07:00',
    gracePeriodMinutes: 15,
    breakDurationMinutes: 30,
    crossesMidnight: true,
  },
  {
    id: 'CHN-GENERAL',
    centerId: 'CHN001',
    name: 'General',
    startTime: '09:00',
    endTime: '18:00',
    gracePeriodMinutes: 10,
    breakDurationMinutes: 45,
    crossesMidnight: false,
  },
  {
    id: 'BLR-GENERAL',
    centerId: 'BLR001',
    name: 'General',
    startTime: '08:30',
    endTime: '17:30',
    gracePeriodMinutes: 10,
    breakDurationMinutes: 30,
    crossesMidnight: false,
  },
];
