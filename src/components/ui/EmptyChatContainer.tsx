import colors from '@/utils/colors';
import size from '@/utils/size';
import React, { FC } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {}

const EmptyChatContainer: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
        <View style={styles.messageContainer}>
      <Text style={styles.message}>Breaking the ice can be the hardest part, but trust me, it's worth it!
        Start with a simple 'hello' and watch the conversation flow.</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    transform: [{ rotate: "180deg" }, {rotateY: "-180deg"}],
  },
  messageContainer: {
    backgroundColor: colors.deActive,
    borderRadius: size.padding,
    borderWidth: 5
  },
  message: {
    color: colors.active,
    fontSize: 14,
    textAlign: "center",
  }
});

export default EmptyChatContainer