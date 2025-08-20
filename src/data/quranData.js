// Sample Quran data with tajweed colors
// In a real app, this would be loaded from a comprehensive Quran API or database

export const quranData = {
  1: { // Al-Fatiha
    name: "الفاتحة",
    nameTranslation: "Al-Fatiha (The Opening)",
    ayahs: {
      1: {
        arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Bismillahi ar-rahmani ar-raheem",
        translation: "In the name of Allah, the Most Gracious, the Most Merciful",
        tajweed: [
          { text: "بِسْمِ", class: "" },
          { text: "اللَّهِ", class: "tajweed-madd" },
          { text: "الرَّحْمَٰنِ", class: "tajweed-ghunna" },
          { text: "الرَّحِيمِ", class: "tajweed-ghunna" }
        ]
      },
      2: {
        arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
        transliteration: "Al-hamdu lillahi rabbi al-alameen",
        translation: "Praise be to Allah, Lord of all the worlds",
        tajweed: [
          { text: "الْحَمْدُ", class: "" },
          { text: "لِلَّهِ", class: "tajweed-madd" },
          { text: "رَبِّ", class: "tajweed-ghunna" },
          { text: "الْعَالَمِينَ", class: "tajweed-madd" }
        ]
      },
      3: {
        arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
        transliteration: "Ar-rahmani ar-raheem",
        translation: "The Most Gracious, the Most Merciful",
        tajweed: [
          { text: "الرَّحْمَٰنِ", class: "tajweed-ghunna" },
          { text: "الرَّحِيمِ", class: "tajweed-ghunna" }
        ]
      },
      4: {
        arabic: "مَالِكِ يَوْمِ الدِّينِ",
        transliteration: "Maliki yawmi ad-deen",
        translation: "Master of the Day of Judgment",
        tajweed: [
          { text: "مَالِكِ", class: "" },
          { text: "يَوْمِ", class: "" },
          { text: "الدِّينِ", class: "tajweed-ghunna" }
        ]
      },
      5: {
        arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
        transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
        translation: "You alone we worship, and You alone we ask for help",
        tajweed: [
          { text: "إِيَّاكَ", class: "tajweed-madd" },
          { text: "نَعْبُدُ", class: "" },
          { text: "وَإِيَّاكَ", class: "tajweed-madd" },
          { text: "نَسْتَعِينُ", class: "tajweed-madd" }
        ]
      },
      6: {
        arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
        transliteration: "Ihdina as-sirata al-mustaqeem",
        translation: "Guide us on the straight path",
        tajweed: [
          { text: "اهْدِنَا", class: "" },
          { text: "الصِّرَاطَ", class: "tajweed-madd" },
          { text: "الْمُسْتَقِيمَ", class: "tajweed-madd" }
        ]
      },
      7: {
        arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
        transliteration: "Sirata allatheena an'amta alayhim ghayri al-maghdoobi alayhim wa la ad-dalleen",
        translation: "The path of those You have blessed, not of those who have incurred Your wrath, nor of those who have gone astray",
        tajweed: [
          { text: "صِرَاطَ", class: "tajweed-madd" },
          { text: "الَّذِينَ", class: "tajweed-madd" },
          { text: "أَنْعَمْتَ", class: "" },
          { text: "عَلَيْهِمْ", class: "" },
          { text: "غَيْرِ", class: "" },
          { text: "الْمَغْضُوبِ", class: "" },
          { text: "عَلَيْهِمْ", class: "" },
          { text: "وَلَا", class: "" },
          { text: "الضَّالِّينَ", class: "tajweed-ghunna" }
        ]
      }
    }
  },
  112: { // Al-Ikhlas
    name: "الإخلاص",
    nameTranslation: "Al-Ikhlas (The Sincerity)",
    ayahs: {
      1: {
        arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
        transliteration: "Qul huwa Allahu ahad",
        translation: "Say: He is Allah, the One",
        tajweed: [
          { text: "قُلْ", class: "tajweed-qalqala" },
          { text: "هُوَ", class: "" },
          { text: "اللَّهُ", class: "tajweed-madd" },
          { text: "أَحَدٌ", class: "" }
        ]
      },
      2: {
        arabic: "اللَّهُ الصَّمَدُ",
        transliteration: "Allahu as-samad",
        translation: "Allah, the Eternal, Absolute",
        tajweed: [
          { text: "اللَّهُ", class: "tajweed-madd" },
          { text: "الصَّمَدُ", class: "" }
        ]
      },
      3: {
        arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
        transliteration: "Lam yalid wa lam yoolad",
        translation: "He begets not, nor is He begotten",
        tajweed: [
          { text: "لَمْ", class: "" },
          { text: "يَلِدْ", class: "tajweed-qalqala" },
          { text: "وَلَمْ", class: "" },
          { text: "يُولَدْ", class: "tajweed-qalqala" }
        ]
      },
      4: {
        arabic: "وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ",
        transliteration: "Wa lam yakun lahu kufuwan ahad",
        translation: "And there is none comparable to Him",
        tajweed: [
          { text: "وَلَمْ", class: "" },
          { text: "يَكُنْ", class: "tajweed-ikhfa" },
          { text: "لَهُ", class: "" },
          { text: "كُفُوًا", class: "" },
          { text: "أَحَدٌ", class: "" }
        ]
      }
    }
  },
  113: { // Al-Falaq
    name: "الفلق",
    nameTranslation: "Al-Falaq (The Daybreak)",
    ayahs: {
      1: {
        arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
        transliteration: "Qul a'oodhu bi rabbi al-falaq",
        translation: "Say: I seek refuge in the Lord of daybreak",
        tajweed: [
          { text: "قُلْ", class: "tajweed-qalqala" },
          { text: "أَعُوذُ", class: "" },
          { text: "بِرَبِّ", class: "tajweed-ghunna" },
          { text: "الْفَلَقِ", class: "tajweed-qalqala" }
        ]
      },
      2: {
        arabic: "مِنْ شَرِّ مَا خَلَقَ",
        transliteration: "Min sharri ma khalaq",
        translation: "From the evil of what He created",
        tajweed: [
          { text: "مِنْ", class: "tajweed-ikhfa" },
          { text: "شَرِّ", class: "tajweed-ghunna" },
          { text: "مَا", class: "" },
          { text: "خَلَقَ", class: "tajweed-qalqala" }
        ]
      }
    }
  },
  114: { // An-Nas
    name: "الناس",
    nameTranslation: "An-Nas (The People)",
    ayahs: {
      1: {
        arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
        transliteration: "Qul a'oodhu bi rabbi an-nas",
        translation: "Say: I seek refuge in the Lord of people",
        tajweed: [
          { text: "قُلْ", class: "tajweed-qalqala" },
          { text: "أَعُوذُ", class: "" },
          { text: "بِرَبِّ", class: "tajweed-ghunna" },
          { text: "النَّاسِ", class: "tajweed-ghunna" }
        ]
      },
      2: {
        arabic: "مَلِكِ النَّاسِ",
        transliteration: "Maliki an-nas",
        translation: "The King of people",
        tajweed: [
          { text: "مَلِكِ", class: "" },
          { text: "النَّاسِ", class: "tajweed-ghunna" }
        ]
      }
    }
  }
};

// Module structure for organizing practice
export const modules = [
  {
    id: 1,
    name: "Module 1: Essential Surahs",
    description: "Learn the most commonly recited surahs",
    surahs: [1, 112, 113, 114],
    difficulty: "Beginner"
  },
  {
    id: 2,
    name: "Module 2: Al-Fatiha Mastery",
    description: "Perfect your recitation of Al-Fatiha",
    surahs: [1],
    difficulty: "Intermediate"
  },
  {
    id: 3,
    name: "Module 3: Protection Surahs",
    description: "Learn the protective surahs (Al-Falaq & An-Nas)",
    surahs: [113, 114],
    difficulty: "Beginner"
  }
];

// Helper functions
export const getSurahById = (id) => quranData[id];
export const getAyahBySurahAndNumber = (surahId, ayahNumber) => {
  const surah = getSurahById(surahId);
  return surah ? surah.ayahs[ayahNumber] : null;
};

export const getAllSurahs = () => {
  return Object.keys(quranData).map(id => ({
    id: parseInt(id),
    name: quranData[id].name,
    nameTranslation: quranData[id].nameTranslation,
    ayahCount: Object.keys(quranData[id].ayahs).length
  }));
};

export const getModuleById = (id) => modules.find(module => module.id === id);

// Simple transliteration cleaning for comparison
export const cleanTextForComparison = (text) => {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove punctuation
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim();
};
