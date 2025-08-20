import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Play, Square, AlertCircle } from 'lucide-react';
import { 
  isSpeechRecognitionSupported, 
  createSpeechRecognition, 
  calculateSimilarity,
  findMismatches,
  getAccuracyThreshold
} from '../utils/speechRecognition';
import { 
  playSuccess, 
  playError, 
  speakArabic, 
  stripHtmlTags, 
  unlockAudio 
} from '../utils/audioFeedback';

const VoiceRecorder = ({ targetText, onRecordingResult, disabled, currentAyah }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [lastResult, setLastResult] = useState(null);
  const [error, setError] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [playSounds, setPlaySounds] = useState(true);
  const [autoSpeak, setAutoSpeak] = useState(true);
  
  const recognitionRef = useRef(null);
  const timerRef = useRef(null);
  
  useEffect(() => {
    // Keyboard shortcut handler
    const handleKeyPress = (event) => {
      // Only handle space key when not typing in an input
      if (event.code === 'Space' && !['INPUT', 'TEXTAREA'].includes(event.target.tagName)) {
        event.preventDefault();
        if (isRecording) {
          stopRecording();
        } else if (!disabled && !isProcessing) {
          startRecording();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    
    // Initialize speech recognition
    if (isSpeechRecognitionSupported()) {
      recognitionRef.current = createSpeechRecognition();
      
      if (recognitionRef.current) {
        recognitionRef.current.onstart = () => {
          setIsRecording(true);
          setError(null);
          // Timer will be started by useEffect when isRecording becomes true
        };
        
        recognitionRef.current.onresult = (event) => {
          const result = event.results[0][0];
          const spokenText = result.transcript;
          const confidence = result.confidence;
          
          handleRecognitionResult(spokenText, confidence);
        };
        
        recognitionRef.current.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setError(`Recognition error: ${event.error}`);
          stopRecording();
        };
        
        recognitionRef.current.onend = () => {
          stopRecording();
        };
      }
    }
    
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording, disabled, isProcessing]);
  
  // Separate effect for timer to avoid recreating recognition
  useEffect(() => {
    if (isRecording && !timerRef.current) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else if (!isRecording && timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRecording]);
  
  const handleRecognitionResult = (spokenText, confidence) => {
    setIsProcessing(true);
    
    // Ensure we have fresh, clean text for comparison
    const cleanTargetText = targetText?.trim() || '';
    const cleanSpokenText = spokenText?.trim() || '';
    
    console.log('Recognition Debug:', {
      target: cleanTargetText,
      spoken: cleanSpokenText,
      confidence: Math.round(confidence * 100)
    });
    
    // Calculate similarity between target and spoken text
    const accuracy = calculateSimilarity(cleanTargetText, cleanSpokenText);
    const isCorrect = accuracy >= getAccuracyThreshold();
    const mismatches = findMismatches(cleanTargetText, cleanSpokenText);
    
    const result = {
      spokenText: cleanSpokenText,
      targetText: cleanTargetText,
      accuracy,
      confidence: Math.round(confidence * 100),
      isCorrect,
      mismatches,
      timestamp: new Date().toISOString()
    };
    
    setLastResult(result);
    setIsProcessing(false);
    
    // Audio feedback
    if (accuracy === 100) {
      if (playSounds) {
        playSuccess();
      }
    } else {
      if (playSounds) {
        playError();
      }
      if (autoSpeak) {
        // Get the correct Arabic text for TTS
        let correctText = '';
        if (currentAyah?.tajweed) {
          // Build tajweed text and strip HTML tags
          const tajweedText = currentAyah.tajweed.map(segment => segment.text).join(' ');
          correctText = stripHtmlTags(tajweedText);
        } else if (currentAyah?.arabic) {
          correctText = stripHtmlTags(currentAyah.arabic);
        } else {
          correctText = stripHtmlTags(targetText);
        }
        
        if (correctText) {
          setTimeout(() => {
            speakArabic(correctText, { rate: 1.0, pitch: 1.05 });
          }, 300); // Small delay after error sound
        }
      }
    }
    
    // Notify parent component
    if (onRecordingResult) {
      onRecordingResult(isCorrect, accuracy);
    }
  };
  
  const startRecording = async () => {
    if (!recognitionRef.current) {
      setError('Speech recognition not supported in this browser');
      return;
    }
    
    if (!targetText) {
      setError('No target text selected');
      return;
    }
    
    // Unlock audio context on first user interaction
    await unlockAudio();
    
    // Clear all previous state
    setError(null);
    setLastResult(null);
    setIsProcessing(false);
    setRecordingTime(0);
    
    // Ensure speech recognition is in clean state
    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Stop any ongoing TTS
      }
      
      // Add a small delay to ensure clean state
      setTimeout(() => {
        try {
          recognitionRef.current.start();
        } catch (err) {
          setError('Failed to start recording: ' + err.message);
        }
      }, 100);
    } catch (err) {
      setError('Failed to start recording: ' + err.message);
    }
  };
  
  const stopRecording = () => {
    setIsRecording(false);
    
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Error stopping recognition:', err);
      }
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };
  
  const renderResult = () => {
    if (!lastResult) return null;
    
    return (
      <div className="recording-result mt-4" role="region" aria-labelledby="result-heading">
        <div className="result-header mb-2">
          <div className="flex flex-between" style={{ alignItems: 'center' }}>
            <h4 id="result-heading" style={{ margin: 0 }}>Recording Result</h4>
            <div className={`accuracy-badge ${lastResult.isCorrect ? 'success' : 'error'}`} 
                 style={{
                   padding: '0.25rem 0.5rem',
                   borderRadius: '4px',
                   fontSize: '0.8rem',
                   fontWeight: 'bold',
                   color: 'white',
                   background: lastResult.isCorrect ? '#10b981' : '#ef4444'
                 }}
                 aria-label={`Pronunciation accuracy: ${lastResult.accuracy} percent ${lastResult.isCorrect ? 'correct' : 'needs improvement'}`}>
              {lastResult.accuracy}% Accurate
            </div>
          </div>
        </div>
        
        <div className="result-content">
          <div className="text-comparison mb-3">
            <div className="target-text mb-2">
              <strong>Target:</strong>
              <div style={{ 
                padding: '0.5rem', 
                background: '#f3f4f6', 
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>
                {targetText}
              </div>
            </div>
            
            <div className="spoken-text">
              <strong>You said:</strong>
              <div style={{ 
                padding: '0.5rem', 
                background: lastResult.isCorrect ? '#ecfdf5' : '#fef2f2', 
                borderRadius: '4px',
                fontFamily: 'monospace'
              }}>
                {lastResult.spokenText || '(No speech detected)'}
              </div>
            </div>
          </div>
          
          <div className="result-stats">
            <div className="flex" style={{ gap: '1rem', fontSize: '0.85rem' }}>
              <span>Confidence: {lastResult.confidence}%</span>
              <span>Mismatches: {lastResult.mismatches.length}</span>
              <span className={lastResult.isCorrect ? 'text-success' : 'text-error'}>
                {lastResult.isCorrect ? '✓ Correct' : '✗ Needs Practice'}
              </span>
            </div>
          </div>
          
          {lastResult.mismatches.length > 0 && (
            <div className="mismatches mt-3">
              <strong style={{ fontSize: '0.9rem' }}>Areas to improve:</strong>
              <div style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {lastResult.mismatches.map((mismatch, index) => (
                  <div key={index} style={{ 
                    padding: '0.25rem 0.5rem', 
                    background: '#fef2f2', 
                    borderRadius: '4px',
                    margin: '0.25rem 0'
                  }}>
                    Expected: "{mismatch.target}" → You said: "{mismatch.spoken}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!isSpeechRecognitionSupported()) {
    return (
      <div className="card voice-recorder">
        <div className="text-center" style={{ padding: '2rem' }}>
          <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
          <h3>Speech Recognition Not Supported</h3>
          <p style={{ color: '#6b7280' }}>
            Your browser doesn't support speech recognition. 
            Please use Google Chrome or a compatible browser.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card voice-recorder">
      <h3>Voice Practice</h3>
      
      {/* Audio Settings */}
      <div className="audio-settings mb-4" style={{ 
        padding: '1rem', 
        background: '#f9fafb', 
        borderRadius: '8px',
        border: '1px solid #e5e7eb'
      }}>
        <h4 style={{ margin: '0 0 0.75rem 0', fontSize: '0.9rem', color: '#374151' }}>
          Audio Settings
        </h4>
        <div className="settings-row" style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={playSounds}
              onChange={(e) => setPlaySounds(e.target.checked)}
              style={{ margin: 0 }}
            />
            <span>Play sounds</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={autoSpeak}
              onChange={(e) => setAutoSpeak(e.target.checked)}
              style={{ margin: 0 }}
            />
            <span>Auto-speak correction</span>
          </label>
        </div>
      </div>
      
      <div className="recording-controls">
        <div className="control-section mb-4">
          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Click the microphone or press <kbd style={{ 
              background: '#f3f4f6', 
              padding: '2px 6px', 
              borderRadius: '4px', 
              border: '1px solid #d1d5db',
              fontFamily: 'monospace'
            }}>Space</kbd> to record your pronunciation of the Arabic text above.
          </p>
          
          <div className="flex flex-center" style={{ gap: '1rem' }}>
            {!isRecording ? (
              <button
                className="button"
                onClick={startRecording}
                disabled={disabled || isProcessing}
                style={{ 
                  background: '#10b981',
                  padding: '1rem 2rem',
                  fontSize: '1.1rem'
                }}
                aria-label="Start voice recording (Press Space)"
                title="Start recording your pronunciation (Spacebar)"
              >
                <Mic size={20} />
                Start Recording
              </button>
            ) : (
              <button
                className="button error recording"
                onClick={stopRecording}
                style={{ 
                  padding: '1rem 2rem',
                  fontSize: '1.1rem',
                  position: 'relative'
                }}
                aria-label={`Stop voice recording after ${formatTime(recordingTime)} (Press Space)`}
                title="Stop recording (Spacebar)"
              >
                <Square size={20} />
                Stop Recording ({formatTime(recordingTime)})
                {/* Recording indicator */}
                <span style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  width: '8px',
                  height: '8px',
                  background: '#ef4444',
                  borderRadius: '50%',
                  animation: 'pulse 1s infinite'
                }} />
              </button>
            )}
          </div>
          
          {isProcessing && (
            <div className="text-center mt-4">
              <div className="loading"></div>
              <p style={{ marginTop: '0.5rem', color: '#6b7280' }}>
                Processing your recording...
              </p>
            </div>
          )}
          
          {/* Debug info - remove in production */}
          {process.env.NODE_ENV === 'development' && (
            <div style={{ 
              fontSize: '0.75rem', 
              color: '#6b7280', 
              marginTop: '1rem',
              padding: '0.5rem',
              background: '#f9fafb',
              borderRadius: '4px'
            }}>
              Debug: Recording={isRecording ? 'Yes' : 'No'}, 
              Timer={recordingTime}s, 
              Processing={isProcessing ? 'Yes' : 'No'}
              {lastResult && <div>Last accuracy: {lastResult.accuracy}%</div>}
            </div>
          )}
        </div>
        
        {error && (
          <div className="error-message" style={{
            padding: '1rem',
            background: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            color: '#dc2626',
            marginBottom: '1rem'
          }}>
            <AlertCircle size={16} style={{ marginRight: '0.5rem' }} />
            {error}
          </div>
        )}
        
        {renderResult()}
      </div>
      
      <div className="recording-tips mt-4" style={{ 
        borderTop: '1px solid #e5e7eb', 
        paddingTop: '1rem',
        fontSize: '0.85rem',
        color: '#6b7280'
      }}>
        <strong>Tips for better recognition:</strong>
        <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
          <li>Speak clearly and at a moderate pace</li>
          <li>Ensure you're in a quiet environment</li>
          <li>Allow microphone access when prompted</li>
          <li>Practice the transliteration pronunciation first</li>
        </ul>
      </div>
    </div>
  );
};

export default VoiceRecorder;
