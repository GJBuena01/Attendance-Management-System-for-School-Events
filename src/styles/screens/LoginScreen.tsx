import { Text, View, TextInput, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { LoginScreenStyles } from '../LoginScreen.style';
import { globalStyles } from '../GlobalStyles';

export default function LoginScreen() {
  const navigation = useNavigation();

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
        />

        <Text style={LoginScreenStyles.label}>Password</Text>
        <TextInput
          style={LoginScreenStyles.input}
          placeholder="Enter your password"
          placeholderTextColor="#7f7f7f"
          secureTextEntry
        />

        <View style={LoginScreenStyles.buttonWrapper}>
          <Button
            title="Login"
            onPress={() => navigation.navigate('Main' as never)}
          />
        </View>
      </View>
    </View>
  );
}