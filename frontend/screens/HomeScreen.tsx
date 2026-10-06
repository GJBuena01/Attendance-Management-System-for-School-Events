import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import { getEventAttendance, getEvents, getStudentAttendance } from '../api/events';
import type { Account, AttendanceRecord, EventRecord, StudentAttendanceRecord, UserRole } from '../types/event';
import { styles } from '../styles/HomeScreen.style';

type HomeScreenProps = {
  role: UserRole;
  account: Account;
};

export default function HomeScreen({ role, account }: HomeScreenProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [studentRecords, setStudentRecords] = useState<StudentAttendanceRecord[]>([]);
  const [attendeeCounts, setAttendeeCounts] = useState<Record<number, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isAttendeeListVisible, setIsAttendeeListVisible] = useState(false);

  useEffect(() => {
    void refreshEvents();
  }, [account.studentId, role]);

  const refreshEvents = async () => {
    setIsLoading(true);
    setHasError(false);
    setSelectedEvent(null);
    setIsAttendeeListVisible(false);

    try {
      const loadedEvents = await getEvents();
      setEvents(loadedEvents);

      if (role === 'officer') {
        const attendanceLists = await Promise.all(
          loadedEvents.map((event) => getEventAttendance(event.id)),
        );
        setAttendeeCounts(
          Object.fromEntries(
            loadedEvents.map((event, index) => [event.id, attendanceLists[index].length]),
          ),
        );
      } else if (account.studentId) {
        setStudentRecords(await getStudentAttendance(account.studentId));
      }
    } catch {
      setHasError(true);
      setEvents([]);
      setRecords([]);
      setStudentRecords([]);
    } finally {
      setIsLoading(false);
    }
  };

  const selectEvent = async (event: EventRecord) => {
    setSelectedEvent(event);
    setIsAttendeeListVisible(false);

    if (role === 'officer') {
      try {
        setRecords(await getEventAttendance(event.id));
      } catch {
        setRecords([]);
        setHasError(true);
      }
    }
  };

  const selectedRecords = records.filter((record) => record.eventId === selectedEvent?.id);
  const selectedStudentRecord = studentRecords.find(
    (record) => record.eventId === selectedEvent?.id,
  );

  const renderEventList = () => (
    <View style={styles.sectionPanel}>
      <Text style={styles.sectionTitle}>Available events</Text>

      {isLoading ? (
        <Text style={styles.emptyStateText}>Loading events...</Text>
        ) : hasError ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Could not load events</Text>
          <Text style={styles.emptyStateText}>The event service is unavailable.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshEvents}>
            <Text style={styles.refreshText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No events yet</Text>
          <Text style={styles.emptyStateText}>New school events will appear here.</Text>
        </View>
      ) : (
        events.map((event) => {
          const attended = studentRecords.some((record) => record.eventId === event.id);

          return (
            <TouchableOpacity
              key={event.id}
              style={styles.recordCard}
              onPress={() => void selectEvent(event)}
              accessibilityRole="button"
              accessibilityLabel={`View ${role === 'officer' ? 'details' : 'attendance details'} for ${event.name}`}
            >
              <View style={styles.recordMain}>
                <Text style={styles.recordEvent}>{event.name}</Text>
                <Text style={styles.recordDate}>
                  {event.startDate} - {event.endDate} | {event.location}
                </Text>
              </View>
              {role === 'student' ? (
                <View style={[styles.statusBadge, attended ? styles.presentBadge : styles.absentBadge]}>
                  <Text style={[styles.statusText, attended ? styles.presentText : styles.absentText]}>
                    {attended ? 'Present' : 'Not attended'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.detailText}>
                  {attendeeCounts[event.id] ?? 0} attendee{attendeeCounts[event.id] === 1 ? '' : 's'}
                </Text>
              )}
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );

  return (
    <>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>School events</Text>
          <Text style={styles.subtitle}>Your event attendance</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshEvents}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {selectedEvent ? (
        <View style={styles.sectionPanel}>
          <TouchableOpacity
            onPress={() => {
              setSelectedEvent(null);
              setIsAttendeeListVisible(false);
            }}
            accessibilityRole="button"
          >
            <Text style={styles.backText}>‹  All events</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>{selectedEvent.name}</Text>
          <Text style={styles.detailText}>
            {selectedEvent.startDate} - {selectedEvent.endDate}
          </Text>
          <Text style={styles.detailText}>{selectedEvent.location}</Text>
          <Text style={styles.detailDescription}>{selectedEvent.description}</Text>

          {role === 'officer' ? (
            <TouchableOpacity
              style={styles.viewAttendanceButton}
              onPress={() => setIsAttendeeListVisible(true)}
              accessibilityRole="button"
            >
              <Text style={styles.viewAttendanceButtonText}>
                View attendees ({selectedRecords.length})
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.attendanceDetails}>
              <Text style={styles.detailHeading}>Your attendance</Text>
              <Text style={styles.detailText}>
                Status: {selectedStudentRecord ? 'Present' : 'Not attended'}
              </Text>
              <Text style={styles.detailText}>
                Timestamp: {selectedStudentRecord?.scannedAt ?? 'No attendance recorded'}
              </Text>
              <Text style={styles.detailText}>Student ID: {account.studentId ?? 'Unavailable'}</Text>
              <Text style={styles.detailText}>Student name: {account.fullName}</Text>
              <Text style={styles.detailText}>
                Recorded by: {selectedStudentRecord?.scannedBy ?? 'Not recorded'}
              </Text>
            </View>
          )}
        </View>
      ) : renderEventList()}
    </ScrollView>
    <Modal
      visible={role === 'officer' && isAttendeeListVisible && selectedEvent !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setIsAttendeeListVisible(false)}
    >
      <View style={styles.attendanceModal}>
        <View style={styles.attendanceModalHeader}>
          <View style={styles.attendanceModalTitleContainer}>
            <Text style={styles.attendanceModalTitle}>Event attendees</Text>
            <Text style={styles.attendanceModalSubtitle}>
              {selectedEvent?.name} · {
                selectedRecords.length
              } attendee{selectedRecords.length === 1 ? '' : 's'}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.closeModalButton}
            onPress={() => setIsAttendeeListVisible(false)}
            accessibilityRole="button"
            accessibilityLabel="Close attendee list"
          >
            <Text style={styles.closeModalButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
        {(() => {
          return selectedRecords.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateTitle}>No attendees yet</Text>
              <Text style={styles.emptyStateText}>Attendance records for this event will appear here.</Text>
            </View>
          ) : (
            <ScrollView style={styles.attendanceTableVerticalScroll}>
              <ScrollView horizontal showsHorizontalScrollIndicator>
                <View style={styles.attendanceTable}>
                  <View style={[styles.attendanceTableRow, styles.attendanceTableHeader]}>
                    <Text style={[styles.attendanceTableCell, styles.attendanceTableStudentId]}>Student ID</Text>
                    <Text style={[styles.attendanceTableCell, styles.attendanceTableName]}>Student name</Text>
                    <Text style={[styles.attendanceTableCell, styles.attendanceTableStatus]}>Status</Text>
                    <Text style={[styles.attendanceTableCell, styles.attendanceTableTimestamp]}>Timestamp</Text>
                    <Text style={[styles.attendanceTableCell, styles.attendanceTableScanner]}>Scanned by</Text>
                  </View>
                  {selectedRecords.map((record, index) => (
                    <View
                      key={record.id}
                      style={[
                        styles.attendanceTableRow,
                        index % 2 === 1 ? styles.attendanceTableAlternateRow : null,
                      ]}
                    >
                      <Text style={[styles.attendanceTableCell, styles.attendanceTableStudentId]}>
                        {record.studentId}
                      </Text>
                      <Text style={[styles.attendanceTableCell, styles.attendanceTableName]}>
                        {record.fullName}
                      </Text>
                      <Text style={[styles.attendanceTableCell, styles.attendanceTableStatus]}>
                        {record.status}
                      </Text>
                      <Text style={[styles.attendanceTableCell, styles.attendanceTableTimestamp]}>
                        {record.scannedAt}
                      </Text>
                      <Text style={[styles.attendanceTableCell, styles.attendanceTableScanner]}>
                        {record.scannedBy}
                      </Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </ScrollView>
          );
        })()}
      </View>
    </Modal>
    </>
  );
}
