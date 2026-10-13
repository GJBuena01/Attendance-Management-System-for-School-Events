import { useState } from 'react';
import { View, Text, ScrollView, Switch } from 'react-native';
import { styles } from '../styles/SettingsScreen.style';
import BrandMark from '../components/BrandMark';
import { colors } from '../styles/theme';

export default function SettingsScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <BrandMark />
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.text}>Your attendance workspace is ready for every school event.</Text>
      <View style={styles.infoCard}>
        <View style={styles.notificationRow}>
          <View style={styles.notificationCopy}>
            <Text style={styles.notificationTitle}>Notifications</Text>
            <Text style={styles.notificationDescription}>Turn on app alerts and notifcations</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.line, true: colors.maroon }}
            thumbColor={colors.surface}
            accessibilityLabel="Notifications"
          />
        </View>
      </View>
      <View style={styles.infoCard}>
        <Text style={styles.cardTitle}>About this app</Text>
        <Text style={styles.cardText}>School Attendance keeps event check-ins clear, quick, and easy to review.</Text>
      </View>
    </ScrollView>
  );
}
