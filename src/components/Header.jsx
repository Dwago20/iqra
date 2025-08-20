import React from 'react';
import { BookOpen, Settings } from 'lucide-react';

const Header = ({ onSettingsClick }) => {
  return (
    <header className="card" style={{ marginBottom: '2rem' }}>
      <div className="flex flex-between">
        <div className="flex" style={{ alignItems: 'center' }}>
          <BookOpen size={32} color="var(--primary-color)" />
          <div style={{ marginLeft: '1rem' }}>
            <h1 style={{ margin: 0, color: 'var(--primary-color)', fontSize: '1.5rem' }}>
              إقرأ - Iqra
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Learn Quran with Voice Recognition
            </p>
          </div>
        </div>
        
        <div className="flex" style={{ alignItems: 'center', gap: '1rem' }}>
          <div className="pwa-indicator">
            <span style={{ fontSize: '0.8rem', color: 'var(--success-color)' }}>
              📱 PWA Ready
            </span>
          </div>
          
          {onSettingsClick && (
            <button
              onClick={onSettingsClick}
              style={{
                background: 'none',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--text-secondary)',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'var(--bg-secondary)';
                e.target.style.color = 'var(--text-primary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'none';
                e.target.style.color = 'var(--text-secondary)';
              }}
              title="Settings"
            >
              <Settings size={18} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
