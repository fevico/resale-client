import colors from "@/utils/colors";
import { AntDesign } from "@expo/vector-icons";
import { FC } from "react";
import { Pressable, StyleSheet, Text } from "react-native";

interface Props {
    onPress?(): void
    title: string
}

const OptionsSelector: FC<Props> = ({onPress, title}) => {
  return (
    <Pressable
      style={styles.categorySelector}
      onPress={onPress}
    >
      <Text style={styles.categoryTitle}>{title}</Text>
      <AntDesign name="caret-down" color={colors.primary}/>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {},
  categorySelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 15,
    padding: 8,
    borderWidth: 1,
    borderColor: colors.deActive,
    borderRadius: 5,
  },
  categoryTitle: {
    color: colors.primary,
  },
});

export default OptionsSelector;
