import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ModuleSelector from './components/ModuleSelector';
import SurahPicker from './components/SurahPicker';
import AyahDisplay from './components/AyahDisplay';
import VoiceRecorder from './components/VoiceRecorder';
import ProgressTracker from './components/ProgressTracker';
import SttSupportBanner from './components/SttSupportBanner';
import ReciterSelector from './components/ReciterSelector';
import { modules, getSurahById, getAyahBySurahAndNumber } from './data/quranData';
import { loadProgress, saveProgress } from './utils/storage';

function App() {
  const [currentView, setCurrentView] = useState('modules'); // 'modules', 'practice'
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedSurah, setSelectedSurah] = useState(null);
  const [selectedAyah, setSelectedAyah] = useState(1);
  const [selectedReciterId, setSelectedReciterId] = useState(() => {
    return parseInt(localStorage.getItem('iqra.reciterId') || '5', 10);
  });
  const [progress, setProgress] = useState({});
  const [practiceSession, setPracticeSession] = useState({
    attempts: 0,
    correctAttempts: 0,
    currentStreak: 0,
    bestStreak: 0
  });

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = loadProgress();
    setProgress(savedProgress);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  // Handle reciter selection and persist to localStorage
  const handleReciterChange = (reciterId) => {
    setSelectedReciterId(reciterId);
    localStorage.setItem('iqra.reciterId', reciterId.toString());
  };

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    setCurrentView('practice');
    // Default to first surah and first ayah
    if (module.surahs.length > 0) {
      setSelectedSurah(module.surahs[0]);
      setSelectedAyah(1);
    }
  };

  const handleSurahChange = (surahId) => {
    setSelectedSurah(surahId);
    setSelectedAyah(1); // Reset to first ayah
    // Reset practice session for new surah
    setPracticeSession({
      attempts: 0,
      correctAttempts: 0,
      currentStreak: 0,
      bestStreak: 0
    });
  };

  const handleAyahChange = (ayahNumber) => {
    setSelectedAyah(ayahNumber);
    // Reset practice session for new ayah
    setPracticeSession({
      attempts: 0,
      correctAttempts: 0,
      currentStreak: 0,
      bestStreak: 0
    });
  };

  const handleRecordingResult = (isCorrect, accuracy) => {
    const newSession = {
      ...practiceSession,
      attempts: practiceSession.attempts + 1,
      correctAttempts: isCorrect ? practiceSession.correctAttempts + 1 : practiceSession.correctAttempts,
      currentStreak: isCorrect ? practiceSession.currentStreak + 1 : 0,
      bestStreak: isCorrect 
        ? Math.max(practiceSession.bestStreak, practiceSession.currentStreak + 1)
        : practiceSession.bestStreak
    };
    
    setPracticeSession(newSession);

    // Update global progress
    const progressKey = `${selectedSurah}-${selectedAyah}`;
    const currentProgress = progress[progressKey] || {
      totalAttempts: 0,
      correctAttempts: 0,
      bestAccuracy: 0,
      lastPracticed: null
    };

    const updatedProgress = {
      ...progress,
      [progressKey]: {
        totalAttempts: currentProgress.totalAttempts + 1,
        correctAttempts: isCorrect ? currentProgress.correctAttempts + 1 : currentProgress.correctAttempts,
        bestAccuracy: Math.max(currentProgress.bestAccuracy, accuracy),
        lastPracticed: new Date().toISOString()
      }
    };

    setProgress(updatedProgress);
  };

  const goBackToModules = () => {
    setCurrentView('modules');
    setSelectedModule(null);
    setSelectedSurah(null);
    setSelectedAyah(1);
    setPracticeSession({
      attempts: 0,
      correctAttempts: 0,
      currentStreak: 0,
      bestStreak: 0
    });
  };

  const currentAyah = selectedSurah ? getAyahBySurahAndNumber(selectedSurah, selectedAyah) : null;
  const currentSurahData = selectedSurah ? getSurahById(selectedSurah) : null;

  return (
    <div className="App">
      <Header />
      
      <div className="container">
        <SttSupportBanner />
        
        {currentView === 'modules' ? (
          <ModuleSelector 
            modules={modules}
            onModuleSelect={handleModuleSelect}
            progress={progress}
          />
        ) : (
          <div className="practice-view">
            <div className="practice-header mb-4" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <button 
                  className="button secondary"
                  onClick={goBackToModules}
                >
                  ← Back to Modules
                </button>
                <h2 style={{ margin: 0 }}>{selectedModule?.name}</h2>
              </div>
              <ReciterSelector
                selectedReciterId={selectedReciterId}
                onReciterChange={handleReciterChange}
              />
            </div>

            <div className="grid grid-2">
              <div className="practice-content">
                <SurahPicker
                  availableSurahs={selectedModule?.surahs || []}
                  selectedSurah={selectedSurah}
                  selectedAyah={selectedAyah}
                  onSurahChange={handleSurahChange}
                  onAyahChange={handleAyahChange}
                />

                {currentAyah && (
                  <AyahDisplay
                    ayah={currentAyah}
                    surahName={currentSurahData?.name}
                    ayahNumber={selectedAyah}
                    surahNumber={selectedSurah}
                    selectedReciterId={selectedReciterId}
                  />
                )}

                <VoiceRecorder
                  targetText={currentAyah?.arabic || ''}
                  currentAyah={currentAyah}
                  onRecordingResult={handleRecordingResult}
                  disabled={!currentAyah}
                />
              </div>

              <div className="progress-sidebar">
                <ProgressTracker
                  sessionProgress={practiceSession}
                  globalProgress={progress}
                  currentAyahKey={`${selectedSurah}-${selectedAyah}`}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
