import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { getEvents } from '../api/events';
import type { Account, EventRecord } from '../types/event';
import { colors, radii } from '../styles/theme';

type EventArchivesScreenProps = {
  account: Account;
};

export default function EventArchivesScreen({ account }: EventArchivesScreenProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadArchivedEvents = useCallback(async () => {
    setIsLoading(true);
    setHasError(false);
    try {
      setEvents(await getEvents({ archived: true }));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadArchivedEvents();
  }, [loadArchivedEvents]);

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Event archives</Text>
        <Text style={styles.subtitle}>Events manually archived by officers</Text>
        {isLoading ? <Text style={styles.message}>Loading archived events...</Text> : null}
        {hasError ? <Text style={styles.error}>Could not load archived events.</Text> : null}
        {!isLoading && !hasError && events.length === 0 ? (
          <Text style={styles.message}>No archived events yet.</Text>
        ) : null}
        {events.map((event) => (
          <View key={event.id} style={styles.card}>
            <Text style={styles.eventName}>{event.name}</Text>
            <Text style={styles.details}>
              {event.startDate} - {event.endDate} | {event.location}
            </Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>
                {event.status === 'starting_soon'
                  ? 'Starting soon'
                  : event.status === 'ongoing'
                    ? 'Ongoing'
                    : 'Ended'}
              </Text>
            </View>
            <Text style={styles.archiveDetails}>
              Archived on: {event.archivedAt ?? 'Unavailable'}
            </Text>
            <Text style={styles.archiveDetails}>
              Archived by: {event.archivedBy ?? account.fullName}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: colors.canvas },
  contentContainer: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '800' as const, color: colors.ink, marginBottom: 5 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 20 },
  message: { color: colors.muted, fontSize: 14, marginTop: 12 },
  error: { color: colors.danger, fontSize: 14, marginTop: 12 },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.md,
    borderWidth: 1,
    padding: 15,
    marginBottom: 12,
  },
  eventName: { color: colors.ink, fontSize: 17, fontWeight: '800' as const },
  details: { color: colors.muted, fontSize: 12, marginTop: 5 },
  statusBadge: {
    alignSelf: 'flex-start' as const,
    backgroundColor: colors.dangerSoft,
    borderColor: colors.danger,
    borderRadius: radii.pill,
    borderWidth: 1,
    marginTop: 9,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  statusText: { color: colors.danger, fontSize: 11, fontWeight: '800' as const },
  archiveDetails: { color: colors.muted, fontSize: 13, marginTop: 8 },
};
