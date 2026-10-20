import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenStyles } from '../styles/LoginScreen.style';
import BrandMark from '../components/BrandMark';
import { colors } from '../styles/theme';
import { useGoogleSignIn } from '../auth/useGoogleSignIn';
import type { Account } from '../types/event';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSuccess = useCallback((account: Account) => {
    setIsSubmitting(false);
    navigation.navigate({ name: 'Main', params: account } as never);
  }, [navigation]);

  const handleError = useCallback((message: string) => {
    setIsSubmitting(false);
    setError(message);
  }, []);

  const { isConfigured, signIn } = useGoogleSignIn({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleLogin = () => {
    setError('');
    setIsSubmitting(true);
    signIn();
  };

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.maroonDark }}>
      <ScrollView contentContainerStyle={LoginScreenStyles.page}>
        <View style={LoginScreenStyles.card}>
          <View style={LoginScreenStyles.brandContainer}>
            <BrandMark vertical />
          </View>
          <Text style={LoginScreenStyles.description}>
            Sign in with your Google account to access attendance events.
          </Text>
          {!isConfigured ? <Text style={LoginScreenStyles.configurationNotice}>
            Google sign-in needs to be configured before it can be used.
          </Text> : null}
          {error ? <Text style={LoginScreenStyles.error}>{error}</Text> : null}
          <TouchableOpacity style={LoginScreenStyles.primaryButton} onPress={handleLogin} disabled={isSubmitting} accessibilityRole="button">
            {isSubmitting ? <ActivityIndicator color={colors.surface} /> : <Text style={LoginScreenStyles.primaryButtonText}>Continue with Google</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={LoginScreenStyles.secondaryButton} onPress={() => navigation.navigate({ name: 'Signup' } as never)}>
            <Text style={LoginScreenStyles.secondaryButtonText}>New student? Sign up with Google</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
