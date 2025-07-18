import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Home } from 'lucide-react';
import { GameResult } from '../App';

interface GameOverScreenProps {
  result: GameResult;
  onNextLevel: () => void;
  onRetry: () => void;
  onBackToMenu: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  result,
  onNextLevel,
  onRetry,
  onBackToMenu
}) => {
  const isSuccess = result.completed && result.timeLeft > 0;
  
  // Debug log to check if word is being received
  console.log('GameOverScreen received result:', {
    word: result.word,
    wordLength: result.word?.length || 0,
    completed: result.completed,
    level: result.level,
    hasImage: !!result.drawingImage
  });
  
  // Ensure we have a valid word
  const displayWord = result.word && result.word.trim() !== '' ? result.word : 'Unknown';
  console.log('Display word will be:', displayWord);
  
  return (
    <div className="game-over-screen">
      <div className="game-over-container">
        <div className="result-header">
          <div className={`result-icon ${isSuccess ? 'success' : 'failure'}`}>
            <Trophy />
          </div>
          <h1 className="result-title">
            {isSuccess ? 'Well Done!' : 'Time\'s Up!'}
          </h1>
          <p className="result-subtitle">
            {isSuccess 
              ? 'You successfully drew the word in one line!'
              : 'Don\'t worry, try again!'
            }
          </p>
        </div>
        
        {result.drawingImage && (
          <div className="polaroid-container">
            <div className="polaroid">
              <img src={result.drawingImage} alt="Your drawing" className="polaroid-image" />
              <div className="polaroid-caption">"{displayWord}"</div>
            </div>
          </div>
        )}
        
        <div className="result-details">
          <div className="result-card">
            <h3 className="result-word">"{displayWord}"</h3>
            <div className="result-stats">
              <div className="stat-item">
                <span className="stat-label">Level:</span>
                <span className="stat-value">{result.level}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Time Left:</span>
                <span className="stat-value">
                  {Math.floor(result.timeLeft / 60)}:{(result.timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Status:</span>
                <span className={`stat-value ${isSuccess ? 'success' : 'failure'}`}>
                  {isSuccess ? 'Completed' : 'Incomplete'}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="result-actions">
          {isSuccess ? (
            <button className="sketch-button primary large" onClick={onNextLevel}>
              <ArrowRight className="button-icon" />
              Next Level
            </button>
          ) : (
            <button className="sketch-button primary large" onClick={onRetry}>
              <RotateCcw className="button-icon" />
              Try Again
            </button>
          )}
          
          <button className="sketch-button secondary" onClick={onBackToMenu}>
            <Home className="button-icon" />
            Main Menu
          </button>
        </div>
        
        <div className="result-decoration">
          <div className="sketch-star star-1">★</div>
          <div className="sketch-star star-2">★</div>
          <div className="sketch-star star-3">★</div>
        </div>
      </div>
    </div>
  );
};