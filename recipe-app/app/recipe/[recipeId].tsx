import RecipeDetailsMeta from "@/src/components/RecipeDetailsMeta";
import { BASE_URL } from "@/src/constants";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, useWindowDimensions } from "react-native";

export interface Recipe {
  id: string;
  title: string;
  description?: string | null;
  steps: string;
  prep_time: number;
  servings: number;
  image_url?: string | null;
  created_at: string;
  ingredients: string[];
}

function RecipeIndex() {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [recipeData, setRecipeData] = useState<Recipe>();
  const { recipeId } = useLocalSearchParams();
  const getRecipe = async () => {
    try {
      console.log(recipeId);
      const response = await fetch(`${BASE_URL}recipe/${recipeId}`);
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Error fetching recipe: ${response.status} - ${errorText}`
        );
        return;
      }
      const recipe: Recipe = await response.json();
      setRecipeData(recipe);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecipe();
  }, []);

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!recipeData) {
    return <Text>Recipe not found.</Text>;
  }

  return (
    <>
      <View style={styles.titleWrapper}>
        <Text style={styles.title}>{recipeData.title}</Text>
      </View>

      {/* Pass only the props RecipeInfo needs */}
      <RecipeDetailsMeta
        recipeInfo={{
          prep_time: recipeData.prep_time,
          servings: recipeData.servings,
          created_at: recipeData.created_at,
          description: recipeData.description,
        }}
      />
      
    </>
  );
}

const styles = StyleSheet.create({
  titleWrapper: {
    margin: 15,
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  
});

export default RecipeIndex;
