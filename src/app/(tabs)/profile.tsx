import { useRouter } from 'expo-router'
import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {

}

const Profile: FC<Props> = (props) => {
    const router = useRouter()
  return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Profile screen</Text>
    </View>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
   flex: 1,
  },
});