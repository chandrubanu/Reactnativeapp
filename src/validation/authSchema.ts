import { z } from 'zod';

/**
 * Zod = a runtime + compile-time validation schema, roughly like Angular's
 * ReactiveFormsModule Validators but declared as one composable schema
 * object instead of scattered validator functions. React Hook Form's
 * `zodResolver` (see LoginScreen.tsx) plugs this straight into the form.
 */
export const loginSchema = z.object({
  employeeCode: z.string().min(1, 'Employee code is required'),
  password: z.string().min(3, 'Password must be at least 3 characters'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
