import * as SecureStore from 'expo-secure-store';

// Thin wrapper around expo-secure-store. Why a wrapper instead of calling
// SecureStore directly everywhere? Single choke point if we ever need to
// change storage strategy, add key prefixing, or add error handling —
// same reasoning as wrapping Angular's localStorage in an injectable
// StorageService instead of calling window.localStorage directly.

const SESSION_TOKEN_KEY = 'footpro.session.token';
const SESSION_EMPLOYEE_ID_KEY = 'footpro.session.employeeId';

export const secureStorage = {
  async saveToken(token: string): Promise<void> {
    await SecureStore.setItemAsync(SESSION_TOKEN_KEY, token);
  },
  async getToken(): Promise<string | null> {
    return SecureStore.getItemAsync(SESSION_TOKEN_KEY);
  },
  async saveEmployeeId(id: string): Promise<void> {
    await SecureStore.setItemAsync(SESSION_EMPLOYEE_ID_KEY, id);
  },
  async getEmployeeId(): Promise<string | null> {
    return SecureStore.getItemAsync(SESSION_EMPLOYEE_ID_KEY);
  },
  async clear(): Promise<void> {
    await SecureStore.deleteItemAsync(SESSION_TOKEN_KEY);
    await SecureStore.deleteItemAsync(SESSION_EMPLOYEE_ID_KEY);
  },
};
