// Speech recognition utilities using Web Speech API

export const isSpeechRecognitionSupported = () => {
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
};

export const createSpeechRecognition = () => {
  if (!isSpeechRecognitionSupported()) {
    return null;
  }

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  // Configure recognition settings
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'ar-SA'; // Arabic (Saudi Arabia) - good for Quran
  recognition.maxAlternatives = 3;
  
  return recognition;
};

// Compare two texts for similarity
export const calculateSimilarity = (text1, text2) => {
  // Clean and normalize both texts
  const clean1 = cleanText(text1);
  const clean2 = cleanText(text2);
  
  if (clean1 === clean2) return 100;
  if (clean1.length === 0 || clean2.length === 0) return 0;
  
  // Use Levenshtein distance for similarity calculation
  const distance = levenshteinDistance(clean1, clean2);
  const maxLength = Math.max(clean1.length, clean2.length);
  const similarity = ((maxLength - distance) / maxLength) * 100;
  
  return Math.max(0, Math.round(similarity));
};

const containsArabic = s => /[\u0600-\u06FF]/.test(s);

// Remove harakat, tatweel, unify alif/yaa/taa marbuta, strip punctuation.
export const normalizeArabic = (text) => text
  .replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
  .replace(/\u0640/g, '')
  .replace(/[ﭐﭑﻻﻷﻹﻵ]/g, 'لا')
  .replace(/[أإآٱ]/g, 'ا')
  .replace(/ى/g, 'ي')
  .replace(/ة/g, 'ه')
  .replace(/[\u060C\u061B\u061F]/g, ' ')
  .replace(/[^\u0621-\u063A\u0641-\u064A\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

// Clean text for comparison
const cleanText = (text) => {
  if (containsArabic(text)) return normalizeArabic(text);
  return text.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim();
};

// Calculate Levenshtein distance between two strings
const levenshteinDistance = (str1, str2) => {
  const matrix = [];
  
  // Create matrix
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  // Fill matrix
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1 // deletion
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
};

// Find mismatched words between target and spoken text
export const findMismatches = (targetText, spokenText) => {
  const targetWords = cleanText(targetText).split(' ');
  const spokenWords = cleanText(spokenText).split(' ');
  
  const mismatches = [];
  const maxLength = Math.max(targetWords.length, spokenWords.length);
  
  for (let i = 0; i < maxLength; i++) {
    const targetWord = targetWords[i] || '';
    const spokenWord = spokenWords[i] || '';
    
    if (targetWord !== spokenWord) {
      mismatches.push({
        index: i,
        target: targetWord,
        spoken: spokenWord,
        type: !targetWord ? 'extra' : !spokenWord ? 'missing' : 'different'
      });
    }
  }
  
  return mismatches;
};

// Get accuracy threshold for "correct" pronunciation
export const getAccuracyThreshold = () => {
  return 70; // 70% similarity is considered "correct"
};

// Format recognition result for display
export const formatRecognitionResult = (result, confidence) => {
  return {
    text: result,
    confidence: Math.round(confidence * 100),
    timestamp: new Date().toISOString()
  };
};
