import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal } from 'react-native';
import {
  mockAttendance,
  mockEvents,
  mockStudent,
  type AttendanceRecord,
  type MockEvent,
} from '../mock-data/mockAttendance';
import type { UserRole } from '../types/event';
import { styles } from '../styles/HomeScreen.style';

type HomeScreenProps = {
  role: UserRole;
};

export default function HomeScreen({ role }: HomeScreenProps) {
  const [events, setEvents] = useState<MockEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isAttendeeListVisible, setIsAttendeeListVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 250);

    return () => clearTimeout(timer);
  }, []);

  const refreshEvents = () => {
    setIsLoading(true);
    setHasError(false);
    setSelectedEvent(null);
    setTimeout(() => {
      setEvents(mockEvents);
      setIsLoading(false);
    }, 250);
  };

  const renderEventList = () => (
    <View style={styles.sectionPanel}>
      <Text style={styles.sectionTitle}>Available events</Text>

      {isLoading ? (
        <Text style={styles.emptyStateText}>Loading events...</Text>
      ) : hasError ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Could not load events</Text>
          <Text style={styles.emptyStateText}>The local event list is unavailable.</Text>
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
          const attendance = mockAttendance.find(
            (record) => record.eventId === event.id && record.studentId === mockStudent.id,
          );
          const attended = Boolean(attendance);

          return (
            <TouchableOpacity
              key={event.id}
              style={styles.recordCard}
              onPress={() => setSelectedEvent(event)}
              accessibilityRole="button"
              accessibilityLabel={`View ${role === 'officer' ? 'details' : 'attendance details'} for ${event.name}`}
            >
              <View style={styles.recordMain}>
                <Text style={styles.recordEvent}>{event.name}</Text>
                <Text style={styles.recordDate}>{event.date} | {event.location}</Text>
              </View>
              {role === 'student' ? (
                <View style={[styles.statusBadge, attended ? styles.presentBadge : styles.absentBadge]}>
                  <Text style={[styles.statusText, attended ? styles.presentText : styles.absentText]}>
                    {attended ? 'Present' : 'Not attended'}
                  </Text>
                </View>
              ) : null}
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
          <Text style={styles.detailText}>{selectedEvent.date}</Text>
          <Text style={styles.detailText}>{selectedEvent.location}</Text>
          <Text style={styles.detailDescription}>{selectedEvent.description}</Text>

          {role === 'officer' ? (
            <TouchableOpacity
              style={styles.viewAttendanceButton}
              onPress={() => setIsAttendeeListVisible(true)}
              accessibilityRole="button"
            >
              <Text style={styles.viewAttendanceButtonText}>
                View attendees ({mockAttendance.filter((record) => record.eventId === selectedEvent.id).length})
              </Text>
            </TouchableOpacity>
          ) : (
            (() => {
              const attendance = mockAttendance.find(
                (record) =>
                  record.eventId === selectedEvent.id && record.studentId === mockStudent.id,
              );

              return (
                <View style={styles.attendanceDetails}>
                  <Text style={styles.detailHeading}>Your attendance</Text>
                  <Text style={styles.detailText}>
                    Status: {attendance ? 'Present' : 'Not attended'}
                  </Text>
                  <Text style={styles.detailText}>
                    Timestamp: {attendance?.timestamp ?? 'No attendance recorded'}
                  </Text>
                  <Text style={styles.detailText}>Student ID: {mockStudent.id}</Text>
                  <Text style={styles.detailText}>Student name: {mockStudent.fullName}</Text>
                  <Text style={styles.detailText}>
                    Recorded by: {attendance?.scannerName ?? 'Not recorded'}
                  </Text>
                </View>
              );
            })()
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
                mockAttendance.filter((record) => record.eventId === selectedEvent?.id).length
              } attendee{mockAttendance.filter((record) => record.eventId === selectedEvent?.id).length === 1 ? '' : 's'}
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
          const records: AttendanceRecord[] = mockAttendance.filter(
            (record) => record.eventId === selectedEvent?.id,
          );

          return records.length === 0 ? (
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
                  {records.map((record, index) => (
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
                        {record.studentName}
                      </Text>
                      <Text style={[styles.attendanceTableCell, styles.attendanceTableStatus]}>
                        {record.status}
                      </Text>
                      <Text style={[styles.attendanceTableCell, styles.attendanceTableTimestamp]}>
                        {record.timestamp}
                      </Text>
                      <Text style={[styles.attendanceTableCell, styles.attendanceTableScanner]}>
                        {record.scannerName}
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
