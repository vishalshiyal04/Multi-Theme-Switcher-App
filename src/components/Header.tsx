import React from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme.ts';
import { themes } from '../context/ThemeContext.tsx';

const Header: React.FC = () => {
  const { theme, setThemeName, currentThemeName } = useTheme();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 p-4 shadow-md flex justify-between items-center ${theme.colors.headerBg} ${theme.transition}`}>
      <div className="flex items-center">
        <span className={`text-2xl font-bold ${theme.colors.text}`}>🌱 Plant Paradise</span>
      </div>
      <nav>
        <ul className="hidden md:flex space-x-6">
          <li>
            <Link to="/" className={`text-lg font-semibold hover:underline ${theme.colors.text} ${theme.transition}`}>Home</Link>
          </li>
          <li>
            <Link to="/about" className={`text-lg font-semibold hover:underline ${theme.colors.text} ${theme.transition}`}>About</Link>
          </li>
          <li>
            <Link to="/contact" className={`text-lg font-semibold hover:underline ${theme.colors.text} ${theme.transition}`}>Contact</Link>
          </li>
        </ul>
      </nav>
      <div className="relative">
        <select
          value={currentThemeName}
          onChange={(e) => setThemeName(e.target.value)}
          className={`appearance-none py-2 px-4 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-opacity-75 ${theme.colors.dropdownBg} ${theme.colors.dropdownText} ${theme.transition} cursor-pointer`}
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20' fill='%23${theme.colors.dropdownText.replace('text-', '')}'%3E%3Cpath fill-rule='evenodd' d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z' clip-rule='evenodd'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center', backgroundSize: '1.5em 1.5em' }}
        >
          {Object.keys(themes).map((name) => (
            <option key={name} value={name} className={`${theme.colors.dropdownBg} ${theme.colors.dropdownText}`}>
              {name}
            </option>
          ))}
        </select>
      </div>
    </header>
  );
};

export default Header;
