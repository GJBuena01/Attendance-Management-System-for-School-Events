import React from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles/DrawerStyles.style';
import { colors } from '../styles/theme';
import BrandMark from '../components/BrandMark';

import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import EventScreen from '../screens/EventScreen';
import type { Account, UserRole } from '../types/event';

const Drawer = createDrawerNavigator();

type DrawerNavigationProps = {
  route?: {
    params?: {
    role?: UserRole;
    studentId?: string;
    fullName?: string;
    email?: string;
    };
  };
};

export default function DrawerNavigation({ route }: DrawerNavigationProps) {
  const role = route?.params?.role ?? 'student';
  const account: Account = {
    role,
    studentId: route?.params?.studentId,
    fullName: route?.params?.fullName ?? 'Student',
    email: route?.params?.email ?? '',
  };

  return (
    <Drawer.Navigator
      id="MainDrawer"
      screenOptions={{
        headerStyle: { backgroundColor: colors.maroon },
        headerTintColor: colors.surface,
        headerTitleStyle: { fontWeight: '800' },
        drawerActiveTintColor: colors.maroon,
        drawerActiveBackgroundColor: colors.maroonSoft,
        drawerInactiveTintColor: colors.muted,
        drawerLabelStyle: { fontWeight: '700', marginLeft: 2 },
        drawerItemStyle: { borderRadius: 12, marginHorizontal: 12 },
        drawerStyle: { width: 290, backgroundColor: colors.surface },
      }}
      drawerContent={(props) => (
        <DrawerContentScrollView
          {...props}
          contentContainerStyle={styles.drawerContent}
        >
          <View style={styles.drawerBrandHeader}>
            <BrandMark dark vertical />
          </View>
          <DrawerItemList {...props} />
        </DrawerContentScrollView>
      )}
    >
      <Drawer.Screen
        name="Home"
        children={() => <HomeScreen role={role} account={account} />}
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
              <Text style={styles.logoutText}>Log out</Text>
            </TouchableOpacity>
          )

        })}
      />

      <Drawer.Screen
        name="Events"
        children={() => <EventScreen role={role} account={account} />}
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
