import AppButton from '@/components/ui/AppButton'
import CustomKeyAvoidingView from '@/components/ui/CustomKeyAvoidingView'
import FormDivider from '@/components/ui/FormDivider'
import FormInput from '@/components/ui/FormInput'
import FormNavigator from '@/components/ui/FormNavigator'
import WelcomeHeader from '@/components/ui/WelcomeHeader'
import colors from '@/utils/colors'
import { useRouter } from 'expo-router'
import React, { FC } from 'react'
import { StyleSheet, View } from 'react-native'

interface Props {

}
const SignUp: FC<Props> = (props) => {
    const router = useRouter()
  return (
    <CustomKeyAvoidingView>
         <View style={styles.innerContainer}>
        <WelcomeHeader/>
        <View style={styles.formContainer}>
        <FormInput  placeholder='Name' />
        <FormInput  placeholder='Email' keyboardType='email-address' autoCapitalize='none' />
        <FormInput  placeholder='Password' secureTextEntry />
        <AppButton title='Sign Up'/>

        <FormDivider/>

        <FormNavigator 
        onLeftPress={() => router.push("/forget-password")} 
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