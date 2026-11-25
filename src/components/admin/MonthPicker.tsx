import React, { useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii, spacing } from '@/constants/theme';

// ─── Types ─────────────────────────────────────────────────────────────────────
export interface MonthOption {
  /** Display label, e.g. "11 - 2026" */
  label: string;
  /** 1-based month number */
  month: number;
  year: number;
}

export interface MonthPickerProps {
  selected: MonthOption;
  options: MonthOption[];
  onChange: (opt: MonthOption) => void;
}

// ─── Helper ────────────────────────────────────────────────────────────────────
/**
 * Build the past 12 months (including current) in descending order.
 * Labels are zero-padded: "11 - 2026", "08 - 2026", etc.
 */
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
export function buildMonthOptions(): MonthOption[] {
  const today = new Date();
  const options: MonthOption[] = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    options.push({
      label: `${MONTH_NAMES[d.getMonth()].substring(0, 3)} - ${d.getFullYear()}`,
      //label: `${mm} - ${d.getFullYear()}`,
      month: d.getMonth() + 1,
      year: d.getFullYear(),
    });
  }
  return options;
}

/**
 * Format a MonthOption into the API param string: "YYYY-MM" (always 2-digit month).
 * e.g. { year: 2026, month: 5 } → "2026-05"
 */
export function formatMonthParam(opt: Pick<MonthOption, 'year' | 'month'>): string {
  return `${opt.year}-${String(opt.month).padStart(2, '0')}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────
export function MonthPicker({ selected, options, onChange }: MonthPickerProps) {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.wrap}>
      {/* ── Trigger ────────────────────────────────────────────────── */}
      <Pressable
        style={styles.trigger}
        onPress={() => setOpen(true)}
        accessibilityLabel="Select month"
      >
        <Text style={styles.triggerText} numberOfLines={1}>
          {selected.label}
        </Text>
        <Ionicons
          name={open ? 'chevron-up' : 'chevron-down'}
          size={13}
          color={colors.primary}
        />
      </Pressable>

      {/* ── Dropdown (modal overlay — works on web + mobile) ─────── */}
      {open && (
        <Modal
          transparent
          animationType="fade"
          visible={open}
          onRequestClose={() => setOpen(false)}
        >
          <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
            <View style={styles.dropdown}>
              <FlatList
                data={options}
                keyExtractor={(item) => `${item.year}-${item.month}`}
                showsVerticalScrollIndicator={false}
                renderItem={({ item }) => {
                  const isActive =
                    item.month === selected.month && item.year === selected.year;
                  return (
                    <Pressable
                      style={[styles.item, isActive && styles.itemActive]}
                      onPress={() => {
                        onChange(item);
                        setOpen(false);
                      }}
                    >
                      <Text style={[styles.itemText, isActive && styles.itemTextActive]}>
                        {item.label}
                      </Text>
                      {isActive && (
                        <Ionicons name="checkmark" size={14} color={colors.primary} />
                      )}
                    </Pressable>
                  );
                }}
              />
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  wrap: { position: 'relative' },

  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
    maxWidth: 160,
  },
  triggerText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
    flexShrink: 1,
  },

  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dropdown: {
    width: 200,
    maxHeight: 280,
    backgroundColor: '#fff',
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 4px 16px rgba(0,0,0,0.14)' } as any)
      : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.14,
        shadowRadius: 10,
        elevation: 8,
      }),
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  itemActive: { backgroundColor: colors.primaryLight },
  itemText: { fontSize: 13, color: colors.textPrimary },
  itemTextActive: { color: colors.primary, fontWeight: '700' },
});
