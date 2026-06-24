import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthState, Profile, updateAuthState } from '@/store/auth';
import client from '@/api/client';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { runAxiosAsync } from '@/api/axiosAsync';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useAuth from '@/hooks/useAuth';

export default function HomeScreen() {

  const {loggedIn, authState} = useAuth()
  console.log(authState)

  const dispatch = useDispatch()
  console.log("auth state", authState.profile)
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  const fetchAuthState = async () => {
   const token = await AsyncStorage.getItem("access-token")
   console.log("access", token)
   if(token){
    dispatch(updateAuthState({
        pending: true,
        profile: null
      }))
     const res = await runAxiosAsync<{profile: Profile}>(client.get("/auth/profile", {
       headers: {
         Authorization: "Bearer " + token, 
       }
     }))

     console.log("profile", res)

     if(res){
      dispatch(updateAuthState({
        pending: false,
        profile: res.profile
      }))
     }else {
      dispatch(updateAuthState({
        pending: false,
        profile: null
      }))
     }
     setIsCheckingToken(false);
   }
  }

  useEffect(() => {
    fetchAuthState()
  }, [])

  console.log(loggedIn)

  if (isCheckingToken || authState.pending) {
    return (
      <SafeAreaView style={styles.container}>
        <LoadingSpinner visible={true} />
      </SafeAreaView>
    );
  }

  if (!loggedIn) {
    return <Redirect href="/sign-in" />;
  }

  return <Redirect href="/home" />;

  // return (
  //   <SafeAreaView style={styles.container}>
  //     {/* <SignIn /> */}
  //     <LoadingSpinner visible={authState.pending}/>
  //     {!loggedIn ? <Redirect href="/sign-in" /> : <Redirect href="/sign-up" />}
  //   </SafeAreaView>
  // )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});