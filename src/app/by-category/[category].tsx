import { runAxiosAsync } from "@/api/axiosAsync";
import { LatestProduct } from "@/components/LatestProductList";
import EmptyView from "@/components/ui/EmptyView";
import ProductCard from "@/components/ui/ProductCard";
import useClient from "@/hooks/useClient";
import colors from "@/utils/colors";
import size from "@/utils/size";
import { useLocalSearchParams, useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

interface Props {}

const productList: FC<Props> = (props) => {
  const { category } = useLocalSearchParams<{ category: string }>();
  const { authClient } = useClient();
  const [product, setProduct] = useState<LatestProduct[]>([]);
  const router = useRouter();

  const isOdd = product.length % 2 !=0

  const fetchProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/by-category/" + category),
    );
    if (res) {
      setProduct(res.products);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [category]);

  if (!product.length)
    return (
      <View style={styles.container}>
        <EmptyView title="There is no product in this category" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{category}</Text>
      <FlatList
        numColumns={2}
        data={product}
        renderItem={({ item, index }) => (
          <View style={{ flex: isOdd && index === product.length -1 ? 0.5 : 1 }}>
            <ProductCard
              product={item}
              onPress={({ id }) => router.push(`/listings/${id}`)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    color: colors.primary,
    paddingBottom: 5,
    fontSize: 18,
    opacity: 0.6,
  },
});

export default productList;
