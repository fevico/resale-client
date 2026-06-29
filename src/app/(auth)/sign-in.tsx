import AppButton from '@/components/ui/AppButton'
import CustomKeyAvoidingView from '@/components/ui/CustomKeyAvoidingView'
import FormDivider from '@/components/ui/FormDivider'
import FormInput from '@/components/ui/FormInput'
import FormNavigator from '@/components/ui/FormNavigator'
import WelcomeHeader from '@/components/ui/WelcomeHeader'
import colors from '@/utils/colors'
import React, { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { useRouter } from 'expo-router' 
import { signInSchema, yupValidate } from '@/utils/validation'
import { showMessage } from 'react-native-flash-message'
import { runAxiosAsync } from '@/api/axiosAsync'
import client from '@/api/client'
import { useDispatch } from 'react-redux'
import { updateAuthState } from '@/store/auth'
import AsyncStorage from "@react-native-async-storage/async-storage"
import useAuth from '@/hooks/useAuth'

interface Props {

}

const SignIn: FC<Props> = (props) => {
    const router = useRouter()
        const [userInfo, setUserInfo] = useState({email: "", password: ""})
        
        const {signIn} = useAuth()

        const handleSubmit = async() => {
          const {values, error} = await yupValidate(signInSchema, userInfo)
    
          if(error) return showMessage({message: error, type: "danger"})
            
           if(values) signIn(values)

          // router.replace("/home");
        }

     const handleChange = (name: string) => (text: string) => {
          setUserInfo({...userInfo, [name]: text})
    }

        const {email, password} = userInfo
  return (
    <CustomKeyAvoidingView>
       <View style={styles.innerContainer}>
        <WelcomeHeader/>
        <View style={styles.formContainer}>
        <FormInput  placeholder='Email' 
        keyboardType='email-address' 
        autoCapitalize='none' 
        value={email} 
        onChangeText={handleChange("email")} 
        />

        <FormInput  
        placeholder='Password' 
        secureTextEntry 
        value={password}
        onChangeText={handleChange("password")} 
        />
        <AppButton active title='Sign in' onPress={handleSubmit}/>

        <FormDivider/> 

        <FormNavigator 
        onLeftPress={() => router.push("/forgot-password")} 
        onRightPress={() => router.push("/sign-up")} 
        leftTitle='Forget password' 
        rightTitle='Sign Up'/>
        </View>
      </View> 
    </CustomKeyAvoidingView>
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
  innerContainer: {
   padding: 15,
   flex: 1
  },
  input: {
    width: "100%",
    padding: 8,
    borderRadius: 5,
    marginBottom: 15,
    color: colors.primary,
    borderWidth: 1
  },
  formContainer: {
    marginTop: 30,
  }
});
