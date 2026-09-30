import { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { getEvents } from '../api/events';
import type { EventRecord } from '../types/event';
import { styles } from '../styles/HomeScreen.style';

export default function HomeScreen() {
  const [events, setEvents] = useState<EventRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>School events</Text>
          <Text style={styles.subtitle}>Shared event dashboard</Text>
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={() => void loadEvents()}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.sectionPanel}>
        <Text style={styles.sectionTitle}>Available events</Text>

        {isLoading ? (
          <Text style={styles.emptyStateText}>Loading events...</Text>
        ) : error ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>Could not load events</Text>
            <Text style={styles.emptyStateText}>{error}</Text>
          </View>
        ) : events.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No records yet</Text>
            <Text style={styles.emptyStateText}>
              Events created by an officer will appear here.
            </Text>
          </View>
        ) : (
          events.map((event) => {
            return (
              <View key={event.id} style={styles.recordCard}>
                <View style={styles.recordMain}>
                  <Text style={styles.recordEvent}>{event.name}</Text>
                  <Text style={styles.recordDate}>
                    {event.startDate} to {event.endDate} | {event.location}
                  </Text>
                </View>
              </View>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}