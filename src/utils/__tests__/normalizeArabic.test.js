import { describe, it, expect } from 'vitest';
import { normalizeArabic } from '../speechRecognition.js';

describe('normalizeArabic', () => {
  it('should remove harakat (diacritics)', () => {
    const textWithHarakat = 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ';
    const expected = 'بسم الله الرحمن الرحيم';
    expect(normalizeArabic(textWithHarakat)).toBe(expected);
  });

  it('should normalize alif variants to ا', () => {
    const textWithAlifVariants = 'أحمد إبراهيم آدم ٱلله';
    const expected = 'احمد ابراهيم ادم الله';
    expect(normalizeArabic(textWithAlifVariants)).toBe(expected);
  });

  it('should convert ى to ي', () => {
    const textWithAlif = 'على إلى';
    const expected = 'علي الي';
    expect(normalizeArabic(textWithAlif)).toBe(expected);
  });

  it('should convert ة to ه', () => {
    const textWithTaaMarbuta = 'الصلاة الزكاة';
    const expected = 'الصلاه الزكاه';
    expect(normalizeArabic(textWithTaaMarbuta)).toBe(expected);
  });

  it('should convert lam-alif ligatures to لا', () => {
    const textWithLigatures = 'ﻻ ﻷ ﻹ ﻵ';
    const expected = 'لا لا لا لا';
    expect(normalizeArabic(textWithLigatures)).toBe(expected);
  });

  it('should remove tatweel (kashida)', () => {
    const textWithTatweel = 'اللـــــه';
    const expected = 'الله';
    expect(normalizeArabic(textWithTatweel)).toBe(expected);
  });

  it('should remove non-Arabic characters and normalize spaces', () => {
    const textWithPunctuation = 'بسم الله، الرحمن الرحيم.';
    const expected = 'بسم الله الرحمن الرحيم';
    expect(normalizeArabic(textWithPunctuation)).toBe(expected);
  });

  it('should handle multiple spaces and trim', () => {
    const textWithSpaces = '  بسم    الله   الرحمن  ';
    const expected = 'بسم الله الرحمن';
    expect(normalizeArabic(textWithSpaces)).toBe(expected);
  });

  it('should handle complete Quranic verse', () => {
    const verse = 'قُلْ هُوَ اللَّهُ أَحَدٌ';
    const expected = 'قل هو الله احد';
    expect(normalizeArabic(verse)).toBe(expected);
  });

  it('should handle empty string', () => {
    expect(normalizeArabic('')).toBe('');
  });

  it('should handle mixed Arabic and numbers/punctuation', () => {
    const mixed = 'الآية رقم 1: بِسْمِ اللَّهِ';
    const expected = 'الايه رقم بسم الله';
    expect(normalizeArabic(mixed)).toBe(expected);
  });

  it('should preserve word boundaries', () => {
    const text = 'الحمد لله رب العالمين';
    const result = normalizeArabic(text);
    expect(result.split(' ')).toHaveLength(4);
    expect(result).toBe('الحمد لله رب العالمين');
  });
});
