import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';

const SttSupportBanner = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const dismissed = localStorage.getItem('stt-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
      return;
    }

    // Check for speech recognition support
    const hasSTT = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
    const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
    
    // Show banner if no STT support or not Chrome
    if (!hasSTT || !isChrome) {
      setIsVisible(true);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    localStorage.setItem('stt-banner-dismissed', 'true');
  };

  if (isDismissed || !isVisible) {
    return null;
  }

  return (
    <div className="stt-support-banner" style={{
      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
      border: '1px solid #f59e0b',
      borderRadius: '8px',
      padding: '1rem',
      margin: '1rem 0',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '0.75rem',
      fontSize: '0.9rem',
      color: '#92400e'
    }}>
      <AlertTriangle size={20} style={{ color: '#f59e0b', flexShrink: 0, marginTop: '2px' }} />
      
      <div style={{ flex: 1 }}>
        <strong style={{ display: 'block', marginBottom: '0.25rem' }}>
          Voice Recognition Notice
        </strong>
        <p style={{ margin: 0, lineHeight: 1.4 }}>
          Voice transcription requires internet connection and works best in 
          <strong> Google Chrome</strong> (desktop/Android). If you don't see transcription 
          results, please switch to Chrome for the best experience.
        </p>
      </div>
      
      <button
        onClick={handleDismiss}
        style={{
          background: 'none',
          border: 'none',
          color: '#92400e',
          cursor: 'pointer',
          padding: '4px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
        onMouseOver={(e) => e.target.style.background = 'rgba(146, 64, 14, 0.1)'}
        onMouseOut={(e) => e.target.style.background = 'none'}
        title="Dismiss this notice"
        aria-label="Dismiss voice recognition notice"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default SttSupportBanner;
