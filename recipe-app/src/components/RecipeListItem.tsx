import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import Silverware from "../../assets/images/flatware.svg";
export type RecipeListItemData = {
  id: string;
  name: string;
};

export type RecipeListItemProps = {
  item: RecipeListItemData;
  onPress: () => void;
  backgroundColor?: string;
  textColor?: string;
};

const RecipeListItem = ({
  item,
  onPress,
  backgroundColor = "#fff",
  textColor = "#000",
}: RecipeListItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, { backgroundColor }]}
    >
      <Silverware width={40} height={40} />
      <Text style={[styles.name, { color: textColor }]}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export { RecipeListItem };

const styles = StyleSheet.create({
  item: {
    flex: 1,
    width: "90%",
    padding: 10,
    borderWidth: 1,
    borderRadius: 16,
    alignSelf: "center",
    flexDirection: "row",
  },
  name: {
    fontFamily: "PoiretOne",
    fontSize: 32,
    marginLeft: 10,
    alignSelf: "flex-start",
  },
});
