import React from 'react';
import { Play, Star, Target, Clock } from 'lucide-react';

const ModuleSelector = ({ modules, onModuleSelect, progress }) => {
  const getModuleProgress = (module) => {
    let totalAyahs = 0;
    let completedAyahs = 0;
    
    module.surahs.forEach(surahId => {
      // Count ayahs in each surah (simplified - using our data structure)
      const surahAyahs = getSurahAyahCount(surahId);
      totalAyahs += surahAyahs;
      
      // Count completed ayahs (those with good accuracy)
      for (let i = 1; i <= surahAyahs; i++) {
        const progressKey = `${surahId}-${i}`;
        const ayahProgress = progress[progressKey];
        if (ayahProgress && ayahProgress.bestAccuracy >= 70) {
          completedAyahs++;
        }
      }
    });
    
    return totalAyahs > 0 ? Math.round((completedAyahs / totalAyahs) * 100) : 0;
  };
  
  const getSurahAyahCount = (surahId) => {
    // Simplified ayah count based on our sample data
    const counts = { 1: 7, 112: 4, 113: 2, 114: 2 };
    return counts[surahId] || 1;
  };
  
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return '#10b981';
      case 'Intermediate': return '#f59e0b';
      case 'Advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  return (
    <div className="module-selector">
      <div className="text-center mb-4">
        <h2>Choose a Learning Module</h2>
        <p style={{ color: '#6b7280' }}>
          Select a module to start practicing Quran recitation
        </p>
      </div>
      
      <div className="grid grid-2">
        {modules.map(module => {
          const moduleProgress = getModuleProgress(module);
          
          return (
            <div key={module.id} className="card module-card" style={{ cursor: 'pointer' }}>
              <div className="module-header mb-4">
                <div className="flex flex-between">
                  <h3 style={{ margin: 0, color: '#1f2937' }}>
                    {module.name}
                  </h3>
                  <span 
                    className="difficulty-badge"
                    style={{
                      background: getDifficultyColor(module.difficulty),
                      color: 'white',
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.75rem'
                    }}
                  >
                    {module.difficulty}
                  </span>
                </div>
                
                <p style={{ margin: '0.5rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                  {module.description}
                </p>
              </div>
              
              <div className="module-stats mb-4">
                <div className="flex" style={{ gap: '1rem', fontSize: '0.85rem' }}>
                  <div className="flex" style={{ alignItems: 'center', gap: '0.25rem' }}>
                    <Target size={16} color="#6b7280" />
                    <span>{module.surahs.length} Surahs</span>
                  </div>
                  <div className="flex" style={{ alignItems: 'center', gap: '0.25rem' }}>
                    <Star size={16} color="#6b7280" />
                    <span>{moduleProgress}% Complete</span>
                  </div>
                </div>
              </div>
              
              <div className="progress-section mb-4">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ width: `${moduleProgress}%` }}
                  />
                </div>
              </div>
              
              <button 
                className="button"
                style={{ width: '100%' }}
                onClick={() => onModuleSelect(module)}
              >
                <Play size={16} />
                Start Practice
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="stats-summary card mt-4">
        <h3>Your Progress Summary</h3>
        <div className="flex" style={{ gap: '2rem', marginTop: '1rem' }}>
          <div className="stat-item text-center">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
              {Object.keys(progress).length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Ayahs Practiced
            </div>
          </div>
          <div className="stat-item text-center">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
              {Object.values(progress).filter(p => p.bestAccuracy >= 70).length}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Ayahs Mastered
            </div>
          </div>
          <div className="stat-item text-center">
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
              {Object.values(progress).reduce((sum, p) => sum + p.totalAttempts, 0)}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
              Total Attempts
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModuleSelector;
