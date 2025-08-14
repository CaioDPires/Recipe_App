import RecipeInfo from "@/src/components/RecipeInfo";
import { BASE_URL } from "@/src/constants";
import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";

export interface Recipe {
  id: string;
  description?: string | null;
  steps: string;
  prep_time: number;
  servings: number;
  image_url?: string | null;
  created_at: string;
  ingredients: string[];
}

type RecipeIndexProps = {
  id: string;
};

function RecipeIndex({ id }: RecipeIndexProps) {
  const [isLoading, setLoading] = useState<boolean>(true);
  const [recipeData, setRecipeData] = useState<Recipe>();

  const getRecipe = async () => {
    try {
      const response = await fetch(`${BASE_URL}recipe/${id}`);
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
    <View>
      {/* Other details like image, title, etc. */}

      {/* Pass only the props RecipeInfo needs */}
      <RecipeInfo
        recipeInfo={{
          prep_time: recipeData.prep_time,
          servings: recipeData.servings,
          created_at: recipeData.created_at,
          description: recipeData.description,
        }}
      />

      {/* You could also pass the whole recipeData if RecipeInfo supports it */}
    </View>
  );
}

export default RecipeIndex;
