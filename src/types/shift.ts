export interface ShiftTemplate {
  id: string;
  centerId: string;
  name: string; // "Morning", "General", "Evening", "Night"
  startTime: string; // "08:00" 24h local to center timezone
  endTime: string; // "17:00"
  gracePeriodMinutes: number;
  breakDurationMinutes: number;
  crossesMidnight: boolean; // true for shifts like Night 22:00-07:00
}

export interface AssignedShift {
  employeeId: string;
  date: string; // ISO date "2026-09-29"
  shift: ShiftTemplate;
}
