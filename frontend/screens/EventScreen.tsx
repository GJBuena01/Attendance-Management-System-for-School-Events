import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal } from 'react-native';
import {
  mockAttendance,
  mockEvents,
  type AttendanceRecord,
  type MockEvent,
} from '../mock-data/mockAttendance';
import type { UserRole } from '../types/event';
import { styles } from '../styles/EventScreen.style';

type EventScreenProps = {
  role: UserRole;
};

type AttendanceForm = {
  studentId: string;
  studentName: string;
  scannerName: string;
};

type EventForm = {
  name: string;
  date: string;
  location: string;
  description: string;
};

const emptyForm: AttendanceForm = {
  studentId: '',
  studentName: '',
  scannerName: '',
};

const emptyEventForm: EventForm = {
  name: '',
  date: '',
  location: '',
  description: '',
};

export default function EventScreen({ role }: EventScreenProps) {
  const [events, setEvents] = useState<MockEvent[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>(mockAttendance);
  const [selectedEvent, setSelectedEvent] = useState<MockEvent | null>(null);
  const [form, setForm] = useState<AttendanceForm>(emptyForm);
  const [eventForm, setEventForm] = useState<EventForm>(emptyEventForm);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isEventFormVisible, setIsEventFormVisible] = useState(false);
  const [isAttendanceListVisible, setIsAttendanceListVisible] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

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

  const updateForm = (field: keyof AttendanceForm, value: string) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
    setFormError('');
    setSuccessMessage('');
  };

  const updateEventForm = (field: keyof EventForm, value: string) => {
    setEventForm((currentForm) => ({ ...currentForm, [field]: value }));
    setFormError('');
    setSuccessMessage('');
  };

  const handleCreateMockEvent = () => {
    const name = eventForm.name.trim();
    const date = eventForm.date.trim();
    const location = eventForm.location.trim();
    const description = eventForm.description.trim();

    if (!name || !date || !location) {
      setFormError('Event name, date, and location are required.');
      setSuccessMessage('');
      return;
    }

    const newEvent: MockEvent = {
      id: Date.now(),
      name,
      date,
      location,
      description,
    };

    setEvents((currentEvents) => [newEvent, ...currentEvents]);
    setSelectedEvent(newEvent);
    setEventForm(emptyEventForm);
    setIsEventFormVisible(false);
    setFormError('');
    setSuccessMessage(`Event “${name}” was added to the mock list.`);
  };

  const submitAttendance = () => {
    if (!selectedEvent) return;

    const studentId = form.studentId.trim();
    const studentName = form.studentName.trim();
    const scannerName = form.scannerName.trim();
    if (!studentId || !studentName || !scannerName) {
      setFormError('Enter the student ID, full name, and officer name to record attendance.');
      setSuccessMessage('');
      return;
    }

    const newRecord: AttendanceRecord = {
      id: Date.now(),
      eventId: selectedEvent.id,
      studentId,
      studentName,
      status: 'Present',
      timestamp: new Date().toLocaleString(undefined, { hour12: false }),
      scannerName,
    };
    setRecords((currentRecords) => [...currentRecords, newRecord]);
    setForm(emptyForm);
    setFormError('');
    setSuccessMessage(`${studentName} was marked present for ${selectedEvent.name}.`);
  };

  const selectedRecords = selectedEvent
    ? records.filter((record) => record.eventId === selectedEvent.id)
    : [];

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>School events</Text>
          <Text style={styles.title}>{role === 'officer' ? 'Officer events' : 'Event list'}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshEvents}>
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {role === 'officer' ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setIsEventFormVisible((currentValue) => !currentValue);
            setFormError('');
            setSuccessMessage('');
          }}
          accessibilityRole="button"
        >
          <Text style={styles.buttonText}>{isEventFormVisible ? 'Close form' : 'Add event'}</Text>
        </TouchableOpacity>
      ) : null}

      {role === 'officer' && isEventFormVisible ? (
        <View style={styles.formPanel}>
          <Text style={styles.formTitle}>Add event</Text>
          <TextInput
            style={styles.input}
            placeholder="Event name"
            value={eventForm.name}
            onChangeText={(value) => updateEventForm('name', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Date"
            value={eventForm.date}
            onChangeText={(value) => updateEventForm('date', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={eventForm.location}
            onChangeText={(value) => updateEventForm('location', value)}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            value={eventForm.description}
            onChangeText={(value) => updateEventForm('description', value)}
            multiline
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleCreateMockEvent}>
            <Text style={styles.buttonText}>Save event</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {hasError ? (
        <View style={styles.errorPanel}>
          <Text style={styles.errorText}>Could not load the local event list.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshEvents}>
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <Text style={styles.emptyStateText}>Loading events...</Text>
      ) : events.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No events yet</Text>
          <Text style={styles.emptyStateText}>Mock events will appear here.</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Available events</Text>
          {events.map((event) => (
            <TouchableOpacity
              key={event.id}
              style={[
                styles.recordCard,
                selectedEvent?.id === event.id ? styles.selectedRecordCard : null,
              ]}
              onPress={() => {
                setSelectedEvent(event);
                setForm(emptyForm);
                setIsAttendanceListVisible(false);
                setFormError('');
                setSuccessMessage('');
              }}
              accessibilityRole="button"
              accessibilityLabel={`Select ${event.name}`}
            >
              <View style={styles.recordInfo}>
                <Text style={styles.recordEvent}>{event.name}</Text>
                <Text style={styles.recordDate}>{event.date} | {event.location}</Text>
                {event.description ? (
                  <Text style={styles.recordDescription}>{event.description}</Text>
                ) : null}
              </View>
              <Text style={styles.selectEventText}>
                {selectedEvent?.id === event.id ? 'Selected' : 'Select'}
              </Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      {successMessage ? (
        <View style={styles.successPanel}>
          <Text style={styles.successText}>{successMessage}</Text>
        </View>
      ) : null}

      {selectedEvent && role === 'student' && !isLoading && !hasError ? (
        <View style={styles.selectedEventPanel}>
          <Text style={styles.sectionTitle}>{selectedEvent.name} attendance</Text>
        </View>
      ) : null}
      </ScrollView>
      <Modal
        visible={role === 'officer' && selectedEvent !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setIsAttendanceListVisible(false);
          setSelectedEvent(null);
        }}
      >
        <View style={styles.attendanceModal}>
          <View style={styles.attendanceModalHeader}>
            <View style={styles.attendanceModalTitleContainer}>
              <Text style={styles.attendanceModalTitle}>
                {isAttendanceListVisible ? 'Event attendees' : selectedEvent?.name}
              </Text>
              <Text style={styles.attendanceModalSubtitle}>
                {isAttendanceListVisible
                  ? `${selectedRecords.length} attendee${selectedRecords.length === 1 ? '' : 's'}`
                  : `${selectedEvent?.date} · ${selectedEvent?.location}`}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeModalButton}
              onPress={() => {
                setIsAttendanceListVisible(false);
                setSelectedEvent(null);
              }}
              accessibilityRole="button"
              accessibilityLabel="Close event window"
            >
              <Text style={styles.closeModalButtonText}>Close</Text>
            </TouchableOpacity>
          </View>

          {isAttendanceListVisible ? (
            <>
              <TouchableOpacity
                style={styles.backToFormButton}
                onPress={() => setIsAttendanceListVisible(false)}
                accessibilityRole="button"
              >
                <Text style={styles.backToFormButtonText}>‹  Back to event form</Text>
              </TouchableOpacity>
              {selectedRecords.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No attendance records</Text>
                  <Text style={styles.emptyStateText}>
                    Submit the attendance form for this event to add the first attendee.
                  </Text>
                </View>
              ) : (
                <ScrollView style={styles.attendanceTableVerticalScroll}>
                  <ScrollView horizontal showsHorizontalScrollIndicator>
                    <View style={styles.attendanceTable}>
                      <View style={[styles.attendanceTableRow, styles.attendanceTableHeader]}>
                        <Text style={[styles.attendanceTableCell, styles.attendanceTableStudentId]}>
                          Student ID
                        </Text>
                        <Text style={[styles.attendanceTableCell, styles.attendanceTableName]}>
                          Student name
                        </Text>
                        <Text style={[styles.attendanceTableCell, styles.attendanceTableStatus]}>
                          Status
                        </Text>
                        <Text style={[styles.attendanceTableCell, styles.attendanceTableTimestamp]}>
                          Timestamp
                        </Text>
                        <Text style={[styles.attendanceTableCell, styles.attendanceTableScanner]}>
                          Scanned by
                        </Text>
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
              )}
            </>
          ) : (
            <ScrollView style={styles.eventWorkspaceContent}>
              <Text style={styles.eventWorkspaceDescription}>
                {selectedEvent?.description}
              </Text>
              <TouchableOpacity
                style={styles.viewAttendanceButton}
                onPress={() => setIsAttendanceListVisible(true)}
                accessibilityRole="button"
              >
                <Text style={styles.viewAttendanceButtonText}>
                  View attendees ({selectedRecords.length})
                </Text>
              </TouchableOpacity>

              <View style={styles.formPanel}>
                <Text style={styles.formTitle}>Mock attendance entry</Text>
                <Text style={styles.formDescription}>
                  Enter the details as if they were read by the event scanner.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Student ID"
                  value={form.studentId}
                  onChangeText={(value) => updateForm('studentId', value)}
                  autoCapitalize="characters"
                />
                <TextInput
                  style={styles.input}
                  placeholder="Student full name"
                  value={form.studentName}
                  onChangeText={(value) => updateForm('studentName', value)}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Scanned by / officer name"
                  value={form.scannerName}
                  onChangeText={(value) => updateForm('scannerName', value)}
                />
                {formError ? (
                  <View style={styles.errorPanel}>
                    <Text style={styles.errorText}>{formError}</Text>
                  </View>
                ) : null}
                {successMessage ? (
                  <View style={styles.successPanel}>
                    <Text style={styles.successText}>{successMessage}</Text>
                  </View>
                ) : null}
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={submitAttendance}
                  accessibilityRole="button"
                >
                  <Text style={styles.buttonText}>Record attendance</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </Modal>
    </>
  );
}
