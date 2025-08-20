// localStorage utilities for progress tracking

const PROGRESS_KEY = 'iqra_progress';
const SETTINGS_KEY = 'iqra_settings';

export const loadProgress = () => {
  try {
    const stored = localStorage.getItem(PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading progress:', error);
    return {};
  }
};

export const saveProgress = (progress) => {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
};

export const loadSettings = () => {
  try {
    const stored = localStorage.getItem(SETTINGS_KEY);
    return stored ? JSON.parse(stored) : {
      language: 'en',
      showTransliteration: true,
      showTranslation: true,
      autoAdvance: false
    };
  } catch (error) {
    console.error('Error loading settings:', error);
    return {
      language: 'en',
      showTransliteration: true,
      showTranslation: true,
      autoAdvance: false
    };
  }
};

export const saveSettings = (settings) => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving settings:', error);
  }
};

export const clearAllData = () => {
  try {
    localStorage.removeItem(PROGRESS_KEY);
    localStorage.removeItem(SETTINGS_KEY);
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

export const exportProgress = () => {
  try {
    const progress = loadProgress();
    const settings = loadSettings();
    const exportData = {
      progress,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    return JSON.stringify(exportData, null, 2);
  } catch (error) {
    console.error('Error exporting progress:', error);
    return null;
  }
};

export const importProgress = (jsonData) => {
  try {
    const data = JSON.parse(jsonData);
    if (data.progress) {
      saveProgress(data.progress);
    }
    if (data.settings) {
      saveSettings(data.settings);
    }
    return true;
  } catch (error) {
    console.error('Error importing progress:', error);
    return false;
  }
};
