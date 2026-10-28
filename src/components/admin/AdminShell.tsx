import React, { PropsWithChildren } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Image } from 'react-native';
import { useAuth } from '../../features/auth/useAuth';
import { colors, spacing, typography } from '../../constants/theme';
import { admin } from './adminTheme';
import { useNavigation } from '@react-navigation/native';

//type IconName = React.ComponentProps<typeof Ionicons>['name'];

// Only "Settings" is built; the rest are visible but disabled placeholders.
const NAV: Array<{ label: string; icon: string; enabled: boolean }> = [
  { label: 'Dashboard', icon: 'grid-outline', enabled: true },
  //{ label: 'Scheduling', icon: 'calendar-outline', enabled: false },
  // { label: 'Leave Approval', icon: 'checkbox-outline', enabled: false },
  // { label: 'Reports', icon: 'bar-chart-outline', enabled: false },
  // { label: 'Employee Management', icon: 'people-outline', enabled: false },
  { label: 'Settings', icon: 'settings-outline', enabled: true },
];

interface AdminShellProps {
  activeItem: string;
  pageTitle: string;
}

/** Sidebar + top bar layout for the web admin console. */
//export default function AdminShell({ activeItem, children }) {
export function AdminShell({ activeItem, pageTitle, children }: PropsWithChildren<AdminShellProps>) {
  const navigation = useNavigation();
  const handleNavigation = (label: string) => {
    switch (label) {
      case 'Dashboard':
        navigation.navigate('AdminDashboard' as never);
        break;

      case 'Settings':
        navigation.navigate('AdminSettings' as never);
        break;

      default:
        break;
    }
  };
  const { employee, logout } = useAuth();

  return (
    <View style={styles.root}>
      <View style={styles.sidebar}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Image
              source={require('../../../assets/fulllogo.jpg')}
              style={{ width: '100%', height: 120 }}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.brandSub}>ADMIN CONSOLE</Text>
          </View>
        </View>



        <View style={styles.nav}>
          {NAV.map((item) => {
            const active = item.label === activeItem;
            return (
              <Pressable
                key={item.label}
                disabled={!item.enabled}
                onPress={() => handleNavigation(item.label)}
                style={[styles.navItem, active && styles.navItemActive, !item.enabled && styles.navDisabled]}
              >
                {/* <Ionicons name={item.icon} size={18} color={active ? colors.primary : colors.textSecondary} /> */}
                <Text style={[styles.navLabel, active && styles.navLabelActive]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>

        <Pressable style={styles.navItem} onPress={logout}>
          {/* <Ionicons name="log-out-outline" size={18} color={colors.textSecondary} /> */}
          <Text style={styles.navLabel}>Log Out</Text>
        </Pressable>
      </View>

      <View style={styles.main}>
        <View style={styles.topBar}>
          <View style={styles.crumbs}>
            <Text style={styles.crumbRoot}>Attendance Admin</Text>
            <View style={styles.divider} />
            <Text style={styles.crumb}>{pageTitle}</Text>
          </View>
          <View style={styles.userArea}>
            {/* <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} /> */}
            {/* <Ionicons name="help-circle-outline" size={20} color={colors.textSecondary} /> */}
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={styles.userName}>{employee?.name}</Text>
              <Text style={styles.userRole}>Super Admin</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{employee?.name?.[0] ?? 'A'}</Text>
            </View>
          </View>
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.contentInner}>{children}</View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: admin.pageBg },
  sidebar: {
    width: 240, backgroundColor: admin.sidebarBg, padding: spacing.md,
    justifyContent: 'space-between', borderRightWidth: 1, borderRightColor: colors.border,
  },
  brandRow: { flexDirection: 'column', },
  logo: { borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  brand: { ...typography.bodyBold, color: colors.primary, fontSize: 17 },
  brandSub: { fontSize: 9, color: colors.textSecondary, letterSpacing: 0.8 },
  nav: { flex: 1, gap: 4, marginTop: spacing.md },
  navItem: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, padding: spacing.sm + 2, borderRadius: 8 },
  navItemActive: { backgroundColor: admin.activeNavBg },
  navDisabled: { opacity: 0.7 },
  navLabel: { ...typography.body, fontSize: 14, color: colors.textSecondary },
  navLabelActive: { color: colors.primary, fontWeight: '600' },
  main: { flex: 1 },
  topBar: {
    height: 56, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: spacing.lg, backgroundColor: admin.sidebarBg, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  crumbs: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  crumbRoot: { ...typography.bodyBold, color: colors.textPrimary },
  divider: { width: 1, height: 16, backgroundColor: colors.border },
  crumb: { ...typography.body, fontSize: 14, color: colors.textSecondary },
  userArea: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
  userName: { fontSize: 12, fontWeight: '600', color: colors.textPrimary },
  userRole: { fontSize: 10, color: colors.textSecondary },
  avatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: colors.textPrimary, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: '#fff', fontWeight: '700' },
  content: { padding: spacing.lg, alignItems: 'center' },
  contentInner: { width: '100%' },
});
