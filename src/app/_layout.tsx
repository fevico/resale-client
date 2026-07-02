import "../global.css"
import { useEffect, useState } from 'react';
import { Platform, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import { Stack, useRouter, useSegments } from 'expo-router'; 
import FlashMessage from "react-native-flash-message"
import { Provider, useDispatch } from "react-redux"
import store from "@/store";
import { Profile, updateAuthState } from "@/store/auth";
import { runAxiosAsync } from "@/api/axiosAsync";
import AsyncStorage from "@react-native-async-storage/async-storage";
import useAuth from "@/hooks/useAuth";
import useClient from "@/hooks/useClient"; 

// Component 1: The Inner Content App Controller 
function AppNavigationManager() {

  const colorScheme = useColorScheme();
  const {authClient} = useClient()
  const { loggedIn, authState } = useAuth(); // Safe to use here because Provider wraps it!
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const fetchAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (token) {
        dispatch(updateAuthState({ pending: true, profile: null }));
        
        const res = await runAxiosAsync<{ profile: Profile }>(
          authClient.get("/auth/profile", {
            headers: { Authorization: "Bearer " + token }
          })
        );

        if (res) {
          dispatch(updateAuthState({ pending: false, profile: res.profile }));
        } else {
          await AsyncStorage.removeItem("access-token");
          await AsyncStorage.removeItem("refresh-token");
          dispatch(updateAuthState({ pending: false, profile: null }));
        }
      }
    } catch (e) {
      console.log("Session verification error:", e);
    } finally {
      setIsCheckingToken(false);
    }
  };

  useEffect(() => {
    fetchAuthState();
  }, []);

  // Monitor login changes and handle global URL redirects reactively
  useEffect(() => {
    if (isCheckingToken) return;
    const inAuthGroup = segments[0] === '(auth)';
    const isAtRoot = !segments[0] || segments[0] === undefined;

    if (!loggedIn && !inAuthGroup) {
      router.replace('/sign-in');
    } else if (loggedIn && (inAuthGroup || isAtRoot)) {
      router.replace('/home');
    }
  }, [loggedIn, isCheckingToken, segments]);

    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    //   <Stack screenOptions={{ headerShown: false }}>
    //     {/* FIXED: Explicitly map your entry and sub-group configurations */}
    //     <Stack.Screen name="index" />
    //     <Stack.Screen name="(auth)/sign-in" />
    //     <Stack.Screen name="(auth)/sign-up" />
    //     <Stack.Screen name="(auth)/forgot-password" />
    //     <Stack.Screen name="(tabs)" />
    //     <Stack.Screen name="(views)" options={{ headerShown: true }} />
    //   </Stack>
    //   <FlashMessage position="top"/>
    // </ThemeProvider>
    return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Only declare the main entry points and top-level directory wrappers */}
        <Stack.Screen name="index" />
        {/* Custom overrides for your standalone pages when they slide up */}
        <Stack.Screen name="chats" options={{ headerShown: true, title: "Messages" }} />
        <Stack.Screen name="listings" options={{ headerShown: true, title: "Your Listings" }} />
      </Stack>
      <FlashMessage position="top"/>
    </ThemeProvider>
  );
}

// Component 2: The Outer Provider Wrapper Entry Point
export default function TabLayout() {
  return (
    <Provider store={store}>
      <AppNavigationManager />
    </Provider>
  );
}