import React from "react";
import { Text, View } from "react-native";

type RecipeData = {
  id: string;
  title: string;
  description?: string;
  prep_time: number;
  servings: number;
  image_url?: string;
  created_at: Date;
  ingredients: string[];
};

type Props = {
  id: string;
};

function RecipeIndex(p: Props) {
  // const [isLoading, setLoading] = useState<Boolean>(false);
  // const [data, setData] = useState<RecipeData | null>(null);

  // const getRecipe = async () => {
  //     try {
  //   const response = await fetch(BASE_URL + "recipe/" + p.id);
  //   if (!response.ok) {
  //     const errorText = await response.text();
  //     console.error(
  //       `Error fetching recipes: ${response.status} - ${errorText}`
  //     );
  //     return;
  //   }
  //   const json = await response.json();
  //   const mapped = json.map((r: any) => ({
  //     id: r.id,
  //     name: r.title,
  //     fullData: r,
  //   }));
  //   setData(mapped);
  // } catch (error) {
  //   console.error(error);
  // } finally {
  //   setLoading(false);
  // }
  // };

  // useEffect(() => {
  //     getRecipe();
  //   }, []);

  return (
    <View>
      <Text>New page!</Text>
    </View>
  );
}

export default RecipeIndex;
