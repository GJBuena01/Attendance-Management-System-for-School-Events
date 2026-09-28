import { View, Text, StyleSheet } from 'react-native';
import { styles } from '../styles/HomeScreen.style';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.text}>This is the home screen.</Text>
    </View>
  );
}
