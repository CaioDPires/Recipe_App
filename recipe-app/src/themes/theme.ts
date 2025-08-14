// The base color palette
const appTheme = {
  stiletto: {
    '50': '#fcf5f4',
    '100': '#f9ecea',
    '200': '#f3dbd8',
    '300': '#e9bdb8',
    '400': '#dd948f',
    '500': '#cc6c67',
    '600': '#b64848',
    '700': '#a63d40',
    '800': '#803136',
    '900': '#6e2d33',
    '950': '#3c1518',
  },
};

// The dark color scheme (Stiletto Noir)
export const darkColors = {
  primary: appTheme.stiletto['700'],
  onPrimary: appTheme.stiletto['50'],
  secondary: appTheme.stiletto['400'],
  onSecondary: appTheme.stiletto['950'],
  tertiary: appTheme.stiletto['600'],
  onTertiary: appTheme.stiletto['50'],
  background: appTheme.stiletto['950'],
  onBackground: appTheme.stiletto['100'],
  surface: appTheme.stiletto['900'],
  onSurface: appTheme.stiletto['100'],
  onSurfaceVariant: appTheme.stiletto['300'],
  outline: appTheme.stiletto['800'],
  error: '#cf6679',
  onError: '#000000',
};

// The light color scheme
export const lightColors = {
  primary: appTheme.stiletto['700'],
  onPrimary: appTheme.stiletto['50'],
  secondary: appTheme.stiletto['600'],
  onSecondary: appTheme.stiletto['50'],
  tertiary: appTheme.stiletto['400'],
  onTertiary: appTheme.stiletto['950'],
  background: appTheme.stiletto['50'],
  onBackground: appTheme.stiletto['950'],
  surface: '#ffffff',
  onSurface: appTheme.stiletto['950'],
  onSurfaceVariant: appTheme.stiletto['800'],
  outline: appTheme.stiletto['200'],
  error: '#b00020',
  onError: '#ffffff',
};

// A type representing a complete color scheme's structure
export type ColorScheme = typeof darkColors;