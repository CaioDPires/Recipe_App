import React, { createContext, ReactNode, useContext, useState } from 'react';
import { darkColors, lightColors, ColorScheme } from './theme'; // Updated import

// Define the context type using the new ColorScheme type
type ThemeContextType = {
  theme: ColorScheme;
  isDark: boolean; // Also expose isDark so components can know the mode
  toggleTheme: () => void;
};

// Provide a default value. We'll start with the dark theme.
const ThemeContext = createContext<ThemeContextType>({
  theme: darkColors,
  isDark: true,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  // Default to dark mode (isDark = true)
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark(prev => !prev);

  // KEY CHANGE: Select the theme object based on the isDark state
  const currentTheme = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider
      value={{ theme: currentTheme, isDark, toggleTheme }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

// The hook remains the same
export const useTheme = () => useContext(ThemeContext);