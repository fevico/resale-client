import "../global.css"
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Stack } from 'expo-router';
import FlashMessage from "react-native-flash-message"
import {Provider} from "react-redux"

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import store from "@/store";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <Provider store={store}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      {/* <AnimatedSplashOverlay />
      <AppTabs /> */}
      <Stack screenOptions={{ headerShown: false }}>
        {/* <Stack.Screen name="index" /> */}
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
      <FlashMessage position="top"/>
    </ThemeProvider>
    </Provider>
  );
}
