import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles/DrawerStyles.style';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EventScreen from '../screens/EventScreen';
import type { UserRole } from '../types/event';

const Drawer = createDrawerNavigator();

type DrawerNavigationProps = {
  route?: {
    params?: {
      role?: UserRole;
    };
  };
};

export default function DrawerNavigation({ route }: DrawerNavigationProps) {
  const role = route?.params?.role ?? 'student';

  return (
    <Drawer.Navigator id="MainDrawer">
      <Drawer.Screen
        name="Home"
        children={() => <HomeScreen />}
        options={({ navigation }) => ({
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),

          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.getParent()?.navigate('Login')}
              style={styles.logoutButton}
            >
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          )

        })}
      />

      <Drawer.Screen
        name="Events"
        children={() => <EventScreen role={role} />}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="calendar-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name="settings-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />
      
    </Drawer.Navigator>
  );
}