import { runAxiosAsync } from "@/api/axiosAsync";
import CategoryList from "@/components/CategoryList";
import LatestProductList, {
  LatestProduct,
} from "@/components/LatestProductList";
import SearchBar from "@/components/SearchBar";
import ChatNotification from "@/components/ui/ChatNotification";
import useClient from "@/hooks/useClient";
import size from "@/utils/size";
import { useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

interface Props {}

const Home: FC<Props> = (props) => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { authClient } = useClient();
  const router = useRouter();

  const onChatPress = () => {
    router.push("/chats");
  };

  const latestProduct = async () => {
    const res = await runAxiosAsync<{ products: LatestProduct[] }>(
      authClient.get("/product/latest"),
    );
    if (res?.products) {
      setProducts(res.products);
    }
  };

  useEffect(() => {
    latestProduct();
  }, []);

  return (
    <>
      <SafeAreaView style={styles.safeArea}>
        <ChatNotification onPress={onChatPress} />
        <ScrollView style={styles.container}>
          <SearchBar />
          <CategoryList
            onPress={(category) =>
              router.push({
                pathname: "/by-category/[category]",
                params: { category },
              })
            }
          />
          <LatestProductList
            data={products}
            onPress={({ id }) => router.push(`/listings/${id}`)}
          />
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
    flex: 1,
  },
  safeArea: { flex: 1 },
});
