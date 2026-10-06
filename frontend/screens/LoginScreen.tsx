import { useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenStyles } from '../styles/LoginScreen.style';
import { globalStyles } from '../styles/GlobalStyles.style';
import { loginStudent } from '../api/auth';

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
    <View style={[globalStyles.screen, LoginScreenStyles.page]}>
      <View style={LoginScreenStyles.card}>
        <Text style={LoginScreenStyles.loginHeader}>Login</Text>
        <Text style={LoginScreenStyles.subtitle}>School Event Attendance</Text>

        <Text style={LoginScreenStyles.label}>Email</Text>
        <TextInput
          style={LoginScreenStyles.input}
          placeholder="Enter email, student, or officer name"
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

        <View style={LoginScreenStyles.buttonWrapper}>
          <Button
            title={isSubmitting ? 'Signing in...' : 'Login'}
            onPress={handleLogin}
            disabled={isSubmitting}
          />
        </View>
        <View style={LoginScreenStyles.buttonWrapper}>
          <Button
            title="Create student account"
            onPress={() => navigation.navigate({ name: 'Signup' } as never)}
          />
        </View>
      </View>
    </View>
  );
}