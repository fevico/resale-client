import colors from '@/utils/colors'
import { FontAwesome } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { FC } from 'react'
import { Image, StyleSheet, View } from 'react-native'

interface Props {
    uri?: string
    size?: number
}

const iconContainerFactor = 0.7
const iconSizeFactor =  0.8

const AvatarView: FC<Props> = ({size = 50, uri}) => {
    const router = useRouter()
    const iconContainerSize = size * iconContainerFactor
    const iconSize = size * iconSizeFactor

  return (
  <View style={[{width: size, height: size, borderRadius: size / 2}, styles.container, !uri && styles.ProfileIcon]}>
     {uri ? <Image source={{uri}} style={styles.image}/> 
     : <View style={[{width: iconContainerSize, height: iconContainerSize, borderRadius: iconContainerSize / 2}, styles.iconContainer]}>
            <FontAwesome name='user' size={iconSize} color={colors.white}/>
        </View>} 
    </View>
  )
}

export default AvatarView

const styles = StyleSheet.create({
  container: {
    overflow: "hidden"
  },
  image: {flex: 1},
  ProfileIcon: {
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center"
  }, 
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden"
  }
});