import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Palette, Sparkles } from 'lucide-react';

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
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
        <div className="floating-shape shape-4"></div>
      </div>

      <div className="settings-container">
        <div className="settings-header">
          <button className="game-button" onClick={onBack}>
            <ArrowLeft className="button-icon" />
            Back
          </button>
          <h1 className="settings-title">⚙️ Settings</h1>
        </div>
        
        <div className="settings-content">
          <div className="settings-section bounce-in">
            <h3 className="section-title">🎨 Custom Words</h3>
            <p className="section-description">
              Add your own words to make the game more personal and challenging! Create your own artistic vocabulary.
            </p>
            
            <div className="add-word-container">
              <input
                type="text"
                className="modern-input"
                placeholder="Enter a creative word..."
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                onKeyPress={handleKeyPress}
                maxLength={20}
              />
              <button 
                className="modern-button secondary" 
                onClick={handleAddWord}
                disabled={!newWord.trim()}
                style={{ minWidth: 'auto', padding: '1rem' }}
              >
                <Plus className="button-icon" />
              </button>
            </div>
            
            <div className="custom-words-list">
              {customWords.length === 0 ? (
                <p className="empty-state">✨ No custom words yet. Add some creative words above! ✨</p>
              ) : (
                customWords.map((word, index) => (
                  <div key={index} className="word-item slide-in-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    <span className="word-text">🎯 {word}</span>
                    <button 
                      className="game-button"
                      onClick={() => handleRemoveWord(word)}
                      style={{ 
                        background: 'linear-gradient(135deg, #ff6b6b, #ff8b94)',
                        color: 'white',
                        minWidth: 'auto',
                        padding: '0.5rem'
                      }}
                    >
                      <Trash2 className="button-icon" style={{ width: '1rem', height: '1rem' }} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="settings-section bounce-in" style={{ animationDelay: '0.2s' }}>
            <h3 className="section-title">📊 Game Statistics</h3>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">⏱️ Default Timer:</span>
                <span className="info-value">60 seconds</span>
              </div>
              <div className="info-item">
                <span className="info-label">📚 Total Word Bank:</span>
                <span className="info-value">1000+ words</span>
              </div>
              <div className="info-item">
                <span className="info-label">🎯 Difficulty Levels:</span>
                <span className="info-value">Progressive</span>
              </div>
              <div className="info-item">
                <span className="info-label">🎨 Art Style:</span>
                <span className="info-value">One Line Drawing</span>
              </div>
              <div className="info-item">
                <span className="info-label">🌟 Custom Words:</span>
                <span className="info-value">{customWords.length} added</span>
              </div>
            </div>
          </div>

          <div className="settings-section bounce-in" style={{ animationDelay: '0.4s' }}>
            <h3 className="section-title">🎪 About One Line</h3>
            <p className="section-description">
              One Line is a creative drawing game that challenges your artistic skills and imagination. 
              Express complex ideas through simple, continuous lines and discover the beauty of minimalist art!
            </p>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">🎨 Version:</span>
                <span className="info-value">1.0.0</span>
              </div>
              <div className="info-item">
                <span className="info-label">✨ Theme:</span>
                <span className="info-value">Artistic & Creative</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};