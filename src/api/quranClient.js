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
