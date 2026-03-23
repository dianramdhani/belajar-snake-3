import type { SliderProps } from '../../types/common';

export const Slider = ({
  value,
  min,
  max,
  step = 1,
  onChange,
  label,
  disabled = false,
  className = '',
}: SliderProps) => {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm font-medium text-gray-300">
          {label}: <span className="text-purple-400">{value}</span>
        </label>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        className="input-range"
      />
      <div className="flex justify-between text-xs text-gray-500">
        <span>{min}</span>
        <span>{max}</span>
      </div>
    </div>
  );
};
