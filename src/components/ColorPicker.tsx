import React from 'react';

interface ColorPickerProps {
  colors: string[];
  currentColorIndex: number;
  onColorChange: (index: number) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({ colors, currentColorIndex, onColorChange }) => {
  return (
    <ul className="colours">
      {colors.map((color, index) => (
        <li
          key={index}
          style={{ backgroundColor: color }}
          className={index === currentColorIndex ? 'active' : ''}
          onClick={() => onColorChange(index)}
        />
      ))}
    </ul>
  );
};