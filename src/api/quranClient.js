// Quran data client with Quran.com primary, QF secondary, Tanzil/local fallbacks

const QC_BASE = import.meta.env.VITE_QC_BASE || "https://api.quran.com/api/v4";
const QF_BASE = import.meta.env.VITE_QF_CONTENT_BASE || "";
const QF_TOKEN = import.meta.env.VITE_QF_ACCESS_TOKEN || "";
const QF_CLIENT_ID = import.meta.env.VITE_QF_CLIENT_ID || "";

const mem = { surahs: null, ayahs: new Map(), recitations: null };

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
  
  // 1) Try Quran.com first
  try {
    const res = await fetch(`${QC_BASE}/chapters`);
    if (res.ok) {
      const data = await res.json();
      mem.surahs = (data?.chapters || []).map(c => ({
        number: c.id,
        nameArabic: c.name_arabic,
        nameEnglish: c.translated_name?.name || c.name_simple,
      }));
      if (mem.surahs.length) return mem.surahs;
    }
  } catch (e) {
    console.warn("Quran.com getSurahs failed:", e);
  }
  
  // 2) Try QF as secondary
  if (isQuranFoundationEnabled()) {
    try {
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
  
  // 3) Fallback: Tanzil
  try {
    const res = await fetch(`/tanzil/surahs.json`);
    const json = await res.json();
    mem.surahs = json;
    return mem.surahs;
  } catch (e) {
    console.warn("Tanzil fallback failed:", e);
  }
  
  // 4) Final hardcoded fallback
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

  // 1) Try Quran.com first
  try {
    const qs = new URLSearchParams({
      fields: "text_uthmani,text_uthmani_tajweed",
      per_page: String(perPage),
      page: String(page),
    }).toString();
    const res = await fetch(`${QC_BASE}/verses/by_chapter/${surahNumber}?${qs}`);
    if (res.ok) {
      const data = await res.json();
      const verses = data?.verses || [];
      const ayahs = verses.map(v => ({
        numberInSurah: v.verse_number,
        textArabic: v.text_uthmani,
        textUthmani: v.text_uthmani || null,
        tajweedHtml: v.text_uthmani_tajweed || null,
      }));
      mem.ayahs.set(key, ayahs);
      return ayahs;
    }
  } catch (e) {
    console.warn("Quran.com getAyahs failed:", e);
  }

  // 2) Try QF as secondary
  if (isQuranFoundationEnabled()) {
    try {
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
        tajweedHtml: v.text_uthmani_tajweed || null,
      }));
      mem.ayahs.set(key, ayahs);
      return ayahs;
    } catch (e) { 
      console.warn("QF getAyahs failed:", e); 
    }
  }
  
  // 3) Fallback: Tanzil
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
  // 1) Try Quran.com first for chapter audio
  if (!ayahNumber) {
    try {
      const res = await fetch(`${QC_BASE}/chapter_recitations/${reciterId}?chapter_number=${surahNumber}`);
      if (res.ok) {
        const data = await res.json();
        const audioUrl = data?.audio_files?.[0]?.audio_url;
        if (audioUrl) return audioUrl;
      }
    } catch (e) {
      console.warn("Quran.com chapter audio failed:", e);
    }
  }

  // 2) Try QF as secondary
  if (!ayahNumber && isQuranFoundationEnabled()) {
    try {
      const data = await qfFetch(`/chapter_reciter_audio_file/${reciterId}?chapter_number=${surahNumber}`);
      const url = data?.audio_file?.audio_url;
      if (url) return url;
    } catch (e) { 
      console.warn("QF chapter audio failed:", e); 
    }
  }
  
  // 3) Fallback: Static URLs
  const s = String(surahNumber).padStart(3, "0");
  if (!ayahNumber) {
    // Full chapter audio
    return `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${s}.mp3`;
  }
  
  // Individual ayah audio
  const a = String(ayahNumber).padStart(3, "0");
  return `https://audio.qurancdn.com/ar.alafasy/ayahs/${s}${a}.mp3`;
}

// -------- Recitations --------
export async function getRecitations() {
  if (mem.recitations) return mem.recitations;

  // Try Quran.com first
  try {
    const res = await fetch(`${QC_BASE}/resources/recitations?language=en`);
    if (res.ok) {
      const data = await res.json();
      mem.recitations = (data?.recitations || []).map(r => ({
        id: r.id,
        name: r.reciter_name,
        style: r.style
      }));
      if (mem.recitations.length) return mem.recitations;
    }
  } catch (e) {
    console.warn("Quran.com recitations failed:", e);
  }

  // Static fallback list
  mem.recitations = [
    { id: 5, name: "Mishary Rashid Alafasy", style: "Murattal" },
    { id: 7, name: "Mohammad al-Minshawi", style: "Murattal" },
    { id: 1, name: "Mahmoud Khalil Al-Husary", style: "Murattal" }
  ];
  return mem.recitations;
}

// -------- Utility --------
export function getDataSourceInfo() {
  return {
    quranFoundation: isQuranFoundationEnabled(),
    fallbacks: ['Tanzil JSON files', 'Quran.com audio', 'Local sample data'],
    currentMode: isQuranFoundationEnabled() ? 'QF + fallbacks' : 'Fallbacks only'
  };
}
