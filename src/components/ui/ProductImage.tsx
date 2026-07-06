import size from '@/utils/size'
import { FC } from 'react'
import { Dimensions, Image, StyleSheet } from 'react-native'

interface Props {
 uri?: string
}
const {width} = Dimensions.get("window")
const imageWidth = width - size.padding * 2
const aspect = 16 / 9

const ProductImage: FC<Props> = ({uri}) => {
  return (
   <Image source={{ uri }} style={styles.image} resizeMethod='resize' resizeMode='cover' />
  )
}

const styles = StyleSheet.create({
  container: {},
  image: {
    width: imageWidth,
    height: imageWidth / aspect,
    borderRadius: 7
  }
});

export default ProductImage