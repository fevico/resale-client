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

const ForgetPassword: FC<Props> = (props) => {
    const router = useRouter()
  return (
      <View style={styles.container}>
      </View> 
  )
}

export default ForgetPassword

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
});