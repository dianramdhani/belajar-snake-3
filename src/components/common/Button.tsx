import type { ButtonProps } from '../../types/common';

export const Button = ({
  onClick,
  disabled = false,
  variant = 'primary',
  children,
  className = '',
}: ButtonProps) => {
  const variantStyles = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    success: 'btn-success',
    danger: 'btn-danger',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
};
