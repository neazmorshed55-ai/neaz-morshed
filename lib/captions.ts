/**
 * Caption handling for video reviews.
 *
 * Captions are stored on the review row as WebVTT and handed to a <track>
 * element, which gives the native player its CC button — so a visitor can
 * switch them off. The admin panel accepts either SRT or VTT and normalizes
 * to VTT here.
 *
 * A transcript with no timestamps cannot become captions: cue timings can't be
 * invented, and evenly spreading text across the runtime drifts out of sync.
 * parseCaptions returns null for such input so the UI can say so plainly.
 */

/** SRT uses a comma before milliseconds; WebVTT requires a dot. */
const SRT_TIMECODE = /(\d{2}:\d{2}:\d{2}),(\d{3})/g;

const HAS_TIMECODE = /\d{2}:\d{2}:\d{2}[.,]\d{3}\s*-->/;

/**
 * Normalizes SRT or VTT input to WebVTT.
 * Returns null if the input carries no cue timings.
 */
export function parseCaptions(raw: string): string | null {
  const input = raw.trim();
  if (!input || !HAS_TIMECODE.test(input)) return null;

  // Strip a existing WEBVTT header so we can re-emit exactly one.
  const body = input
    .replace(/^﻿/, '')
    .replace(/^WEBVTT[^\n]*\n/i, '')
    .trim();

  const vttBody = body.replace(SRT_TIMECODE, '$1.$2');

  return `WEBVTT\n\n${vttBody}\n`;
}

/** Number of cues in a VTT document — used to show the admin what it parsed. */
export function countCues(vtt: string): number {
  const matches = vtt.match(/-->/g);
  return matches ? matches.length : 0;
}
