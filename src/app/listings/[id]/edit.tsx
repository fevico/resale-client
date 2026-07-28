import { runAxiosAsync } from "@/api/axiosAsync";
import CategoryOptions from "@/components/CategoryOptions";
import HorizontalImageList from "@/components/HorizontalImagelist";
import OptionModal from "@/components/OptionModal";
import AppButton from "@/components/ui/AppButton";
import DatePicker from "@/components/ui/DatePicker";
import FormInput from "@/components/ui/FormInput";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useClient from "@/hooks/useClient";
import colors from "@/utils/colors";
import { selectImages } from "@/utils/helper";
import size from "@/utils/size";
import { newProductSchema, yupValidate } from "@/utils/validation";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import mime from "mime";
import { FC, useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { showMessage } from "react-native-flash-message";
import deepEqual from "deep-equal"

interface Props {}

type ProductInfo = {
  name: string;
  description: string;
  category: string;
  price: string;
  purchasingDate: string;
};

const imageOptions = [
  { value: "Use as Thumbnail", id: "thumb" },
  { value: "Remove image", id: "remove" },
];

const EditProduct: FC<Props> = (props) => {
  const [selectedImage, setSelectedImage] = useState("");
  const [busy, setBusy] = useState(false);
  const [showImageOption, setShowImageOption] = useState(false);
  const { authClient } = useClient();

    const { id, product: productString } = useLocalSearchParams<{
    id: string;
    product?: string;
  }>();
  // Initialize state cleanly
  const initialProduct = productString ? JSON.parse(productString) : null;
  const [product, setProduct] = useState(initialProduct);

  const isFormChanged = deepEqual(initialProduct, product)

  const onLongPress = (image: string) => {
    setSelectedImage(image);
    setShowImageOption(true);
  };

  // ✅ FIX: Remove image from BOTH backend AND local component state
  const removeSelectedImage = async () => {
    const isCloudinaryImage = selectedImage.startsWith(
      "https://res.cloudinary.com",
    );

    const image = product.images;
    const newImages = image?.filter((img: any) => img !== selectedImage);
    setProduct({ ...product, image: newImages });
    if (isCloudinaryImage) {
      const splittedItems = selectedImage.split("/");
      const imageId = splittedItems[splittedItems.length - 1].split(".")[0];
      await runAxiosAsync<{ message: string }>(
        authClient.delete(`/product/image/${id}/${imageId}`),
      );
    }

    // Update local state array so the image disappears from the UI immediately!
    setProduct((prev: any) => ({
      ...prev,
      images: prev.images.filter((img: string) => img !== selectedImage),
    }));

    setShowImageOption(false);
  };

  // ✅ FIX: Functional state update for newly selected image URIs
  const handleOnImageSelect = async () => {
    const newImages = await selectImages();
    if (newImages.length) {
      setProduct((prev: any) => ({
        ...prev,
        images: [...(prev?.images || []), ...newImages],
      }));
    }
  };

  const makeSelectedImageAsThumbnail = () => {
    if (selectedImage.startsWith("https://res.cloudinary.com")) {
      setProduct({ ...product, thumbnail: selectedImage });
    }
  };

  const handleOnSubmit = async () => {
    const dataToUpdate: ProductInfo = {
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      purchasingDate: product.date,
    };

    const { error } = await yupValidate(newProductSchema, dataToUpdate);
    if (error) return showMessage({ message: error, type: "danger" });
    const formData = new FormData();

    if (product.thumbnail) {
      formData.append("thumbnail", product.thumbnail);
    }
    type productInfoKeys = keyof typeof dataToUpdate;
    for (let key in dataToUpdate) {
      const value = dataToUpdate[key as productInfoKeys];
      formData.append(key, value);
    }

    product.images?.forEach((img: any, index: number) => {
      if (!img.startsWith("https://res.cloudinary.com"))
        formData.append("images", {
          uri: img,
          name: "image_" + index,
          type: mime.getType(img),
        } as any);
    });
    // send data to the backend
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.patch("/product/" + product.id, formData, {
        headers: {
          "Content-Type": 'multipart/form-data'
        }
      }),
    );
    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };

  if (!product) {
    return (
      <View style={styles.container}>
        <Text>Loading product information...</Text>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Images</Text>

          {/* Renders live product images array */}
          <HorizontalImageList
            images={product.images || []}
            onLongPress={onLongPress}
          />

          <Pressable onPress={handleOnImageSelect} style={styles.imageSelector}>
            <Ionicons name="images" size={30} color={colors.primary} />
          </Pressable>

          {/* Product Name Input */}
          <FormInput
            placeholder="Product name"
            value={product.name || ""}
            onChangeText={(name) =>
              setProduct((prev: any) => ({ ...prev, name }))
            }
          />

          {/* Price Input - Converts to string for editing without freezing */}
          <FormInput
            placeholder="Price"
            keyboardType="numeric"
            value={product.price !== undefined ? String(product.price) : ""}
            onChangeText={(price) =>
              setProduct((prev: any) => ({ ...prev, price }))
            }
          />

          {/* Date Picker */}
          <DatePicker
            value={product.date ? new Date(product.date) : new Date()}
            title="Purchasing Date"
            onChange={(date) => setProduct((prev: any) => ({ ...prev, date }))}
          />

          {/* Category Selector */}
          <CategoryOptions
            onSelect={(category) => setProduct({ ...product, category })}
            title={product.category || "Category"}
          />

          {/* Description Input */}
          <FormInput
            placeholder="Description"
            value={product.description || ""}
            onChangeText={(description) =>
              setProduct((prev: any) => ({ ...prev, description }))
            }
          />
          {!isFormChanged && <AppButton title="Update Product" onPress={handleOnSubmit} />}
        </ScrollView>
      </View>

      <OptionModal
        options={imageOptions}
        visible={showImageOption}
        onRequestClose={setShowImageOption}
        renderItem={(option) => {
          return <Text style={styles.option}>{option.value}</Text>;
        }}
        onPress={({ id: actionId }) => {
          if (actionId === "thumb") makeSelectedImageAsThumbnail();
          if (actionId === "remove") {
            removeSelectedImage();
          }
        }}
      />
      <LoadingSpinner visible={busy} />
    </>
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
  option: {
    paddingVertical: 10,
    color: colors.primary,
  },
});

export default EditProduct;
