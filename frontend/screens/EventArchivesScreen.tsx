import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/theme';

export default function EventArchivesScreen() {
  return <SafeAreaView edges={['bottom']} style={{ flex: 1, backgroundColor: colors.canvas }} />;
}
