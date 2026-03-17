import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  ReactNode,
} from 'react';


export interface ThemeColors {
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
  border: string;
  muted: string;
}

export interface ThemeFonts {
  base: string;
  heading: string;
  mono?: string;
  googleFontUrl?: string;
}

export interface ThemeLayout {
  container: string;
  contentArea: string;
  cardGrid?: string;
  cardBase?: string;
  sidebar?: string;
}

export interface ThemeSpacing {
  padding: string;
  margin: string;
  gap: string;
}

export interface Theme {
  name: string;
  displayName: string;
  colorScheme: 'light' | 'dark'; // for <meta> and system sync
  colors: ThemeColors;
  fonts: ThemeFonts;
  layout: ThemeLayout;
  spacing: ThemeSpacing;
  transition: string;
}

export interface ThemeContextType {
  theme: Theme;
  setThemeName: (name: string) => void;
  currentThemeName: string;
  availableThemes: string[];
  isDark: boolean;
}


export const themes: Record<string, Theme> = {
  'theme-light': {
    name: 'theme-light',
    displayName: 'Light',
    colorScheme: 'light',
    colors: {
      primary: 'bg-indigo-600',
      secondary: 'bg-indigo-500',
      background: 'bg-gray-50',
      text: 'text-gray-900',
      cardBg: 'bg-white',
      buttonBg: 'bg-indigo-600',
      buttonText: 'text-white',
      headerBg: 'bg-white/80',
      dropdownBg: 'bg-white',
      dropdownText: 'text-gray-800',
      dropdownHoverBg: 'bg-gray-100',
      border: 'border-gray-200',
      muted: 'text-gray-500',
    },
    fonts: {
      base: 'font-sans',
      heading: 'font-sans font-bold',
      mono: 'font-mono',
    },
    layout: {
      container: 'flex flex-col min-h-screen',
      contentArea: 'flex-1 p-4 md:p-8',
      cardGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      cardBase: 'rounded-xl shadow-sm overflow-hidden border border-gray-100',
    },
    spacing: { padding: 'p-4', margin: 'mb-4', gap: 'gap-4' },
    transition: 'transition-all duration-300 ease-in-out',
  },

  'theme-dark': {
    name: 'theme-dark',
    displayName: 'Dark',
    colorScheme: 'dark',
    colors: {
      primary: 'bg-teal-500',
      secondary: 'bg-teal-400',
      background: 'bg-gray-950',
      text: 'text-gray-100',
      cardBg: 'bg-gray-900',
      buttonBg: 'bg-teal-600',
      buttonText: 'text-white',
      headerBg: 'bg-gray-900/80',
      dropdownBg: 'bg-gray-800',
      dropdownText: 'text-gray-100',
      dropdownHoverBg: 'bg-gray-700',
      border: 'border-gray-800',
      muted: 'text-gray-400',
    },
    fonts: {
      base: 'font-sans',
      heading: 'font-sans font-bold',
      mono: 'font-mono',
    },
    layout: {
      container: 'flex min-h-screen',
      contentArea: 'flex-1 p-4 md:p-8',
      sidebar: 'w-64 bg-gray-900 p-4 hidden md:block border-r border-gray-800',
      cardGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      cardBase: 'rounded-xl shadow-lg overflow-hidden border border-gray-800',
    },
    spacing: { padding: 'p-6', margin: 'mb-6', gap: 'gap-6' },
    transition: 'transition-all duration-300 ease-in-out',
  },

  'theme-playful': {
    name: 'theme-playful',
    displayName: 'Playful',
    colorScheme: 'light',
    colors: {
      primary: 'bg-pink-500',
      secondary: 'bg-yellow-400',
      background: 'bg-purple-50',
      text: 'text-gray-800',
      cardBg: 'bg-white',
      buttonBg: 'bg-pink-500',
      buttonText: 'text-white',
      headerBg: 'bg-yellow-300/90',
      dropdownBg: 'bg-white',
      dropdownText: 'text-gray-800',
      dropdownHoverBg: 'bg-purple-100',
      border: 'border-purple-200',
      muted: 'text-gray-500',
    },
    fonts: {
      base: 'font-sans',
      heading: 'font-pacifico',
      googleFontUrl:
        'https://fonts.googleapis.com/css2?family=Pacifico&display=swap',
    },
    layout: {
      container: 'flex flex-col min-h-screen',
      contentArea: 'flex-1 p-4 md:p-8',
      cardGrid: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      cardBase: 'rounded-2xl shadow-lg overflow-hidden border border-purple-100',
    },
    spacing: { padding: 'p-5', margin: 'mb-5', gap: 'gap-8' },
    transition: 'transition-all duration-300 ease-in-out',
  },
};


const FONT_LINK_ATTR = 'data-theme-font';

function applyGoogleFont(url: string | undefined) {
  // Remove all previously injected theme font links
  document
    .querySelectorAll<HTMLLinkElement>(`link[${FONT_LINK_ATTR}]`)
    .forEach((el) => el.remove());

  if (!url) return;

  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = url;
  link.setAttribute(FONT_LINK_ATTR, 'true');
  document.head.appendChild(link);
}


export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'app:theme';
const DEFAULT_THEME = 'theme-light';

function resolveInitialTheme(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && themes[stored]) return stored;
  } catch {
    // localStorage unavailable (SSR / private browsing)
  }
  // Respect OS preference as fallback
  const prefersDark =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'theme-dark' : DEFAULT_THEME;
}


export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState<string>(resolveInitialTheme);

  const theme = themes[currentThemeName] ?? themes[DEFAULT_THEME];
  const isDark = theme.colorScheme === 'dark';

  // Apply theme side-effects
  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, currentThemeName); } catch { /* noop */ }

    applyGoogleFont(theme.fonts.googleFontUrl);

    document.body.classList.remove(
      ...Object.values(themes).map((t) => t.fonts.base),
      ...Object.values(themes).map((t) => t.colors.background),
      ...Object.values(themes).map((t) => t.colors.text),
    );
    document.body.classList.add(theme.fonts.base, theme.colors.background, theme.colors.text);

    let meta = document.querySelector<HTMLMetaElement>('meta[name="color-scheme"]');
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'color-scheme';
      document.head.appendChild(meta);
    }
    meta.content = theme.colorScheme;

    document.documentElement.classList.toggle('dark', isDark);
  }, [currentThemeName, theme, isDark]);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mq) return;
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually chosen a theme
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) setCurrentThemeName(e.matches ? 'theme-dark' : 'theme-light');
    };
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  const setThemeName = useCallback((name: string) => {
    if (themes[name]) setCurrentThemeName(name);
    else console.warn(`[ThemeContext] Unknown theme: "${name}"`);
  }, []);

  const availableThemes = useMemo(() => Object.keys(themes), []);

  const value = useMemo<ThemeContextType>(
    () => ({ theme, setThemeName, currentThemeName, availableThemes, isDark }),
    [theme, setThemeName, currentThemeName, availableThemes, isDark]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};