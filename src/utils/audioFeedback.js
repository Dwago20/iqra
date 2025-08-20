// Audio feedback utilities for success/error tones and Arabic TTS

let _ctx;
const getCtx = () => (_ctx ||= new (window.AudioContext || window.webkitAudioContext)());

const beep = (startHz, endHz, ms = 200, gainPeak = 0.2) => {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(startHz, ctx.currentTime);
    if (endHz && endHz !== startHz) {
      osc.frequency.linearRampToValueAtTime(endHz, ctx.currentTime + ms / 1000);
    }
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(gainPeak, ctx.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + ms / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + ms / 1000 + 0.02);
  } catch (e) {
    console.warn("WebAudio beep failed", e);
  }
};

export const playSuccess = () => {
  beep(880, 1320, 160);
  setTimeout(() => beep(1320, 1760, 140), 110);
};

export const playError = () => beep(659, 523, 220);

let cachedArabicVoice = null;
const pickArabicVoice = () => {
  const voices = (window.speechSynthesis && window.speechSynthesis.getVoices?.()) || [];
  return voices.find(v => /^ar/i.test(v.lang)) || voices.find(v => /Arabic/i.test(v.name)) || null;
};

export const speakArabic = (text, { rate = 1.0, pitch = 1.05 } = {}) => {
  const synth = window.speechSynthesis;
  if (!synth) return console.warn("speechSynthesis not available");
  
  const trySpeak = () => {
    const ut = new SpeechSynthesisUtterance(text);
    ut.voice = cachedArabicVoice || null;
    ut.lang = (cachedArabicVoice && cachedArabicVoice.lang) || "ar-SA";
    ut.rate = rate;
    ut.pitch = pitch;
    try { synth.cancel(); } catch {}
    synth.speak(ut);
  };
  
  if (!cachedArabicVoice) {
    cachedArabicVoice = pickArabicVoice();
    if (!cachedArabicVoice) {
      // Wait for voices to load once, then retry
      synth.addEventListener("voiceschanged", () => {
        cachedArabicVoice = pickArabicVoice();
        if (cachedArabicVoice) trySpeak();
      }, { once: true });
      synth.getVoices(); // trigger load
      return;
    }
  }
  trySpeak();
};

export const stripHtmlTags = (s = "") => s.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

export const unlockAudio = async () => {
  try {
    const ctx = getCtx();
    if (ctx.state !== "running") await ctx.resume();
  } catch {}
};
