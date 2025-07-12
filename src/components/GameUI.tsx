import React from 'react';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';

interface GameUIProps {
  word: string;
  level: number;
  isDrawing: boolean;
  hasStartedDrawing: boolean;
  onClear: () => void;
  onBackToMenu: () => void;
}

export const GameUI: React.FC<GameUIProps> = ({
  word,
  level,
  isDrawing,
  hasStartedDrawing,
  onClear,
  onBackToMenu
}) => {
  return (
    <div className="game-ui">
      <div className="game-header">
        <button className="sketch-button small" onClick={onBackToMenu}>
          <ArrowLeft className="button-icon" />
        </button>
        
        <div className="level-indicator">
          <Trophy className="trophy-icon small" />
          <span>Level {level}</span>
        </div>
        
        <button 
          className="sketch-button small" 
          onClick={onClear}
          disabled={isDrawing}
        >
          <RotateCcw className="button-icon" />
        </button>
      </div>
      
      <div className="word-display">
        <div className="word-card">
          <h2 className="word-text">{word}</h2>
          <div className="word-underline"></div>
        </div>
      </div>
      
      <div className="drawing-status">
        <div className={`status-indicator ${isDrawing ? 'drawing' : hasStartedDrawing ? 'paused' : 'ready'}`}>
          <div className="status-dot"></div>
          <span className="status-text">
            {isDrawing ? 'Drawing...' : hasStartedDrawing ? 'Paused' : 'Ready'}
          </span>
        </div>
      </div>
    </div>
  );
};