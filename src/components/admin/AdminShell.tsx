
import React, { PropsWithChildren, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useAuth } from '../../features/auth/useAuth';
import { colors, spacing, typography } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';

const NAV: Array<{ label: string; icon: string; enabled: boolean }> = [
  { label: 'Dashboard', icon: 'grid-outline', enabled: true },
  { label: 'Settings', icon: 'settings-outline', enabled: true },
];

interface AdminShellProps {
  activeItem: string;
  pageTitle: string;
}

export function AdminShell({
  activeItem,
  pageTitle,
  children,
}: PropsWithChildren<AdminShellProps>) {
  const navigation = useNavigation();
  const { employee, logout } = useAuth();

  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleNavigation = (label: string) => {
    // Close the drawer on mobile before navigating.
    if (isMobile) {
      setSidebarOpen(false);
    }

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

  return (
    <View style={styles.root}>
      {/* Dark backdrop behind the mobile drawer */}
      {isMobile && sidebarOpen && (
        <Pressable
          style={styles.backdrop}
          onPress={() => setSidebarOpen(false)}
          accessibilityRole="button"
          accessibilityLabel="Close navigation menu"
        />
      )}

      {/* Sidebar: permanent on desktop, collapsible on mobile */}
      {(!isMobile || sidebarOpen) && (
        <View
          style={[
            styles.sidebar,
            isMobile && styles.mobileSidebar,
          ]}
        >
          <View>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <Image
                  source={require('../../../assets/fulllogo.jpg')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
              </View>

              <Text style={styles.brandSub}>ADMIN CONSOLE</Text>
            </View>

            <View style={styles.nav}>
              {NAV.map((item) => {
                const active = item.label === activeItem;

                return (
                  <Pressable
                    key={item.label}
                    disabled={!item.enabled}
                    onPress={() => handleNavigation(item.label)}
                    style={[
                      styles.navItem,
                      active && styles.navItemActive,
                      !item.enabled && styles.navDisabled,
                    ]}
                    accessibilityRole="button"
                    accessibilityState={{
                      selected: active,
                      disabled: !item.enabled,
                    }}
                  >
                    <Text
                      style={[
                        styles.navLabel,
                        active && styles.navLabelActive,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <Pressable
            style={styles.navItem}
            onPress={() => {
              setSidebarOpen(false);
              logout();
            }}
            accessibilityRole="button"
          >
            <Text style={styles.navLabel}>Log Out</Text>
          </Pressable>
        </View>
      )}

      {/* Main content */}
      <View style={styles.main}>
        <View style={styles.topBar}>
          <View style={styles.headerLeft}>
            {isMobile && (
              <Pressable
                style={styles.menuButton}
                onPress={() => setSidebarOpen(true)}
                accessibilityRole="button"
                accessibilityLabel="Open navigation menu"
              >
                <Text style={styles.menuIcon}>☰</Text>
              </Pressable>
            )}

            <View style={styles.crumbs}>
              <Text
                style={styles.crumbRoot}
                numberOfLines={1}
              >
                Attendance Admin
              </Text>

              {!isMobile && (
                <>
                  <View style={styles.divider} />
                  <Text style={styles.crumb} numberOfLines={1}>
                    {pageTitle}
                  </Text>
                </>
              )}
            </View>
          </View>

          <View style={styles.userArea}>
            <View style={styles.userInfo}>
              <Text
                style={styles.userName}
                numberOfLines={1}
              >
                {employee?.name}
              </Text>

              <Text style={styles.userRole}>Super Admin</Text>
            </View>

            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {employee?.name?.[0] ?? 'A'}
              </Text>
            </View>
          </View>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={[
            styles.content,
            isMobile && styles.mobileContent,
          ]}
        >
          <View style={styles.contentInner}>
            {children}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.pageBg,
    position: 'relative',
  },

  sidebar: {
    width: 240,
    flexShrink: 0,
    backgroundColor: colors.sidebarBg,
    padding: spacing.md,
    justifyContent: 'space-between',
    borderRightWidth: 1,
    borderRightColor: colors.border,
  },

  mobileSidebar: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    width: 280,
    maxWidth: '85%',
    zIndex: 20,
    elevation: 10,
  },

  backdrop: {
    // ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 10,
  },

  brandRow: {
    flexDirection: 'column',
  },

  logo: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoImage: {
    width: '100%',
    height: 60,
  },

  brand: {
    ...typography.bodyBold,
    color: colors.primary,
    fontSize: 17,
  },

  brandSub: {
    fontSize: 9,
    color: colors.textSecondary,
    letterSpacing: 0.8,
  },

  nav: {
    flex: 1,
    gap: 4,
    marginTop: spacing.md,
  },

  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm + 2,
    borderRadius: 8,
  },

  navItemActive: {
    backgroundColor: colors.activeNavBg,
  },

  navDisabled: {
    opacity: 0.7,
  },

  navLabel: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },

  navLabelActive: {
    color: colors.primary,
    fontWeight: '600',
  },

  main: {
    flex: 1,
    minWidth: 0,
  },

  topBar: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    gap: 8,
    backgroundColor: colors.sidebarBg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  headerLeft: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  menuButton: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },

  menuIcon: {
    fontSize: 24,
    color: colors.textPrimary,
  },

  crumbs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flexShrink: 1,
  },

  crumbRoot: {
    ...typography.bodyBold,
    color: colors.textPrimary,
    flexShrink: 1,
  },

  divider: {
    width: 1,
    height: 16,
    backgroundColor: colors.border,
  },

  crumb: {
    ...typography.body,
    fontSize: 14,
    color: colors.textSecondary,
  },

  userArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flexShrink: 0,
  },

  userInfo: {
    alignItems: 'flex-end',
    maxWidth: 110,
  },

  userName: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },

  userRole: {
    fontSize: 10,
    color: colors.textSecondary,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.textPrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: {
    color: '#fff',
    fontWeight: '700',
  },

  scrollView: {
    flex: 1,
  },

  content: {
    padding: spacing.lg,
    alignItems: 'center',
    flexGrow: 1,
  },

  mobileContent: {
    padding: 12,
  },

  contentInner: {
    width: '100%',
    maxWidth: 1440,
  },
});
