import colors from '@/utils/colors'
import { useRouter } from 'expo-router'
import { FC, JSX } from 'react'
import { StyleSheet, Text, View } from 'react-native'

interface Props {
    icon: JSX.Element,
    name:  string
}

const CategoryOption: FC<Props> = ({name, icon}) => {
    const router = useRouter()
  return (
  <View style={styles.container}>
              <View style={{transform: [{scale: 0.4}]}}>{icon}</View>
              <Text style={styles.category}>{name}</Text>
    </View>
  )
}

export default CategoryOption

const styles = StyleSheet.create({
    container: {flexDirection: "row", alignItems: "center"},
  category: {
      color: colors.primary,
      paddingVertical: 10
    }
});