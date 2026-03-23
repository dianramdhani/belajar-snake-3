export interface ClassNameProps {
  className?: string;
}

export interface ChildrenProps {
  children?: React.ReactNode;
}

export interface ButtonProps extends ClassNameProps {
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
  children?: React.ReactNode;
}

export interface SliderProps extends ClassNameProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  label?: string;
  disabled?: boolean;
}

export interface SelectProps<T extends string> extends ClassNameProps {
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
  label?: string;
  disabled?: boolean;
}

export interface CardProps extends ClassNameProps, ChildrenProps {
  title?: string;
}
