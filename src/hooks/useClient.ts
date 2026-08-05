import { runAxiosAsync } from "@/api/axiosAsync"
import { baseURL } from "@/api/client"
import { getAuthState, updateAuthState } from "@/store/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios"
import createAuthRefreshInterceptor from "axios-auth-refresh"
import { useDispatch, useSelector } from "react-redux"

const authClient = axios.create({baseURL})

export type TokenResponse = {
 tokens: {
    refresh: string;
    access: string
 },
     profile: {
      id: string,
      email: string,
      name: string,
      verified: boolean,
      avatar?: string | undefined
    },
}
const useClient = () => {
//    const {authState}  = useAuth()
      const authState = useSelector(getAuthState); 
   const dispatch = useDispatch()
   const token = authState.profile?.accessToken
   authClient.interceptors.request.use((config) => {
        if(!config.headers.Authorization){
            config.headers.Authorization = "Bearer " + token
        }
        return config 
   }, (error) => {
    return Promise.reject(error)
   })

   const refreshAuthLogic = async (FailedRequest: any) => {
    // read refresh token from async storage
    const refreshToken = await AsyncStorage.getItem("refresh-token")
    // send request with that token to get  new access
    const options = {method: "POST", data: {refreshToken}, url: `${baseURL}/auth/refresh-token`}
    const res = await runAxiosAsync<TokenResponse>(axios(options))
    if(res?.tokens){
        FailedRequest.response.config.headers.Authorization = "Bearer " + res.tokens.access
        // to handle signout if the token is expired
        if(FailedRequest.response.config.url === `/auth/sign-out`){
            FailedRequest.response.config.data = {refreshToken: res.tokens.refresh}
        }
        await AsyncStorage.setItem("access-token", res.tokens.access)
        await AsyncStorage.setItem("refresh-token", res.tokens.refresh)
        dispatch(updateAuthState({profile: {...res.profile, accessToken: res.tokens.access}, pending: false}))
        return Promise.resolve()
    }
   }
    
   createAuthRefreshInterceptor(authClient, refreshAuthLogic)

    return {authClient}
}

export default useClient