import { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ActivityIndicator, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenStyles } from '../styles/LoginScreen.style';
import BrandMark from '../components/BrandMark';
import { colors } from '../styles/theme';
import { useGoogleSignIn } from '../auth/useGoogleSignIn';
import type { Account } from '../types/event';

export default function SignupScreen() {
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

  const { isReady, signIn } = useGoogleSignIn({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  const handleSignup = () => {
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
            Create your student account securely with Google.
          </Text>
          {error ? <Text style={LoginScreenStyles.error}>{error}</Text> : null}
          <TouchableOpacity style={LoginScreenStyles.primaryButton} onPress={handleSignup} disabled={isSubmitting || !isReady}>
            {isSubmitting ? <ActivityIndicator color={colors.surface} /> : <Text style={LoginScreenStyles.primaryButtonText}>Sign up with Google</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={LoginScreenStyles.secondaryButton} onPress={() => navigation.navigate({ name: 'Login' } as never)}>
            <Text style={LoginScreenStyles.secondaryButtonText}>Back to login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
