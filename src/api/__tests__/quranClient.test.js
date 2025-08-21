import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock fetch globally
global.fetch = vi.fn();

describe('quranClient', () => {
  let getSurahs, getAyahs, getRecitations, getAudioUrl;

  beforeEach(async () => {
    // Reset fetch mock before each test
    fetch.mockReset();
    
    // Dynamically import fresh module to avoid caching issues
    vi.resetModules();
    const module = await import('../quranClient');
    getSurahs = module.getSurahs;
    getAyahs = module.getAyahs;
    getRecitations = module.getRecitations;
    getAudioUrl = module.getAudioUrl;
  });

  describe('getSurahs', () => {
    it('should fetch surahs from Quran.com and map correctly', async () => {
      const mockResponse = {
        chapters: [
          {
            id: 1,
            name_arabic: 'الفاتحة',
            name_simple: 'Al-Fatihah',
            translated_name: { name: 'The Opening' }
          },
          {
            id: 2,
            name_arabic: 'البقرة',
            name_simple: 'Al-Baqarah',
            translated_name: { name: 'The Cow' }
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getSurahs();

      expect(fetch).toHaveBeenCalledWith('https://api.quran.com/api/v4/chapters');
      expect(result).toEqual([
        {
          number: 1,
          nameArabic: 'الفاتحة',
          nameEnglish: 'The Opening'
        },
        {
          number: 2,
          nameArabic: 'البقرة',
          nameEnglish: 'The Cow'
        }
      ]);
    });

    it('should fallback to Tanzil when Quran.com fails', async () => {
      const tanzilResponse = [
        {
          number: 1,
          nameArabic: 'الفاتحة',
          nameEnglish: 'Al-Fātiḥah'
        }
      ];

      // First call (Quran.com) fails
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Second call (Tanzil) succeeds
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => tanzilResponse
      });

      const result = await getSurahs();

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(fetch).toHaveBeenNthCalledWith(1, 'https://api.quran.com/api/v4/chapters');
      expect(fetch).toHaveBeenNthCalledWith(2, '/tanzil/surahs.json');
      expect(result).toEqual(tanzilResponse);
    });

    it('should return hardcoded fallback when all sources fail', async () => {
      // Both Quran.com and Tanzil fail
      fetch.mockRejectedValue(new Error('Network error'));

      const result = await getSurahs();

      expect(result).toEqual([
        { number: 1, nameArabic: "الفاتحة", nameEnglish: "Al-Fātiḥah" },
        { number: 112, nameArabic: "الإخلاص", nameEnglish: "Al-Ikhlāṣ" },
        { number: 113, nameArabic: "الفلق", nameEnglish: "Al-Falaq" },
        { number: 114, nameArabic: "الناس", nameEnglish: "An-Nās" }
      ]);
    });
  });

  describe('getAyahs', () => {
    it('should fetch ayahs from Quran.com and map correctly', async () => {
      const mockResponse = {
        verses: [
          {
            verse_number: 1,
            text_uthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            text_uthmani_tajweed: '<span class="tajweed-madd">بِسْمِ</span> اللَّهِ'
          },
          {
            verse_number: 2,
            text_uthmani: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
            text_uthmani_tajweed: null
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getAyahs(1, { page: 1, perPage: 50 });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.quran.com/api/v4/verses/by_chapter/1?fields=text_uthmani%2Ctext_uthmani_tajweed&per_page=50&page=1'
      );
      expect(result).toEqual([
        {
          numberInSurah: 1,
          textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          textUthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          tajweedHtml: '<span class="tajweed-madd">بِسْمِ</span> اللَّهِ'
        },
        {
          numberInSurah: 2,
          textArabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
          textUthmani: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
          tajweedHtml: null
        }
      ]);
    });

    it('should fallback to Tanzil when Quran.com fails', async () => {
      const tanzilResponse = {
        ayahs: [
          {
            text: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            uthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
            tajweed: '<span>بِسْمِ</span> اللَّهِ'
          }
        ]
      };

      // Quran.com fails
      fetch.mockRejectedValueOnce(new Error('Network error'));
      
      // Tanzil succeeds
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => tanzilResponse
      });

      const result = await getAyahs(1);

      expect(fetch).toHaveBeenCalledTimes(2);
      expect(result).toEqual([
        {
          numberInSurah: 1,
          textArabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          textUthmani: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
          tajweedHtml: '<span>بِسْمِ</span> اللَّهِ'
        }
      ]);
    });

    it('should return empty array when all sources fail', async () => {
      fetch.mockRejectedValue(new Error('Network error'));

      const result = await getAyahs(1);

      expect(result).toEqual([]);
    });
  });

  describe('getRecitations', () => {
    it('should fetch recitations from Quran.com and map correctly', async () => {
      const mockResponse = {
        recitations: [
          {
            id: 5,
            reciter_name: 'Mishary Rashid Alafasy',
            style: 'Murattal'
          },
          {
            id: 7,
            reciter_name: 'Mohammad al-Minshawi',
            style: 'Murattal'
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getRecitations();

      expect(fetch).toHaveBeenCalledWith('https://api.quran.com/api/v4/resources/recitations?language=en');
      expect(result).toEqual([
        {
          id: 5,
          name: 'Mishary Rashid Alafasy',
          style: 'Murattal'
        },
        {
          id: 7,
          name: 'Mohammad al-Minshawi',
          style: 'Murattal'
        }
      ]);
    });

    it('should return static fallback list when API fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getRecitations();

      expect(result).toEqual([
        { id: 5, name: "Mishary Rashid Alafasy", style: "Murattal" },
        { id: 7, name: "Mohammad al-Minshawi", style: "Murattal" },
        { id: 1, name: "Mahmoud Khalil Al-Husary", style: "Murattal" }
      ]);
    });
  });

  describe('getAudioUrl', () => {
    it('should fetch chapter audio URL from Quran.com', async () => {
      const mockResponse = {
        audio_files: [
          {
            audio_url: 'https://audio.qurancdn.com/chapter/5/001.mp3'
          }
        ]
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });

      const result = await getAudioUrl({
        surahNumber: 1,
        reciterId: 5
      });

      expect(fetch).toHaveBeenCalledWith(
        'https://api.quran.com/api/v4/chapter_recitations/5?chapter_number=1'
      );
      expect(result).toBe('https://audio.qurancdn.com/chapter/5/001.mp3');
    });

    it('should return static URL fallback for chapter audio when API fails', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const result = await getAudioUrl({
        surahNumber: 1,
        reciterId: 5
      });

      expect(result).toBe('https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3');
    });

    it('should return static ayah audio URL when ayahNumber is provided', async () => {
      const result = await getAudioUrl({
        surahNumber: 1,
        ayahNumber: 1,
        reciterId: 5
      });

      // Should not call API for ayah audio, just return static URL
      expect(fetch).not.toHaveBeenCalled();
      expect(result).toBe('https://audio.qurancdn.com/ar.alafasy/ayahs/001001.mp3');
    });

    it('should pad surah and ayah numbers correctly', async () => {
      const result = await getAudioUrl({
        surahNumber: 2,
        ayahNumber: 255,
        reciterId: 5
      });

      expect(result).toBe('https://audio.qurancdn.com/ar.alafasy/ayahs/002255.mp3');
    });
  });

  describe('caching behavior', () => {
    it('should cache surahs and not refetch on subsequent calls', async () => {
      const mockResponse = {
        chapters: [
          { id: 1, name_arabic: 'الفاتحة', name_simple: 'Al-Fatihah', translated_name: { name: 'The Opening' } }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // First call
      const result1 = await getSurahs();
      
      // Second call
      const result2 = await getSurahs();

      expect(fetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it('should cache ayahs per surah and not refetch on subsequent calls', async () => {
      const mockResponse = {
        verses: [
          { verse_number: 1, text_uthmani: 'بِسْمِ اللَّهِ', text_uthmani_tajweed: null }
        ]
      };

      fetch.mockResolvedValue({
        ok: true,
        json: async () => mockResponse
      });

      // First call for surah 1
      const result1 = await getAyahs(1);
      
      // Second call for surah 1
      const result2 = await getAyahs(1);
      
      // Third call for surah 2 (should fetch)
      const result3 = await getAyahs(2);

      expect(fetch).toHaveBeenCalledTimes(2); // Once for surah 1, once for surah 2
      expect(result1).toEqual(result2);
    });
  });
});
