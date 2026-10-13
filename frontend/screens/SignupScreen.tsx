import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { signupStudent } from '../api/auth';
import { LoginScreenStyles } from '../styles/LoginScreen.style';
import BrandMark from '../components/BrandMark';
import { colors } from '../styles/theme';

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
    <ScrollView contentContainerStyle={LoginScreenStyles.page} keyboardShouldPersistTaps="handled">
      <View style={LoginScreenStyles.card}>
        <View style={LoginScreenStyles.brandContainer}>
          <BrandMark vertical />
        </View>

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

        <TouchableOpacity style={LoginScreenStyles.primaryButton} onPress={handleSignup} disabled={isSubmitting}>
          {isSubmitting ? <ActivityIndicator color={colors.surface} /> : <Text style={LoginScreenStyles.primaryButtonText}>Create account</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={LoginScreenStyles.secondaryButton} onPress={() => navigation.navigate({ name: 'Login' } as never)}>
          <Text style={LoginScreenStyles.secondaryButtonText}>Back to login</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
