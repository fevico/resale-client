import { runAxiosAsync } from '@/api/axiosAsync';
import HorizontalImageList from '@/components/HorizontalImagelist';
import OptionModal from '@/components/OptionModal';
import AppButton from '@/components/ui/AppButton';
import CategoryOption from '@/components/ui/CategoryOption';
import DatePicker from '@/components/ui/DatePicker';
import FormInput from '@/components/ui/FormInput';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import useClient from '@/hooks/useClient';
import categories from '@/utils/categories';
import colors from '@/utils/colors';
import { newProductSchema, yupValidate } from '@/utils/validation';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as ImagePicker from "expo-image-picker";
import { useRouter } from 'expo-router';
import mime from "mime";
import { FC, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { showMessage } from 'react-native-flash-message';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props {

}

const defaultInfo = {
  name: "",
  description: "",
  category: "",
  price: "",
  purchasingDate: new Date()
}

const imageOptions = [{value: "Remove Image", id: "remove"}]

const NewListing: FC<Props> = (props) => {
    const router = useRouter()
    const [showCategoryModal, setShowCategoryModal] = useState(false)
    const [showImageOptions, setShowImageOptions] = useState(false)
    const [productInfo, setProductInfo] = useState({...defaultInfo})
    const [images, setImages] = useState<string[]>([])
    const [selectedImage, setSelectedImage] = useState("")
    const [busy, setBusy] = useState(false)
    const {authClient} = useClient()

    const {category, description,  name, price, purchasingDate} = productInfo

      const handleChange = (name: string) => (text: string) => {
          setProductInfo({...productInfo, [name]: text})
    }

    const handleSubmit = async() => {
     const {error} = await yupValidate(newProductSchema, productInfo)
     if(error) return showMessage({message: error, type: "danger"})

      setBusy(true)
      const formData = new FormData()
      type productInfoKeys = keyof typeof productInfo
      for (let key in productInfo){
        const value =  productInfo[key as productInfoKeys]
        if(value instanceof Date) formData.append(key, value.toDateString())
        else formData.append(key, value)
      }
      // appending images
      const newImages = images.map((img, index) => ({
        name: "image_"+ index,
        type: mime.getType(img),
        uri: img
      }))

      for(let img of newImages){
        formData.append("images", img as any);
      }

     const res = await runAxiosAsync<{message: string}>(authClient.post('/product/list', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }))

      setBusy(false)

      if(res){
        showMessage({message: res.message, type: "success"})
        setProductInfo({...defaultInfo})
        setImages([])
      }    
    }

    const handleOnImageSelection = async() => {
      try {
       const {assets} = await ImagePicker.launchImageLibraryAsync({
          allowsEditing: false,
          mediaTypes: ['images'],
          quality: 0.3,
          allowsMultipleSelection: true
        })
        if(!assets) return 
       const imageUris = assets.map(({uri}) => uri)
       setImages((prevImages) => [...prevImages, ...imageUris])
      } catch (error) {
      showMessage({message: (error as any).message, type: "danger"})
      }
    }  

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}> 
    <View style={styles.imageContainer}>
    <Pressable onPress={handleOnImageSelection} style={styles.fileSelector}>
        <View style={styles.iconContainer}>
        <Ionicons name="images" size={24} color="black" />
        </View>
     <Text style={styles.btnTitle}>Add Images</Text>
    </Pressable>

    <HorizontalImageList images={images}
     onLongPress={(img) => {
      setSelectedImage(img)
      setShowImageOptions(true)
    }}/>

      </View>

      <FormInput value={name} placeholder='product Name' onChangeText={handleChange("name")}/>
      <FormInput value={price} placeholder='Price' keyboardType='numeric' onChangeText={handleChange("price")}/>
      <DatePicker title="Purchasing Date: " value={purchasingDate} onChange={(purchasingDate) => setProductInfo({...productInfo, purchasingDate})}/>

       <Pressable style={styles.categorySelector} onPress={() => setShowCategoryModal(true)}>
        <Text style={styles.categoryTitle}>{category || "Category"}</Text>
       </Pressable>

      <FormInput value={description} placeholder='Description' onChangeText={handleChange("description")} multiline numberOfLines={4}/>

      <AppButton title='List product' onPress={handleSubmit}/>

      <OptionModal
      visible={showCategoryModal}
      onRequestClose={setShowCategoryModal}
      options={categories}
      renderItem={(item) => {
        return <CategoryOption {...item}/>
      }}
      onPress={(item) => {
        setProductInfo({...productInfo, category:  item.name})
      }}
      />


      {/* image options */}
      <OptionModal
      visible={showImageOptions}
      onRequestClose={setShowImageOptions}
      options={imageOptions}
      renderItem={(item) => {
        return <Text style={styles.imageOption}>{item.value}</Text>
      }}
      onPress={(option) => {
        if(option.id === "remove"){
        const newImages = images.filter(img => img !==  selectedImage)
        setImages([...newImages])
        }
      }}
      />
    </View>
    <LoadingSpinner visible={busy}/>
    </SafeAreaView>
  )
}

export default NewListing

const styles = StyleSheet.create({
  container: {
   padding: 15,
   flex: 1
  },
  imageContainer: {
    flexDirection: "row"
  },
  selectedImages: {
    width: 70,
    height: 70,
    borderRadius: 7,
    marginLeft: 5
  },
  safeArea: {
    flex: 1,
    padding: 10
  },
  fileSelector: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
    alignSelf: "flex-start"
  },
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 70,
    height: 70,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 7
  },
  btnTitle: {
    color: colors.primary,
    marginTop: 5
  },
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
     width: "100%",
        marginBottom: 15,
        padding: 8,
        borderWidth: 1,
        borderColor: colors.deActive,
        borderRadius: 5
  },
  categoryTitle: {
    color: colors.primary
  },
  imageOption: {fontWeight: "600", fontSize: 18, color: colors.primary, padding: 10}
});