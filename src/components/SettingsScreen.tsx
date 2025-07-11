import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';

interface SettingsScreenProps {
  onBack: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack }) => {
  const [customWords, setCustomWords] = useState<string[]>([]);
  const [newWord, setNewWord] = useState('');

  const handleAddWord = () => {
    if (newWord.trim() && !customWords.includes(newWord.trim().toLowerCase())) {
      setCustomWords([...customWords, newWord.trim().toLowerCase()]);
      setNewWord('');
    }
  };

  const handleRemoveWord = (wordToRemove: string) => {
    setCustomWords(customWords.filter(word => word !== wordToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddWord();
    }
  };

  return (
    <div className="settings-screen">
      <div className="settings-container">
        <div className="settings-header">
          <button className="sketch-button small" onClick={onBack}>
            <ArrowLeft className="button-icon" />
          </button>
          <h1 className="settings-title">Settings</h1>
        </div>
        
        <div className="settings-content">
          <div className="settings-section">
            <h3 className="section-title">Custom Words</h3>
            <p className="section-description">
              Add your own words to make the game more personal and challenging!
            </p>
            
            <div className="add-word-container">
              <input
                type="text"
                className="sketch-input"
                placeholder="Enter a word..."
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={20}
              />
              <button 
                className="sketch-button small primary" 
                onClick={handleAddWord}
                disabled={!newWord.trim()}
              >
                <Plus className="button-icon" />
              </button>
            </div>
            
            <div className="custom-words-list">
              {customWords.length === 0 ? (
                <p className="empty-state">No custom words yet. Add some above!</p>
              ) : (
                customWords.map((word, index) => (
                  <div key={index} className="word-item">
                    <span className="word-text">{word}</span>
                    <button 
                      className="sketch-button tiny danger"
                      onClick={() => handleRemoveWord(word)}
                    >
                      <Trash2 className="button-icon" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="settings-section">
            <h3 className="section-title">Game Info</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Default Timer:</span>
                <span className="info-value">60 seconds</span>
              </div>
              <div className="info-item">
                <span className="info-label">Total Word Bank:</span>
                <span className="info-value">1000+ words</span>
              </div>
              <div className="info-item">
                <span className="info-label">Difficulty Levels:</span>
                <span className="info-value">Progressive</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};