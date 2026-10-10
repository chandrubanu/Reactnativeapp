import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import ScheduleScreen from '../screens/schedule/ScheduleScreen';
import LeaveScreen from '../screens/leave/LeaveScreen';
import { colors } from '../constants/theme';

const Tab = createBottomTabNavigator<MainTabParamList>();

/**
 * Bottom tab bar — matches the screenshot's Attendance/Schedule/Leave
 * bar. We use React Navigation's built-in bottom-tabs navigator (native
 * look & feel, handles safe-area insets automatically) rather than
 * hand-rolling a custom BottomTabBar component — less code, and it's
 * the standard, well-maintained approach.
 */
export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen name="Attendance" component={DashboardScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Leave" component={LeaveScreen} />
    </Tab.Navigator>
  );
}
