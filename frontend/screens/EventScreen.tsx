import { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, Switch } from 'react-native';
import {
  createEvent,
  getEventAttendance,
  getEvents,
  getStudentAttendance,
  recordAttendance,
} from '../api/events';
import type {
  Account,
  AttendanceRecord,
  CreateEventInput,
  EventRecord,
  StudentAttendanceRecord,
  UserRole,
} from '../types/event';
import { styles } from '../styles/EventScreen.style';

type EventScreenProps = {
  role: UserRole;
  account?: Account;
};

type AttendanceForm = {
  studentId: string;
};

type EventForm = {
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
  hasAmAttendance: boolean;
  hasPmAttendance: boolean;
};

const emptyForm: AttendanceForm = {
  studentId: '',
};

const emptyEventForm: EventForm = {
  name: '',
  startDate: '',
  endDate: '',
  location: '',
  description: '',
  hasAmAttendance: true,
  hasPmAttendance: true,
};

export default function EventScreen({ role, account }: EventScreenProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [studentRecords, setStudentRecords] = useState<StudentAttendanceRecord[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [form, setForm] = useState<AttendanceForm>(emptyForm);
  const [eventForm, setEventForm] = useState<EventForm>(emptyEventForm);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isEventFormVisible, setIsEventFormVisible] = useState(false);
  const [isAttendanceListVisible, setIsAttendanceListVisible] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    void loadEvents();
  }, []);

  useEffect(() => {
    if (!selectedEvent || role !== 'officer') return;

    void loadAttendance(selectedEvent.id);
  }, [selectedEvent, role]);

  useEffect(() => {
    if (role !== 'student' || !account?.studentId) return;

    void loadStudentAttendance(account.studentId);
  }, [account?.studentId, role]);

  const loadEvents = async () => {
    setIsLoading(true);
    setHasError(false);
    setSelectedEvent(null);
    try {
      setEvents(await getEvents());
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEvents = () => {
    void loadEvents();
  };

  const loadAttendance = async (eventId: number) => {
    try {
      setRecords(await getEventAttendance(eventId));
    } catch (requestError) {
      setRecords([]);
      setFormError(requestError instanceof Error ? requestError.message : 'Could not load attendance.');
    }
  };

  const loadStudentAttendance = async (studentId: string) => {
    try {
      setStudentRecords(await getStudentAttendance(studentId));
    } catch (requestError) {
      setStudentRecords([]);
      setFormError(requestError instanceof Error ? requestError.message : 'Could not load attendance.');
    }
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

  const handleCreateEvent = async () => {
    const name = eventForm.name.trim();
    const startDate = eventForm.startDate.trim();
    const endDate = eventForm.endDate.trim();
    const location = eventForm.location.trim();
    const description = eventForm.description.trim();

    if (!name || !startDate || !endDate || !location || !description) {
      setFormError('Event name, dates, location, and description are required.');
      setSuccessMessage('');
      return;
    }

    if (endDate < startDate) {
      setFormError('End date must be on or after the start date.');
      setSuccessMessage('');
      return;
    }

    if (!eventForm.hasAmAttendance && !eventForm.hasPmAttendance) {
      setFormError('Select at least one attendance period.');
      setSuccessMessage('');
      return;
    }

    const input: CreateEventInput = {
      name,
      startDate,
      endDate,
      location,
      description,
      hasAmAttendance: eventForm.hasAmAttendance,
      hasPmAttendance: eventForm.hasPmAttendance,
    };

    setIsSubmitting(true);
    try {
      const newEvent = await createEvent(input);
      setEvents((currentEvents) => [newEvent, ...currentEvents]);
      setSelectedEvent(newEvent);
      setEventForm(emptyEventForm);
      setIsEventFormVisible(false);
      setFormError('');
      setSuccessMessage(`${name} was added.`);
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Could not create event.');
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAttendance = async () => {
    if (!selectedEvent) return;

    const studentId = form.studentId.trim();
    const scannerName = account?.fullName.trim();
    if (!studentId || !scannerName) {
      setFormError('Enter a student ID while signed in as an officer.');
      setSuccessMessage('');
      return;
    }

    try {
      const newRecord = await recordAttendance({
        studentId,
        eventId: selectedEvent.id,
        scannedBy: scannerName,
      });
      setRecords((currentRecords) => [...currentRecords, newRecord]);
      setForm(emptyForm);
      setFormError('');
      setSuccessMessage(`${newRecord.fullName} was marked present for ${selectedEvent.name}.`);
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Could not record attendance.');
      setSuccessMessage('');
    }
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
            placeholder="Start date (YYYY-MM-DD)"
            value={eventForm.startDate}
            onChangeText={(value) => updateEventForm('startDate', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="End date (YYYY-MM-DD)"
            value={eventForm.endDate}
            onChangeText={(value) => updateEventForm('endDate', value)}
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
          <View style={{ marginBottom: 8 }}>
            <Text style={styles.formDescription}>Attendance periods</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
              <Switch
                value={eventForm.hasAmAttendance}
                onValueChange={(value) => setEventForm((currentForm) => ({ ...currentForm, hasAmAttendance: value }))}
              />
              <Text>AM attendance</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Switch
                value={eventForm.hasPmAttendance}
                onValueChange={(value) => setEventForm((currentForm) => ({ ...currentForm, hasPmAttendance: value }))}
              />
              <Text>PM attendance</Text>
            </View>
          </View>
          {formError ? (
            <View style={styles.errorPanel}>
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleCreateEvent}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>{isSubmitting ? 'Saving event...' : 'Save event'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      {hasError ? (
        <View style={styles.errorPanel}>
          <Text style={styles.errorText}>Could not load the event list.</Text>
          <TouchableOpacity style={styles.retryButton} onPress={refreshEvents}>
            <Text style={styles.buttonText}>Try again</Text>
          </TouchableOpacity>
        </View>
      ) : isLoading ? (
        <Text style={styles.emptyStateText}>Loading events...</Text>
      ) : events.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No events yet</Text>
          <Text style={styles.emptyStateText}>New events will appear here.</Text>
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
                <Text style={styles.recordDate}>
                  {event.startDate} - {event.endDate} | {event.location}
                </Text>
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
          <Text style={styles.emptyStateText}>Student ID: {account?.studentId ?? 'Unavailable'}</Text>
          <Text style={styles.emptyStateText}>
            Status: {studentRecords.some((record) => record.eventId === selectedEvent.id) ? 'Present' : 'Not attended'}
          </Text>
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
                  : `${selectedEvent?.startDate} - ${selectedEvent?.endDate} · ${selectedEvent?.location}`}
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
                <Text style={styles.formTitle}>Attendance entry</Text>
                <Text style={styles.formDescription}>
                  Enter the student ID as if it were read by the event scanner.
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Student ID"
                  value={form.studentId}
                  onChangeText={(value) => updateForm('studentId', value)}
                  autoCapitalize="characters"
                />
                <Text style={styles.formDescription}>Scanned by: {account?.fullName ?? 'Officer'}</Text>
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
