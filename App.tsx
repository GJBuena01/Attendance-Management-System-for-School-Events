import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/styles/screens/LoginScreen';
import DrawerNavigation from './src/styles/navigation/DrawerNavigation';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
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
          name="Main"
          component={DrawerNavigation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
