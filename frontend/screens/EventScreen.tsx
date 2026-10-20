import { useEffect, useState } from 'react';
import {
  Platform,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  archiveEvent,
  createEvent,
  deleteAttendance,
  getEventAttendance,
  getEvents,
  getStudentAttendance,
  recordAttendance,
  updateAttendance,
  updateEvent,
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
import { CameraView, useCameraPermissions } from 'expo-camera';
import DateTimePicker from '@react-native-community/datetimepicker';

type EventScreenProps = {
  role: UserRole;
  account?: Account;
};

const formatDateForInput = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseDateInput = (value: string): Date | undefined => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) {
    return undefined;
  }

  const date = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
  return Number.isNaN(date.getTime()) ? undefined : date;
};

const getCalendarDays = (month: Date): Array<number | null> => {
  const firstDay = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  return [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];
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
};

export default function EventScreen({ role, account }: EventScreenProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [studentRecords, setStudentRecords] = useState<StudentAttendanceRecord[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<EventRecord | null>(null);
  const [form, setForm] = useState<AttendanceForm>(emptyForm);
  const [eventForm, setEventForm] = useState<EventForm>(emptyEventForm);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isEventFormVisible, setIsEventFormVisible] = useState(false);
  const [isAttendanceListVisible, setIsAttendanceListVisible] = useState(false);
  const [formError, setFormError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isScannerVisible, setIsScannerVisible] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [eventToArchive, setEventToArchive] = useState<EventRecord | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [attendeeSearchQuery, setAttendeeSearchQuery] = useState('');
  const [datePickerField, setDatePickerField] = useState<'startDate' | 'endDate' | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const today = new Date();
    return new Date(today.getFullYear(), today.getMonth(), 1);
  });
  const [isEditingAttendees, setIsEditingAttendees] = useState(false);
  const [selectedAttendee, setSelectedAttendee] = useState<AttendanceRecord | null>(null);
  const [attendanceTimeDraft, setAttendanceTimeDraft] = useState('');
  const [attendeeToDelete, setAttendeeToDelete] = useState<AttendanceRecord | null>(null);

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

  const openScanner = async () => {
  if (!cameraPermission?.granted) {
    const permissionResult = await requestCameraPermission();

    if (!permissionResult.granted) {
      setFormError('Camera permission is required to scan QR codes.');
      return;
    }
  }

  setHasScanned(false);
  setIsScannerVisible(true);
  };

  const loadEvents = async (preserveSelection = false) => {
    const selectedEventId = selectedEvent?.id;
    setIsLoading(true);
    setHasError(false);
    if (!preserveSelection) {
      setSelectedEvent(null);
    }
    try {
      const loadedEvents = await getEvents();
      setEvents(loadedEvents);
      if (preserveSelection && selectedEventId !== undefined) {
        setSelectedEvent(
          loadedEvents.find((event) => event.id === selectedEventId) ?? null,
        );
      }
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const refreshEvents = () => {
    void loadEvents();
  };

  const refreshSelectedEvent = () => {
    void loadEvents(true);
    if (role === 'student' && account?.studentId) {
      void loadStudentAttendance(account.studentId);
    }
  };

  const archiveEventCard = async (event: EventRecord) => {
    try {
      await archiveEvent(event.id, account?.fullName ?? 'Officer');
      await loadEvents();
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Could not archive event.');
    } finally {
      setEventToArchive(null);
    }
  };

  const confirmArchiveEvent = (event: EventRecord) => {
    setEventToArchive(event);
  };

  const confirmDeleteAttendee = (record: AttendanceRecord) => {
    setAttendeeToDelete(record);
  };

  const updateSelectedAttendance = async () => {
    if (!selectedAttendee) return;

    try {
      const updatedRecord = await updateAttendance({
        attendanceId: selectedAttendee.id,
        scannedAt: attendanceTimeDraft,
        scannedBy: selectedAttendee.scannedBy,
      });
      setRecords((currentRecords) =>
        currentRecords.map((record) => (record.id === updatedRecord.id ? updatedRecord : record)),
      );
      setSelectedAttendee(updatedRecord);
      setAttendanceTimeDraft(updatedRecord.scannedAt);
      setFormError('');
      setSuccessMessage(`${updatedRecord.fullName}'s attendance time was updated.`);
    } catch (requestError) {
      setFormError(
        requestError instanceof Error ? requestError.message : 'Could not update attendance record.',
      );
      setSuccessMessage('');
    }
  };

  const removeAttendee = async () => {
    if (!attendeeToDelete) return;

    try {
      await deleteAttendance(attendeeToDelete.id);
      setRecords((currentRecords) =>
        currentRecords.filter((record) => record.id !== attendeeToDelete.id),
      );
      setAttendeeToDelete(null);
      setSelectedAttendee(null);
      setIsEditingAttendees(false);
    } catch (requestError) {
      setFormError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not delete attendance record.',
      );
    }
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

  const openDatePicker = (field: 'startDate' | 'endDate') => {
    const selectedDate = parseDateInput(eventForm[field]) ?? new Date();
    setCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
    setDatePickerField(field);
  };

  const selectCalendarDate = (day: number) => {
    if (!datePickerField) return;

    const selectedDate = new Date(
      calendarMonth.getFullYear(),
      calendarMonth.getMonth(),
      day,
    );
    const minimumDate =
      datePickerField === 'endDate' ? parseDateInput(eventForm.startDate) : undefined;

    if (minimumDate && selectedDate < minimumDate) {
      return;
    }

    updateEventForm(datePickerField, formatDateForInput(selectedDate));
    setDatePickerField(null);
  };

  const startEditingEvent = (event: EventRecord) => {
    setEditingEventId(event.id);
    setEventForm({
      name: event.name,
      startDate: event.startDate,
      endDate: event.endDate,
      location: event.location,
      description: event.description,
    });
    setIsEventFormVisible(true);
    setFormError('');
    setSuccessMessage('');
  };

  const handleSaveEvent = async () => {
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

    const input: CreateEventInput = {
      name,
      startDate,
      endDate,
      location,
      description,
    };

    const wasEditing = editingEventId !== null;
    setIsSubmitting(true);
    try {
      const savedEvent = wasEditing
        ? await updateEvent(editingEventId, input)
        : await createEvent(input);
      setEvents((currentEvents) =>
        wasEditing
          ? currentEvents.map((event) => (event.id === savedEvent.id ? savedEvent : event))
          : [savedEvent, ...currentEvents],
      );
      setSelectedEvent(savedEvent);
      setEventForm(emptyEventForm);
      setEditingEventId(null);
      setIsEventFormVisible(false);
      setFormError('');
      setSuccessMessage(`${name} was ${wasEditing ? 'updated' : 'added'}.`);
    } catch (requestError) {
      setFormError(requestError instanceof Error ? requestError.message : 'Could not save event.');
      setSuccessMessage('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAttendance = async (scannedStudentId?: string) => {
    if (!selectedEvent) return;

  const studentId = (scannedStudentId ?? form.studentId).trim();
  const scannerName = account?.fullName.trim();

    if (!studentId || !scannerName) {
      setFormError('A student ID and officer account are required.');
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
  const normalizedAttendeeSearchQuery = attendeeSearchQuery.trim().toLowerCase();
  const filteredAttendees = selectedRecords.filter((record) =>
    [record.fullName, record.studentId].some((value) =>
      value.toLowerCase().includes(normalizedAttendeeSearchQuery),
    ),
  );
  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredEvents = events.filter((event) => {
    if (!normalizedSearchQuery) {
      return true;
    }

    return [
      event.name,
      event.description ?? '',
      event.location,
      event.startDate,
      event.endDate,
      event.status,
    ].some((value) => value.toLowerCase().includes(normalizedSearchQuery));
  });

  return (
    <>
      <SafeAreaView edges={['bottom']} style={styles.container}>
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>School events</Text>
          <Text style={styles.title}>{role === 'officer' ? 'Officer events' : 'Event list'}</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={refreshEvents}>
          <Text style={styles.refreshButtonText}>Refresh</Text>
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

      {role === 'officer' ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setIsEventFormVisible((currentValue) => !currentValue);
            setEditingEventId(null);
            setEventForm(emptyEventForm);
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
          <Text style={styles.formTitle}>{editingEventId === null ? 'Add event' : 'Edit event'}</Text>
          <TextInput
            style={styles.input}
            placeholder="Event name"
            value={eventForm.name}
            onChangeText={(value) => updateEventForm('name', value)}
          />
          <TouchableOpacity
            style={styles.datePickerInput}
            onPress={() => openDatePicker('startDate')}
            accessibilityRole="button"
            accessibilityLabel="Choose event start date"
          >
            <Text style={eventForm.startDate ? styles.datePickerValue : styles.datePickerPlaceholder}>
              {eventForm.startDate || 'Start date (YYYY-MM-DD)'}
            </Text>
            <Ionicons name="calendar-outline" size={18} color={styles.searchIcon.color} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.datePickerInput}
            onPress={() => openDatePicker('endDate')}
            accessibilityRole="button"
            accessibilityLabel="Choose event end date"
          >
            <Text style={eventForm.endDate ? styles.datePickerValue : styles.datePickerPlaceholder}>
              {eventForm.endDate || 'End date (YYYY-MM-DD)'}
            </Text>
            <Ionicons name="calendar-outline" size={18} color={styles.searchIcon.color} />
          </TouchableOpacity>
          {datePickerField && Platform.OS !== 'web' ? (
            <DateTimePicker
              value={
                parseDateInput(eventForm[datePickerField]) ??
                new Date()
              }
              mode="date"
              display="default"
              minimumDate={
                datePickerField === 'endDate'
                  ? parseDateInput(eventForm.startDate)
                  : undefined
              }
              onChange={(_event, selectedDate) => {
                if (selectedDate) {
                  updateEventForm(datePickerField, formatDateForInput(selectedDate));
                }
                setDatePickerField(null);
              }}
            />
          ) : null}
          {datePickerField && Platform.OS === 'web' ? (
            <Modal
              visible
              transparent
              animationType="fade"
              onRequestClose={() => setDatePickerField(null)}
            >
              <View style={styles.calendarOverlay}>
                <View style={styles.calendarPanel}>
                  <Text style={styles.calendarTitle}>
                    Choose {datePickerField === 'startDate' ? 'start' : 'end'} date
                  </Text>
                  <View style={styles.calendarHeader}>
                    <TouchableOpacity
                      style={styles.calendarNavigationButton}
                      onPress={() =>
                        setCalendarMonth(
                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                        )
                      }
                      accessibilityRole="button"
                      accessibilityLabel="Previous month"
                    >
                      <Text style={styles.calendarNavigationText}>‹</Text>
                    </TouchableOpacity>
                    <Text style={styles.calendarMonthLabel}>
                      {calendarMonth.toLocaleDateString(undefined, {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Text>
                    <TouchableOpacity
                      style={styles.calendarNavigationButton}
                      onPress={() =>
                        setCalendarMonth(
                          new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                        )
                      }
                      accessibilityRole="button"
                      accessibilityLabel="Next month"
                    >
                      <Text style={styles.calendarNavigationText}>›</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.calendarWeekRow}>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                      <Text key={day} style={styles.calendarWeekDay}>{day}</Text>
                    ))}
                  </View>
                  <View style={styles.calendarGrid}>
                    {getCalendarDays(calendarMonth).map((day, index) => (
                      <TouchableOpacity
                        key={`${calendarMonth.toISOString()}-${index}`}
                        style={styles.calendarDay}
                        disabled={day === null}
                        onPress={() => {
                          if (day !== null) selectCalendarDate(day);
                        }}
                        accessibilityRole={day === null ? undefined : 'button'}
                      >
                        <Text style={day === null ? styles.calendarEmptyDay : styles.calendarDayText}>
                          {day ?? ''}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <TouchableOpacity
                    style={styles.calendarCancelButton}
                    onPress={() => setDatePickerField(null)}
                    accessibilityRole="button"
                  >
                    <Text style={styles.calendarCancelText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          ) : null}
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
          {formError ? (
            <View style={styles.errorPanel}>
              <Text style={styles.errorText}>{formError}</Text>
            </View>
          ) : null}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveEvent}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>
              {isSubmitting ? 'Saving event...' : editingEventId === null ? 'Create event' : 'Update event'}
            </Text>
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
      ) : filteredEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No matching events</Text>
          <Text style={styles.emptyStateText}>Try a different keyword.</Text>
        </View>
      ) : (
        <>
          <Text style={styles.sectionTitle}>Available events</Text>
          {filteredEvents.map((event) => (
            <View
              key={event.id}
              style={[
                styles.recordCard,
                selectedEvent?.id === event.id ? styles.selectedRecordCard : null,
              ]}
            >
              <TouchableOpacity
                style={styles.recordCardMain}
                onPress={() => {
                  setSelectedEvent(event);
                  setForm(emptyForm);
                  setAttendeeSearchQuery('');
                  setIsEditingAttendees(false);
                  setSelectedAttendee(null);
                  setAttendeeToDelete(null);
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
                  {event.description ? (
                    <Text style={styles.recordDescription}>{event.description}</Text>
                  ) : null}
                </View>
                <Text style={styles.selectEventText}>
                  {selectedEvent?.id === event.id ? 'Selected' : 'Select'}
                </Text>
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
                    style={styles.eventActionButton}
                    onPress={() => startEditingEvent(event)}
                    accessibilityRole="button"
                    accessibilityLabel={`Edit ${event.name}`}
                  >
                    <Ionicons name="create-outline" size={16} color={styles.eventActionIcon.color} />
                    <Text style={styles.eventActionText}>Edit</Text>
                  </TouchableOpacity>
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
      </SafeAreaView>
      <Modal
        visible={role === 'officer' && selectedEvent !== null}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => {
          setIsAttendanceListVisible(false);
          setSelectedEvent(null);
        }}
      >
        <SafeAreaView edges={['top', 'bottom']} style={styles.attendanceModal}>
          <View style={styles.attendanceModalHeader}>
            <View style={styles.attendanceModalTitleContainer}>
              <Text style={styles.attendanceModalTitle}>
                {isAttendanceListVisible ? 'Event attendees' : selectedEvent?.name}
              </Text>
              <Text style={styles.attendanceModalSubtitle}>
                {isAttendanceListVisible
                ? `${filteredAttendees.length} attendee${filteredAttendees.length === 1 ? '' : 's'}`
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
              <View style={styles.attendeeSearchBar}>
                <Ionicons name="search-outline" size={19} color={styles.searchIcon.color} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="name or id"
                  placeholderTextColor={styles.searchPlaceholder.color}
                  value={attendeeSearchQuery}
                  onChangeText={setAttendeeSearchQuery}
                  autoCorrect={false}
                />
              </View>
              <View style={styles.attendeeTableActions}>
                {isEditingAttendees && selectedAttendee ? (
                  <TouchableOpacity
                    style={styles.deleteAttendeeButton}
                    onPress={() => confirmDeleteAttendee(selectedAttendee)}
                    accessibilityRole="button"
                  >
                    <Ionicons name="trash-outline" size={17} color={styles.deleteAttendeeText.color} />
                    <Text style={styles.deleteAttendeeText}>Delete attendee</Text>
                  </TouchableOpacity>
                ) : null}
                <TouchableOpacity
                  style={styles.editAttendeesButton}
                  onPress={() => setIsEditingAttendees((currentValue) => !currentValue)}
                  accessibilityRole="button"
                >
                  <Ionicons name="create-outline" size={17} color={styles.editAttendeesText.color} />
                  <Text style={styles.editAttendeesText}>
                    {isEditingAttendees ? 'Done editing' : 'Edit attendees'}
                  </Text>
                </TouchableOpacity>
              </View>
              {isEditingAttendees && selectedAttendee ? (
                <View style={styles.formPanel}>
                  <Text style={styles.formDescription}>
                    Update attendance time for {selectedAttendee.fullName} (ISO date/time)
                  </Text>
                  <TextInput
                    style={styles.input}
                    value={attendanceTimeDraft}
                    onChangeText={setAttendanceTimeDraft}
                    placeholder="2026-10-20T09:30:00.000Z"
                    autoCapitalize="none"
                  />
                  <TouchableOpacity
                    style={styles.saveButton}
                    onPress={() => void updateSelectedAttendance()}
                    accessibilityRole="button"
                  >
                    <Text style={styles.buttonText}>Update attendance time</Text>
                  </TouchableOpacity>
                </View>
              ) : null}
              {selectedRecords.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No attendance records</Text>
                  <Text style={styles.emptyStateText}>
                    Submit the attendance form for this event to add the first attendee.
                  </Text>
                </View>
              ) : filteredAttendees.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateTitle}>No matching attendees</Text>
                  <Text style={styles.emptyStateText}>Try a different name or student ID.</Text>
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
                      {filteredAttendees.map((record, index) => (
                        <TouchableOpacity
                          key={record.id}
                          style={[
                            styles.attendanceTableRow,
                            index % 2 === 1 ? styles.attendanceTableAlternateRow : null,
                            isEditingAttendees && selectedAttendee?.id === record.id
                              ? styles.selectedAttendeeRow
                              : null,
                          ]}
                          onPress={() => {
                            if (isEditingAttendees) {
                              setSelectedAttendee(record);
                              setAttendanceTimeDraft(record.scannedAt);
                            }
                          }}
                          disabled={!isEditingAttendees}
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
                        </TouchableOpacity>
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
                style={styles.archiveEventButton}
                onPress={() => {
                  if (selectedEvent) confirmArchiveEvent(selectedEvent);
                }}
                accessibilityRole="button"
                accessibilityLabel={`Archive ${selectedEvent?.name}`}
              >
                <Ionicons name="archive-outline" size={16} color={styles.archiveEventText.color} />
                <Text style={styles.archiveEventText}>Archive event</Text>
              </TouchableOpacity>
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
                  Enter the student ID or use the QR scanner.
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
                  onPress={() => {
                    void submitAttendance();
                  }}
                  accessibilityRole="button">
                  <Text style={styles.buttonText}>Record attendance</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.scanQrButton}
                    onPress={openScanner}
                    accessibilityRole="button"
                  >
                  <Text style={styles.scanQrButtonText}>Scan QR</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
      <Modal
          visible={attendeeToDelete !== null}
          transparent
          animationType="fade"
          onRequestClose={() => setAttendeeToDelete(null)}
        >
          <View style={styles.confirmationOverlay}>
            <View style={styles.confirmationPanel}>
              <Text style={styles.confirmationTitle}>Delete attendance?</Text>
              <Text style={styles.confirmationMessage}>
                Remove {attendeeToDelete?.fullName} ({attendeeToDelete?.studentId}) from this event?
              </Text>
              <View style={styles.confirmationActions}>
                <TouchableOpacity
                  style={styles.confirmationCancelButton}
                  onPress={() => setAttendeeToDelete(null)}
                  accessibilityRole="button"
                >
                  <Text style={styles.confirmationCancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.confirmationDeleteButton}
                  onPress={() => void removeAttendee()}
                  accessibilityRole="button"
                >
                  <Text style={styles.confirmationDeleteText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        <Modal
          visible={isScannerVisible}
        animationType="slide"
        onRequestClose={() => setIsScannerVisible(false)}
      >
      <SafeAreaView edges={['top', 'right', 'bottom', 'left']} style={styles.scannerContainer}>
        <CameraView
          style={styles.camera}
          facing="back"
          barcodeScannerSettings={{
            barcodeTypes: ['qr'],
          }}
          onBarcodeScanned={
            hasScanned
              ? undefined
              : ({ data }) => {
                  setHasScanned(true);
                  setIsScannerVisible(false);
                  setForm({ studentId: data });
                  void submitAttendance(data);
                }
          }
      />

        <TouchableOpacity
          style={styles.closeScannerButton}
          onPress={() => setIsScannerVisible(false)}
          accessibilityRole="button">
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
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
