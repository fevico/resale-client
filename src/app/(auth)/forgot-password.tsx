import { runAxiosAsync } from '@/api/axiosAsync'
import client from '@/api/client'
import AppButton from '@/components/ui/AppButton'
import CustomKeyAvoidingView from '@/components/ui/CustomKeyAvoidingView'
import FormDivider from '@/components/ui/FormDivider'
import FormInput from '@/components/ui/FormInput'
import FormNavigator from '@/components/ui/FormNavigator'
import WelcomeHeader from '@/components/ui/WelcomeHeader'
import colors from '@/utils/colors'
import { emailRegex } from '@/utils/validation'
import { useRouter } from 'expo-router'
import React, { FC, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { showMessage } from 'react-native-flash-message'

interface Props {

}

const ForgetPassword: FC<Props> = (props) => {
  const [email, setEmail] = useState("")
  const [busy, setBusy] = useState(false)
    const router = useRouter()

    const handleSubmit = async() => {
      if(!emailRegex.test(email)){
        return showMessage({message: "Invalid email id!", type: "danger"})
      }
      setBusy(true)
    const res = await runAxiosAsync<{message: string}>(client.post('/auth/forget-password', {email}))
    console.log("response", res) 
    setBusy(false)
    if(res){
      showMessage({message: res.message, type: "success"})
    }

    }

  return (
    <CustomKeyAvoidingView>
         <View style={styles.innerContainer}>
        <WelcomeHeader/>
        <View style={styles.formContainer}>
        <FormInput  
        placeholder='Email' 
        keyboardType='email-address' 
        autoCapitalize='none' 
        value={email}
        onChangeText={text => setEmail(text)} 
        />
        <AppButton active={!busy} title={busy ? "Please wait..." : 'Request Link'} onPress={handleSubmit}/>

        <FormDivider/>

        <FormNavigator 
        onLeftPress={() => router.push("/sign-up")} 
        onRightPress={() => router.push("/sign-in")} 
        leftTitle='Sign Up' 
        rightTitle='Sign In'/>
        </View>
      </View> 
    </CustomKeyAvoidingView>
  )
}

export default ForgetPassword

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