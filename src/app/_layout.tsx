import { runAxiosAsync } from "@/api/axiosAsync";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useClient from "@/hooks/useClient";
import store from "@/store";
import { updateAuthState } from "@/store/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import FlashMessage from "react-native-flash-message";
import { Provider, useDispatch } from "react-redux";
import "../global.css";

// Component 1: The Inner Content App Controller 
type ProfileRes = {
  profile: {
    id: string;
    email: string;
    name: string;
    verified: boolean;
    avatar?: string;
  }
}
function AppNavigationManager() {

  const colorScheme = useColorScheme();
  const {authClient} = useClient()
  const { loggedIn } = useAuth(); 
  const dispatch = useDispatch();
  const router = useRouter();
  const segments = useSegments();
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const fetchAuthState = async () => {
    try {
      const token = await AsyncStorage.getItem("access-token");
      if (token) {
        dispatch(updateAuthState({ pending: true, profile: null }));
        
        const res = await runAxiosAsync<ProfileRes>(
          authClient.get("/auth/profile", {
            headers: { Authorization: "Bearer " + token }
          })
        );

        if (res) {
          dispatch(updateAuthState({ pending: false, profile: {...res.profile, accessToken: token} }));
        } else {
          await AsyncStorage.removeItem("access-token");
          await AsyncStorage.removeItem("refresh-token");
          dispatch(updateAuthState({ pending: false, profile: null }));
        }
      }
    } catch (e) {
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


    return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="chats" options={{ headerShown: true, title: "Messages" }} />
        <Stack.Screen name="listings" options={{ headerShown: true, title: "Your Listings" }} />
        <Stack.Screen name="listings/[id]/index" options={{ headerShown: true, title: "Product Detail" }} />
        <Stack.Screen name="listings/[id]/edit" options={{ headerShown: true, title: "Edit Product" }} />
        <Stack.Screen name="by-category/[category]" options={{ headerShown: true, title: "Product category" }} />
        <Stack.Screen name="chat-window" options={{ headerShown: true, title: "Chat" }} />
      </Stack>
      <FlashMessage position="top"/>
    </ThemeProvider>
  );
}

function AppLayoutContainer() {
  const { authState } = useAuth(); 
  return (
    <>
      <LoadingSpinner visible={authState.pending} />
      <AppNavigationManager />
    </>
  );
}

// Component 2: The Outer Provider Wrapper Entry Point
export default function TabLayout() {
  return (
    <Provider store={store}>
      <AppLayoutContainer />
    </Provider>
  );
}