import React, { useState } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { InstructionsScreen } from './components/InstructionsScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { GameOverScreen } from './components/GameOverScreen';

export type GameState = 'menu' | 'instructions' | 'settings' | 'game' | 'gameOver';

export interface GameResult {
  word: string;
  completed: boolean;
  timeLeft: number;
  level: number;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('menu');
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameResult, setGameResult] = useState<GameResult | null>(null);

  const handleStartGame = () => {
    setGameState('game');
  };

  const handleGameComplete = (result: GameResult) => {
    setGameResult(result);
    if (result.completed) {
      setCurrentLevel(prev => prev + 1);
    }
    setGameState('gameOver');
  };

  const handleBackToMenu = () => {
    setGameState('menu');
  };

  const handleNextLevel = () => {
    setGameState('game');
  };

  const handleRetry = () => {
    setGameState('game');
  };

  return (
    <div className="app">
      {gameState === 'menu' && (
        <MainMenu 
          onStartGame={handleStartGame}
          onInstructions={() => setGameState('instructions')}
          onSettings={() => setGameState('settings')}
          currentLevel={currentLevel}
        />
      )}
      
      {gameState === 'instructions' && (
        <InstructionsScreen onBack={handleBackToMenu} />
      )}
      
      {gameState === 'settings' && (
        <SettingsScreen onBack={handleBackToMenu} />
      )}
      
      {gameState === 'game' && (
        <GameScreen 
          level={currentLevel}
          onGameComplete={handleGameComplete}
          onBackToMenu={handleBackToMenu}
        />
      )}
      
      {gameState === 'gameOver' && gameResult && (
        <GameOverScreen 
          result={gameResult}
          onNextLevel={handleNextLevel}
          onRetry={handleRetry}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </div>
  );
}

export default App;