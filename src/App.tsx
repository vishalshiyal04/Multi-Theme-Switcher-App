import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.tsx';
import { useTheme } from './hooks/useTheme.ts';
import Header from './components/Header.tsx';
import HomePage from './pages/HomePage.tsx';
import AboutPage from './pages/AboutPage.tsx';
import ContactPage from './pages/ContactPage.tsx';

const App: React.FC = () => {
  const location = useLocation();
  const { theme } = useTheme();

  // This is a workaround to ensure the custom font class is applied by Tailwind
  // In a real project, this would be configured in tailwind.config.js
  const pacificoFontClass = theme.name === 'Theme 3' ? 'font-pacifico' : '';

  return (
    <div className={`${theme.colors.background} ${theme.colors.text} ${theme.transition} ${pacificoFontClass} min-h-screen`}>
      <Header />
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>
    </div>
  );
};

const Root: React.FC = () => (
  <React.StrictMode>
    <Router>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </Router>
  </React.StrictMode>
);

export default Root;
