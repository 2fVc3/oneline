import React, { useState } from 'react';
import { ArrowLeft, Eye, Users, Calendar, Trash2 } from 'lucide-react';

interface Drawing {
  id: string;
  word: string;
  date: string;
  guesses: number;
  correctGuesses: number;
  imageData: string;
}

interface MyDrawingsScreenProps {
  onBack: () => void;
}

export const MyDrawingsScreen: React.FC<MyDrawingsScreenProps> = ({ onBack }) => {
  // Mock data - in real app this would come from storage/database
  const [drawings] = useState<Drawing[]>([
    {
      id: '1',
      word: 'cat',
      date: '2024-01-15',
      guesses: 5,
      correctGuesses: 4,
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    },
    {
      id: '2',
      word: 'house',
      date: '2024-01-14',
      guesses: 3,
      correctGuesses: 2,
      imageData: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
    }
  ]);

  const [selectedDrawing, setSelectedDrawing] = useState<Drawing | null>(null);

  const handleViewDrawing = (drawing: Drawing) => {
    setSelectedDrawing(drawing);
  };

  const handleCloseModal = () => {
    setSelectedDrawing(null);
  };

  const getSuccessRate = (drawing: Drawing) => {
    if (drawing.guesses === 0) return 0;
    return Math.round((drawing.correctGuesses / drawing.guesses) * 100);
  };

  return (
    <div className="my-drawings-screen">
      <div className="my-drawings-container">
        <div className="my-drawings-header">
          <button className="sketch-button small" onClick={onBack}>
            <ArrowLeft className="button-icon" />
          </button>
          <h1 className="my-drawings-title">My Drawings</h1>
        </div>
        
        <div className="my-drawings-content">
          {drawings.length === 0 ? (
            <div className="empty-state">
              <p>No drawings yet! Start playing to see your artwork here.</p>
            </div>
          ) : (
            <div className="drawings-grid">
              {drawings.map((drawing) => (
                <div key={drawing.id} className="drawing-card">
                  <div className="drawing-preview">
                    <div className="drawing-placeholder">
                      <span className="drawing-word">"{drawing.word}"</span>
                    </div>
                  </div>
                  
                  <div className="drawing-info">
                    <h3 className="drawing-title">{drawing.word}</h3>
                    <p className="drawing-date">{new Date(drawing.date).toLocaleDateString()}</p>
                    
                    <div className="drawing-stats">
                      <div className="stat">
                        <Users className="stat-icon" />
                        <span>{drawing.guesses} guesses</span>
                      </div>
                      <div className="stat success">
                        <span className="success-rate">{getSuccessRate(drawing)}%</span>
                        <span>success</span>
                      </div>
                    </div>
                    
                    <div className="drawing-actions">
                      <button 
                        className="sketch-button small primary"
                        onClick={() => handleViewDrawing(drawing)}
                      >
                        <Eye className="button-icon" />
                        View
                      </button>
                      <button className="sketch-button small danger">
                        <Trash2 className="button-icon" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {selectedDrawing && (
        <div className="drawing-modal" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>"{selectedDrawing.word}"</h2>
              <button className="close-button" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="large-drawing-preview">
                <span className="large-drawing-word">"{selectedDrawing.word}"</span>
              </div>
              <div className="detailed-stats">
                <div className="stat-row">
                  <span>Total Guesses:</span>
                  <span>{selectedDrawing.guesses}</span>
                </div>
                <div className="stat-row">
                  <span>Correct Guesses:</span>
                  <span>{selectedDrawing.correctGuesses}</span>
                </div>
                <div className="stat-row">
                  <span>Success Rate:</span>
                  <span>{getSuccessRate(selectedDrawing)}%</span>
                </div>
                <div className="stat-row">
                  <span>Date:</span>
                  <span>{new Date(selectedDrawing.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};