import { useContext, useDebugValue } from 'react';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext.tsx';

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      '[useTheme] must be used within a <ThemeProvider>.\n' +
      'Wrap your component tree with <ThemeProvider> in your app entry point.'
    );
  }

  // Shows current theme name in React DevTools next to this hook
  useDebugValue(context.currentThemeName, (name) => `Theme: ${name}`);

  return context;
};

export const useThemeStyles = () => useTheme().theme;

export const useIsDark = () => useTheme().isDark;

export const useSetTheme = () => useTheme().setThemeName;

export const useThemeSelector = () => {
  const { currentThemeName, availableThemes, setThemeName } = useTheme();
  return { currentThemeName, availableThemes, setThemeName };
};