// import { useContext } from 'react';
// import { ThemeContext, ThemeContextType } from '../context/ThemeContext.tsx';

// export const useTheme = (): ThemeContextType => {
//   const context = useContext(ThemeContext);
//   if (context === undefined) {
//     throw new Error('useTheme must be used within a ThemeProvider');
//   }
//   return context;
// };


import { useContext, useDebugValue } from 'react';
import { ThemeContext, ThemeContextType } from '../context/ThemeContext.tsx';

/**
 * useTheme
 *
 * Consumes the ThemeContext. Must be used inside <ThemeProvider>.
 *
 * @example
 * const { theme, setThemeName, isDark, currentThemeName } = useTheme();
 */
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

// ─── Selector hooks (avoid re-renders when only one value is needed) ──────────

/**
 * Returns only the theme object.
 * Components that only need styles won't re-render on theme name changes.
 */
export const useThemeStyles = () => useTheme().theme;

/**
 * Returns only isDark flag.
 * Useful for conditionally rendering dark/light assets or icons.
 */
export const useIsDark = () => useTheme().isDark;

/**
 * Returns only the setter. Useful in theme-switcher components
 * that don't need to read the current theme.
 */
export const useSetTheme = () => useTheme().setThemeName;

/**
 * Returns current theme name + available theme list.
 * Useful for theme picker dropdowns.
 */
export const useThemeSelector = () => {
  const { currentThemeName, availableThemes, setThemeName } = useTheme();
  return { currentThemeName, availableThemes, setThemeName };
};