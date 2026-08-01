import colors from "@/utils/colors";
import Feather from "@expo/vector-icons/Feather";
import { FC } from "react";
import { StyleSheet, TextInput, View } from "react-native";

interface Props {}

const SearchBar: FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      <Feather name="search" size={24} color={colors.primary} />
      <TextInput placeholder="Search here..." style={styles.textInput} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: colors.primary,
    padding: 5
  },
  textInput: {
    paddingLeft: 10,
    flex: 1,
    color: colors.primary,
    fontSize: 14,
  },
});

export default SearchBar;
