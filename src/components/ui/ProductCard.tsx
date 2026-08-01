import colors from '@/utils/colors';
import { formatPrice } from '@/utils/helper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { FC } from 'react'
import { Image } from 'react-native';
import { StyleSheet, Text, View, Pressable } from 'react-native'
import { LatestProduct } from '../LatestProductList';

interface Props {
    product: LatestProduct
    onPress(item: LatestProduct): void
}

const ProductCard: FC<Props> = ({product, onPress}) => {
  return (
          <Pressable
            onPress={() => onPress(product)}
            style={styles.productContainer}
          >
            {product.thumbnail ? (
              <Image
                source={{ uri: product.thumbnail }}
                style={styles.thumbnail}
              />
            ) : (
              <View style={styles.noImage}>
                <MaterialCommunityIcons
                  name="image-off"
                  size={35}
                  color={colors.primary}
                />
              </View>
            )}
            <Text style={styles.price}>{formatPrice(product.price)}</Text>
            <Text style={styles.name}>{product.name}</Text>
          </Pressable>
  )
}

const styles = StyleSheet.create({
  container: {},
    thumbnail: {
      width: "100%",
      height: 100,
      borderRadius: 5,
    },
    noImage: {
      backgroundColor: colors.deActive,
      alignItems: 'center',
      justifyContent: "center"
    },
    productContainer: {
      padding: 7,
    },
    name: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.primary,
    },
    price: {
      fontSize: 16,
      fontWeight: "600",
      color: colors.active,
      paddingTop: 5,
    },
});

export default ProductCard