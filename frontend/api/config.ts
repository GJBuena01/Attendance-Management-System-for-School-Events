import Constants from 'expo-constants';
import { Platform } from 'react-native';

const fallbackHost = '192.168.1.13';
const expoHost = Constants.expoConfig?.hostUri?.split(':')[0];
const webHost =
  Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.hostname : undefined;
const apiHost = webHost || expoHost || fallbackHost;

export const API_BASE_URL = `http://${apiHost}:3000`;
