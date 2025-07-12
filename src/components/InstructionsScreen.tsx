import React from 'react';
import { ArrowLeft, MousePointer, Clock, Trophy, Zap, Star, Target } from 'lucide-react';

interface InstructionsScreenProps {
  onBack: () => void;
}

export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onBack }) => {
  return (
    <div className="instructions-screen">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <div className="instructions-container">
        <div className="instructions-header">
          <button className="game-button" onClick={onBack}>
            <ArrowLeft className="button-icon" />
            Back
          </button>
          <h1 className="instructions-title">🎨 How to Play</h1>
        </div>
        
        <div className="instructions-content">
          <div className="instruction-card bounce-in">
            <div className="instruction-icon">
              <MousePointer />
            </div>
            <h3>✨ One Magic Line</h3>
            <p>Draw the given word using only ONE continuous line! Click and hold to start your masterpiece, and don't lift your finger until you're completely done creating your art!</p>
          </div>
          
          <div className="instruction-card bounce-in" style={{ animationDelay: '0.1s' }}>
            <div className="instruction-icon" style={{ background: 'linear-gradient(135deg, #4ecdc4, #44a08d)' }}>
              <Clock />
            </div>
            <h3>⏰ Race Against Time</h3>
            <p>You have 60 exciting seconds to complete your drawing! The timer starts as soon as you begin drawing, so plan your artistic strategy before you start!</p>
          </div>
          
          <div className="instruction-card bounce-in" style={{ animationDelay: '0.2s' }}>
            <div className="instruction-icon" style={{ background: 'linear-gradient(135deg, #ffe66d, #ffb347)' }}>
              <Trophy />
            </div>
            <h3>🏆 Level Up Your Art</h3>
            <p>Each level gets progressively more challenging with complex words! Complete a drawing to advance to the next level and unlock new artistic challenges!</p>
          </div>
          
          <div className="instruction-card bounce-in" style={{ animationDelay: '0.3s' }}>
            <div className="instruction-icon" style={{ background: 'linear-gradient(135deg, #ff8b94, #ff6b6b)' }}>
              <Zap />
            </div>
            <h3>🎯 Pro Artist Tips</h3>
            <p>• 🧠 Plan your route before starting<br/>• 🎨 Simple shapes work best<br/>• ✨ Don't worry about perfection<br/>• 🎉 Have fun and be creative!</p>
          </div>

          <div className="instruction-card bounce-in" style={{ animationDelay: '0.4s' }}>
            <div className="instruction-icon" style={{ background: 'linear-gradient(135deg, #a8e6cf, #88d8a3)' }}>
              <Star />
            </div>
            <h3>🌟 Scoring System</h3>
            <p>Earn points based on your speed and accuracy! The faster you complete your drawing, the more points you earn. Bonus points for creative interpretations!</p>
          </div>

          <div className="instruction-card bounce-in" style={{ animationDelay: '0.5s' }}>
            <div className="instruction-icon" style={{ background: 'linear-gradient(135deg, #ffd93d, #ff6b6b)' }}>
              <Target />
            </div>
            <h3>🎪 Fun Challenges</h3>
            <p>From simple objects to complex concepts, each word presents a unique artistic challenge. Express your creativity and see how others might interpret the same word!</p>
          </div>
        </div>
        
        <div className="instructions-footer">
          <button className="modern-button primary" onClick={onBack}>
            <Star className="button-icon" />
            Let's Create Art!
          </button>
        </div>
      </div>
    </div>
  );
};