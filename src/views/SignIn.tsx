import WelcomeHeader from '@/components/ui/WelcomeHeader'
import React, { FC } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {

}
const SignIn: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <WelcomeHeader/>
    </View> 
  )
}

export default SignIn

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  image: {
    width: 250,
    height: 250
  }
});