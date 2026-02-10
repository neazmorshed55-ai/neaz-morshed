import React from 'react';
/**
 * Country Code to Flag Emoji Converter
 * Replaces external FlagCDN with Unicode emoji flags
 */

/**
 * Convert ISO Alpha-2 country code to flag emoji
 * @param countryCode - Two-letter country code (e.g., 'US', 'GB', 'BD')
 * @returns Flag emoji string
 */
export function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) {
    return '🏳️'; // Default fallback flag
  }

  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map((char) => 127397 + char.charCodeAt(0));

  return String.fromCodePoint(...codePoints);
}

// FlagEmoji component removed - use getFlagEmoji() function directly instead
