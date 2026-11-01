import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAllOffices, useAssignOffice } from '@/features/admin/useAdminDashboard';
import { toast } from '@/utils/toast';
import { colors, radii, spacing, typography } from '@/constants/theme';

interface Props {
  /** Employee row data */
  employeeId: string;
  employeeName: string;
  officeId?: number;
  /** Controls visibility */
  visible: boolean;
  onClose: () => void;
}

export function AssignOfficeModal({ employeeId, employeeName, officeId, visible, onClose }: Props) {
  const { data: offices = [], isLoading: officesLoading } = useAllOffices();
  const assignMutation = useAssignOffice();

  const [selectedOfficeId, setSelectedOfficeId] = useState<number | null>(
    officeId ?? null
  );

  // Pre-select the current office whenever the modal opens for a (different) employee
  useEffect(() => {
    if (visible) {
      setSelectedOfficeId(officeId ?? null);
    }
  }, [visible, officeId]);

  const handleSubmit = async () => {
    if (selectedOfficeId === null) {
      toast.warning('No office selected', 'Please choose an office before submitting.');
      return;
    }
    try {
      await assignMutation.mutateAsync({ employeeId, officeId: selectedOfficeId });
      toast.success('Office Assigned', `${employeeName} has been assigned to the selected office.`);
      setSelectedOfficeId(null);
      onClose();
    } catch (e: any) {
      toast.error('Assignment Failed', e?.message ?? 'Could not assign office. Please try again.');
    }
  };

  const handleClose = () => {
    setSelectedOfficeId(null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={handleClose}>
        {/* Stop tap-through on the card itself */}
        <Pressable style={styles.card} onPress={() => { }}>
          {/* ── Header ───────────────────────────────────────────────── */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="location-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>Assign Office</Text>
              <Text style={styles.subtitle} numberOfLines={1}>
                {employeeName} · #{employeeId}
              </Text>
            </View>
            <Pressable onPress={handleClose} hitSlop={8} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* ── Office dropdown list ──────────────────────────────────── */}
          <Text style={styles.sectionLabel}>SELECT OFFICE</Text>

          {officesLoading ? (
            <ActivityIndicator color={colors.primary} style={{ marginVertical: spacing.lg }} />
          ) : offices.length === 0 ? (
            <Text style={styles.empty}>No offices available.</Text>
          ) : (
            <ScrollView
              style={styles.listScroll}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {offices.map((office) => {
                const isSelected = selectedOfficeId === Number(office.centerId);
                const isCurrent = officeId !== undefined && officeId === Number(office.centerId);
                return (
                  <Pressable
                    key={office.centerId}
                    style={[styles.officeItem, isSelected && styles.officeItemSelected]}
                    onPress={() => setSelectedOfficeId(Number(office.centerId))}
                  >
                    <View style={styles.officeItemLeft}>
                      <View style={[styles.radioDot, isSelected && styles.radioDotSelected]}>
                        {isSelected && <View style={styles.radioDotInner} />}
                      </View>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <View style={styles.officeCodeRow}>
                          <Text style={[styles.officeCode, isSelected && styles.officeCodeSelected]}>
                            {office.centerCode}
                          </Text>
                          {isCurrent && (
                            <View style={styles.currentBadge}>
                              <Text style={styles.currentBadgeText}>Current</Text>
                            </View>
                          )}
                        </View>
                        <Text style={styles.officeLabel} numberOfLines={1}>
                          {office.locationLabel}
                        </Text>
                      </View>
                    </View>
                    {isSelected && (
                      <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
                    )}
                  </Pressable>
                );
              })}
            </ScrollView>
          )}

          {/* ── Actions ──────────────────────────────────────────────── */}
          <View style={styles.actions}>
            <Pressable style={styles.cancelBtn} onPress={handleClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.submitBtn,
                (selectedOfficeId === null || selectedOfficeId === (officeId ?? -1) || assignMutation.isPending) && styles.submitBtnDisabled,
              ]}
              disabled={selectedOfficeId === null || selectedOfficeId === (officeId ?? -1) || assignMutation.isPending}
              onPress={handleSubmit}
            >
              {assignMutation.isPending ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <>
                  <Ionicons name="save-outline" size={14} color="#fff" />
                  <Text style={styles.submitText}>Assign</Text>
                </>
              )}
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: radii.md,
    overflow: 'hidden',
    // Shadow
    ...(Platform.OS === 'web'
      ? ({ boxShadow: '0 8px 32px rgba(0,0,0,0.18)' } as any)
      : {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.18,
        shadowRadius: 16,
        elevation: 12,
      }),
  },

  // ── Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { ...typography.bodyBold, color: colors.textPrimary },
  subtitle: { fontSize: 11, color: colors.textSecondary, marginTop: 1 },
  closeBtn: { padding: 4 },

  // ── List
  sectionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.textSecondary,
    letterSpacing: 0.8,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  listScroll: {
    maxHeight: 260,
    paddingHorizontal: spacing.md,
  },
  empty: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    padding: spacing.lg,
  },
  officeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.sm + 4,
    borderRadius: radii.sm,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: '#FAFBFF',
  },
  officeItemSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  officeItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  radioDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  radioDotSelected: { borderColor: colors.primary },
  radioDotInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  officeCode: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  officeCodeSelected: { color: colors.primary },
  officeCodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currentBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: colors.success + '20',
  },
  currentBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: colors.success,
    letterSpacing: 0.3,
  },
  officeLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
    maxWidth: 280,
  },

  // ── Actions
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    marginTop: spacing.sm,
  },
  cancelBtn: {
    flex: 1,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: { fontSize: 13, fontWeight: '600', color: colors.textSecondary },
  submitBtn: {
    flex: 2,
    flexDirection: 'row',
    gap: 6,
    paddingVertical: spacing.sm + 2,
    borderRadius: radii.sm,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitBtnDisabled: { backgroundColor: '#A9B6D6' },
  submitText: { fontSize: 13, fontWeight: '700', color: '#fff' },
});

