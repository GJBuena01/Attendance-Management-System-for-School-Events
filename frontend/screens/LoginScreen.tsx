import { useState } from 'react';
import { Text, View, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenStyles } from '../styles/LoginScreen.style';
import { globalStyles } from '../styles/GlobalStyles.style';
import type { UserRole } from '../types/event';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    const role: UserRole | null =
      email.trim() === 'student' && password === 'student'
        ? 'student'
        : email.trim() === 'officer' && password === 'officer'
          ? 'officer'
          : null;

    if (!role) {
      setError('Use student/student or officer/officer.');
      return;
    }

    setError('');
    navigation.navigate({ name: 'Main', params: { role } } as never);
  };

  return (
    <View style={[globalStyles.screen, LoginScreenStyles.page]}>
      <View style={LoginScreenStyles.card}>
        <Text style={LoginScreenStyles.loginHeader}>Login</Text>
        <Text style={LoginScreenStyles.subtitle}>School Event Attendance</Text>

        <Text style={LoginScreenStyles.label}>Name</Text>
        <TextInput
          style={LoginScreenStyles.input}
          placeholder="Enter your name"
          placeholderTextColor="#7f7f7f"
          value={email}
          onChangeText={setEmail}
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
      </View>
    </View>
  );
}