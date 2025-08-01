import React, { ReactNode } from 'react';
import { useTheme } from '../hooks/useTheme.ts';

const Button: React.FC<{ children: ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
  const { theme } = useTheme();
  return (
    <button
      onClick={onClick}
      className={`py-2 px-4 rounded-md shadow-md ${theme.colors.buttonBg} ${theme.colors.buttonText} ${theme.transition} hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.colors.buttonBg.replace('bg-', 'focus:ring-')}`}
    >
      {children}
    </button>
  );
};

export default Button;
