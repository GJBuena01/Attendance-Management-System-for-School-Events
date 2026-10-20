import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import LoginScreen from './frontend/screens/LoginScreen';
import SignupScreen from './frontend/screens/SignupScreen';
import DrawerNavigation from './frontend/navigation/DrawerNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
     <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
        id='AppStack'
          initialRouteName="Login"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen
            name="Login"
            component={LoginScreen}
          />

          <Stack.Screen
            name="Signup"
            component={SignupScreen}
          />

          <Stack.Screen
            name="Main"
            component={DrawerNavigation}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
