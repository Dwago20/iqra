import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import { getSurahs, getAyahs } from '../api/quranClient';

const SurahPicker = ({ 
  selectedSurah, 
  selectedAyah, 
  onSurahChange, 
  onAyahChange 
}) => {
  const [surahs, setSurahs] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [ayahs, setAyahs] = useState([]);
  const [ayahsLoading, setAyahsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMoreAyahs, setHasMoreAyahs] = useState(false);
  
  // Load surahs on mount
  useEffect(() => {
    loadSurahs();
  }, []);

  // Load ayahs when surah changes
  useEffect(() => {
    if (selectedSurah) {
      loadAyahs(selectedSurah, 1, true);
    } else {
      setAyahs([]);
      setCurrentPage(1);
      setHasMoreAyahs(false);
    }
  }, [selectedSurah]);

  const loadSurahs = async () => {
    try {
      setLoading(true);
      const data = await getSurahs();
      setSurahs(data);
    } catch (error) {
      console.warn('Failed to load surahs:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAyahs = async (surahNumber, page = 1, reset = false) => {
    try {
      setAyahsLoading(true);
      const data = await getAyahs(surahNumber, { page, perPage: 50 });
      
      if (reset) {
        setAyahs(data);
        setCurrentPage(1);
      } else {
        setAyahs(prev => [...prev, ...data]);
      }
      
      // Simple check for more pages - if we got 50 items, there might be more
      setHasMoreAyahs(data.length === 50);
      setCurrentPage(page);
    } catch (error) {
      console.warn('Failed to load ayahs:', error);
    } finally {
      setAyahsLoading(false);
    }
  };

  const loadMoreAyahs = () => {
    if (selectedSurah && hasMoreAyahs && !ayahsLoading) {
      loadAyahs(selectedSurah, currentPage + 1, false);
    }
  };

  // Filter surahs based on search
  const filteredSurahs = surahs.filter(surah => 
    surah.nameEnglish.toLowerCase().includes(searchTerm.toLowerCase()) ||
    surah.nameArabic.includes(searchTerm)
  );

  const currentSurah = surahs.find(s => s.number === selectedSurah);
  const totalAyahs = ayahs.length;
  
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

  // Skeleton loader component
  const SkeletonSurah = () => (
    <div style={{
      background: 'var(--bg-secondary)',
      borderRadius: 'var(--radius-sm)',
      padding: '0.75rem',
      marginBottom: '0.5rem',
      animation: 'pulse 1.5s ease-in-out infinite'
    }}>
      <div style={{
        height: '1rem',
        background: 'var(--border-color)',
        borderRadius: '4px',
        marginBottom: '0.5rem',
        width: '70%'
      }} />
      <div style={{
        height: '0.75rem',
        background: 'var(--border-color)',
        borderRadius: '4px',
        width: '50%'
      }} />
    </div>
  );

  return (
    <div className="card surah-picker">
      <h3>Select Surah & Ayah</h3>
      
      <div className="surah-selection mb-4">
        <label htmlFor="surah-search" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Search Surahs:
        </label>
        
        {/* Search Input */}
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Search 
            size={16} 
            style={{
              position: 'absolute',
              left: '0.75rem',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-muted)'
            }}
          />
          <input
            id="surah-search"
            type="text"
            placeholder="Search by English or Arabic name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              padding: '0.75rem 0.75rem 0.75rem 2.5rem',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.875rem',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--primary-color)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </div>

        <label htmlFor="surah-select" style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500' }}>
          Choose Surah:
        </label>
        
        {loading ? (
          <div>
            <SkeletonSurah />
            <SkeletonSurah />
            <SkeletonSurah />
          </div>
        ) : (
          <select
            id="surah-select"
            className="select"
            value={selectedSurah || ''}
            onChange={(e) => onSurahChange(parseInt(e.target.value))}
          >
            <option value="">Select a Surah</option>
            {filteredSurahs.map(surah => (
              <option key={surah.number} value={surah.number}>
                {surah.number}. {surah.nameEnglish} - {surah.nameArabic}
              </option>
            ))}
          </select>
        )}
        
        {!loading && filteredSurahs.length === 0 && searchTerm && (
          <div style={{
            padding: '1rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            fontSize: '0.875rem'
          }}>
            No surahs found matching "{searchTerm}"
          </div>
        )}
      </div>
      
      {currentSurah && (
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
                Ayah {selectedAyah} {totalAyahs > 0 ? `of ${totalAyahs}` : ''}
                {hasMoreAyahs && '+'}
              </div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                {currentSurah.nameEnglish}
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
            
            {ayahsLoading && totalAyahs === 0 ? (
              <div style={{
                height: '2.5rem',
                background: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
            ) : (
              <>
                <select
                  id="ayah-select"
                  className="select"
                  value={selectedAyah}
                  onChange={(e) => onAyahChange(parseInt(e.target.value))}
                >
                  {ayahs.map((ayah, index) => (
                    <option key={ayah.numberInSurah || index + 1} value={ayah.numberInSurah || index + 1}>
                      Ayah {ayah.numberInSurah || index + 1}
                    </option>
                  ))}
                </select>
                
                {hasMoreAyahs && (
                  <button
                    className="button secondary"
                    onClick={loadMoreAyahs}
                    disabled={ayahsLoading}
                    style={{
                      width: '100%',
                      marginTop: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    {ayahsLoading ? (
                      <>
                        <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />
                        Loading more ayahs...
                      </>
                    ) : (
                      'Load More Ayahs'
                    )}
                  </button>
                )}
              </>
            )}
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
