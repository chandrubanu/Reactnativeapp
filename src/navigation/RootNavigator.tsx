import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, ActivityIndicator, Platform } from 'react-native';
import { RootStackParamList } from './types';
import LoginScreen from '../screens/auth/LoginScreen';
import MainTabNavigator from './MainTabNavigator';
import { useAuth } from '../features/auth/useAuth';
import { useSessionRestore } from '../features/auth/useSessionRestore';
import { colors } from '../constants/theme';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import { isSuperAdmin } from '../utils/roles';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * RootNavigator reads session state directly from useAuth() and decides
 * which stack to render — Login vs Main. No manual `navigation.navigate`
 * calls are needed after login/logout; changing `isAuthenticated` in the
 * Zustand store causes this component to re-render and React Navigation
 * swaps the whole stack.
 *
 * useSessionRestore() is called HERE — once, at the root — so that
 * /api/employees/me is only fetched a single time on app boot, regardless
 * of how many child components call useAuth().
 */
export default function RootNavigator() {
  // ✅ Single call: restores session from stored token on boot.
  useSessionRestore();

  const { isAuthenticated, isRestoring, employee } = useAuth();

  if (isRestoring) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.primary} size="large" />
      </View>
    );
  }

  const showAdminConsole = Platform.OS === 'web' && isSuperAdmin(employee);
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : showAdminConsole ? (
          <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
        ) : (
          <Stack.Screen name="Main" component={MainTabNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

