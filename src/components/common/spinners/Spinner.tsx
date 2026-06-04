import React from 'react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg' | string;
  color?: 'primary' | 'dark' | 'white' | string;
  className?: string;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'primary',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-5 w-5', // Used in AuthCard
    md: 'h-6 w-6', // Used in DocumentPanel
    lg: 'h-8 w-8', // Used in App loader
  };

  const colorClasses = {
    primary: 'text-titanium-primary',
    dark: 'text-dark-deep',
    white: 'text-white',
  };

  const finalSize = sizeClasses[size as keyof typeof sizeClasses] || size;
  const finalColor = colorClasses[color as keyof typeof colorClasses] || color;

  return (
    <svg
      className={`animate-spin ${finalSize} ${finalColor} ${className}`}
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
};
