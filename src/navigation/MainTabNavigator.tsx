import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { MainTabParamList } from './types';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import { colors } from '../constants/theme';
import { Platform, View, Text, StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator<MainTabParamList>();
// const showAdminConsole = Platform.OS === 'web';
// function NotAuthorizedScreen() {
//   return (
//     <View style={styles.container}>
//       <Ionicons
//         name="lock-closed-outline"
//         size={60}
//         color={colors.textSecondary}
//       />
//       <Text style={styles.title}>Not Authorized</Text>
//       <Text style={styles.message}>
//         You are not authorized to access this page.
//       </Text>
//     </View>
//   );
// }

export default function MainTabNavigator() {


  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
      }}
    >
      <Tab.Screen
        name="Attendance"
        // component={
        //   showAdminConsole ? DashboardScreen : NotAuthorizedScreen
        // }
                component={DashboardScreen}

        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="finger-print" size={size} color={color} />
          ),
          tabBarLabel: 'Attendance',
        }}
      />
      {/* <Tab.Screen name="Schedule" component={ScheduleScreen} />
      <Tab.Screen name="Leave" component={LeaveScreen} /> */}
    </Tab.Navigator>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#222',
  },
  message: {
    fontSize: 16,
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },
});