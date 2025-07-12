import React from 'react';
import { Play, BookOpen, Settings, Trophy, Sparkles } from 'lucide-react';

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
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <div className="menu-container bounce-in">
        <div className="game-title">
          <h1 className="title-text">One Line</h1>
          <p className="subtitle-text">✨ Draw it in one magical stroke! ✨</p>
        </div>
        
        <div className="level-display slide-in-up">
          <Trophy className="trophy-icon" />
          <span className="level-text">Level {currentLevel}</span>
          <Sparkles className="trophy-icon" style={{ color: '#ff6b6b' }} />
        </div>
        
        <div className="menu-buttons">
          <button className="modern-button primary" onClick={onStartGame}>
            <Play className="button-icon" />
            Start Adventure
          </button>
          
          <button className="modern-button secondary" onClick={onInstructions}>
            <BookOpen className="button-icon" />
            How to Play
          </button>
          
          <button className="modern-button accent" onClick={onSettings}>
            <Settings className="button-icon" />
            Settings
          </button>
        </div>
      </div>
    </div>
  );
};