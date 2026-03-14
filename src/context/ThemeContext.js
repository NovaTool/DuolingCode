import React, { createContext, useContext, useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { DARK_COLORS, LIGHT_COLORS } from '../constants/colors';

// expo-navigation-bar is Android-only and not available on web
const NavigationBar = Platform.OS === 'android'
  ? require('expo-navigation-bar')
  : null;

const ThemeContext = createContext();

export function ThemeProvider({ children, initialDark = true }) {
  const [isDark, setIsDark] = useState(initialDark);
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  // Sync Android navigation bar color with theme
  useEffect(() => {
    if (Platform.OS === 'android' && NavigationBar) {
      NavigationBar.setBackgroundColorAsync(isDark ? '#131F24' : '#FFFFFF');
      NavigationBar.setButtonStyleAsync(isDark ? 'light' : 'dark');
    }
  }, [isDark]);

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
