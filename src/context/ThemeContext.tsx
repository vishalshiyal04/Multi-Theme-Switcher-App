import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';

// --- Interfaces ---
export interface Theme {
  name: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    cardBg: string;
    buttonBg: string;
    buttonText: string;
    headerBg: string;
    dropdownBg: string;
    dropdownText: string;
    dropdownHoverBg: string;
  };
  fonts: {
    base: string;
    heading: string;
    googleFontUrl?: string;
  };
  layout: {
    container: string;
    contentArea: string;
    cardGrid?: string;
    cardBase?: string;
    sidebar?: string;
  };
  spacing: {
    padding: string;
    margin: string;
    gap: string;
  };
  transition: string;
}

export interface ThemeContextType {
  theme: Theme;
  setThemeName: (name: string) => void;
  currentThemeName: string;
}

// --- Theme Definitions ---
export const themes: { [key: string]: Theme } = {
  'Theme 1': {
    name: 'Theme 1',
    colors: {
      primary: 'bg-indigo-600',
      secondary: 'bg-indigo-500',
      background: 'bg-gray-50',
      text: 'text-gray-900',
      cardBg: 'bg-white',
      buttonBg: 'bg-indigo-600',
      buttonText: 'text-white',
      headerBg: 'bg-white',
      dropdownBg: 'bg-white',
      dropdownText: 'text-gray-800',
      dropdownHoverBg: 'bg-gray-100',
    },
    fonts: {
      base: 'font-sans',
      heading: 'font-sans',
    },
    layout: {
      container: 'flex flex-col min-h-screen',
      contentArea: 'flex-1 p-4 md:p-8',
    },
    spacing: {
      padding: 'p-4',
      margin: 'mb-4',
      gap: 'gap-4',
    },
    transition: 'transition-all duration-500 ease-in-out',
  },
  'Theme 2': {
    name: 'Theme 2',
    colors: {
      primary: 'bg-teal-700',
      secondary: 'bg-teal-600',
      background: 'bg-gray-900',
      text: 'text-gray-100',
      cardBg: 'bg-gray-800',
      buttonBg: 'bg-teal-600',
      buttonText: 'text-white',
      headerBg: 'bg-gray-800',
      dropdownBg: 'bg-gray-700',
      dropdownText: 'text-gray-100',
      dropdownHoverBg: 'bg-gray-600',
    },
    fonts: {
      base: 'font-serif',
      heading: 'font-serif font-bold',
    },
    layout: {
      container: 'flex min-h-screen',
      contentArea: 'flex-1 p-4 md:p-8',
      sidebar: 'w-64 bg-gray-800 p-4 hidden md:block',
    },
    spacing: {
      padding: 'p-6',
      margin: 'mb-6',
      gap: 'gap-6',
    },
    transition: 'transition-all duration-500 ease-in-out',
  },
  'Theme 3': {
    name: 'Theme 3',
    colors: {
      primary: 'bg-pink-500',
      secondary: 'bg-yellow-400',
      background: 'bg-purple-100',
      text: 'text-gray-800',
      cardBg: 'bg-white',
      buttonBg: 'bg-pink-500',
      buttonText: 'text-white',
      headerBg: 'bg-yellow-400',
      dropdownBg: 'bg-white',
      dropdownText: 'text-gray-800',
      dropdownHoverBg: 'bg-purple-200',
    },
    fonts: {
      base: 'font-sans',
      heading: 'font-pacifico',
      googleFontUrl: 'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
    },
    layout: {
      container: 'flex flex-col min-h-screen',
      contentArea: 'flex-1 p-4 md:p-8',
      cardGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      cardBase: 'rounded-xl shadow-lg overflow-hidden',
    },
    spacing: {
      padding: 'p-5',
      margin: 'mb-5',
      gap: 'gap-8',
    },
    transition: 'transition-all duration-500 ease-in-out',
  },
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState<string>(() => {
    return localStorage.getItem('themeName') || 'Theme 1';
  });

  const theme = themes[currentThemeName] || themes['Theme 1'];

  useEffect(() => {
    localStorage.setItem('themeName', currentThemeName);

    let linkElement: HTMLLinkElement | null = document.getElementById('google-font-pacifico') as HTMLLinkElement;
    if (theme.fonts.googleFontUrl) {
      if (!linkElement) {
        linkElement = document.createElement('link');
        linkElement.id = 'google-font-pacifico';
        linkElement.rel = 'stylesheet';
        document.head.appendChild(linkElement);
      }
      linkElement.href = theme.fonts.googleFontUrl;
    } else {
      if (linkElement) {
        document.head.removeChild(linkElement);
      }
    }

    document.body.className = `${theme.fonts.base} ${theme.colors.background} ${theme.colors.text} ${theme.transition}`;
  }, [currentThemeName, theme]);

  const setThemeName = useCallback((name: string) => {
    if (themes[name]) {
      setCurrentThemeName(name);
    }
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, setThemeName, currentThemeName }}>
      {children}
    </ThemeContext.Provider>
  );
};
