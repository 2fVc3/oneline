import React from 'react';
import { Play, BookOpen, Settings, Trophy } from 'lucide-react';

interface MainMenuProps {
  onStartGame: () => void;
  onInstructions: () => void;
  onSettings: () => void;
  currentLevel: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({ 
  onStartGame, 
  onInstructions, 
  onSettings, 
  currentLevel 
}) => {
  return (
    <div className="main-menu">
      <div className="menu-container">
        <div className="game-title">
          <h1 className="title-text">One Line</h1>
          <p className="subtitle-text">Draw it in one continuous line!</p>
        </div>
        
        <div className="level-display">
          <Trophy className="trophy-icon" />
          <span className="level-text">Level {currentLevel}</span>
        </div>
        
        <div className="menu-buttons">
          <button className="sketch-button primary" onClick={onStartGame}>
            <Play className="button-icon" />
            Start Game
          </button>
          
          <button className="sketch-button secondary" onClick={onInstructions}>
            <BookOpen className="button-icon" />
            How to Play
          </button>
          
          <button className="sketch-button secondary" onClick={onSettings}>
            <Settings className="button-icon" />
            Settings
          </button>
        </div>
        
        <div className="menu-decoration">
          <div className="sketch-line line-1"></div>
          <div className="sketch-line line-2"></div>
          <div className="sketch-line line-3"></div>
        </div>
      </div>
    </div>
  );
};