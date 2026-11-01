
import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useGetAllActivities } from '@/features/admin/useAdminDashboard';
import { colors } from '@/constants/theme';
import { AssignOfficeModal } from './AssignOfficeModal';

interface SelectedEmployee {
  id: string;
  name: string;
  officeid?: number
}

export default function AdminRecentActivities() {
  const todayDate = useMemo(
    () => new Date().toISOString().split('T')[0],
    [],
  );
  const {
    data: employees = [],
    isLoading,
    isError,
  } = useGetAllActivities(todayDate);

  const [selected, setSelected] = useState<SelectedEmployee | null>(null);

  if (isLoading) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.cell}>Loading recent activities...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.cell}>
          Failed to load recent activities.
        </Text>
      </View>
    );
  }

  if (employees.length === 0) {
    return (
      <View style={styles.messageContainer}>
        <Text style={styles.cell}>No recent activities found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.table}>
          {/* ── Header ─────────────────────────────────────────────── */}
          <View style={[styles.row, styles.header]}>
            <Text style={[styles.heading, styles.employeeCol]}>EMPLOYEE</Text>
            <Text style={[styles.heading, styles.statusCol]}>STATUS</Text>
            <Text style={[styles.heading, styles.timeCol]}>PUNCH-IN TIME</Text>
            <Text style={[styles.heading, styles.departmentCol]}>DEPARTMENT</Text>
            <Text style={[styles.heading, styles.actionCol]}>ACTIONS</Text>
          </View>

          {/* ── Rows ───────────────────────────────────────────────── */}
          {
            employees.map((employee) => {
              const statusStyle =
                employee.status === 'ABSENT'
                  ? styles.late
                  : employee.status === 'ON_TIME'
                    ? styles.onTime
                    : styles.permission;
              const statusStyletransparent =
                employee.status === 'ABSENT'
                  ? styles.latetransparent
                  : employee.status === 'ON_TIME'
                    ? styles.onTimetransparent
                    : styles.permissiontransparent;

              return (
                <View
                  key={employee.id}
                  style={[styles.row, styles.dataRow]}
                >
                  {/* Employee */}
                  <View style={[styles.employeeCol, styles.employeeInfo]}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>{employee.avatar}</Text>
                    </View>
                    <View style={styles.employeeDetails}>
                      <Text style={styles.employeeName}>{employee.name}</Text>
                      <Text style={styles.employeeId}>Emp ID: #{employee.id}</Text>
                    </View>
                  </View>

                  {/* Status badge */}
                  <View style={styles.statusCol}>
                    <View style={[styles.badge, statusStyletransparent]}>
                      <Text style={[styles.badgeText, statusStyle]}>{employee.status}</Text>
                    </View>
                  </View>

                  {/* Punch-in */}
                  <Text style={[styles.cell, styles.timeCol]}>
                    {employee.punchIn || '---'}
                  </Text>

                  {/* Department */}
                  <Text numberOfLines={1} style={[styles.cell, styles.departmentCol]}>
                    {employee.department}
                  </Text>

                  {/* ── Actions ─────────────────────────────────────── */}
                  <View style={[styles.actionCol, styles.actionCell]}>
                    <Pressable
                      hitSlop={8}
                      onPress={() =>
                        setSelected({ id: employee.id, name: employee.name, officeid: employee.officeId })
                      }
                      style={({ pressed }) => [
                        styles.actionBtn,
                        pressed && styles.actionBtnPressed,
                      ]}
                      accessibilityLabel={`Actions for ${employee.name}`}
                    >
                      <Ionicons name="location-outline" size={17} color={colors.primary} />
                    </Pressable>
                  </View>
                </View>
              );
            })}
        </View>
      </ScrollView>

      {/* ── Assign Office Modal ───────────────────────────────────────── */}
      {
        selected && (
          <AssignOfficeModal
            visible={!!selected}
            employeeId={selected.id}
            employeeName={selected.name}
            officeId={selected.officeid}
            onClose={() => setSelected(null)}
          />
        )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flex: 1,
    minWidth: 0,
    alignSelf: 'stretch',
  },

  scrollView: {
    width: '100%',
  },

  scrollContent: {
    flexGrow: 1,
    marginTop: 15,
  },

  messageContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  employeeDetails: {
    flex: 1,
    minWidth: 0,
  },

  table: {
    width: '100%',
    minWidth: 850,
    backgroundColor: '#EEF2FF',
    borderRadius: 12,
    padding: 6,
    gap: 6,
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  header: {
    minHeight: 47,
    paddingHorizontal: 5,
  },

  heading: {
    fontSize: 12,
    fontWeight: '600',
    color: '#172554',
    letterSpacing: 0.4,
  },

  dataRow: {
    minHeight: 55,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: 5,
  },

  employeeCol: { width: 190 },
  statusCol: { width: 170 },
  timeCol: { width: 190 },
  departmentCol: { width: 240, paddingRight: 12 },
  actionCol: { width: 55, alignItems: 'center' },

  employeeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#D7F0EF',
    alignItems: 'center',
    justifyContent: 'center',
  },

  avatarText: { fontSize: 17 },

  employeeName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#172554',
  },

  employeeId: {
    fontSize: 10,
    color: '#8B93A1',
    marginTop: 3,
  },

  cell: {
    fontSize: 12,
    color: '#172554',
  },

  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  badgeText: {
    fontSize: 10,
    fontWeight: '500',
    textTransform: 'capitalize',
  },

  onTime: { color: colors.primary },
  late: { color: colors.danger },
  permission: { color: colors.textSecondary },

  onTimetransparent: { backgroundColor: colors.primary + '20' },
  latetransparent: { backgroundColor: colors.danger + '20' },
  permissiontransparent: { backgroundColor: colors.textSecondary + '20' },

  actionCell: { justifyContent: 'center' },

  actionBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnPressed: {
    backgroundColor: colors.primary + '30',
  },
});
