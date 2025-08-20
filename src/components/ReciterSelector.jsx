import React, { useState, useEffect } from 'react';
import { Volume2, ChevronDown } from 'lucide-react';
import { getRecitations } from '../api/quranClient';

const ReciterSelector = ({ selectedReciterId, onReciterChange }) => {
  const [recitations, setRecitations] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecitations();
  }, []);

  const loadRecitations = async () => {
    try {
      const data = await getRecitations();
      setRecitations(data);
    } catch (error) {
      console.warn('Failed to load recitations:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectedReciter = recitations.find(r => r.id === selectedReciterId) || recitations[0];

  if (loading) {
    return (
      <div className="reciter-selector loading" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem',
        fontSize: '0.875rem',
        color: 'var(--text-secondary)'
      }}>
        <Volume2 size={16} />
        Loading reciters...
      </div>
    );
  }

  return (
    <div className="reciter-selector" style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 0.75rem',
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          fontSize: '0.875rem',
          cursor: 'pointer',
          minWidth: '180px',
          justifyContent: 'space-between'
        }}
        title="Select reciter"
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Volume2 size={16} />
          <span>{selectedReciter?.name || 'Select Reciter'}</span>
        </div>
        <ChevronDown 
          size={16} 
          style={{ 
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease'
          }} 
        />
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-sm)',
            boxShadow: 'var(--shadow-medium)',
            zIndex: 1000,
            maxHeight: '200px',
            overflowY: 'auto'
          }}
        >
          {recitations.map(reciter => (
            <button
              key={reciter.id}
              onClick={() => {
                onReciterChange(reciter.id);
                setIsOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '0.75rem',
                textAlign: 'left',
                border: 'none',
                background: reciter.id === selectedReciterId ? 'var(--bg-accent)' : 'transparent',
                cursor: 'pointer',
                fontSize: '0.875rem',
                borderBottom: '1px solid var(--border-light)'
              }}
              onMouseEnter={(e) => {
                if (reciter.id !== selectedReciterId) {
                  e.target.style.background = 'var(--bg-secondary)';
                }
              }}
              onMouseLeave={(e) => {
                if (reciter.id !== selectedReciterId) {
                  e.target.style.background = 'transparent';
                }
              }}
            >
              <div style={{ fontWeight: reciter.id === selectedReciterId ? '500' : '400' }}>
                {reciter.name}
              </div>
              {reciter.style && (
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--text-muted)',
                  marginTop: '0.25rem'
                }}>
                  {reciter.style}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default ReciterSelector;
