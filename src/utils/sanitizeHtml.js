import DOMPurify from "dompurify";

// Keep tags & attributes QF uses for tajwid coloring: <span class="...">
const ALLOWED_TAGS = ["span", "b", "strong", "i", "em", "#text"];
const ALLOWED_ATTR = ["class", "dir"];

export function sanitizeTajweedHtml(html) {
  if (!html || typeof html !== "string") return "";
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    USE_PROFILES: { html: true },
  });
}
