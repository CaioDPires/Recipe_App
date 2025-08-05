import RecipeList from "@/src/components/RecipeList";
import { RecipeListItemData } from "@/src/components/RecipeListItem";
import { useTheme } from "@/src/themes/ThemeContext";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TextInput, View } from "react-native";

const BASE_URL = "http://192.168.1.12:8080/";
export default function Index() {
  const [isLoading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { theme } = useTheme();
  const [data, setData] = useState<RecipeListItemData[] | null>(null);

  const getRecipes = async () => {
    try {
      const response = await fetch(BASE_URL + "recipes",{ signal: AbortSignal.timeout(5000) }) ;
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Error fetching recipes: ${response.status} - ${errorText}`
        );
        return; 
      }
      const json = await response.json()
      const mapped = json.map((r: any) => ({
        id: r.id,
        name: r.title, 
        fullData: r,
      }));
      setData(mapped);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getRecipes();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: theme.background, color: theme.primary },
          ]}
          placeholder="Search Here"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <View style={[styles.container, {width: '100%'}]}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.primary} />
        ) : (
          <RecipeList
            data={data}
            onItemPress={() => {
              return null;
            }}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    height: 60,
    width: "90%",
    padding: 8,
    margin: 20,
  },
});
