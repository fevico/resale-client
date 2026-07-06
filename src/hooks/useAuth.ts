import { runAxiosAsync } from "@/api/axiosAsync"
import client from "@/api/client"
import { getAuthState, updateAuthState } from "@/store/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"
import { useDispatch, useSelector } from "react-redux"
import useClient from "./useClient"

export interface SignInRes {
  profile: {
    id: string;
    email: string
    name: string;
    verified: boolean;
    avatar?: string;
  },
  tokens: {
    refresh: string
    access: string
  }
}

type UserInfo = {
    email: string;
    password: string;
}
const useAuth = () => {
  const {authClient} = useClient()
    const dispatch =  useDispatch()
      const authState = useSelector(getAuthState); 
      const router = useRouter()

    const signIn = async (userInfo: UserInfo) => {
                dispatch(updateAuthState({profile: null, pending: true}))
                  const res = await runAxiosAsync<SignInRes>(client.post("/auth/sign-in", userInfo))
                  if(res){
                    // store the token
                   await AsyncStorage.setItem("access-token", res.tokens.access)
                   await AsyncStorage.setItem("refresh-token", res.tokens.refresh)
                    dispatch(updateAuthState({
                      profile: {...res.profile, accessToken: res.tokens.access},
                      pending: false
                    }))
                    router.replace("/home") 
                  }else{
                    dispatch(updateAuthState({profile: null, pending: false}))
                  }
    }

    const signOut = async () => { 
      const token = await AsyncStorage.getItem("refresh-token")
      if(token){
       dispatch(updateAuthState({profile: authState.profile, pending: true}))
       const res = await runAxiosAsync(authClient.post("/auth/sign-out", {refreshToken: token}))
       await AsyncStorage.removeItem("refresh-token")
       await AsyncStorage.removeItem("access-token")
       dispatch(updateAuthState({profile: null, pending: false}))
        //  router.replace("/sign-in")
     }
    }

    const loggedIn = authState.profile ? true : false;

    return {signIn, authState, signOut, loggedIn}
}

export default useAuth