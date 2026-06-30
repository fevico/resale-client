import { useRouter } from 'expo-router'
import React, { FC } from 'react'
import { StyleProp, ViewStyle } from 'react-native'
import { FlatList, Image, Pressable, StyleSheet, Text, View } from 'react-native'

interface Props {
 images: string[]
 onPress?(item: string): void
 onLongPress?(item: string): void
 style?: StyleProp<ViewStyle>
}

const HorizontalImageList: FC<Props> = ({images, style, onPress, onLongPress}) => {
    const router = useRouter()
  return (
    <FlatList 
        data={images} 
        renderItem={({item}) => {
          return ( 
            <Pressable 
            onPress={() => onPress &&  onPress(item)}
            onLongPress={() => onLongPress &&  onLongPress(item)} 
            style={styles.listItem}
            >
                <Image style={styles.image} source={{uri: item}}/>
            </Pressable>
        )
        }}
        keyExtractor={(item) => item}
        horizontal
        contentContainerStyle={style}
        />
  )
}

export default HorizontalImageList

const styles = StyleSheet.create({
  listItem: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5,
    overflow: "hidden"
  },
  image: {
    flex: 1
  }
});