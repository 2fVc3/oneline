import React from 'react';
import { ArrowLeft, MousePointer, Clock, Trophy, Zap } from 'lucide-react';

interface InstructionsScreenProps {
  onBack: () => void;
}

export const InstructionsScreen: React.FC<InstructionsScreenProps> = ({ onBack }) => {
  return (
    <div className="instructions-screen">
      <div className="instructions-container">
        <div className="instructions-header">
          <button className="sketch-button small" onClick={onBack}>
            <ArrowLeft className="button-icon" />
          </button>
          <h1 className="instructions-title">How to Play</h1>
        </div>
        
        <div className="instructions-content">
          <div className="instruction-card">
            <div className="instruction-icon">
              <MousePointer />
            </div>
            <h3>One Continuous Line</h3>
            <p>Draw the given word using only ONE continuous line. Click and hold to start drawing, and don't lift your finger until you're completely done!</p>
          </div>
          
          <div className="instruction-card">
            <div className="instruction-icon">
              <Clock />
            </div>
            <h3>Beat the Clock</h3>
            <p>You have 60 seconds to complete your drawing. The timer starts as soon as you begin drawing, so think before you start!</p>
          </div>
          
          <div className="instruction-card">
            <div className="instruction-icon">
              <Trophy />
            </div>
            <h3>Level Up</h3>
            <p>Each level gets progressively harder with more complex words. Complete a drawing to advance to the next level!</p>
          </div>
          
          <div className="instruction-card">
            <div className="instruction-icon">
              <Zap />
            </div>
            <h3>Pro Tips</h3>
            <p>• Plan your route before starting<br/>• Simple shapes work best<br/>• Don't worry about perfection<br/>• Have fun and be creative!</p>
          </div>
        </div>
        
        <div className="instructions-footer">
          <button className="sketch-button primary" onClick={onBack}>
            Got it!
          </button>
        </div>
      </div>
    </div>
  );
};