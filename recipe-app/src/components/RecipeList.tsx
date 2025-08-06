import { FlatList } from "react-native";
import { useTheme } from "../themes/ThemeContext";
import { RecipeListItem, RecipeListItemData } from "./RecipeListItem";

type RecipeListProps = {
  data: RecipeListItemData[] | null;
  onItemPress: (id: string) => void;
};

const RecipeList = ({ data, onItemPress }: RecipeListProps) => {
  const { theme } = useTheme();
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
          <RecipeListItem
            item={item}
            onPress={() => onItemPress(item.id)}
            backgroundColor={theme.stiletto['400']}
            textColor={theme.stiletto['950']}
          />
      )}
    />
  );
};

export default RecipeList;
