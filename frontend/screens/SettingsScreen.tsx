import { View, Text } from 'react-native';
import { styles } from '../styles/SettingsScreen.style';

export default function SettingsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings</Text>
      <Text style={styles.text}>This is the settings screen.</Text>
    </View>
  );
}
