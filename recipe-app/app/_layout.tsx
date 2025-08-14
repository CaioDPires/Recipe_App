import { ThemeProvider, useTheme } from "@/src/themes/ThemeContext";
import { useFonts } from 'expo-font';
import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const [loaded, error] = useFonts({
    'PoiretOne': require('../assets/fonts/PoiretOne-Regular.ttf'),
  });
  const { theme, toggleTheme, isDark } = useTheme();

  // Wrap your styles in useMemo.
  // This function will only re-run if `theme` changes.
  const styles = 
    StyleSheet.create({
      safeView: {
        flex: 1,
        backgroundColor: theme.surface,
      },
    });
  
  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }
  return (
    <ThemeProvider>
      <SafeAreaView style={styles.safeView}>
        <Stack screenOptions={{ headerShown: false }} />
      </SafeAreaView>
    </ThemeProvider>
  );
}

