import React, { useState, useRef, useEffect } from 'react';
import { Volume2, Play, Pause, RotateCcw, Repeat, Gauge } from 'lucide-react';
import { sanitizeTajweedHtml } from '../utils/sanitizeHtml';
import { getAudioUrl } from '../api/quranClient';

const AyahDisplay = ({ ayah, surahName, ayahNumber, surahNumber, selectedReciterId = 5, settings }) => {
  const showTajweed = settings?.showTajweed ?? true;
  const largeArabicFont = settings?.largeArabicFont ?? false;
  
  // Audio player state
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Speed options
  const speedOptions = [0.5, 0.75, 1, 1.25, 1.5];

  // Load audio URL when ayah/reciter changes
  useEffect(() => {
    loadAudioUrl();
  }, [ayahNumber, surahNumber, selectedReciterId]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const loadAudioUrl = async () => {
    try {
      setLoading(true);
      const url = await getAudioUrl({
        surahNumber: surahNumber,
        ayahNumber: ayahNumber,
        reciterId: selectedReciterId,
      });
      setAudioUrl(url);
    } catch (error) {
      console.warn('Failed to get audio URL:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeAudio = () => {
    if (audioUrl && !audioRef.current) {
      audioRef.current = new Audio(audioUrl);
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = isLooping;
      
      audioRef.current.addEventListener('ended', () => {
        if (!isLooping) {
          setIsPlaying(false);
        }
      });
      
      audioRef.current.addEventListener('pause', () => {
        setIsPlaying(false);
      });
      
      audioRef.current.addEventListener('play', () => {
        setIsPlaying(true);
      });
    }
  };

  const togglePlayPause = () => {
    if (!audioUrl) return;
    
    initializeAudio();
    
    if (isPlaying) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play().catch(console.warn);
    }
  };

  const restartAudio = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(console.warn);
      }
    }
  };

  const toggleLoop = () => {
    const newLooping = !isLooping;
    setIsLooping(newLooping);
    if (audioRef.current) {
      audioRef.current.loop = newLooping;
    }
  };

  const changeSpeed = (rate) => {
    setPlaybackRate(rate);
    if (audioRef.current) {
      audioRef.current.playbackRate = rate;
    }
  };

  // Update audio settings when state changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = isLooping;
    }
  }, [playbackRate, isLooping]);

  // Reset audio when URL changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setIsPlaying(false);
    }
  }, [audioUrl]);

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
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <button
                className="button secondary"
                onClick={() => speakText(ayah.arabic || ayah.textArabic)}
                style={{ padding: '0.5rem', fontSize: '0.8rem' }}
                title="Listen to Arabic pronunciation (TTS)"
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>
          
          {/* Practice Mode Audio Controls */}
          <div style={{
            background: 'var(--bg-accent)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            marginBottom: 'var(--space-md)'
          }}>
            <h5 style={{ 
              margin: '0 0 0.75rem 0', 
              fontSize: '0.875rem', 
              fontWeight: '600',
              color: 'var(--text-primary)'
            }}>
              🎧 Practice Mode
            </h5>
            
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              flexWrap: 'wrap'
            }}>
              {/* Play/Pause Button */}
              <button
                className="button"
                onClick={togglePlayPause}
                disabled={loading || !audioUrl}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 1rem',
                  background: isPlaying ? 'var(--warning-color)' : 'var(--primary-color)',
                  opacity: loading || !audioUrl ? 0.6 : 1
                }}
                title={isPlaying ? 'Pause audio' : 'Play audio'}
              >
                {loading ? (
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid transparent',
                    borderTop: '2px solid currentColor',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                ) : isPlaying ? (
                  <Pause size={16} />
                ) : (
                  <Play size={16} />
                )}
                {loading ? 'Loading...' : isPlaying ? 'Pause' : 'Play'}
              </button>

              {/* Restart Button */}
              <button
                className="button secondary"
                onClick={restartAudio}
                disabled={!audioUrl}
                style={{
                  padding: '0.5rem',
                  opacity: !audioUrl ? 0.6 : 1
                }}
                title="Restart from beginning"
              >
                <RotateCcw size={16} />
              </button>

              {/* Loop Toggle */}
              <button
                className="button secondary"
                onClick={toggleLoop}
                disabled={!audioUrl}
                style={{
                  padding: '0.5rem',
                  background: isLooping ? 'var(--primary-color)' : 'transparent',
                  color: isLooping ? 'white' : 'var(--text-secondary)',
                  opacity: !audioUrl ? 0.6 : 1
                }}
                title={isLooping ? 'Disable loop' : 'Enable loop'}
              >
                <Repeat size={16} />
              </button>

              {/* Speed Control */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem',
                marginLeft: '0.5rem'
              }}>
                <Gauge size={16} style={{ color: 'var(--text-muted)' }} />
                <select
                  value={playbackRate}
                  onChange={(e) => changeSpeed(parseFloat(e.target.value))}
                  disabled={!audioUrl}
                  style={{
                    padding: '0.25rem 0.5rem',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    background: 'var(--bg-primary)',
                    opacity: !audioUrl ? 0.6 : 1
                  }}
                  title="Playback speed"
                >
                  {speedOptions.map(speed => (
                    <option key={speed} value={speed}>
                      {speed}x
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {isLooping && (
              <div style={{
                marginTop: '0.5rem',
                padding: '0.5rem',
                background: 'var(--primary-color)',
                color: 'white',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                textAlign: 'center'
              }}>
                🔄 Loop mode active - Audio will repeat automatically
              </div>
            )}
          </div>
          
          <div 
            className="arabic-text ayah-text" 
            dir="rtl" 
            lang="ar"
            style={{
              fontSize: largeArabicFont ? '1.75rem' : '1.35rem',
              lineHeight: largeArabicFont ? '2.75rem' : '2.25rem'
            }}
          >
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
