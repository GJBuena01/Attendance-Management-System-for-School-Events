import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Switch } from 'react-native';
import { createEvent, getEvents } from '../api/events';
import type { CreateEventInput, EventRecord, UserRole } from '../types/event';
import { styles } from '../styles/EventScreen.style';

const emptyForm: CreateEventInput = {
  name: '',
  description: '',
  startDate: '',
  endDate: '',
  location: '',
  hasAmAttendance: true,
  hasPmAttendance: false,
};

type EventScreenProps = {
  role: UserRole;
};

export default function EventScreen({ role }: EventScreenProps) {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [form, setForm] = useState<CreateEventInput>(emptyForm);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const loadEvents = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      setEvents(await getEvents());
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to load events.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadEvents();
  }, [loadEvents]);

  const updateForm = <K extends keyof CreateEventInput>(field: K, value: CreateEventInput[K]) => {
    setForm((currentForm) => ({ ...currentForm, [field]: value }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError('');

    try {
      await createEvent(form);
      setForm(emptyForm);
      setIsFormVisible(false);
      await loadEvents();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Unable to save event.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>School events</Text>
          <Text style={styles.title}>Event list</Text>
        </View>

        <TouchableOpacity
          style={styles.refreshButton}
          onPress={() => void loadEvents()}
        >
          <Text style={styles.buttonText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {role === 'officer' ? (
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setError('');
            setIsFormVisible((currentValue) => !currentValue);
          }}
        >
          <Text style={styles.buttonText}>{isFormVisible ? 'Close form' : 'Add event'}</Text>
        </TouchableOpacity>
      ) : null}

      {isFormVisible && role === 'officer' ? (
        <View style={styles.formPanel}>
          <Text style={styles.sectionTitle}>New event</Text>
          <TextInput
            style={styles.input}
            placeholder="Event name"
            value={form.name}
            onChangeText={(value) => updateForm('name', value)}
          />
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Description"
            value={form.description}
            onChangeText={(value) => updateForm('description', value)}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="Start date (YYYY-MM-DD)"
            value={form.startDate}
            onChangeText={(value) => updateForm('startDate', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="End date (YYYY-MM-DD)"
            value={form.endDate}
            onChangeText={(value) => updateForm('endDate', value)}
          />
          <TextInput
            style={styles.input}
            placeholder="Location"
            value={form.location}
            onChangeText={(value) => updateForm('location', value)}
          />
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>AM attendance</Text>
            <Switch
              value={form.hasAmAttendance}
              onValueChange={(value) => updateForm('hasAmAttendance', value)}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>PM attendance</Text>
            <Switch
              value={form.hasPmAttendance}
              onValueChange={(value) => updateForm('hasPmAttendance', value)}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={() => void handleSave()} disabled={isSaving}>
            <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save event'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}

      <Text style={styles.sectionTitle}>Available events</Text>

      {error ? (
        <View style={styles.errorPanel}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}

      {isLoading ? (
        <Text style={styles.emptyStateText}>Loading events...</Text>
      ) : events.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No events yet</Text>
          <Text style={styles.emptyStateText}>
            An officer can create the first event.
          </Text>
        </View>
      ) : (
        events.map((event) => {
          return (
            <View key={event.id} style={styles.recordCard}>
              <View style={styles.recordInfo}>
                <Text style={styles.recordEvent}>{event.name}</Text>
                <Text style={styles.recordDate}>
                  {event.startDate} to {event.endDate} | {event.location}
                </Text>
                {event.description ? (
                  <Text style={styles.recordDescription}>{event.description}</Text>
                ) : null}
                <Text style={styles.recordSessions}>
                  {event.hasAmAttendance ? 'AM' : ''}
                  {event.hasAmAttendance && event.hasPmAttendance ? ' and ' : ''}
                  {event.hasPmAttendance ? 'PM' : ''} attendance
                </Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}