import React from 'react';
import { TrendingUp, Target, Clock, Award, BarChart3 } from 'lucide-react';

const ProgressTracker = ({ sessionProgress, globalProgress, currentAyahKey }) => {
  const currentAyahProgress = globalProgress[currentAyahKey] || {
    totalAttempts: 0,
    correctAttempts: 0,
    bestAccuracy: 0,
    lastPracticed: null
  };
  
  const getSessionAccuracy = () => {
    if (sessionProgress.attempts === 0) return 0;
    return Math.round((sessionProgress.correctAttempts / sessionProgress.attempts) * 100);
  };
  
  const getGlobalAccuracy = () => {
    if (currentAyahProgress.totalAttempts === 0) return 0;
    return Math.round((currentAyahProgress.correctAttempts / currentAyahProgress.totalAttempts) * 100);
  };
  
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  const getStreakColor = (streak) => {
    if (streak >= 5) return '#10b981'; // Green
    if (streak >= 3) return '#f59e0b'; // Yellow
    return '#6b7280'; // Gray
  };
  
  const getMasteryLevel = () => {
    const accuracy = currentAyahProgress.bestAccuracy;
    const attempts = currentAyahProgress.totalAttempts;
    
    if (accuracy >= 90 && attempts >= 3) return { level: 'Master', color: '#10b981' };
    if (accuracy >= 80 && attempts >= 2) return { level: 'Good', color: '#f59e0b' };
    if (accuracy >= 70 && attempts >= 1) return { level: 'Learning', color: '#3b82f6' };
    return { level: 'Beginner', color: '#6b7280' };
  };
  
  const mastery = getMasteryLevel();

  return (
    <div className="progress-tracker">
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>
          <BarChart3 size={20} style={{ marginRight: '0.5rem' }} />
          Progress Tracking
        </h3>
        
        {/* Current Session Stats */}
        <div className="session-stats mb-4">
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>
            Current Session
          </h4>
          
          <div className="stats-grid" style={{ display: 'grid', gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
            <div className="stat-card" style={{ 
              padding: '1rem', 
              background: '#f9fafb', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2563eb' }}>
                {sessionProgress.attempts}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Attempts
              </div>
            </div>
            
            <div className="stat-card" style={{ 
              padding: '1rem', 
              background: '#f9fafb', 
              borderRadius: '8px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {getSessionAccuracy()}%
              </div>
              <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                Accuracy
              </div>
            </div>
          </div>
          
          <div className="streak-info mt-3">
            <div className="flex flex-between" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Current Streak:</span>
              <span style={{ 
                fontWeight: 'bold', 
                color: getStreakColor(sessionProgress.currentStreak)
              }}>
                {sessionProgress.currentStreak} 🔥
              </span>
            </div>
            <div className="flex flex-between" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Best Streak:</span>
              <span style={{ 
                fontWeight: 'bold', 
                color: getStreakColor(sessionProgress.bestStreak)
              }}>
                {sessionProgress.bestStreak} ⭐
              </span>
            </div>
          </div>
        </div>
        
        {/* Current Ayah Progress */}
        <div className="ayah-progress mb-4" style={{ 
          borderTop: '1px solid #e5e7eb', 
          paddingTop: '1rem' 
        }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>
            This Ayah Progress
          </h4>
          
          <div className="mastery-level mb-3">
            <div className="flex flex-between" style={{ alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>Mastery Level:</span>
              <span style={{ 
                fontWeight: 'bold', 
                color: mastery.color,
                padding: '0.25rem 0.5rem',
                background: `${mastery.color}20`,
                borderRadius: '4px',
                fontSize: '0.8rem'
              }}>
                {mastery.level}
              </span>
            </div>
          </div>
          
          <div className="progress-details">
            <div className="progress-item mb-2">
              <div className="flex flex-between">
                <span style={{ fontSize: '0.85rem' }}>Best Accuracy:</span>
                <span style={{ fontWeight: 'bold', color: '#2563eb' }}>
                  {currentAyahProgress.bestAccuracy}%
                </span>
              </div>
              <div className="progress-bar mt-1">
                <div 
                  className="progress-fill"
                  style={{ width: `${currentAyahProgress.bestAccuracy}%` }}
                />
              </div>
            </div>
            
            <div className="progress-item mb-2">
              <div className="flex flex-between">
                <span style={{ fontSize: '0.85rem' }}>Overall Accuracy:</span>
                <span style={{ fontWeight: 'bold', color: '#10b981' }}>
                  {getGlobalAccuracy()}%
                </span>
              </div>
              <div className="progress-bar mt-1">
                <div 
                  className="progress-fill"
                  style={{ 
                    width: `${getGlobalAccuracy()}%`,
                    background: '#10b981'
                  }}
                />
              </div>
            </div>
            
            <div className="attempts-info mt-3" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
              <div className="flex flex-between">
                <span>Total Attempts:</span>
                <span>{currentAyahProgress.totalAttempts}</span>
              </div>
              <div className="flex flex-between">
                <span>Correct Attempts:</span>
                <span>{currentAyahProgress.correctAttempts}</span>
              </div>
              <div className="flex flex-between">
                <span>Last Practiced:</span>
                <span>{formatDate(currentAyahProgress.lastPracticed)}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Achievements */}
        <div className="achievements" style={{ 
          borderTop: '1px solid #e5e7eb', 
          paddingTop: '1rem' 
        }}>
          <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>
            <Award size={16} style={{ marginRight: '0.5rem' }} />
            Quick Stats
          </h4>
          
          <div className="achievement-list">
            {sessionProgress.bestStreak >= 5 && (
              <div className="achievement-item" style={{ 
                padding: '0.5rem', 
                background: '#ecfdf5', 
                borderRadius: '4px',
                marginBottom: '0.5rem',
                fontSize: '0.85rem'
              }}>
                🔥 Hot Streak! ({sessionProgress.bestStreak} in a row)
              </div>
            )}
            
            {currentAyahProgress.bestAccuracy >= 90 && (
              <div className="achievement-item" style={{ 
                padding: '0.5rem', 
                background: '#fef3c7', 
                borderRadius: '4px',
                marginBottom: '0.5rem',
                fontSize: '0.85rem'
              }}>
                ⭐ Excellence! (90%+ accuracy)
              </div>
            )}
            
            {currentAyahProgress.totalAttempts >= 10 && (
              <div className="achievement-item" style={{ 
                padding: '0.5rem', 
                background: '#dbeafe', 
                borderRadius: '4px',
                marginBottom: '0.5rem',
                fontSize: '0.85rem'
              }}>
                💪 Persistent! (10+ attempts)
              </div>
            )}
            
            {Object.keys(globalProgress).length >= 5 && (
              <div className="achievement-item" style={{ 
                padding: '0.5rem', 
                background: '#f3e8ff', 
                borderRadius: '4px',
                marginBottom: '0.5rem',
                fontSize: '0.85rem'
              }}>
                📚 Explorer! (5+ ayahs practiced)
              </div>
            )}
          </div>
          
          {sessionProgress.attempts === 0 && currentAyahProgress.totalAttempts === 0 && (
            <div className="no-progress" style={{ 
              textAlign: 'center', 
              color: '#6b7280',
              fontStyle: 'italic',
              padding: '1rem'
            }}>
              Start practicing to see your progress!
            </div>
          )}
        </div>
      </div>
      
      {/* Motivational Tips */}
      <div className="card mt-4">
        <h4 style={{ fontSize: '1rem', marginBottom: '1rem', color: '#374151' }}>
          <TrendingUp size={16} style={{ marginRight: '0.5rem' }} />
          Tips for Improvement
        </h4>
        
        <div className="tips-list" style={{ fontSize: '0.85rem', color: '#6b7280' }}>
          {getSessionAccuracy() < 70 && (
            <div className="tip" style={{ marginBottom: '0.5rem' }}>
              • Listen to the audio pronunciation first
            </div>
          )}
          {sessionProgress.currentStreak === 0 && sessionProgress.attempts > 0 && (
            <div className="tip" style={{ marginBottom: '0.5rem' }}>
              • Take your time and speak clearly
            </div>
          )}
          {currentAyahProgress.bestAccuracy < 80 && (
            <div className="tip" style={{ marginBottom: '0.5rem' }}>
              • Practice the transliteration syllable by syllable
            </div>
          )}
          <div className="tip" style={{ marginBottom: '0.5rem' }}>
            • Regular practice leads to better retention
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
