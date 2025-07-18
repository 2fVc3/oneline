import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PencilDrawing } from './PencilDrawing';
import { Timer } from './Timer';
import { GameUI } from './GameUI';
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
  const [capturedImage, setCapturedImage] = useState<string>('');
  const drawingRef = useRef<any>(null);
  const timerRef = useRef<NodeJS.Timeout>();

  // Get word for current level
  useEffect(() => {
    const word = getWordForLevel(level);
    console.log('Generated word for level', level, ':', word); // Debug log
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
    console.log('Time up for word:', currentWord); // Debug log
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

  const handleDrawingEnd = (imageData: string) => {
    setIsDrawing(false);
    setCapturedImage(imageData);
    console.log('Drawing ended, current word:', currentWord); // Debug log
    // Auto-submit when drawing ends with polaroid image
    setTimeout(() => {
      handleSubmitDrawing(imageData);
    }, 100);
  };

  const handleSubmitDrawing = (imageData: string) => {
    setGameActive(false);
    console.log('Submitting drawing for word:', currentWord, 'Image data length:', imageData.length); // Debug log
    onGameComplete({
      word: currentWord,
      completed: true,
      timeLeft,
      level,
      drawingImage: imageData
    });
  };

  const handleClear = () => {
    drawingRef.current?.clearCanvas();
    setHasStartedDrawing(false);
    setCapturedImage('');
    setTimeLeft(60);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Debug: Log current word whenever it changes
  useEffect(() => {
    console.log('GameScreen currentWord updated:', currentWord);
  }, [currentWord]);

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
      
      <PencilDrawing 
        ref={drawingRef}
        onDrawingStart={handleDrawingStart}
        onDrawingEnd={handleDrawingEnd}
        gameActive={gameActive}
      />
      
      <div className="game-instructions">
        <p className="instruction-text">
          {!hasStartedDrawing 
           ? "Click and hold to start drawing with your cursor!"
            : isDrawing 
              ? "Keep drawing..."
             : "Release to capture your drawing!"
          }
        </p>
      </div>
    </div>
  );
};