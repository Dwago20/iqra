import React from 'react';
import { Volume2 } from 'lucide-react';

const AyahDisplay = ({ ayah, surahName, ayahNumber }) => {
  const renderTajweedText = () => {
    if (!ayah.tajweed) {
      return <span>{ayah.arabic}</span>;
    }
    
    return ayah.tajweed.map((segment, index) => (
      <span key={index} className={segment.class}>
        {segment.text}
        {index < ayah.tajweed.length - 1 ? ' ' : ''}
      </span>
    ));
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA'; // Arabic
      utterance.rate = 0.8; // Slightly slower for learning
      utterance.pitch = 1;
      utterance.volume = 1;
      
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="card ayah-display">
      <div className="ayah-header mb-4">
        <h3 style={{ margin: 0 }}>
          {surahName} - Ayah {ayahNumber}
        </h3>
      </div>
      
      <div className="ayah-content">
        {/* Arabic Text with Tajweed */}
        <div className="arabic-section mb-4">
          <div className="flex flex-between" style={{ alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>
              Arabic Text
            </h4>
            <button
              className="button secondary"
              onClick={() => speakText(ayah.arabic)}
              style={{ padding: '0.5rem', fontSize: '0.8rem' }}
              title="Listen to Arabic pronunciation"
            >
              <Volume2 size={16} />
            </button>
          </div>
          <div className="arabic-text">
            {renderTajweedText()}
          </div>
        </div>
        
        {/* Transliteration */}
        <div className="transliteration-section mb-4">
          <div className="flex flex-between" style={{ alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 style={{ margin: 0, fontSize: '1rem', color: '#6b7280' }}>
              Transliteration (Practice Target)
            </h4>
            <button
              className="button secondary"
              onClick={() => speakText(ayah.transliteration)}
              style={{ padding: '0.5rem', fontSize: '0.8rem' }}
              title="Listen to transliteration pronunciation"
            >
              <Volume2 size={16} />
            </button>
          </div>
          <div 
            className="transliteration-text"
            style={{
              padding: '1rem',
              background: '#f3f4f6',
              borderRadius: '8px',
              fontSize: '1.1rem',
              fontWeight: '500',
              fontFamily: 'monospace',
              border: '2px solid #e5e7eb'
            }}
          >
            {ayah.transliteration}
          </div>
        </div>
        
        {/* Translation */}
        <div className="translation-section">
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: '#6b7280' }}>
            Translation
          </h4>
          <div 
            className="translation-text"
            style={{
              padding: '1rem',
              background: '#f9fafb',
              borderRadius: '8px',
              fontSize: '1rem',
              fontStyle: 'italic',
              color: '#374151'
            }}
          >
            {ayah.translation}
          </div>
        </div>
      </div>
      
      {/* Tajweed Legend */}
      <div className="tajweed-legend mt-4" style={{ borderTop: '1px solid #e5e7eb', paddingTop: '1rem' }}>
        <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: '#6b7280' }}>
          Tajweed Color Guide:
        </h5>
        <div className="legend-items" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.75rem' }}>
          <span className="legend-item">
            <span className="tajweed-ghunna">■</span> Ghunna
          </span>
          <span className="legend-item">
            <span className="tajweed-madd">■</span> Madd
          </span>
          <span className="legend-item">
            <span className="tajweed-qalqala">■</span> Qalqala
          </span>
          <span className="legend-item">
            <span className="tajweed-idgham">■</span> Idgham
          </span>
          <span className="legend-item">
            <span className="tajweed-ikhfa">■</span> Ikhfa
          </span>
        </div>
      </div>
    </div>
  );
};

export default AyahDisplay;
