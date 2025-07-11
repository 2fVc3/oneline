import React from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
  timeLeft: number;
  isActive: boolean;
}

export const Timer: React.FC<TimerProps> = ({ timeLeft, isActive }) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = (timeLeft / 60) * 100;
  
  const getTimerColor = () => {
    if (timeLeft > 30) return 'timer-green';
    if (timeLeft > 10) return 'timer-yellow';
    return 'timer-red';
  };

  return (
    <div className="timer-container">
      <div className="timer-display">
        <Clock className="timer-icon" />
        <span className={`timer-text ${getTimerColor()}`}>
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>
      </div>
      
      <div className="timer-bar">
        <div 
          className={`timer-fill ${getTimerColor()}`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};