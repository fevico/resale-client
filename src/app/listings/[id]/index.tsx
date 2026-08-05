import { runAxiosAsync } from "@/api/axiosAsync";
import OptionModal from "@/components/OptionModal";
import ProductDetails from "@/components/ProductDetail";
import ChatIcon from "@/components/ui/ChatIcon";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useClient from "@/hooks/useClient";
import { deleteItem, Product } from "@/store/listings";
import colors from "@/utils/colors";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import { useDispatch } from "react-redux";

interface Props {}

const menuOptions = [
  {
    name: "Edit",
    icon: <Ionicons name="create-outline" color={colors.primary} size={20} />,
    id: "edit",
  },
  {
    name: "Delete",
    icon: <Ionicons name="trash-outline" color={colors.primary} size={20} />,
    id: "delete",
  },
];

const ListingDetails: FC<Props> = (props) => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { authClient } = useClient();
  const { authState } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [fetchChatId, setFetchChatId] = useState(false);
  const dispatch = useDispatch();

  const router = useRouter();

  const fetchProductDetail = async () => {
    try {
      setLoading(true);
      // Firing the individual product endpoint by its ID path parameter
      const res = await runAxiosAsync<{ product: Product }>(
        authClient.get(`/product/detail/${id}`),
      );
      if (res) {
        setProduct(res.product);
      }
    } catch (error) {
      console.log("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  const onChatBtnPress = async () => {
    try {
      if(!product) return;
      setFetchChatId(true);
      const res = await runAxiosAsync<{ conversationId: string }>(
        authClient.get(`conversation/with/` + product?.seller.id),
      );
      setFetchChatId(false);

      if (res) {
        router.push({
          pathname: "/chat-window",
          params: {
            conversationId: res.conversationId,
            peerProfile: JSON.stringify(product.seller),
          },
        });
      }
    } catch (error) {
      console.log("Error fetching product details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchProductDetail();
  }, [id]);

  if (loading) {
    return <LoadingSpinner visible={loading} />;
  }
  const isAdmin = authState.profile?.id === product?.seller.id;

  const confirmDelete = async () => {
    setLoading(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.delete("/product/" + id),
    );
    setLoading(false);
    if (res?.message) {
      dispatch(deleteItem(id));
      showMessage({ message: res.message, type: "success" });
      router.back();
    }
  };
  
  const fetchingChatId = () => {

  }

  const onDeletePress = () => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        {
          text: "Delete",
          style: "destructive",
          onPress: confirmDelete,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
    );
  };

  return (
    <>
      <View style={styles.container}>
        {/* render pressable icon  */}
        <Stack.Screen
          options={{
            headerShown: true,
            title: "Product Detail",
            headerRight: () =>
              isAdmin ? (
                <Pressable onPress={() => setShowMenu(true)}>
                  <Ionicons
                    name="ellipsis-vertical-sharp"
                    color={colors.primary}
                    size={20}
                  />
                </Pressable>
              ) : null,
          }}
        />
        {product ? (
          <ProductDetails product={product} />
        ) : (
          <Text>Product not found</Text>
        )}
        {!isAdmin && <ChatIcon onPress={onChatBtnPress} busy={fetchChatId}/>
}
        <OptionModal
          options={menuOptions}
          renderItem={({ icon, name }) => (  
            <View style={styles.option}>
              {icon}
              <Text style={styles.optionTitle}>{name}</Text>
            </View>
          )}
          visible={showMenu}
          onRequestClose={setShowMenu}
          onPress={(option) => {
            if (option.name === "Delete") {
              onDeletePress();
            }
            if (option.name === "Edit") {
              router.push({
                pathname: "/listings/[id]/edit",
                params: { id, product: JSON.stringify(product) },
              });
            }
          }}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  optionTitle: {
    paddingLeft: 5,
    color: colors.primary,
  },
});

export default ListingDetails;
