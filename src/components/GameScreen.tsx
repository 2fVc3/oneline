import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PencilDrawing } from './PencilDrawing';
import { Timer } from './Timer';
import { GameUI } from './GameUI';
import { GameControls } from './GameControls';
import { getWordForLevel } from '../utils/wordLists';
import { GameResult } from '../App';

interface GameScreenProps {
  level: number;
  onGameComplete: (result: GameResult) => void;
  onBackToMenu: () => void;
}

export const GameScreen: React.FC<GameScreenProps> = ({ 
  level, 
  onGameComplete, 
  onBackToMenu 
}) => {
  const [currentWord, setCurrentWord] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasStartedDrawing, setHasStartedDrawing] = useState(false);
  const [gameActive, setGameActive] = useState(true);
  const [showSubmitButton, setShowSubmitButton] = useState(false);
  const drawingRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Get word for current level
  useEffect(() => {
    const word = getWordForLevel(level);
    setCurrentWord(word);
  }, [level]);

  // Timer logic
  useEffect(() => {
    if (gameActive && hasStartedDrawing) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gameActive, hasStartedDrawing]);

  const handleTimeUp = useCallback(() => {
    setGameActive(false);
    onGameComplete({
      word: currentWord,
      completed: false,
      timeLeft: 0,
      level
    });
  }, [currentWord, level, onGameComplete]);

  const handleDrawingStart = () => {
    setIsDrawing(true);
    if (!hasStartedDrawing) {
      setHasStartedDrawing(true);
    }
  };

  const handleDrawingEnd = () => {
    setIsDrawing(false);
    // Auto-submit when drawing ends (left mouse button release)
    handleSubmitDrawing();
  };

  const handleSubmitDrawing = () => {
    setGameActive(false);
    setShowSubmitButton(false);
    onGameComplete({
      word: currentWord,
      completed: true,
      timeLeft,
      level
    });
  };

  const handleClear = () => {
    drawingRef.current?.clearCanvas();
    setHasStartedDrawing(false);
    setShowSubmitButton(false);
    setTimeLeft(60);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return (
    <div className="game-screen">
      <GameUI 
        word={currentWord}
        level={level}
        isDrawing={isDrawing}
        hasStartedDrawing={hasStartedDrawing}
        onClear={handleClear}
        onBackToMenu={onBackToMenu}
      />
      
      <Timer timeLeft={timeLeft} isActive={hasStartedDrawing && gameActive} />
      
      {showSubmitButton && (
        <GameControls 
          onSubmit={handleSubmitDrawing}
          onClear={handleClear}
        />
      )}
      
      <PencilDrawing 
        ref={drawingRef}
        onDrawingStart={handleDrawingStart}
        onDrawingEnd={handleDrawingEnd}
        gameActive={gameActive}
      />
      
      <div className="game-instructions">
        <p className="instruction-text">
          {!hasStartedDrawing 
            ? "Click and hold to start drawing!"
            : isDrawing 
              ? "Keep drawing..."
              : showSubmitButton
                ? "Release to pause. Submit when ready!"
                : "Drawing submitted!"
          }
        </p>
      </div>
    </div>
  );
};