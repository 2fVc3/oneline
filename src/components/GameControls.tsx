import React from 'react';
import { Send, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onSubmit: () => void;
  onClear: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({ onSubmit, onClear }) => {
  return (
    <div className="game-controls">
      <div className="controls-container">
        <button className="control-button submit" onClick={onSubmit}>
          <Send className="control-icon" />
          <span>Submit Drawing</span>
        </button>
        
        <button className="control-button clear" onClick={onClear}>
          <RotateCcw className="control-icon" />
          <span>Clear & Restart</span>
        </button>
      </div>
    </div>
  );
};