import React from "react";
import { View, Text, StyleSheet } from "react-native";

type RecipeInfo = {
  prep_time?: number;
  servings?: number;
  created_at?: string;
  description?: string | null;
};

type RecipeInfoProps = {
  recipeInfo: RecipeInfo;
};

const LABELS: { key: keyof RecipeInfo; label: string }[] = [
  { key: "prep_time", label: "Prep Time" },
  { key: "servings", label: "Servings" },
  { key: "created_at", label: "Created At" },
  { key: "description", label: "Description" },
];

const RecipeInfo = ({ recipeInfo }: RecipeInfoProps) => {
  const displayItems = LABELS
    .map(({ key, label }) => ({
      label,
      value: recipeInfo[key],
    }))
    .filter(
      (item) =>
        item.value !== null &&
        item.value !== undefined &&
        String(item.value).trim() !== ""
    );

  return (
    <View style={styles.container}>
      {displayItems.map((item) => (
        <View style={styles.row} key={item.label}>
          <Text style={styles.label}>{item.label}</Text>
          <Text style={styles.value}>{String(item.value)}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center", // center it horizontally
    marginVertical: 10,
    width: "80%", // optional, to keep it narrower than the full screen
  },
  row: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    flex: 1,
    fontWeight: "bold",
  },
  value: {
    flex: 2,
  },
});

export default RecipeInfo;
