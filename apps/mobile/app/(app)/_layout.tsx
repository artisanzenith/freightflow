import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { dark } from '../../src/theme';

/**
 * Driver app tab navigation. Five primary tabs matching the driver's core
 * workflow: Home (availability + live dispatch search), Loads (offers), Trip
 * (current load), Messages, and Profile. Legacy placeholder routes are kept in
 * the group but hidden from the tab bar via `href: null`.
 *
 * Premium dark theme — deep navy tab bar with blue active accents.
 */
export default function AppTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: dark.brandBright,
        tabBarInactiveTintColor: dark.textSubtle,
        tabBarStyle: {
          backgroundColor: dark.surface,
          borderTopColor: dark.border,
          borderTopWidth: 1,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="loads"
        options={{
          title: 'Loads',
          tabBarIcon: ({ color, size }) => <Ionicons name="cube" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="trip"
        options={{
          title: 'Trip',
          tabBarIcon: ({ color, size }) => <Ionicons name="navigate" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: 'Messages',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <Ionicons name="person" color={color} size={size} />,
        }}
      />
    </Tabs>

  );
}
