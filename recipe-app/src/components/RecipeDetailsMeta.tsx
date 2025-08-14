import React from "react";
import { View, Text, StyleSheet } from "react-native";

type RecipeDetailsMeta = {
  prep_time: number;
  servings: number;
  created_at: string;
  description?: string | null;
};

type RecipeDetailsMetaProps = {
  recipeInfo: RecipeDetailsMeta;
};

const LABELS: { key: keyof RecipeDetailsMeta; label: string }[] = [
  { key: "prep_time", label: "Prep Time" },
  { key: "servings", label: "Servings" },
  { key: "created_at", label: "Created At" },
  { key: "description", label: "Description" },
];

// Helper to trim nanoseconds/microseconds to milliseconds
const sanitizeIsoDate = (dateStr: string) =>
  dateStr.replace(/(\.\d{3})\d+Z$/, "$1Z");

const RecipeDetailsMeta = ({ recipeInfo }: RecipeDetailsMetaProps) => {
  const displayItems = LABELS.map(({ key, label }) => {
    const value = recipeInfo[key];

    if (key === "created_at" && value != null) {
      const cleanDateStr = sanitizeIsoDate(String(value));
      const date = new Date(cleanDateStr);
      return {
        label,
        value: date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
    }

    return { label, value };
  }).filter(
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
    alignSelf: "baseline",
    marginLeft: 15,
    marginVertical: 10,
    width: "65%",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    flex: 1,
    fontSize: 14,
    fontWeight: "bold",
  },
  value: {
    flex: 2,
    fontSize: 14,
  },
});

export default RecipeDetailsMeta;
