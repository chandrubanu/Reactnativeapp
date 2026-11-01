/**
 * Imperative toast helpers — safe to call from repositories, hooks,
 * or any non-React context.
 *
 * Usage:
 *   import { toast } from '@/utils/toast';
 *   toast.success('Saved', 'Center settings saved successfully.');
 *   toast.error('Error', 'Something went wrong.');
 */
import { useToastStore } from '../store/toastStore';

const show = useToastStore.getState().show;

export const toast = {
  success: (title: string, message: string) => show('success', title, message),
  error:   (title: string, message: string) => show('error',   title, message),
  info:    (title: string, message: string) => show('info',    title, message),
  warning: (title: string, message: string) => show('warning', title, message),
};

