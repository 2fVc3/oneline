import React from 'react';
import { ArrowLeft, RotateCcw, Trophy, Zap } from 'lucide-react';

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
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <div className="game-header">
        <button className="game-button" onClick={onBackToMenu}>
          <ArrowLeft className="button-icon" />
          Back
        </button>
        
        <div className="level-indicator">
          <Trophy className="trophy-icon small" style={{ color: '#ffd700', width: '1.2rem', height: '1.2rem' }} />
          <span>Level {level}</span>
          <Zap style={{ color: '#ff6b6b', width: '1.2rem', height: '1.2rem' }} />
        </div>
        
        <button 
          className="game-button" 
          onClick={onClear}
          disabled={isDrawing}
        >
          <RotateCcw className="button-icon" />
          Clear
        </button>
      </div>
      
      <div className="word-display">
        <div className="word-card bounce-in">
          <h2 className="word-text">{word}</h2>
        </div>
      </div>
      
      <div className="drawing-status">
        <div className={`status-indicator ${isDrawing ? 'drawing' : hasStartedDrawing ? 'paused' : 'ready'}`}>
          <div className="status-dot"></div>
          <span className="status-text">
            {isDrawing ? '🎨 Drawing...' : hasStartedDrawing ? '⏸️ Paused' : '✨ Ready to Draw!'}
          </span>
        </div>
      </div>
    </div>
  );
};