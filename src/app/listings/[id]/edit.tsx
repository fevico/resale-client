import HorizontalImageList from "@/components/HorizontalImagelist";
import OptionsSelector from "@/components/OptionsSelector";
import DatePicker from "@/components/ui/DatePicker";
import FormInput from "@/components/ui/FormInput";
import colors from "@/utils/colors";
import size from "@/utils/size";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { FC } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

interface Props {}

const editProduct: FC<Props> = (props) => {
  const { id, product: productString } = useLocalSearchParams<{
    id: string;
    product?: string;
  }>();
  const productToEdit = productString ? JSON.parse(productString) : null;
  console.log("products", productToEdit)

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Images</Text>
        <HorizontalImageList images={productToEdit.images || []} />
        <Pressable style={styles.imageSelector}>
          <Ionicons name="images" size={30} color={colors.primary} />
        </Pressable>
        <FormInput placeholder="Product name" value={productToEdit.name} />
        <FormInput
          placeholder="Price"
          keyboardType="numeric"
          value={productToEdit.price.toString()}
        />
        <DatePicker
          value={new Date(productToEdit.date)}
          title="Purchasing Date"
          onChange={() => {}}
        />
        <OptionsSelector
          title={productToEdit.category || "Category"}
        />
        <FormInput
          placeholder="Description"
          value={productToEdit.description}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: size.padding,
  },
  title: {
    fontWeight: "600",
    fontSize: 16,
    color: colors.primary,
    marginBottom: 10,
  },
  imageSelector: {
    height: 70,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 7,
    borderColor: colors.primary,
    marginVertical: 10,
  },
});

export default editProduct;
