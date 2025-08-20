import React, { useState, useEffect } from 'react';
import { Settings, X } from 'lucide-react';

const DEFAULT_SETTINGS = {
  showTajweed: true,
  largeArabicFont: false,
  dataSourcePreference: 'Auto', // 'Auto', 'Quran.com', 'QF', 'Tanzil'
};

const SettingsSheet = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const [localSettings, setLocalSettings] = useState(settings || DEFAULT_SETTINGS);

  useEffect(() => {
    setLocalSettings(settings || DEFAULT_SETTINGS);
  }, [settings]);

  const handleSettingChange = (key, value) => {
    const newSettings = { ...localSettings, [key]: value };
    setLocalSettings(newSettings);
    onSettingsChange(newSettings);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 1000,
          backdropFilter: 'blur(2px)'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'var(--bg-primary)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: 'var(--shadow-large)',
          zIndex: 1001,
          width: '90%',
          maxWidth: '480px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: 'var(--space-lg)',
            borderBottom: '1px solid var(--border-color)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Settings size={20} />
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '600' }}>
              Settings
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-secondary)'
            }}
            onMouseEnter={(e) => e.target.style.background = 'var(--bg-secondary)'}
            onMouseLeave={(e) => e.target.style.background = 'none'}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: 'var(--space-lg)' }}>
          {/* Display Settings */}
          <section style={{ marginBottom: 'var(--space-xl)' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: 'var(--space-md)',
              color: 'var(--text-primary)'
            }}>
              Display
            </h3>

            {/* Show Tajweed Colors */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-md) 0',
              borderBottom: '1px solid var(--border-light)'
            }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  Show Tajwīd Colors
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4
                }}>
                  Highlight Quranic text with traditional tajwīd color coding
                </div>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '44px',
                height: '24px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={localSettings.showTajweed}
                  onChange={(e) => handleSettingChange('showTajweed', e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: localSettings.showTajweed ? 'var(--primary-color)' : '#ccc',
                  borderRadius: '12px',
                  transition: 'background-color 0.2s ease'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: localSettings.showTajweed ? '23px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s ease'
                  }} />
                </span>
              </label>
            </div>

            {/* Large Arabic Font */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 'var(--space-md) 0',
              borderBottom: '1px solid var(--border-light)'
            }}>
              <div>
                <div style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                  Large Arabic Font
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.4
                }}>
                  Increase Arabic text size for better readability
                </div>
              </div>
              <label style={{
                position: 'relative',
                display: 'inline-block',
                width: '44px',
                height: '24px',
                cursor: 'pointer'
              }}>
                <input
                  type="checkbox"
                  checked={localSettings.largeArabicFont}
                  onChange={(e) => handleSettingChange('largeArabicFont', e.target.checked)}
                  style={{ display: 'none' }}
                />
                <span style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: localSettings.largeArabicFont ? 'var(--primary-color)' : '#ccc',
                  borderRadius: '12px',
                  transition: 'background-color 0.2s ease'
                }}>
                  <span style={{
                    position: 'absolute',
                    content: '""',
                    height: '18px',
                    width: '18px',
                    left: localSettings.largeArabicFont ? '23px' : '3px',
                    bottom: '3px',
                    backgroundColor: 'white',
                    borderRadius: '50%',
                    transition: 'left 0.2s ease'
                  }} />
                </span>
              </label>
            </div>
          </section>

          {/* Data Source Settings */}
          <section style={{ marginBottom: 'var(--space-xl)' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: '600',
              marginBottom: 'var(--space-md)',
              color: 'var(--text-primary)'
            }}>
              Data Source
            </h3>

            <div style={{
              padding: 'var(--space-md) 0'
            }}>
              <div style={{ fontWeight: '500', marginBottom: '0.75rem' }}>
                Preferred Source
              </div>
              <div style={{
                fontSize: '0.875rem',
                color: 'var(--text-secondary)',
                marginBottom: 'var(--space-md)',
                lineHeight: 1.4
              }}>
                Choose which API to prioritize for Quran text and audio
              </div>

              {['Auto', 'Quran.com', 'QF', 'Tanzil'].map((source) => (
                <label
                  key={source}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.5rem 0',
                    cursor: 'pointer'
                  }}
                >
                  <input
                    type="radio"
                    name="dataSource"
                    value={source}
                    checked={localSettings.dataSourcePreference === source}
                    onChange={(e) => handleSettingChange('dataSourcePreference', e.target.value)}
                    style={{
                      width: '16px',
                      height: '16px',
                      accentColor: 'var(--primary-color)'
                    }}
                  />
                  <div>
                    <div style={{ fontWeight: '500' }}>
                      {source === 'Auto' ? 'Auto (Recommended)' : source}
                    </div>
                    <div style={{
                      fontSize: '0.75rem',
                      color: 'var(--text-muted)',
                      marginTop: '0.25rem'
                    }}>
                      {source === 'Auto' && 'Try Quran.com first, then fallback to other sources'}
                      {source === 'Quran.com' && 'Use Quran.com API exclusively when available'}
                      {source === 'QF' && 'Use Quran Foundation API when configured'}
                      {source === 'Tanzil' && 'Use local Tanzil JSON files only'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          {/* Info */}
          <div style={{
            background: 'var(--bg-secondary)',
            padding: 'var(--space-md)',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.5
          }}>
            <strong>Note:</strong> Settings are automatically saved to your browser's local storage.
            Changes take effect immediately.
          </div>
        </div>
      </div>
    </>
  );
};

export default SettingsSheet;
