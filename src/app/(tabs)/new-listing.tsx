import FormInput from '@/components/ui/FormInput'
import { useRouter } from 'expo-router'
import React, { FC } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '@/utils/colors';
import { SafeAreaView } from 'react-native-safe-area-context';
import DatePicker from '@/components/ui/DatePicker';


interface Props {

}

const NewListing: FC<Props> = (props) => {
    const router = useRouter()
  return (
    <SafeAreaView>
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
      <FormInput placeholder='Description'/>
    </View>
    </SafeAreaView>
  )
}

export default NewListing

const styles = StyleSheet.create({
  container: {
   padding: 15,
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
  }
});