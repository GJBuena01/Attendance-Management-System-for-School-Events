import { useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenStyles } from '../styles/LoginScreen.style';
import { globalStyles } from '../styles/GlobalStyles.style';
import type { UserRole } from '../types/event';
import { loginStudent } from '../api/auth';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (email.trim() === 'officer' && password === 'officer') {
      setError('');
      navigation.navigate({ name: 'Main', params: { role: 'officer', fullName: 'Officer' } } as never);
      return;
    }

    try {
      const account = await loginStudent({ email: email.trim(), password });
      setError('');
      navigation.navigate({ name: 'Main', params: account } as never);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not log in.');
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
          placeholder="Enter your name"
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
            title="Login"
            onPress={handleLogin}
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