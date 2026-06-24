import { useRouter } from 'expo-router'
import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {

}

const ForgetPassword: FC<Props> = (props) => {
    const router = useRouter()
  return (
      <View style={styles.container}>
        <Text>Hello This is me</Text>
      </View> 
  )
}

export default ForgetPassword

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
});