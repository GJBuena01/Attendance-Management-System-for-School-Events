import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { mockAttendance} from '../mock-data/mockAttendance';
import { styles } from '../styles/EventScreen.style';
import { Ionicons } from '@expo/vector-icons';

export default function EventScreen() {
  const emptyData = mockAttendance.length === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.eyebrow}>School events</Text>
          <Text style={styles.title}>Attendance History</Text>
        </View>

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() =>
            Alert.alert('Officer scan placeholder', 'Scan flow will be connected later.')
          }
        >
          <Ionicons
            name="qr-code-outline"
            size={21}
            color="#ffffff"
          />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Event history</Text>

      {emptyData ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateTitle}>No history available</Text>
          <Text style={styles.emptyStateText}>
            Attendance records will appear here once submitted.
          </Text>
        </View>
      ) : (
        mockAttendance.map((entry) => {
          const isPresent = entry.status === 'Present';
          return (
            <View key={entry.id} style={styles.recordCard}>
              <View style={styles.recordInfo}>
                <Text style={styles.recordEvent}>{entry.eventName}</Text>
                <Text style={styles.recordDate}>{entry.date}</Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  isPresent
                    ? styles.statusPresent
                    : styles.statusAbsent,
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    isPresent ? styles.statusTextPresent : styles.statusTextAbsent,
                  ]}
                >
                  {entry.status}
                </Text>
              </View>
            </View>
          );
        })
      )}
    </ScrollView>
  );
}