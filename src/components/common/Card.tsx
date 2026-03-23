import type { CardProps } from '../../types/common';

export const Card = ({
  title,
  children,
  className = '',
}: CardProps) => {
  return (
    <div className={`card ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      )}
      {children}
    </div>
  );
};
