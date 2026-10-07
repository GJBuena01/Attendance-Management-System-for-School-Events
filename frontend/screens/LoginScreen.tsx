import { useState } from 'react';
import { ActivityIndicator, Text, View, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenStyles } from '../styles/LoginScreen.style';
import { loginStudent } from '../api/auth';
import BrandMark from '../components/BrandMark';
import { colors } from '../styles/theme';

const officerNames = ['Sinampaga', 'Bardago', 'Israel', 'Torculas', 'Cabal'];

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    setError('');

    const loginName = email.trim();
    const officerName =
      loginName.toLowerCase() === 'officer'
        ? 'Officer'
        : officerNames.find((name) => name.toLowerCase() === loginName.toLowerCase());

    if (officerName && password === 'officer') {
      navigation.navigate({ name: 'Main', params: { role: 'officer', fullName: officerName } } as never);
      setIsSubmitting(false);
      return;
    }

    try {
      const account = await loginStudent({ email: email.trim(), password });
      navigation.navigate({ name: 'Main', params: account } as never);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not log in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={LoginScreenStyles.page} keyboardShouldPersistTaps="handled">
      <View style={LoginScreenStyles.card}>
        <View style={LoginScreenStyles.brandContainer}>
          <BrandMark vertical />
        </View>

        <Text style={LoginScreenStyles.label}>Email</Text>
        <TextInput
          style={LoginScreenStyles.input}
          placeholder="Email, student, or officer name"
          placeholderTextColor="#7f7f7f"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={LoginScreenStyles.label}>Password</Text>
        <TextInput
          style={LoginScreenStyles.input}
          placeholder="Enter your password"
          placeholderTextColor="#7f7f7f"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={LoginScreenStyles.error}>{error}</Text> : null}

        <TouchableOpacity style={LoginScreenStyles.primaryButton} onPress={handleLogin} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color={colors.surface} /> : <Text style={LoginScreenStyles.primaryButtonText}>Sign in</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={LoginScreenStyles.secondaryButton} onPress={() => navigation.navigate({ name: 'Signup' } as never)}>
          <Text style={LoginScreenStyles.secondaryButtonText}>Create student account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
