/**
 * Deviant Multimedia Engine — shared engine code for the in-player
 * accessibility stack (audio AND video; renamed from "Deviant Audio
 * Engine" 2026-11-10 because it covers both).
 *
 * Nothing here invents a fake capability. The upscaler is a real plugin
 * point: until a provider registers, the player honestly reports
 * "not connected". The video palette filters are real CSS filters;
 * achromatopsia matches the site-wide grayscale treatment, and the other
 * six are documented contrast/separation enhancement ramps — clinical
 * daltonization matrices are a follow-up, not something to fake here.
 */

import type { ColorBlindPalette } from '../context/AccessibilityContext';

/* ------------------------------------------------------------------ */
/* Video palettes: the same 7 typed palettes, as filters on <video>.    */
/* ------------------------------------------------------------------ */

/**
 * Per-palette CSS filter applied to the <video> element.
 *
 * - achromatopsia: pure grayscale + a touch of contrast. This is the same
 *   treatment the site already applies to all media (index.css).
 * - The other six boost saturation and contrast and shift hue a few
 *   degrees in the direction that separates the colours that deficiency
 *   confuses. These are enhancement ramps, NOT clinical daltonization
 *   (which needs per-pixel colour-space matrices). If Sonja wants true
 *   daltonization, that is a colour-science pass on this map — the
 *   plumbing (same palette ids, same persistence) already supports it.
 */
export const VIDEO_PALETTE_FILTERS: Record<ColorBlindPalette, string> = {
  none: 'none',
  deuteranomaly: 'saturate(1.25) contrast(1.06) hue-rotate(-6deg)',
  protanomaly: 'saturate(1.25) contrast(1.06) hue-rotate(8deg)',
  deuteranopia: 'saturate(1.35) contrast(1.08) hue-rotate(-10deg)',
  protanopia: 'saturate(1.35) contrast(1.08) hue-rotate(12deg)',
  tritanomaly: 'saturate(1.25) contrast(1.06) hue-rotate(4deg)',
  tritanopia: 'saturate(1.35) contrast(1.08) hue-rotate(-4deg)',
  achromatopsia: 'grayscale(1) contrast(1.08)',
};

/* ------------------------------------------------------------------ */
/* Subtitles                                                           */
/* ------------------------------------------------------------------ */

export type SubtitleTrackKind = 'subtitles' | 'captions' | 'descriptions';

export interface SubtitleTrackInput {
  src: string;
  srclang: string;
  label: string;
  kind: SubtitleTrackKind;
}

export interface SubtitleTrack extends SubtitleTrackInput {
  /** Stable id for the track list UI. */
  id: string;
  /** True when the viewer attached this file themselves (removable). */
  userAttached: boolean;
  /** Blob URL when the track came from an upload / fetch, else undefined. */
  blobUrl?: string;
}

let trackCounter = 0;
export const makeTrackId = (): string => `dme-track-${Date.now().toString(36)}-${(trackCounter += 1)}`;

/**
 * Convert SubRip (.srt) text to WebVTT, which is what <track> needs.
 * SRT timestamps use commas (00:00:01,000); VTT uses dots. A WEBVTT
 * header is required. Everything else (cue text, sequence numbers)
 * passes through unchanged.
 */
export function srtToVtt(srt: string): string {
  const body = srt
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2')
    .trim();
  return `WEBVTT\n\n${body}\n`;
}

/** True when the text looks like SubRip rather than WebVTT. */
export function looksLikeSrt(text: string): boolean {
  const head = text.replace(/^\uFEFF/, '').trimStart();
  if (head.startsWith('WEBVTT')) return false;
  return /\d{2}:\d{2}:\d{2},\d{3}\s*-->/.test(head);
}

/* ------------------------------------------------------------------ */
/* Upscaler: the real plugin point. No provider = honest stub state.    */
/* ------------------------------------------------------------------ */

export type MediaKind = 'video' | 'audio';

export interface UpscaleRequest {
  /** Source media URL (the file currently playing). */
  src: string;
  kind: MediaKind;
  title: string;
}

export interface UpscaleResult {
  /** URL of the upscaled media to play instead of the source. */
  src: string;
  /** Short human-readable label, e.g. "Upscaled 1080p · ExampleUpscaler". */
  label: string;
}

export interface UpscalerProvider {
  /** Stable id, e.g. 'topaz-video-ai' or 'local-ffmpeg'. */
  id: string;
  /** Human-readable name shown in the player. */
  label: string;
  supports: (kind: MediaKind) => boolean;
  /** Returns an upscaled media URL. Must reject (never resolve a fake) on failure. */
  upscale: (req: UpscaleRequest) => Promise<UpscaleResult>;
}

export type UpscalerStatus = 'not-connected' | 'ready';

let provider: UpscalerProvider | null = null;

/** Register the one upscaler provider. Called once at app start by whoever owns the provider. */
export function registerUpscalerProvider(p: UpscalerProvider): void {
  provider = p;
}

export function getUpscalerProvider(): UpscalerProvider | null {
  return provider;
}

export function getUpscalerStatus(): UpscalerStatus {
  return provider ? 'ready' : 'not-connected';
}
