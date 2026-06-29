import FormInput from '@/components/ui/FormInput'
import { useRouter } from 'expo-router'
import { FC, useState } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/utils/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from '@/components/ui/DatePicker';
import OptionModal from '@/components/OptionModal';
import categories from '@/utils/categories';
import CategoryOption from '@/components/ui/CategoryOption';
import AppButton from '@/components/ui/AppButton';

interface Props {

}

const NewListing: FC<Props> = (props) => {
    const router = useRouter()
    const [showCategoryModal, setShowCategoryModal] = useState(false)

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}> 
    <Pressable style={styles.fileSelector}>
        <View style={styles.iconContainer}>
        <Ionicons name="images" size={24} color="black" />
        </View>
     <Text style={styles.btnTitle}>Add Images</Text>
    </Pressable>
      <FormInput placeholder='product Name'/>
      <FormInput placeholder='Price'/>
      <DatePicker title="Purchasing Date: " value={new Date()} onChange={() => {}}/>
       <Pressable style={styles.categorySelector} onPress={() => setShowCategoryModal(true)}>
        <Text style={styles.categoryTitle}>Category</Text>
       </Pressable>

      <FormInput placeholder='Description' multiline numberOfLines={4}/>

      <AppButton title='List product'/>
      <OptionModal  
      visible={showCategoryModal}
      onRequestClose={setShowCategoryModal}
      options={categories}
      renderItem={(item) => {
        return <CategoryOption {...item} />
      }}
      onPress={(item) => {
        console.log(item)
      }}
      />
    </View>
    </SafeAreaView>
  )
}

export default NewListing

const styles = StyleSheet.create({
  container: {
   padding: 15,
   flex: 1
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
  }
});