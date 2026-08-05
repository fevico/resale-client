import colors from "@/utils/colors";
import { AntDesign } from "@expo/vector-icons";
import LottieView from "lottie-react-native";
import { FC } from "react";
import { Pressable, StyleSheet, View } from "react-native";

interface Props {
  onPress?(): void;
  busy?: boolean;
}

const ChatIcon: FC<Props> = ({ onPress, busy }) => {
  if (busy)
    return (
      <View style={styles.common}>
        <View style={styles.flex1}>
          <LottieView
            style={styles.flex1}
            source={require("../../assets/loading_2.json")}
            autoPlay
            loop
          />
        </View>
      </View>
    );
  return (
    <Pressable onPress={onPress} style={[styles.common, styles.messageBtn]}>
      <AntDesign name="message" size={20} color={colors.white} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  common: {
    width: 50,
    bottom: 60,
    right: 50,
    height: 50,
    position: "absolute",
  },
  messageBtn: {
    borderRadius: 25,
    backgroundColor: colors.active,
    justifyContent: "center",
    alignItems: "center",
  },
  flex1: {
    flex: 1,
  },
});

export default ChatIcon;
