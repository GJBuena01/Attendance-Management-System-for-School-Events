import { SafeAreaView } from 'react-native-safe-area-context';
import { useCallback, useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getEventAttendance, getEvents } from '../api/events';
import type { Account, EventRecord } from '../types/event';
import { colors, radii } from '../styles/theme';

type EventArchivesScreenProps = {
  account: Account;
};

export default function EventArchivesScreen({ account }: EventArchivesScreenProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [attendees, setAttendees] = useState<Awaited<ReturnType<typeof getEventAttendance>>>([]);
  const [isAttendeeLoading, setIsAttendeeLoading] = useState(false);

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

  const openEvent = async (event: EventRecord) => {
    setSelectedEvent(event);
    setIsAttendeeLoading(true);
    try {
      setAttendees(await getEventAttendance(event.id));
    } catch {
      setAttendees([]);
    } finally {
      setIsAttendeeLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void loadArchivedEvents();
    }, [loadArchivedEvents]),
  );

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Event archives</Text>
        <Text style={styles.subtitle}>Events manually archived by officers</Text>
        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => void loadArchivedEvents()}
          accessibilityRole="button"
          accessibilityLabel="Refresh archived events"
        >
          <Text style={styles.refreshButtonText}>Refresh</Text>
        </TouchableOpacity>
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
            {event.description ? (
              <Text style={styles.description}>{event.description}</Text>
            ) : null}
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
            <TouchableOpacity
              style={styles.viewAttendeesButton}
              onPress={() => void openEvent(event)}
              accessibilityRole="button"
              accessibilityLabel={`View attendees for ${event.name}`}
            >
              <Text style={styles.viewAttendeesButtonText}>View attendees</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <Modal
        visible={selectedEvent !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelectedEvent(null)}
      >
        <SafeAreaView edges={['top', 'bottom']} style={styles.modal}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>{selectedEvent?.name}</Text>
              <Text style={styles.modalSubtitle}>
                Archived event attendees · {attendees.length} attendee{attendees.length === 1 ? '' : 's'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setSelectedEvent(null)}
              accessibilityRole="button"
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
          {isAttendeeLoading ? (
            <Text style={styles.message}>Loading attendees...</Text>
          ) : attendees.length === 0 ? (
            <Text style={styles.message}>No attendance records for this event.</Text>
          ) : (
            <ScrollView>
              {attendees.map((attendee) => (
                <View key={attendee.id} style={styles.attendeeCard}>
                  <Text style={styles.attendeeName}>{attendee.fullName}</Text>
                  <Text style={styles.attendeeDetails}>
                    {attendee.studentId} · {attendee.scannedAt}
                  </Text>
                  <Text style={styles.attendeeDetails}>Scanned by: {attendee.scannedBy}</Text>
                </View>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = {
  container: { flex: 1, backgroundColor: colors.canvas },
  contentContainer: { padding: 20, paddingBottom: 32 },
  title: { fontSize: 28, fontWeight: '800' as const, color: colors.ink, marginBottom: 5 },
  subtitle: { fontSize: 14, color: colors.muted, marginBottom: 20 },
  refreshButton: {
    alignSelf: 'flex-start' as const,
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    marginBottom: 18,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  refreshButtonText: { color: colors.surface, fontWeight: '800' as const },
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
  description: { color: colors.ink, fontSize: 13, lineHeight: 19, marginTop: 8 },
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
  viewAttendeesButton: {
    alignSelf: 'flex-start' as const,
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    marginTop: 14,
    paddingHorizontal: 13,
    paddingVertical: 10,
  },
  viewAttendeesButtonText: { color: colors.surface, fontWeight: '800' as const },
  modal: { flex: 1, backgroundColor: colors.canvas, padding: 20 },
  modalHeader: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
    marginBottom: 20,
  },
  modalTitleContainer: { flex: 1, marginRight: 12 },
  modalTitle: { color: colors.ink, fontSize: 21, fontWeight: '800' as const },
  modalSubtitle: { color: colors.muted, fontSize: 13, marginTop: 4 },
  closeButton: {
    backgroundColor: colors.maroon,
    borderRadius: radii.sm,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  closeButtonText: { color: colors.surface, fontWeight: '800' as const },
  attendeeCard: {
    backgroundColor: colors.surface,
    borderColor: colors.line,
    borderRadius: radii.sm,
    borderWidth: 1,
    padding: 14,
    marginBottom: 10,
  },
  attendeeName: { color: colors.ink, fontSize: 16, fontWeight: '800' as const },
  attendeeDetails: { color: colors.muted, fontSize: 13, marginTop: 5 },
};
