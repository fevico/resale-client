import { runAxiosAsync } from '@/api/axiosAsync';
import OptionModal from '@/components/OptionModal';
import ProductDetails from '@/components/ProductDetail';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useAuth from '@/hooks/useAuth';
import useClient from '@/hooks/useClient';
import { deleteItem, Product } from '@/store/listings';
import colors from '@/utils/colors';
import { Ionicons, AntDesign } from '@expo/vector-icons';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { FC, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { useDispatch } from 'react-redux';

interface Props {}

  const menuOptions = [
    {name: "Edit", icon: <Ionicons name="create-outline" color={colors.primary} size={20}/>, id: "edit"},
    {name: "Delete", icon: <Ionicons name="trash-outline" color={colors.primary} size={20}/>, id: "delete"}
  ]

const ListingDetails: FC<Props> = (props) => {
    const { id } = useLocalSearchParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const {authClient} = useClient()
    const {authState} = useAuth()
    const [showMenu, setShowMenu] = useState(false)
    const dispatch = useDispatch()

    const router = useRouter()

    const fetchProductDetail = async () => {
    try {
      setLoading(true);
      // Firing the individual product endpoint by its ID path parameter
      const res = await runAxiosAsync<{ product: Product }>(
        authClient.get(`/product/detail/${id}`)  
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

  useEffect(() => {
    if (id) fetchProductDetail();
  }, [id]);

  if(loading){
    return <LoadingSpinner visible={loading}/>
  }
  const isAdmin = authState.profile?.id === product?.seller.id;

  const confirmDelete = async () => { 
    setLoading(true)
    const res = await runAxiosAsync<{message: string}>(authClient.delete("/product/"+ id))
    setLoading(false)
    if(res?.message){
        dispatch(deleteItem(id))
        showMessage({message: res.message, type: "success"})
        router.back()
    }
  }

  const onDeletePress = () => {
    Alert.alert("Delete Product", "Are you sure you want to delete this product?", [
      {
        text: "Delete",
        style: "destructive",
        onPress: confirmDelete
      },
      {
        text: "Cancel",
        style: "cancel"
      }
    ])
  }

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
                <Ionicons name="ellipsis-vertical-sharp" color={colors.primary} size={20} />
              </Pressable>
            ) : null,
        }} 
      />
      {product ? <ProductDetails product={product} /> : <Text>Product not found</Text>}
      <Pressable onPress={() => router.push('/chat-window')} style={styles.messageBtn}>
        <AntDesign name="message" size={20} color={colors.white} />
      </Pressable>

      <OptionModal options={menuOptions} renderItem={({icon, name}) => <View style={styles.option}>
        {icon}
        <Text style={styles.optionTitle}>{name}</Text>
      </View>} 
      visible={showMenu}
      onRequestClose={setShowMenu}
      onPress={(option) => {
        if(option.name === "Delete"){
            onDeletePress()
        }
      }}
      />
    </View>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  option:  {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10
  },
  optionTitle: {
    paddingLeft: 5,
    color: colors.primary,
  },
  messageBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.active,
    justifyContent: 'center',
    alignItems: 'center',
    position: "absolute",
    bottom: 60,
    right: 50
  },
});

export default ListingDetails