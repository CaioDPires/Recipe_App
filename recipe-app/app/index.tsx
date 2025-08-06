import RecipeList from "@/src/components/RecipeList";
import { RecipeListItemData } from "@/src/components/RecipeListItem";
import { useTheme } from "@/src/themes/ThemeContext";
import { AntDesign } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const BASE_URL = "http://192.168.15.189:8080/";

export default function Index() {
  const [isLoading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const { theme } = useTheme();
  const [data, setData] = useState<RecipeListItemData[] | null>(null);
  const [filteredData, setFilteredData] = useState<RecipeListItemData[]>([]);

  const getRecipes = async () => {
    try {
      const response = await fetch(BASE_URL + "recipes");
      if (!response.ok) {
        const errorText = await response.text();
        console.error(
          `Error fetching recipes: ${response.status} - ${errorText}`
        );
        return;
      }
      const json = await response.json();
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

  useEffect(() => {
    if (data) {
      setFilteredData(
        data.filter((recipe) =>
          recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
  }, [searchQuery, data]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.stiletto["50"] }}>
      {/* Search Bar (should only wrap content height) */}
      <View style={[styles.container ]}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.stiletto["200"],
              color: theme.stiletto["950"],
            },
          ]}
          placeholder="Search Here"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          onPress={() => console.log("Plus pressed")}
          style={{
            backgroundColor: theme.stiletto["500"],
            borderRadius: 30,
            padding: 10,
          }}
        >
          <AntDesign name="plus" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* FlatList container (fills remaining space and full width) */}
      <View style={{ flex: 1 }}>
        {isLoading ? (
          <ActivityIndicator size="large" color={theme.stiletto["950"]} />
        ) : (
          <View style={{ flex: 1 }}>
            <RecipeList
              data={filteredData}
              onItemPress={() => {
                return null;
              }}
            />
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "stretch",
    flexDirection: "row"
  },
  input: {
    fontFamily: "PoiretOne",
    borderWidth: 1,
    borderRadius: 10,
    height: 60,
    width: "75%",
    padding: 8,
    margin: 10,
  },
});
