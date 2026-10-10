import { ShiftTemplate } from '../../types/shift';
import { MOCK_SHIFT_TEMPLATES } from './mockShifts';

export interface IShiftRepository {
  getShiftById(shiftId: string): Promise<ShiftTemplate | null>;
  getShiftsForCenter(centerId: string): Promise<ShiftTemplate[]>;
}

class MockShiftRepository implements IShiftRepository {
  async getShiftById(shiftId: string): Promise<ShiftTemplate | null> {
    await new Promise((r) => setTimeout(r, 100));
    return MOCK_SHIFT_TEMPLATES.find((s) => s.id === shiftId) ?? null;
  }

  async getShiftsForCenter(centerId: string): Promise<ShiftTemplate[]> {
    await new Promise((r) => setTimeout(r, 100));
    return MOCK_SHIFT_TEMPLATES.filter((s) => s.centerId === centerId);
  }
}

export const shiftRepository: IShiftRepository = new MockShiftRepository();
