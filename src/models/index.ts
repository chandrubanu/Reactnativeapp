// This folder is reserved for DTO <-> domain-model mapping functions once
// a real backend is connected (e.g. snake_case API DTOs -> camelCase
// domain types from src/types/). While every data source is mocked,
// mock repositories already return data shaped like src/types/, so there
// is nothing to map yet. Re-exporting types here keeps the import path
// stable for future code: `import { Employee } from '@/models'`.

export * from '../types/employee';
export * from '../types/attendance';
export * from '../types/shift';
export * from '../types/location';
export * from '../types/dashboard';
export * from '../types/leave';
export * from '../types/holiday';
export * from '../types/admin';
export * from '../types/common';
