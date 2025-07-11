import React from 'react';

interface ControlsProps {
  onClear: () => void;
  onSave: () => void;
}

export const Controls: React.FC<ControlsProps> = ({ onClear, onSave }) => {
  return (
    <>
      <button className="pencil__refresh btn" onClick={onClear}>
        Clear
      </button>
      <button className="pencil__submit btn" onClick={onSave}>
        Save
      </button>
    </>
  );
};