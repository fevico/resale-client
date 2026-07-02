import ProfileOptionListItem from '@/components/ProfileOptionListItem'
import AvatarView from '@/components/ui/AvatarView'
import FormDivider from '@/components/ui/FormDivider'
import useAuth from '@/hooks/useAuth'
import colors from '@/utils/colors'
import size from '@/utils/size'
import { useRouter } from 'expo-router'
import { FC } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface Props {

}

const Profile: FC<Props> = (props) => {
    const router = useRouter()
    const {authState} = useAuth()
    const  {profile} = authState

    const onMessagePress = () => {
      router.push("/chats")
    }

    const onListingPress = () => {
      router.push("/listings")
    }

  return (
    <ScrollView contentContainerStyle={styles.container}>
    <SafeAreaView>
      {/* profile image */}
      <View style={styles.profileContainer}>
        <AvatarView uri={profile?.avatar} size={80} />

        <View style={styles.profileInfo}>
          <Text style={styles.name}>{profile?.name}</Text>
          <Text style={styles.email}>{profile?.email}</Text>
        </View>
      </View>

      <FormDivider/>  
      {/* options for profile */}
      <ProfileOptionListItem style={styles.marginBottom} active={true} antIconName="message" title="Messages" onPress={onMessagePress} />
      <ProfileOptionListItem style={styles.marginBottom} antIconName="appstore" title="Your Listings" onPress={onListingPress} />
      <ProfileOptionListItem antIconName="logout" title="Log Out" />
    </SafeAreaView>
    </ScrollView>
  )
}

export default Profile

const styles = StyleSheet.create({
  container: {
    padding: size.padding,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    paddingLeft: size.padding
  },
  name: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    color: colors.primary,
    paddingTop: 2
  },
  marginBottom: {
    marginBottom: 15
  }
});