import React, { useState } from 'react';
import { ArrowLeft, Eye, Users, Plus, Trash2 } from 'lucide-react';

interface WordDrawing {
  id: string;
  word: string;
  playerName: string;
  date: string;
  guesses: number;
  correctGuesses: number;
}

interface MyWordsScreenProps {
  onBack: () => void;
}

export const MyWordsScreen: React.FC<MyWordsScreenProps> = ({ onBack }) => {
  const [customWords] = useState<string[]>(['elephant', 'rainbow', 'castle']);
  const [wordDrawings] = useState<WordDrawing[]>([
    {
      id: '1',
      word: 'elephant',
      playerName: 'Player123',
      date: '2024-01-15',
      guesses: 8,
      correctGuesses: 6
    },
    {
      id: '2',
      word: 'rainbow',
      playerName: 'ArtistPro',
      date: '2024-01-14',
      guesses: 4,
      correctGuesses: 4
    }
  ]);

  const [selectedWord, setSelectedWord] = useState<string | null>(null);

  const getWordStats = (word: string) => {
    const drawings = wordDrawings.filter(d => d.word === word);
    const totalGuesses = drawings.reduce((sum, d) => sum + d.guesses, 0);
    const totalCorrect = drawings.reduce((sum, d) => sum + d.correctGuesses, 0);
    const successRate = totalGuesses > 0 ? Math.round((totalCorrect / totalGuesses) * 100) : 0;
    
    return {
      drawings: drawings.length,
      totalGuesses,
      totalCorrect,
      successRate
    };
  };

  return (
    <div className="my-words-screen">
      <div className="my-words-container">
        <div className="my-words-header">
          <button className="sketch-button small" onClick={onBack}>
            <ArrowLeft className="button-icon" />
          </button>
          <h1 className="my-words-title">My Words</h1>
        </div>
        
        <div className="my-words-content">
          <div className="words-section">
            <h3 className="section-title">Your Custom Words</h3>
            <p className="section-description">
              Words you've added to the game and how players performed drawing them
            </p>
            
            {customWords.length === 0 ? (
              <div className="empty-state">
                <p>No custom words yet! Add some in Settings to see how players draw them.</p>
              </div>
            ) : (
              <div className="words-grid">
                {customWords.map((word) => {
                  const stats = getWordStats(word);
                  return (
                    <div key={word} className="word-card">
                      <div className="word-header">
                        <h3 className="word-title">"{word}"</h3>
                        <div className="word-actions">
                          <button 
                            className="sketch-button tiny primary"
                            onClick={() => setSelectedWord(word)}
                          >
                            <Eye className="button-icon" />
                          </button>
                          <button className="sketch-button tiny danger">
                            <Trash2 className="button-icon" />
                          </button>
                        </div>
                      </div>
                      
                      <div className="word-stats">
                        <div className="stat-item">
                          <span className="stat-label">Drawings:</span>
                          <span className="stat-value">{stats.drawings}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Total Guesses:</span>
                          <span className="stat-value">{stats.totalGuesses}</span>
                        </div>
                        <div className="stat-item">
                          <span className="stat-label">Success Rate:</span>
                          <span className={`stat-value ${stats.successRate > 70 ? 'success' : stats.successRate > 40 ? 'warning' : 'danger'}`}>
                            {stats.successRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          {selectedWord && (
            <div className="word-drawings-section">
              <h3 className="section-title">Drawings for "{selectedWord}"</h3>
              <div className="drawings-list">
                {wordDrawings
                  .filter(d => d.word === selectedWord)
                  .map((drawing) => (
                    <div key={drawing.id} className="drawing-item">
                      <div className="drawing-preview-small">
                        <span className="small-word">"{drawing.word}"</span>
                      </div>
                      <div className="drawing-details">
                        <p className="player-name">by {drawing.playerName}</p>
                        <p className="drawing-date">{new Date(drawing.date).toLocaleDateString()}</p>
                        <div className="mini-stats">
                          <span>{drawing.correctGuesses}/{drawing.guesses} correct</span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};