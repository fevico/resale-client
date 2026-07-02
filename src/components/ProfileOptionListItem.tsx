import colors from '@/utils/colors'
import { AntDesign } from '@expo/vector-icons'
import { FC } from 'react'
import { Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native'

interface Props {
    antIconName: string
    title: string
    style?: StyleProp<ViewStyle>
    active?: boolean
    onPress?: () => void
}

const ProfileOptionListItem: FC<Props> = ({antIconName, title, style, active, onPress}) => {
  return (
  <Pressable style={[styles.container, style]} onPress={onPress}>
      <View style={styles.buttonContainer}>
        <AntDesign name={antIconName as any} size={24} color={active ? colors.active : colors.primary} />
      <Text style={[styles.title, {color: active ? colors.active : colors.primary}]}>{title}</Text>
      </View>
      {active && <View style={styles.activeIndicator} />}
    </Pressable>
  )
}

export default ProfileOptionListItem

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  title: {
    fontSize: 20,
    paddingLeft: 10
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activeIndicator:{
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.active,
  }
});