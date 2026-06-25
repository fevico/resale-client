import { Tabs } from 'expo-router';
import { SymbolView } from 'expo-symbols'; // Built-in high-performance SF Symbols support for Expo 56
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        // Set your active tab accent color (e.g., matching a modern dating app theme)
        tabBarActiveTintColor: '#f43f5e', 
        tabBarInactiveTintColor: '#94a3b8',
        headerShown: false, // Hides the default bulky white top header bar
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e2e8f0',
          height: Platform.OS === 'android' ? 95 : 85,
          paddingBottom: Platform.OS === 'android' ? 10 : 25,
          paddingTop: 2
        },
      }}
    >
      {/* Tab 1: The Home Matches Feed */}
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab 2: The Product listing Matches Feed */}
      <Tabs.Screen
        name="new-listing"
        options={{
          title: 'Listing',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "add-circle" : "list-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />

      {/* Tab 3: The Profile display tab */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? "person" : "person-outline"} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}