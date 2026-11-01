import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useToastStore, ToastItem, ToastType } from '../../store/toastStore';
import { colors, radii, spacing } from '../../constants/theme';

// ─── Per-type visual config ────────────────────────────────────────────────────
const CONFIG: Record<
  ToastType,
  { bg: string; border: string; icon: keyof typeof Ionicons.glyphMap; iconColor: string }
> = {
  success: {
    bg: '#F0FDF4',
    border: colors.success,
    icon: 'checkmark-circle',
    iconColor: colors.success,
  },
  error: {
    bg: '#FEF2F2',
    border: colors.danger,
    icon: 'close-circle',
    iconColor: colors.danger,
  },
  warning: {
    bg: '#FFFBEB',
    border: colors.warning,
    icon: 'warning',
    iconColor: colors.warning,
  },
  info: {
    bg: colors.primaryLight,
    border: colors.primary,
    icon: 'information-circle',
    iconColor: colors.primary,
  },
};

// ─── Single animated toast card ────────────────────────────────────────────────
function ToastCard({ item }: { item: ToastItem }) {
  const dismiss = useToastStore((s) => s.dismiss);
  const cfg = CONFIG[item.type];

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-16)).current;

  useEffect(() => {
    // Slide-in
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 220, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 220, useNativeDriver: true }),
    ]).start();

    // Slide-out just before auto-dismiss (3.7 s → fades 300 ms = 4 s total)
    const fadeOut = setTimeout(() => {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -12, duration: 300, useNativeDriver: true }),
      ]).start();
    }, 3700);

    return () => clearTimeout(fadeOut);
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        { backgroundColor: cfg.bg, borderLeftColor: cfg.border },
        { opacity, transform: [{ translateY }] },
      ]}
    >
      <Ionicons name={cfg.icon} size={20} color={cfg.iconColor} style={styles.icon} />

      <View style={styles.text}>
        <Text style={styles.title}>{item.title}</Text>
        {item.message ? (
          <Text style={styles.message} numberOfLines={3}>
            {item.message}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={() => dismiss(item.id)}
        style={styles.close}
        accessibilityLabel="Dismiss notification"
        hitSlop={8}
      >
        <Ionicons name="close" size={16} color={colors.textSecondary} />
      </Pressable>
    </Animated.View>
  );
}

// ─── Toast container — mount once in AdminShell ────────────────────────────────
export function Toast() {
  const toasts = useToastStore((s) => s.toasts);
  if (toasts.length === 0) return null;

  return (
    <View style={styles.container} pointerEvents="box-none">
      {toasts.map((t) => (
        <ToastCard key={t.id} item={t} />
      ))}
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 9999,
    gap: 10,
    // On mobile keep it narrower
    maxWidth: 360,
    minWidth: 260,
    // Web: align to top-right
    ...(Platform.OS === 'web' ? { alignItems: 'flex-end' } : {}),
  },
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.sm,
    borderLeftWidth: 4,
    borderRadius: radii.sm,
    padding: spacing.sm + 4,
    // Shadow — web
    ...(Platform.OS === 'web'
      ? ({
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        } as any)
      : {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.12,
          shadowRadius: 8,
          elevation: 6,
        }),
  },
  icon: {
    marginTop: 1,
    flexShrink: 0,
  },
  text: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  message: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  close: {
    padding: 2,
    flexShrink: 0,
  },
});

