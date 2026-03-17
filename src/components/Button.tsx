// import React, { ReactNode } from 'react';
// import { useTheme } from '../hooks/useTheme.ts';

// const Button: React.FC<{ children: ReactNode; onClick?: () => void }> = ({ children, onClick }) => {
//   const { theme } = useTheme();
//   return (
//     <button
//       onClick={onClick}
//       className={`py-2 px-4 rounded-md shadow-md ${theme.colors.buttonBg} ${theme.colors.buttonText} ${theme.transition} hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.colors.buttonBg.replace('bg-', 'focus:ring-')}`}
//     >
//       {children}
//     </button>
//   );
// };

// export default Button;

import React, { ReactNode, forwardRef } from 'react';
import { useTheme } from '../hooks/useTheme.ts';

type ButtonVariant = 'solid' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm gap-1.5',
  md: 'px-4 py-2 text-sm gap-2',
  lg: 'px-6 py-3 text-base gap-2.5',
};

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 shrink-0"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
  </svg>
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'solid',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      disabled,
      className = '',
      ...props
    },
    ref
  ) => {
    const { theme } = useTheme();
    const isDisabled = disabled || loading;

    const variantStyles: Record<ButtonVariant, string> = {
      solid: `${theme.colors.buttonBg} ${theme.colors.buttonText} hover:opacity-90 shadow-sm`,
      outline: `border-2 border-current ${theme.colors.buttonText} bg-transparent hover:bg-white/10`,
      ghost: `bg-transparent ${theme.colors.buttonText} hover:bg-white/10`,
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    };

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={[
          // Base
          'inline-flex items-center justify-center font-medium rounded-lg',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'transition-all duration-150 ease-in-out',
          'active:scale-[0.97] select-none',
          // Size
          sizeStyles[size],
          // Variant
          variantStyles[variant],
          // State
          isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer',
          fullWidth ? 'w-full' : '',
          // Motion preference
          'motion-reduce:transition-none motion-reduce:active:scale-100',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {loading ? (
          <Spinner />
        ) : leftIcon ? (
          <span className="shrink-0">{leftIcon}</span>
        ) : null}

        <span>{children}</span>

        {!loading && rightIcon && (
          <span className="shrink-0">{rightIcon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
export default Button;