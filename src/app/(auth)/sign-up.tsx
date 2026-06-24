import AppButton from '@/components/ui/AppButton'
import CustomKeyAvoidingView from '@/components/ui/CustomKeyAvoidingView'
import FormDivider from '@/components/ui/FormDivider'
import FormInput from '@/components/ui/FormInput'
import FormNavigator from '@/components/ui/FormNavigator'
import WelcomeHeader from '@/components/ui/WelcomeHeader'
import colors from '@/utils/colors'
import { useRouter } from 'expo-router'
import { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { newUserSchema, yupValidate } from '@/utils/validation'
import { runAxiosAsync } from '@/api/axiosAsync'
import { showMessage } from 'react-native-flash-message'
import client from '@/api/client'
import useAuth from '@/hooks/useAuth'

interface Props {

}
const SignUp: FC<Props> = (props) => {
    const router = useRouter()
    const [userInfo, setUserInfo] = useState({name: "", email: "", password: ""})
    const {name, email, password} = userInfo
    const [busy, setBusy] = useState(false)
    const {signIn} = useAuth()

    const handleChange = (name: string) => (text: string) => {
          setUserInfo({...userInfo, [name]: text})
    }

    const handleSubmit = async() => {
      setBusy(true)
      const {values, error} = await yupValidate(newUserSchema, userInfo)

      if(error) return showMessage({message: error, type: "danger"})

      const res = await runAxiosAsync<{message: string}>(client.post("/auth/sign-up", values))
      if(res?.message) {
       showMessage({message: res.message, type: "success"})
       signIn(values!)
      }
      setBusy(false)
    }

  return (
    <CustomKeyAvoidingView>
         <View style={styles.innerContainer}>
        <WelcomeHeader/>
        <View style={styles.formContainer}>
        <FormInput  
        placeholder='Name' 
        value={name} 
        onChangeText={handleChange("name")}
        />

        <FormInput  
        placeholder='Email' 
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

        <AppButton active={!busy} title='Sign Up' onPress={handleSubmit}/>

        <FormDivider/>

        <FormNavigator 
        onLeftPress={() => router.push("/forgot-password")} 
        onRightPress={() => router.push("/sign-in")} 
        leftTitle='Forget password' 
        rightTitle='Sign In'/>
        </View>
      </View> 
    </CustomKeyAvoidingView>
  )
}

export default SignUp

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