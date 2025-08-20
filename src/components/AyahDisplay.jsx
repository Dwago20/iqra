import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';
import { sanitizeTajweedHtml } from '../utils/sanitizeHtml';
import { getAudioUrl } from '../api/quranClient';

const AyahDisplay = ({ ayah, surahName, ayahNumber, surahNumber, selectedReciterId = 5 }) => {
  const [showTajweed, setShowTajweed] = useState(true);

  const renderTajweedText = () => {
    // New: Check for tajweedHtml (from Quran Foundation API) first
    if (showTajweed && ayah.tajweedHtml) {
      return (
        <span
          className="tajweed-colored"
          dangerouslySetInnerHTML={{ __html: sanitizeTajweedHtml(ayah.tajweedHtml) }}
        />
      );
    }
    
    // Legacy: Check for local tajweed array structure
    if (showTajweed && ayah.tajweed) {
      return ayah.tajweed.map((segment, index) => (
        <span key={index} className={segment.class}>
          {segment.text}
          {index < ayah.tajweed.length - 1 ? ' ' : ''}
        </span>
      ));
    }
    
    // Fallback: Plain Arabic text
    return <span className="plain-arabic">{ayah.arabic || ayah.textArabic}</span>;
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
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="button secondary"
                onClick={() => speakText(ayah.arabic || ayah.textArabic)}
                style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                title="Listen to Arabic pronunciation (TTS)"
              >
                <Volume2 size={16} />
              </button>
              <button
                className="button secondary"
                onClick={async () => {
                  try {
                    const url = await getAudioUrl({
                      surahNumber: surahNumber,
                      ayahNumber: ayahNumber,
                      reciterId: selectedReciterId,
                    });
                    const audio = new Audio(url);
                    audio.play().catch(console.warn);
                  } catch (error) {
                    console.warn('Failed to get audio URL:', error);
                  }
                }}
                style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                title="Play recitation audio"
              >
                Play
              </button>
              <button
                onClick={() => setShowTajweed(v => !v)}
                style={{ 
                  padding: '0.5rem', 
                  fontSize: '0.75rem',
                  background: 'none',
                  border: '1px solid #d1d5db',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
                title="Toggle tajweed colors"
              >
                {showTajweed ? "Hide Tajwīd" : "Show Tajwīd"}
              </button>
            </div>
          </div>
          <div className="arabic-text ayah-text" dir="rtl" lang="ar">
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
