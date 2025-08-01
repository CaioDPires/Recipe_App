import { FlatList, View } from "react-native";
import { useTheme } from "../themes/ThemeContext";
import { RecipeListItem, RecipeListItemData } from "./RecipeListItem";

type RecipeListProps = {
  data: RecipeListItemData[] | null;
  onItemPress: (id: string) => void;
};

const RecipeList = ({ data, onItemPress }: RecipeListProps) => {
    const {theme} = useTheme();
    return (
        <FlatList
        data={data}
        keyExtractor={(item)=> item.id}
        renderItem={({item}) => (
            <View style={{ width: '100%', alignItems: 'center' }}>
            <RecipeListItem
            item={item}
            onPress={()=>onItemPress(item.id)}
            backgroundColor={theme.background}
            textColor={theme.text}
            />
            </View>

        )}/>
    );
};

export default RecipeList;
