// import { runAxiosAsync } from "@/api/axiosAsync";
// import CategoryList from "@/components/CategoryList";
// import LatestProductList, {
//   LatestProduct,
// } from "@/components/LatestProductList";
// import SearchBar from "@/components/SearchBar";
// import ChatNotification from "@/components/ui/ChatNotification";
// import useAuth from "@/hooks/useAuth";
// import useClient from "@/hooks/useClient";
// import socket, { handleSocketConnection } from "@/socket";
// import size from "@/utils/size";
// import { useRouter } from "expo-router";
// import { FC, useEffect, useState } from "react";
// import { ScrollView, StyleSheet } from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
// import { useDispatch } from "react-redux";

// interface Props {}

// const Home: FC<Props> = (props) => {
//   const [products, setProducts] = useState<LatestProduct[]>([]);
//   const { authClient } = useClient();
//   const router = useRouter();
//   const { authState } = useAuth();
//   const dispatch = useDispatch()

//   const onChatPress = () => {
//     router.push("/chats");
//   };

//   const latestProduct = async () => {
//     const res = await runAxiosAsync<{ products: LatestProduct[] }>(
//       authClient.get("/product/latest"),
//     );
//     if (res?.products) {
//       setProducts(res.products);
//     }
//   };

//   useEffect(() => {
//     latestProduct();
//   }, []);

//   useEffect(() => {
//     if(authState.profile)
//     handleSocketConnection(authState.profile, dispatch);
//     return () => {
//       socket.off("connect", () => {
//         console.log("connected:", socket.connected);
//       });
//     socket.off("disconnect", () => {
//         console.log("disconnected", socket.connected);
//       });
//     socket.off("connect_error", (error) => {
//       console.log("Error in socket", error.message);
//     });
//       socket.disconnect();
//     };
//   }, []);

//   return (
//     <>
//       <SafeAreaView style={styles.safeArea}>
//         <ChatNotification onPress={onChatPress} />
//         <ScrollView style={styles.container}>
//           <SearchBar />
//           <CategoryList
//             onPress={(category) =>
//               router.push({
//                 pathname: "/by-category/[category]",
//                 params: { category },
//               })
//             }
//           />
//           <LatestProductList
//             data={products}
//             onPress={({ id }) => router.push(`/listings/${id}`)}
//           />
//         </ScrollView>
//       </SafeAreaView>
//     </>
//   );
// };

// export default Home;

// const styles = StyleSheet.create({
//   container: {
//     padding: size.padding,
//     flex: 1,
//   },
//   safeArea: { flex: 1 },
// });



import { runAxiosAsync } from "@/api/axiosAsync";
import CategoryList from "@/components/CategoryList";
import LatestProductList, {
  LatestProduct,
} from "@/components/LatestProductList";
import SearchBar from "@/components/SearchBar";
import ChatNotification from "@/components/ui/ChatNotification";
import useAuth from "@/hooks/useAuth";
import useClient from "@/hooks/useClient";
import socket, { handleSocketConnection } from "@/socket";
import size from "@/utils/size";
import { useRouter } from "expo-router";
import { FC, useEffect, useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

interface Props {}

const Home: FC<Props> = (props) => {
  const [products, setProducts] = useState<LatestProduct[]>([]);
  const { authClient } = useClient();
  const router = useRouter();
  const { authState } = useAuth();
  const dispatch = useDispatch();

  const onChatPress = () => {
    router.push("/chats");
  };

  const latestProduct = async () => {
    // Safe check to prevent state updates if request resolves after unmount
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

  useEffect(() => {
    if (authState.profile) {
      handleSocketConnection(authState.profile, dispatch);
    }

    return () => {
      // ✅ FIX: Cleanly remove all generic listeners attached to socket lifecycle
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [authState.profile]); // Added authState.profile dependency

  return (
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