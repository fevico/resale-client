import { runAxiosAsync } from "@/api/axiosAsync";
import ProfileOptionListItem from "@/components/ProfileOptionListItem";
import AvatarView from "@/components/ui/AvatarView";
import FormDivider from "@/components/ui/FormDivider";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import useAuth from "@/hooks/useAuth";
import useClient from "@/hooks/useClient";
import { updateAuthState } from "@/store/auth";
import colors from "@/utils/colors";
import { selectImages } from "@/utils/helper";
import size from "@/utils/size";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import mime from "mime";
import { FC, useState } from "react";
import {
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { showMessage } from "react-native-flash-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch } from "react-redux";

interface Props {}

type ProfileRes = {
  profile: {
    id: string;
    name: string;
    email: string;
    verified: boolean;
    avatar?: string;
  };
};

const Profile: FC<Props> = (props) => {
  const router = useRouter();
  const { authState, signOut } = useAuth();
  const { profile } = authState;
  const [userName, setUserName] = useState(profile?.name || "");
  const [busy, setBusy] = useState(false);
  const [updatingAvatar, setUpdatingAvatar] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { authClient } = useClient();
  const dispatch = useDispatch();

  const isNameChanged = profile?.name !== userName && userName.length >= 3;

  const onMessagePress = () => {
    router.push("/chats");
  };

  const onListingPress = () => {
    router.push("/listings");
  };

  const fetchProfile = async () => {
    setRefreshing(true)
     const res = await runAxiosAsync<{ profile: ProfileRes }>(
      authClient.get("/auth/profile"),
    );
    setRefreshing(false)
    if(res){
      dispatch(updateAuthState({profile: {...profile!, ...res.profile}, pending: false}))
    }
  };

  const updateProfile = async () => {
    const res = await runAxiosAsync<{ profile: ProfileRes }>(
      authClient.patch("/auth/update-profile", { name: userName }),
    );
    if (res) {
      showMessage({ message: "Name updated successfully", type: "success" });
      dispatch(
        updateAuthState({
          pending: false,
          profile: { ...profile!, ...res.profile },
        }),
      );
    }
  };

  const getVerificationLink = async () => {
    setBusy(true);
    const res = await runAxiosAsync<{ message: string }>(
      authClient.get("/auth/verify-token"),
    );
    setBusy(false);
    if (res) {
      showMessage({ message: res.message, type: "success" });
    }
  };

  const handleProfileImageSelection = async () => {
   const [image] = await selectImages({allowsMultipleSelection: false, allowsEditing: true, aspect: [1, 1]})
   if(image){
    const formData = new FormData()
    formData.append("avatar", {name: "Avatar", uri: image, type: mime.getType(image)} as any)
    setUpdatingAvatar(true)
    const res = await runAxiosAsync<ProfileRes>(authClient.patch("/auth/update-avatar", formData))
    setUpdatingAvatar(false)
    if(res){
      dispatch(updateAuthState({profile: {...profile!, ...res.profile}, pending: false}))
    }
   }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fetchProfile} />} >
      <SafeAreaView>
        {!profile?.verified && (
          <View style={styles.verificationLinkContainer}>
            <Text style={styles.verificationTitle}>
              It looks like your profile is not verified.
            </Text>
            {busy ? (
              <Text
                style={styles.verificationLink}
              >
                Please wait...
              </Text>
            ) : (
              <Text
                style={styles.verificationLink}
                onPress={getVerificationLink}
              >
                Tap here to get the link.
              </Text>
            )}
          </View>
        )}
        {/* profile image */}
        <View style={styles.profileContainer}>
          <AvatarView uri={profile?.avatar} size={80} onPress={handleProfileImageSelection}/>

          <View style={styles.profileInfo}>
            <View style={styles.nameContainer}>
              <TextInput
                style={styles.name}
                value={userName}
                onChangeText={(text) => setUserName(text)}
              />
              {isNameChanged && (
                <Pressable onPress={updateProfile}>
                  <AntDesign name="check" size={24} color={colors.primary} />
                </Pressable>
              )}
            </View>
            <Text style={styles.email}>{profile?.email}</Text>
          </View>
        </View>

        <FormDivider />
        {/* options for profile */}
        <ProfileOptionListItem
          style={styles.marginBottom}
          active={true}
          antIconName="message"
          title="Messages"
          onPress={onMessagePress}
        />
        <ProfileOptionListItem
          style={styles.marginBottom}
          antIconName="appstore"
          title="Your Listings"
          onPress={onListingPress}
        />
        <ProfileOptionListItem
          antIconName="logout"
          title="Log Out"
          onPress={signOut}
        />
      </SafeAreaView>
      <LoadingSpinner visible={updatingAvatar} />
    </ScrollView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  verificationLinkContainer: {
    padding: 10,
    backgroundColor: colors.deActive,
    marginVertical: 10,
    borderRadius: 5,
  },
  verificationTitle: {
    fontWeight: "600",
    color: colors.primary,
    textAlign: "center",
  },
  verificationLink: {
    fontWeight: "600",
    color: colors.active,
    textAlign: "center",
    paddingTop: 5,
  },
  container: {
    padding: size.padding,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileInfo: {
    flex: 1,
    paddingLeft: size.padding,
  },
  name: {
    color: colors.primary,
    fontSize: 20,
    fontWeight: "bold",
  },
  email: {
    color: colors.primary,
    paddingTop: 2,
  },
  marginBottom: {
    marginBottom: 15,
  },
  nameContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
