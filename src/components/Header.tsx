// import React from 'react';
// import { Link } from 'react-router-dom';
// import { useTheme } from '../hooks/useTheme.ts';
// import { themes } from '../context/ThemeContext.tsx';

// const Header: React.FC = () => {
//   const { theme, setThemeName, currentThemeName } = useTheme();

//   return (
//     <header className={`fixed top-0 left-0 right-0 z-50 p-4 shadow-md flex justify-between items-center ${theme.colors.headerBg} ${theme.transition}`}>
//       <div className="flex items-center">
//         <span className={`text-2xl font-bold ${theme.colors.text}`}>🌱 Plant Paradise</span>
//       </div>
//       <nav>
//         <ul className="hidden md:flex space-x-6">
//           <li>
//             <Link to="/" className={`text-lg font-semibold hover:underline ${theme.colors.text} ${theme.transition}`}>Home</Link>
//           </li>
//           <li>
//             <Link to="/about" className={`text-lg font-semibold hover:underline ${theme.colors.text} ${theme.transition}`}>About</Link>
//           </li>
//           <li>
//             <Link to="/contact" className={`text-lg font-semibold hover:underline ${theme.colors.text} ${theme.transition}`}>Contact</Link>
//           </li>
//         </ul>
//       </nav>
//       <div className="relative">
//         <select
//           value={currentThemeName}
//           onChange={(e) => setThemeName(e.target.value)}
//           className={`appearance-none py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-75 ${theme.colors.dropdownBg} ${theme.colors.dropdownText} ${theme.transition} cursor-pointer`}
//           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23${theme.colors.dropdownText.replace('text-', '')}'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
//         >
//           {Object.keys(themes).map((name) => (
//             <option key={name} value={name} className={`${theme.colors.dropdownBg} ${theme.colors.dropdownText}`}>
//               {name}
//             </option>
//           ))}
//         </select>
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.ts';
import { themes } from '../context/ThemeContext.tsx';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
];

const THEME_ICONS: Record<string, string> = {
  light: '☀️',
  dark: '🌙',
  forest: '🌿',
  ocean: '🌊',
  default: '🎨',
};

const Header: React.FC = () => {
  const { theme, setThemeName, currentThemeName } = useTheme();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const themeRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Scroll shadow
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) setThemeOpen(false);
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMenuOpen(false); }, [pathname]);

  // Keyboard: close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setThemeOpen(false); setMenuOpen(false); }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  const themeNames = Object.keys(themes);

  return (
    <header
      role="banner"
      className={[
        'fixed top-0 left-0 right-0 z-50',
        'flex items-center justify-between',
        'px-4 sm:px-6 lg:px-8 h-16',
        theme.colors.headerBg,
        theme.transition,
        scrolled ? 'shadow-md backdrop-blur-sm' : '',
      ].join(' ')}
    >
      {/* ── Logo ── */}
      <Link
        to="/"
        aria-label="Plant Paradise – home"
        className={`flex items-center gap-2 text-xl font-bold tracking-tight ${theme.colors.text} ${theme.transition} hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded`}
      >
        <span aria-hidden="true">🌱</span>
        <span>Plant Paradise</span>
      </Link>

      {/* ── Desktop Nav ── */}
      <nav aria-label="Primary navigation" className="hidden md:block">
        <ul className="flex items-center gap-1" role="list">
          {NAV_LINKS.map(({ to, label }) => {
            const active = pathname === to;
            return (
              <li key={to}>
                <Link
                  to={to}
                  aria-current={active ? 'page' : undefined}
                  className={[
                    'relative px-3 py-1.5 rounded-md text-sm font-medium',
                    'transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                    theme.colors.text,
                    active
                      ? 'font-semibold after:absolute after:bottom-0 after:left-3 after:right-3 after:h-0.5 after:rounded-full after:bg-current'
                      : 'opacity-70 hover:opacity-100 hover:bg-white/10',
                  ].join(' ')}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* ── Right Controls ── */}
      <div className="flex items-center gap-2">

        {/* Theme Switcher (custom dropdown) */}
        <div ref={themeRef} className="relative">
          <button
            aria-haspopup="listbox"
            aria-expanded={themeOpen}
            aria-label={`Current theme: ${currentThemeName}. Change theme`}
            onClick={() => setThemeOpen((o) => !o)}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium',
              'transition-all duration-150 select-none',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
              theme.colors.dropdownBg,
              theme.colors.dropdownText,
              'hover:opacity-90',
            ].join(' ')}
          >
            <span aria-hidden="true">{THEME_ICONS[currentThemeName] ?? THEME_ICONS.default}</span>
            <span className="hidden sm:inline capitalize">{currentThemeName}</span>
            <svg
              className={`w-3.5 h-3.5 transition-transform duration-200 ${themeOpen ? 'rotate-180' : ''}`}
              viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>

          {themeOpen && (
            <ul
              role="listbox"
              aria-label="Theme options"
              className={[
                'absolute right-0 mt-1.5 w-40 py-1 rounded-lg shadow-xl border z-50',
                'motion-safe:animate-in motion-safe:fade-in motion-safe:zoom-in-95 duration-100',
                theme.colors.dropdownBg,
                theme.colors.dropdownText,
              ].join(' ')}
            >
              {themeNames.map((name) => {
                const selected = name === currentThemeName;
                return (
                  <li
                    key={name}
                    role="option"
                    aria-selected={selected}
                    onClick={() => { setThemeName(name); setThemeOpen(false); }}
                    className={[
                      'flex items-center gap-2 px-3 py-2 text-sm cursor-pointer capitalize',
                      'transition-colors duration-100',
                      selected ? 'font-semibold opacity-100' : 'opacity-70 hover:opacity-100 hover:bg-white/10',
                    ].join(' ')}
                  >
                    <span aria-hidden="true">{THEME_ICONS[name] ?? THEME_ICONS.default}</span>
                    {name}
                    {selected && <span className="ml-auto" aria-hidden="true">✓</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Mobile Hamburger */}
        <div ref={menuRef} className="md:hidden">
          <button
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((o) => !o)}
            className={[
              'p-2 rounded-md transition-all duration-150',
              'focus-visible:outline-none focus-visible:ring-2',
              theme.colors.text,
              'hover:bg-white/10',
            ].join(' ')}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" aria-hidden="true">
              {menuOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>

          {/* Mobile Menu Dropdown */}
          {menuOpen && (
            <nav
              id="mobile-menu"
              aria-label="Mobile navigation"
              className={[
                'absolute top-16 left-0 right-0 shadow-lg border-t py-2',
                'motion-safe:animate-in motion-safe:slide-in-from-top-2 duration-150',
                theme.colors.headerBg,
              ].join(' ')}
            >
              <ul role="list">
                {NAV_LINKS.map(({ to, label }) => {
                  const active = pathname === to;
                  return (
                    <li key={to}>
                      <Link
                        to={to}
                        aria-current={active ? 'page' : undefined}
                        className={[
                          'block px-6 py-3 text-sm font-medium transition-colors duration-150',
                          theme.colors.text,
                          active ? 'font-semibold opacity-100 bg-white/10' : 'opacity-70 hover:opacity-100 hover:bg-white/10',
                        ].join(' ')}
                      >
                        {label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;