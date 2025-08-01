import React from "react";
import { StatusBar, StyleSheet, Text, TouchableOpacity } from "react-native";

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
      <Text style={[styles.name, { color: textColor }]}>{item.name}</Text>
    </TouchableOpacity>
  );
};

export { RecipeListItem };

const styles = StyleSheet.create({
  item: {
    width: "90%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 16,
  },
  name: {
    fontSize: 32,
  },
});
