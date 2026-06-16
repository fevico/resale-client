import React, { FC } from 'react'
import { Image, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {}
const heading = "Online Marketplace for Used Goods"
const subHeading = "Buy or sell used goods with trust. Chat directly with sellers, ensuring a seamless, authentic experience."
const WelcomeHeader: FC<Props> = (props) => {
  return (
        <View style={styles.container}>
            <Image source={require('../../assets/hero.png')} style={styles.image} resizeMode='contain' resizeMethod="resize"/>
            <Text style={styles.heading}>{heading}</Text>
            <Text style={styles.subHeading}>{subHeading}</Text>
        </View> 
  )
}

export default WelcomeHeader

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  image: {
    width: 250,
    height: 250
  },
  heading:{
    fontWeight: "600",
    fontSize: 20,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 5,
    color: "#000"
  },
  subHeading:{
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 14,
    color: "#000"
  }
});