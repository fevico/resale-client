import { useRouter } from 'expo-router'
import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {

}

const Chats: FC<Props> = (props) => {
  return (
  <View style={styles.container}>
      <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Your Matches Feed</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {}
});

export default Chats
