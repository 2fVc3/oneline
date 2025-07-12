import React from 'react';
import { Trophy, RotateCcw, ArrowRight, Home, Star, Zap } from 'lucide-react';
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
  
  return (
    <div className="game-over-screen">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      {/* Confetti for success */}
      {isSuccess && (
        <div className="confetti-container">
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
          <div className="confetti"></div>
        </div>
      )}

      <div className="game-over-container bounce-in">
        <div className="result-header">
          <div className={`result-icon ${isSuccess ? 'success' : 'failure'}`}>
            {isSuccess ? <Star /> : <Zap />}
          </div>
          <h1 className="result-title">
            {isSuccess ? '🎉 Amazing!' : '⏰ Time\'s Up!'}
          </h1>
          <p className="result-subtitle">
            {isSuccess 
              ? 'You created a masterpiece in one line!'
              : 'Don\'t worry, every artist needs practice!'
            }
          </p>
        </div>
        
        <div className="result-details slide-in-up">
          <div className="result-card">
            <h3 className="result-word">✨ "{result.word}" ✨</h3>
            <div className="result-stats">
              <div className="stat-item">
                <span className="stat-label">🏆 Level:</span>
                <span className="stat-value">{result.level}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">⏱️ Time Left:</span>
                <span className="stat-value">
                  {Math.floor(result.timeLeft / 60)}:{(result.timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">🎯 Status:</span>
                <span className={`stat-value ${isSuccess ? 'success' : 'failure'}`}>
                  {isSuccess ? '✅ Completed' : '❌ Incomplete'}
                </span>
              </div>
              {isSuccess && (
                <div className="stat-item">
                  <span className="stat-label">🌟 Score:</span>
                  <span className="stat-value success">
                    {Math.max(100, result.timeLeft * 10)} points
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="result-actions">
          {isSuccess ? (
            <button className="modern-button primary" onClick={onNextLevel}>
              <ArrowRight className="button-icon" />
              Next Challenge
            </button>
          ) : (
            <button className="modern-button primary" onClick={onRetry}>
              <RotateCcw className="button-icon" />
              Try Again
            </button>
          )}
          
          <button className="modern-button secondary" onClick={onBackToMenu}>
            <Home className="button-icon" />
            Main Menu
          </button>
        </div>
      </div>
    </div>
  );
};