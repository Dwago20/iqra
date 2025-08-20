import React from 'react';
import { BookOpen } from 'lucide-react';

const Header = () => {
  return (
    <header className="card" style={{ marginBottom: '2rem' }}>
      <div className="flex flex-between">
        <div className="flex" style={{ alignItems: 'center' }}>
          <BookOpen size={32} color="#2563eb" />
          <div style={{ marginLeft: '1rem' }}>
            <h1 style={{ margin: 0, color: '#2563eb', fontSize: '1.5rem' }}>
              إقرأ - Iqra
            </h1>
            <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
              Learn Quran with Voice Recognition
            </p>
          </div>
        </div>
        
        <div className="flex" style={{ alignItems: 'center', gap: '0.5rem' }}>
          <div className="pwa-indicator">
            <span style={{ fontSize: '0.8rem', color: '#10b981' }}>
              📱 PWA Ready
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
