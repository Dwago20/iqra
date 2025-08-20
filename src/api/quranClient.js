// Quran data client with Quran Foundation APIs + fallbacks

const QF_BASE = import.meta.env.VITE_QF_CONTENT_BASE || "";
const QF_TOKEN = import.meta.env.VITE_QF_ACCESS_TOKEN || "";
const QF_CLIENT_ID = import.meta.env.VITE_QF_CLIENT_ID || "";

const mem = { surahs: null, ayahs: new Map() };

export function isQuranFoundationEnabled() {
  return Boolean(QF_BASE && QF_TOKEN && QF_CLIENT_ID);
}

function qfHeaders(extra = {}) {
  if (!isQuranFoundationEnabled()) return extra;
  return {
    "x-auth-token": QF_TOKEN,
    "x-client-id": QF_CLIENT_ID,
    ...extra,
  };
}

async function qfFetch(path, params = {}) {
  if (!isQuranFoundationEnabled()) throw new Error("QF disabled");
  const url = `${QF_BASE}${path}`;
  const res = await fetch(url, { ...params, headers: qfHeaders(params.headers) });
  if (!res.ok) throw new Error(`QF error ${res.status}`);
  return res.json();
}

// -------- Surahs --------
export async function getSurahs() {
  if (mem.surahs) return mem.surahs;
  
  if (isQuranFoundationEnabled()) {
    try {
      // TODO: Verify QF v4 endpoint: /chapters
      const data = await qfFetch(`/chapters`);
      mem.surahs = (data?.chapters || []).map(c => ({
        number: c.id,
        nameArabic: c.name_arabic,
        nameEnglish: c.translated_name?.name || c.name_simple,
      }));
      if (mem.surahs.length) return mem.surahs;
    } catch (e) { 
      console.warn("QF getSurahs failed:", e); 
    }
  }
  
  // Fallback: Tanzil
  try {
    const res = await fetch(`/tanzil/surahs.json`);
    const json = await res.json();
    mem.surahs = json;
    return mem.surahs;
  } catch (e) {
    console.warn("Tanzil fallback failed:", e);
  }
  
  // Final hardcoded fallback
  return [
    { number: 1, nameArabic: "الفاتحة", nameEnglish: "Al-Fātiḥah" },
    { number: 112, nameArabic: "الإخلاص", nameEnglish: "Al-Ikhlāṣ" },
    { number: 113, nameArabic: "الفلق", nameEnglish: "Al-Falaq" },
    { number: 114, nameArabic: "الناس", nameEnglish: "An-Nās" }
  ];
}

// -------- Ayahs --------
export async function getAyahs(surahNumber, { page = 1, perPage = 50 } = {}) {
  const key = String(surahNumber);
  if (mem.ayahs.has(key)) return mem.ayahs.get(key);

  if (isQuranFoundationEnabled()) {
    try {
      // TODO: Verify QF v4 endpoint fields: text_uthmani, text_uthmani_tajweed
      const qs = new URLSearchParams({
        page: String(page),
        per_page: String(perPage),
        fields: "text_uthmani,text_uthmani_tajweed",
      }).toString();
      const data = await qfFetch(`/verses/by_chapter/${surahNumber}?${qs}`);
      const verses = data?.verses || [];
      const ayahs = verses.map(v => ({
        numberInSurah: v.verse_number,
        textArabic: v.text_uthmani || v.text_imlaei,
        textUthmani: v.text_uthmani || null,
        tajweedHtml: v.text_uthmani_tajweed || null, // HTML spans with tajweed colors
      }));
      mem.ayahs.set(key, ayahs);
      return ayahs;
    } catch (e) { 
      console.warn("QF getAyahs failed:", e); 
    }
  }
  
  // Fallback: Tanzil
  try {
    const res = await fetch(`/tanzil/surah-${surahNumber}.json`);
    const json = await res.json();
    const ayahs = json.ayahs.map((a, i) => ({
      numberInSurah: i + 1,
      textArabic: a.text,
      textUthmani: a.uthmani || null,
      tajweedHtml: a.tajweed || null,
    }));
    mem.ayahs.set(key, ayahs);
    return ayahs;
  } catch (e) {
    console.warn(`Tanzil surah-${surahNumber} fallback failed:`, e);
  }
  
  return [];
}

// -------- Audio --------
export async function getAudioUrl({ surahNumber, ayahNumber, reciterId = 5 }) {
  // Prefer QF chapter audio
  if (!ayahNumber && isQuranFoundationEnabled()) {
    try {
      // TODO: Verify QF v4 endpoint: /chapter_reciter_audio_file/{reciterId}
      const data = await qfFetch(`/chapter_reciter_audio_file/${reciterId}?chapter_number=${surahNumber}`);
      const url = data?.audio_file?.audio_url;
      if (url) return url;
    } catch (e) { 
      console.warn("QF chapter audio failed:", e); 
    }
  }
  
  // Fallback: Quran.com
  const s = String(surahNumber).padStart(3, "0");
  if (!ayahNumber) {
    // Full chapter audio
    return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${s}.mp3`;
  }
  
  // Individual ayah audio
  const a = String(ayahNumber).padStart(3, "0");
  return `https://audio.qurancdn.com/ar.alafasy/ayahs/${s}${a}.mp3`;
}

// -------- Utility --------
export function getDataSourceInfo() {
  return {
    quranFoundation: isQuranFoundationEnabled(),
    fallbacks: ['Tanzil JSON files', 'Quran.com audio', 'Local sample data'],
    currentMode: isQuranFoundationEnabled() ? 'QF + fallbacks' : 'Fallbacks only'
  };
}
