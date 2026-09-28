import { View, Text, StyleSheet } from 'react-native';
import { styles } from '../styles/EventScreen.style';

export default function EventScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Events</Text>
      <Text style={styles.text}>This is the event screen.</Text>
    </View>
  );
}
