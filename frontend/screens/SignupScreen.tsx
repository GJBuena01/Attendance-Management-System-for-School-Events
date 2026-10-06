import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signupStudent } from '../api/auth';
import { globalStyles } from '../styles/GlobalStyles.style';
import { LoginScreenStyles } from '../styles/LoginScreen.style';

export default function SignupScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    setError('');
    if (!fullName.trim() || !email.trim() || !password) {
      setError('Enter your full name, email, and password.');
      return;
    }

    setIsSubmitting(true);
    try {
      const account = await signupStudent({ fullName, email, password });
      navigation.navigate({ name: 'Main', params: account } as never);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Could not create account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={[globalStyles.screen, LoginScreenStyles.page]}>
      <View style={LoginScreenStyles.card}>
        <Text style={LoginScreenStyles.loginHeader}>Student signup</Text>
        <Text style={LoginScreenStyles.subtitle}>Create an attendance account</Text>

        <Text style={LoginScreenStyles.label}>Full name</Text>
        <TextInput
          style={LoginScreenStyles.input}
          placeholder="Enter your full name"
          value={fullName}
          onChangeText={setFullName}
        />

        <Text style={LoginScreenStyles.label}>University email</Text>
        <TextInput
          style={LoginScreenStyles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text style={LoginScreenStyles.label}>Password</Text>
        <TextInput
          style={LoginScreenStyles.input}
          placeholder="Create a password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {error ? <Text style={LoginScreenStyles.error}>{error}</Text> : null}

        <View style={LoginScreenStyles.buttonWrapper}>
          <Button
            title={isSubmitting ? 'Creating account...' : 'Create account'}
            onPress={handleSignup}
            disabled={isSubmitting}
          />
        </View>
        <View style={LoginScreenStyles.buttonWrapper}>
          <Button
            title="Back to login"
            onPress={() => navigation.navigate({ name: 'Login' } as never)}
          />
        </View>
      </View>
    </View>
  );
}