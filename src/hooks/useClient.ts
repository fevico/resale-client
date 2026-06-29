import { baseURL } from "@/api/client"
import axios from "axios"
import useAuth from "./useAuth"
import createAuthRefreshInterceptor from "axios-auth-refresh"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { runAxiosAsync } from "@/api/axiosAsync"
import { useDispatch } from "react-redux"
import { updateAuthState } from "@/store/auth"

const authClient = axios.create({baseURL})

type Response = {
 tokens: {
    refresh: string;
    access: string
 }
}
const useClient = () => {
   const {authState}  = useAuth()
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
    const res = await runAxiosAsync<Response>(axios(options))
    if(res?.tokens){
        FailedRequest.response.config.headers.Authorization = "Bearer " + res.tokens.access
        await AsyncStorage.setItem("access-token", res.tokens.access)
        await AsyncStorage.setItem("refresh-token", res.tokens.refresh)
        dispatch(updateAuthState({profile: {...authState.profile!, accessToken: res.tokens.access}, pending: false}))
        return Promise.resolve()  
    }
   }
    
   createAuthRefreshInterceptor(authClient, refreshAuthLogic)

    return {authClient}
}

export default useClient