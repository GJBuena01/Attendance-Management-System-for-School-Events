import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { mockAttendance } from '../mock-data/mockAttendance';
import { styles } from '../styles/HomeScreen.style';

export default function HomeScreen() {
  const emptyData = mockAttendance.length === 0;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Student Attendance</Text>
      <Text style={styles.subtitle}>Attendance overview</Text>

      <View style={styles.sectionPanel}>
        <Text style={styles.sectionTitle}>Recent attendance</Text>

        {emptyData ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>No records yet</Text>
            <Text style={styles.emptyStateText}>
              Student attendance will appear here once events are recorded.
            </Text>
          </View>
        ) : (
          mockAttendance.map((entry) => {
            const isPresent = entry.status === 'Present';

            return (
              <View key={entry.id} style={styles.recordCard}>
                <View style={styles.recordMain}>
                  <Text style={styles.recordEvent}>{entry.eventName}</Text>
                  <Text style={styles.recordDate}>{entry.date}</Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    isPresent ? styles.presentBadge : styles.absentBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.statusText,
                      isPresent ? styles.presentText : styles.absentText,
                    ]}
                  >
                    {entry.status}
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