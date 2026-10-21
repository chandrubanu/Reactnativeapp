import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

// expo-secure-store has NO web implementation (browsers have no Keychain /
// Keystore). On web we fall back to localStorage so the admin console can
// keep a session. localStorage is readable by any script on the page, so a
// real backend should use short-lived tokens or httpOnly cookies for web.
const isWeb = Platform.OS === 'web';
const webStore = () => (globalThis as any).localStorage as Storage;

const SESSION_TOKEN_KEY = 'footpro.session.token';
const SESSION_EMPLOYEE_ID_KEY = 'footpro.session.employeeId';

async function setItem(key: string, value: string) {
  if (isWeb) return webStore().setItem(key, value);
  await SecureStore.setItemAsync(key, value);
}
async function getItem(key: string): Promise<string | null> {
  if (isWeb) return webStore().getItem(key);
  return SecureStore.getItemAsync(key);
}
async function removeItem(key: string) {
  if (isWeb) return webStore().removeItem(key);
  await SecureStore.deleteItemAsync(key);
}

export const secureStorage = {
  saveToken: (token: string) => setItem(SESSION_TOKEN_KEY, token),
  getToken: () => getItem(SESSION_TOKEN_KEY),
  saveEmployeeId: (id: string) => setItem(SESSION_EMPLOYEE_ID_KEY, id),
  getEmployeeId: () => getItem(SESSION_EMPLOYEE_ID_KEY),
  async clear() {
    await removeItem(SESSION_TOKEN_KEY);
    await removeItem(SESSION_EMPLOYEE_ID_KEY);
  },
};
