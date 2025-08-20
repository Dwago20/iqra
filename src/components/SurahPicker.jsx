import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getSurahById } from '../data/quranData';

const SurahPicker = ({ 
  availableSurahs, 
  selectedSurah, 
  selectedAyah, 
  onSurahChange, 
  onAyahChange 
}) => {
  const currentSurahData = selectedSurah ? getSurahById(selectedSurah) : null;
  const totalAyahs = currentSurahData ? Object.keys(currentSurahData.ayahs).length : 0;
  
  const handlePreviousAyah = () => {
    if (selectedAyah > 1) {
      onAyahChange(selectedAyah - 1);
    }
  };
  
  const handleNextAyah = () => {
    if (selectedAyah < totalAyahs) {
      onAyahChange(selectedAyah + 1);
    }
  };

  return (
    <div className="card surah-picker">
      <h3>Select Surah & Ayah</h3>
      
      <div className="surah-selection mb-4">
        <label htmlFor="surah-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Choose Surah:
        </label>
        <select
          id="surah-select"
          className="select"
          value={selectedSurah || ''}
          onChange={(e) => onSurahChange(parseInt(e.target.value))}
        >
          <option value="">Select a Surah</option>
          {availableSurahs.map(surahId => {
            const surah = getSurahById(surahId);
            return (
              <option key={surahId} value={surahId}>
                {surah.name} - {surah.nameTranslation}
              </option>
            );
          })}
        </select>
      </div>
      
      {currentSurahData && (
        <div className="ayah-navigation">
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
            Ayah Navigation:
          </label>
          
          <div className="flex flex-between" style={{ alignItems: 'center' }}>
            <button
              className="button secondary"
              onClick={handlePreviousAyah}
              disabled={selectedAyah <= 1}
              style={{ padding: '0.5rem' }}
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="ayah-info text-center">
              <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                Ayah {selectedAyah} of {totalAyahs}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                {currentSurahData.nameTranslation}
              </div>
            </div>
            
            <button
              className="button secondary"
              onClick={handleNextAyah}
              disabled={selectedAyah >= totalAyahs}
              style={{ padding: '0.5rem' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="ayah-selector mt-4">
            <label htmlFor="ayah-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
              Jump to Ayah:
            </label>
            <select
              id="ayah-select"
              className="select"
              value={selectedAyah}
              onChange={(e) => onAyahChange(parseInt(e.target.value))}
            >
              {Array.from({ length: totalAyahs }, (_, i) => i + 1).map(ayahNumber => (
                <option key={ayahNumber} value={ayahNumber}>
                  Ayah {ayahNumber}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
      
      {!selectedSurah && (
        <div className="placeholder text-center" style={{ padding: '2rem', color: '#6b7280' }}>
          Please select a Surah to begin practice
        </div>
      )}
    </div>
  );
};

export default SurahPicker;
