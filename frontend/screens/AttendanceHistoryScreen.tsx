import { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, Text, View } from 'react-native';
import { getStudentAttendance } from '../api/events';
import type { Account, StudentAttendanceRecord } from '../types/event';
import { colors, radii } from '../styles/theme';

const styles = {
  container: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: '800' as const, color: colors.ink, marginBottom: 6 },
  subtitle: { color: colors.muted, fontSize: 15, lineHeight: 22, marginBottom: 20 },
  loading: { paddingTop: 40, alignItems: 'center' as const },
  empty: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 18,
  },
  emptyTitle: { color: colors.ink, fontSize: 17, fontWeight: '800' as const, marginBottom: 6 },
  emptyText: { color: colors.muted, fontSize: 14, lineHeight: 20 },
  record: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: radii.md,
    padding: 17,
    marginBottom: 12,
  },
  recordHeader: { flexDirection: 'row' as const, justifyContent: 'space-between' as const, alignItems: 'flex-start' as const, gap: 10, marginBottom: 8 },
  eventName: { flex: 1, color: colors.ink, fontSize: 17, fontWeight: '800' as const },
  badge: { backgroundColor: colors.successSoft, borderRadius: radii.pill, paddingHorizontal: 9, paddingVertical: 5 },
  archivedBadge: { backgroundColor: colors.yellowSoft },
  badgeText: { color: colors.success, fontSize: 11, fontWeight: '800' as const },
  archivedBadgeText: { color: colors.ink },
  detail: { color: colors.muted, fontSize: 14, lineHeight: 21 },
};

type AttendanceHistoryScreenProps = {
  account: Account;
};

export default function AttendanceHistoryScreen({ account }: AttendanceHistoryScreenProps) {
  const [records, setRecords] = useState<StudentAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (!account.studentId) {
      setIsLoading(false);
      return;
    }

    void getStudentAttendance(account.studentId)
      .then(setRecords)
      .catch(() => {
        setHasError(true);
        setRecords([]);
      })
      .finally(() => setIsLoading(false));
  }, [account.studentId]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Event attendance history</Text>
        <Text style={styles.subtitle}>
          Events attended by {account.fullName}, including archived events.
        </Text>

        {isLoading ? (
          <View style={styles.loading}>
            <ActivityIndicator color={colors.maroon} />
          </View>
        ) : hasError ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>Could not load attendance history</Text>
            <Text style={styles.emptyText}>The attendance service is unavailable.</Text>
          </View>
        ) : records.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No attendance yet</Text>
            <Text style={styles.emptyText}>Attended events will appear here.</Text>
          </View>
        ) : (
          records.map((record) => (
            <View key={record.id} style={styles.record}>
              <View style={styles.recordHeader}>
                <Text style={styles.eventName}>{record.eventName}</Text>
                <View style={[styles.badge, record.archivedAt ? styles.archivedBadge : null]}>
                  <Text style={[styles.badgeText, record.archivedAt ? styles.archivedBadgeText : null]}>
                    {record.archivedAt ? 'Archived' : 'Active'}
                  </Text>
                </View>
              </View>
              <Text style={styles.detail}>{record.startDate} - {record.endDate}</Text>
              <Text style={styles.detail}>{record.location}</Text>
              <Text style={styles.detail}>Recorded: {record.scannedAt}</Text>
              <Text style={styles.detail}>Recorded by: {record.scannedBy}</Text>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
