import React, { createContext, useContext, useState } from 'react';
import { DARK_COLORS, LIGHT_COLORS } from '../constants/colors';

const ThemeContext = createContext();

export function ThemeProvider({ children, initialDark = true }) {
  const [isDark, setIsDark] = useState(initialDark);
  const colors = isDark ? DARK_COLORS : LIGHT_COLORS;

  return (
    <ThemeContext.Provider value={{ isDark, setIsDark, colors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
