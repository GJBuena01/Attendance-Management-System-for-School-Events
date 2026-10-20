import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { archiveEvent, getEventAttendance, getEvents, getStudentAttendance } from '../api/events';
import type { Account, AttendanceRecord, EventRecord, StudentAttendanceRecord, UserRole } from '../types/event';
import { styles } from '../styles/HomeScreen.style';
import StudentQrModal from '../components/StudentQrModal';

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
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [eventToArchive, setEventToArchive] = useState<EventRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    void refreshEvents();
  }, [account.studentId, role]);

  const handleGenerateQR = () => {
    if (!account.studentId) {
      return;
    }
    setIsQrVisible(true);
  };

  const refreshEvents = async (preserveSelection = false) => {
    const selectedEventId = selectedEvent?.id;
    setIsLoading(true);
    setHasError(false);
    if (!preserveSelection) {
      setSelectedEvent(null);
    }
    setIsAttendeeListVisible(false);

    try {
      const loadedEvents = await getEvents();
      setEvents(loadedEvents);
      if (preserveSelection && selectedEventId !== undefined) {
        setSelectedEvent(
          loadedEvents.find((event) => event.id === selectedEventId) ?? null,
        );
      }

      if (role === 'officer') {
        const attendanceLists = await Promise.all(
          loadedEvents.map((event) => getEventAttendance(event.id)),
        );
        setAttendeeCounts(
          Object.fromEntries(
            loadedEvents.map((event, index) => [event.id, attendanceLists[index].length]),
          ),
        );
        if (selectedEventId !== undefined) {
          setRecords(
            attendanceLists[loadedEvents.findIndex((event) => event.id === selectedEventId)] ?? [],
          );
        }
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

  const refreshSelectedEvent = () => {
    void refreshEvents(true);
  };

  const archiveEventCard = async (event: EventRecord) => {
    try {
      await archiveEvent(event.id, account.fullName);
      await refreshEvents();
    } catch {
      setHasError(true);
    } finally {
      setEventToArchive(null);
    }
  };

  const confirmArchiveEvent = (event: EventRecord) => {
    setEventToArchive(event);
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
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredEvents = events.filter((event) => {
    if (!normalizedSearchQuery) {
      return true;
    }

    return [
      event.name,
      event.description,
      event.location,
      event.startDate,
      event.endDate,
      event.status,
    ].some((value) => value.toLowerCase().includes(normalizedSearchQuery));
  });

  const renderEventList = () => (
    <View style={styles.sectionPanel}>
      <Text style={styles.sectionTitle}>Available events</Text>

      {isLoading ? (
        <Text style={styles.emptyStateText}>Loading events...</Text>
        ) : hasError ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>Could not load events</Text>
          <Text style={styles.emptyStateText}>The event service is unavailable.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => void refreshEvents()}>
            <Text style={styles.refreshText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No events yet</Text>
          <Text style={styles.emptyStateText}>New school events will appear here.</Text>
        </View>
      ) : filteredEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No matching events</Text>
          <Text style={styles.emptyStateText}>Try a different keyword.</Text>
        </View>
      ) : (
        filteredEvents.map((event) => {
          const attended = studentRecords.some((record) => record.eventId === event.id);

          return (
            <View key={event.id} style={styles.recordCard}>
              <TouchableOpacity
                style={styles.recordCardMain}
                onPress={() => void selectEvent(event)}
                accessibilityRole="button"
                accessibilityLabel={`View ${role === 'officer' ? 'details' : 'attendance details'} for ${event.name}`}
              >
                <View style={styles.recordMain}>
                  <Text style={styles.recordEvent}>{event.name}</Text>
                  <Text style={styles.recordDate}>
                    {event.startDate} - {event.endDate} | {event.location}
                  </Text>
                  <View
                    style={[
                      styles.eventStatusBadge,
                      event.status === 'ongoing'
                        ? styles.ongoingStatusBadge
                        : event.status === 'ended'
                          ? styles.endedStatusBadge
                          : styles.startingSoonStatusBadge,
                    ]}
                  >
                    <Text
                      style={[
                        styles.eventStatusText,
                        event.status === 'ongoing'
                          ? styles.ongoingStatusText
                          : event.status === 'ended'
                            ? styles.endedStatusText
                            : styles.startingSoonStatusText,
                      ]}
                    >
                      {event.status === 'starting_soon'
                        ? 'Starting soon'
                        : event.status === 'ongoing'
                          ? 'Ongoing'
                          : 'Ended'}
                    </Text>
                  </View>
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
              {role === 'officer' ? (
                <View style={styles.eventCardActions}>
                  {selectedEvent?.id === event.id ? (
                    <TouchableOpacity
                      style={styles.eventActionButton}
                      onPress={refreshSelectedEvent}
                      accessibilityRole="button"
                      accessibilityLabel={`Refresh ${event.name}`}
                    >
                      <Ionicons name="refresh-outline" size={16} color={styles.eventActionIcon.color} />
                      <Text style={styles.eventActionText}>Refresh</Text>
                    </TouchableOpacity>
                  ) : null}
                  <TouchableOpacity
                    style={styles.archiveEventButton}
                    onPress={() => confirmArchiveEvent(event)}
                    accessibilityRole="button"
                    accessibilityLabel={`Archive ${event.name}`}
                  >
                    <Ionicons name="archive-outline" size={16} color={styles.archiveEventText.color} />
                    <Text style={styles.archiveEventText}>Archive</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </View>
          );
        })
      )}
    </View>
  );

  return (
    <>
    <SafeAreaView edges={['bottom']} style={styles.container}>
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>School events</Text>
          <Text style={styles.subtitle}>Your event attendance</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={() => void refreshEvents()}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={19} color={styles.searchIcon.color} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search events"
          placeholderTextColor={styles.searchPlaceholder.color}
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCorrect={false}
        />
      </View>
      {role === 'student' ? (
        <TouchableOpacity
          style={styles.generateQrButton}
          onPress={handleGenerateQR}
          accessibilityRole="button"
        >
          <Text style={styles.generateQrButtonText}>Generate QR</Text>
        </TouchableOpacity>
      ) : null}
      {selectedEvent ? (
        <View style={styles.sectionPanel}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              setSelectedEvent(null);
              setIsAttendeeListVisible(false);
            }}
            accessibilityRole="button"
          >
            <Text style={styles.backButtonText}>‹  All events</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>{selectedEvent.name}</Text>
          <Text style={styles.detailText}>
            {selectedEvent.startDate} - {selectedEvent.endDate}
          </Text>
          <Text style={styles.detailText}>{selectedEvent.location}</Text>
          <Text style={styles.detailDescription}>{selectedEvent.description}</Text>
          <View style={styles.eventCardActions}>
            <TouchableOpacity
              style={styles.eventActionButton}
              onPress={refreshSelectedEvent}
              accessibilityRole="button"
              accessibilityLabel={`Refresh ${selectedEvent.name}`}
            >
              <Ionicons name="refresh-outline" size={16} color={styles.eventActionIcon.color} />
              <Text style={styles.eventActionText}>Refresh</Text>
            </TouchableOpacity>
            {role === 'officer' ? (
              <TouchableOpacity
                style={styles.archiveEventButton}
                onPress={() => confirmArchiveEvent(selectedEvent)}
                accessibilityRole="button"
                accessibilityLabel={`Archive ${selectedEvent.name}`}
              >
                <Ionicons name="archive-outline" size={16} color={styles.archiveEventText.color} />
                <Text style={styles.archiveEventText}>Archive</Text>
              </TouchableOpacity>
            ) : null}
          </View>

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
    </SafeAreaView>

    <StudentQrModal
      visible={isQrVisible}
      account={account}
      onClose={() => setIsQrVisible(false)}
    />

    <Modal
      visible={role === 'officer' && isAttendeeListVisible && selectedEvent !== null}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={() => setIsAttendeeListVisible(false)}
    >
      <SafeAreaView edges={['top', 'bottom']} style={styles.attendanceModal}>
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
        <View style={styles.attendeeSearchBar}>
          <Ionicons name="search-outline" size={19} color={styles.searchIcon.color} />
          <TextInput
            style={styles.searchInput}
            placeholder="name or id"
            placeholderTextColor={styles.searchPlaceholder.color}
          />
        </View>
        <View style={styles.attendeeTableActions}>
          <TouchableOpacity style={styles.editAttendeesButton} accessibilityRole="button">
            <Ionicons name="create-outline" size={17} color={styles.editAttendeesText.color} />
            <Text style={styles.editAttendeesText}>Edit attendees</Text>
          </TouchableOpacity>
        </View>
        {(() => {
          if (selectedRecords.length === 0) {
            return (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateTitle}>No attendees yet</Text>
                <Text style={styles.emptyStateText}>
                  Attendance records for this event will appear here.
                </Text>
              </View>
            );
          }

          return (
            <>
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
            </>
          );
        })()}
      </SafeAreaView>
    </Modal>
    <Modal
      visible={eventToArchive !== null}
      transparent
      animationType="fade"
      onRequestClose={() => setEventToArchive(null)}
    >
      <View style={styles.confirmationOverlay}>
        <View style={styles.confirmationPanel}>
          <Text style={styles.confirmationTitle}>Archive event?</Text>
          <Text style={styles.confirmationMessage}>
            {eventToArchive?.name} will be removed from the active event lists.
          </Text>
          <View style={styles.confirmationActions}>
            <TouchableOpacity
              style={styles.confirmationCancelButton}
              onPress={() => setEventToArchive(null)}
              accessibilityRole="button"
            >
              <Text style={styles.confirmationCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmationArchiveButton}
              onPress={() => {
                if (eventToArchive) {
                  void archiveEventCard(eventToArchive);
                }
              }}
              accessibilityRole="button"
            >
              <Text style={styles.confirmationArchiveText}>Archive</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
    </>
  );
}
