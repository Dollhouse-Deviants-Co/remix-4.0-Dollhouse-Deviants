import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

/**
 * Typed color-vision palettes. 'none' = default site palette.
 * deuteranomaly / protanomaly / deuteranopia / protanopia cover red-green
 * deficiencies, tritanomaly / tritanopia cover blue-yellow deficiencies,
 * achromatopsia is total color blindness (monochromacy).
 */
export type ColorBlindPalette =
  | 'none'
  | 'deuteranomaly'
  | 'protanomaly'
  | 'deuteranopia'
  | 'protanopia'
  | 'tritanomaly'
  | 'tritanopia'
  | 'achromatopsia';

export const COLOR_BLIND_PALETTES: { id: ColorBlindPalette; label: string; hint: string }[] = [
  { id: 'none', label: 'Off (default palette)', hint: 'No remapping' },
  { id: 'deuteranomaly', label: 'Deuteranomaly', hint: 'Green-weak: blue/orange ramp' },
  { id: 'protanomaly', label: 'Protanomaly', hint: 'Red-weak: blue/amber ramp' },
  { id: 'deuteranopia', label: 'Deuteranopia', hint: 'No green: blue/orange ramp' },
  { id: 'protanopia', label: 'Protanopia', hint: 'No red: blue/yellow ramp' },
  { id: 'tritanomaly', label: 'Tritanomaly', hint: 'Blue-weak: pink/green ramp' },
  { id: 'tritanopia', label: 'Tritanopia', hint: 'No blue: pink/orange ramp' },
  { id: 'achromatopsia', label: 'Achromatopsia (monochromacy)', hint: 'Pure grayscale + high contrast' },
];

export const isColorBlindPalette = (v: unknown): v is ColorBlindPalette =>
  COLOR_BLIND_PALETTES.some((p) => p.id === v);

interface AccessProps {
  focusMode: boolean; toggleFocus: () => void;
  reduceMotion: boolean; toggleMotion: () => void;
  dyslexicFont: boolean; toggleFont: () => void;
  highContrast: boolean; toggleContrast: () => void;
  tooltipsEnabled: boolean; toggleTooltips: () => void;
  colorBlindPalette: ColorBlindPalette; setColorBlindPalette: (p: ColorBlindPalette) => void;
  /** @deprecated Derived from colorBlindPalette (palette !== 'none')). Kept for compatibility. */
  colorBlindMode: boolean;
  /** @deprecated Toggles between 'none' and the last non-'none' palette. Prefer setColorBlindPalette. */
  toggleColorBlind: () => void;
  lightMode: boolean; toggleLightMode: () => void;
  isSimplifiedMode: boolean; toggleSimplifiedMode: () => void;
}

const AccessContext = createContext<AccessProps | undefined>(undefined);

const STORE_KEY = 'dd_a11y_settings_v1';
const LEGACY_SIMPLIFIED_KEY = 'deviant_simplified_mode';

interface StoredSettings {
  focusMode: boolean;
  reduceMotion: boolean;
  dyslexicFont: boolean;
  highContrast: boolean;
  tooltipsEnabled: boolean;
  colorBlindPalette: ColorBlindPalette;
  lightMode: boolean;
  isSimplifiedMode: boolean;
}

const DEFAULTS: StoredSettings = {
  focusMode: false,
  reduceMotion: false,
  dyslexicFont: false,
  highContrast: false,
  tooltipsEnabled: true,
  colorBlindPalette: 'none',
  lightMode: false,
  isSimplifiedMode: false,
};

const toBool = (v: unknown, fallback: boolean): boolean =>
  typeof v === 'boolean' ? v : fallback;

function readCookie(key: string): string | null {
  if (typeof document === 'undefined') return null;
  const parts = document.cookie.split(';');
  for (const part of parts) {
    const idx = part.indexOf('=');
    if (idx < 0) continue;
    if (part.slice(0, idx).trim() === key) {
      try {
        return decodeURIComponent(part.slice(idx + 1).trim());
      } catch {
        return null;
      }
    }
  }
  return null;
}

function writeCookie(key: string, value: string): void {
  if (typeof document === 'undefined') return;
  // Persist for a year so the page does not reset for returning visitors.
  document.cookie = `${key}=${encodeURIComponent(value)}; Max-Age=31536000; Path=/; SameSite=Lax`;
}

function parseStored(raw: string | null): Partial<StoredSettings> | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as Partial<StoredSettings>;
    if (parsed && typeof parsed === 'object') return parsed;
    return null;
  } catch {
    return null;
  }
}

/**
 * Load order: localStorage -> cookie -> legacy simplified-mode key ->
 * OS preferences (first visit only). Any saved record wins over OS signals.
 */
function loadInitialSettings(): StoredSettings {
  if (typeof window === 'undefined' || typeof document === 'undefined') return DEFAULTS;

  const fromStorage = parseStored(localStorage.getItem(STORE_KEY));
  const fromCookie = fromStorage ? null : parseStored(readCookie(STORE_KEY));
  const saved = fromStorage ?? fromCookie;

  let legacySimplified: boolean | null = null;
  try {
    const legacy = localStorage.getItem(LEGACY_SIMPLIFIED_KEY);
    if (legacy === 'true' || legacy === 'false') legacySimplified = legacy === 'true';
  } catch {
    legacySimplified = null;
  }

  if (saved || legacySimplified !== null) {
    const s = saved ?? {};
    const palette = isColorBlindPalette(s.colorBlindPalette) ? s.colorBlindPalette : DEFAULTS.colorBlindPalette;
    return {
      focusMode: toBool(s.focusMode, DEFAULTS.focusMode),
      reduceMotion: toBool(s.reduceMotion, DEFAULTS.reduceMotion),
      dyslexicFont: toBool(s.dyslexicFont, DEFAULTS.dyslexicFont),
      highContrast: toBool(s.highContrast, DEFAULTS.highContrast),
      tooltipsEnabled: toBool(s.tooltipsEnabled, DEFAULTS.tooltipsEnabled),
      colorBlindPalette: palette,
      lightMode: toBool(s.lightMode, DEFAULTS.lightMode),
      isSimplifiedMode: toBool(s.isSimplifiedMode, legacySimplified ?? DEFAULTS.isSimplifiedMode),
    };
  }

  // First visit only: respect OS-level accessibility + color-scheme signals.
  const mq = (q: string): boolean => {
    try {
      return window.matchMedia(q).matches;
    } catch {
      return false;
    }
  };
  return {
    ...DEFAULTS,
    reduceMotion: mq('(prefers-reduced-motion: reduce)'),
    highContrast: mq('(prefers-contrast: more)'),
    lightMode: mq('(prefers-color-scheme: light)'),
  };
}

const CB_BODY_CLASSES = COLOR_BLIND_PALETTES.filter((p) => p.id !== 'none').map((p) => `cb-${p.id}`);

export const AccessibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [initial] = useState<StoredSettings>(loadInitialSettings);
  const [focusMode, setFocusMode] = useState(initial.focusMode);
  const [reduceMotion, setReduceMotion] = useState(initial.reduceMotion);
  const [dyslexicFont, setDyslexicFont] = useState(initial.dyslexicFont);
  const [highContrast, setHighContrast] = useState(initial.highContrast);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(initial.tooltipsEnabled);
  const [colorBlindPalette, setColorBlindPaletteState] = useState<ColorBlindPalette>(initial.colorBlindPalette);
  const [lightMode, setLightMode] = useState(initial.lightMode);
  const [isSimplifiedMode, setIsSimplifiedMode] = useState(initial.isSimplifiedMode);

  // Remembers the last non-'none' palette so the legacy toggle has somewhere to return to.
  const lastPalette = useRef<ColorBlindPalette>(
    initial.colorBlindPalette !== 'none' ? initial.colorBlindPalette : 'deuteranomaly',
  );

  const setColorBlindPalette = (p: ColorBlindPalette) => {
    if (p !== 'none') lastPalette.current = p;
    setColorBlindPaletteState(p);
  };

  // Persist all 7 settings on every change: localStorage (primary) + cookie (fallback).
  useEffect(() => {
    const payload: StoredSettings = {
      focusMode,
      reduceMotion,
      dyslexicFont,
      highContrast,
      tooltipsEnabled,
      colorBlindPalette,
      lightMode,
      isSimplifiedMode,
    };
    const raw = JSON.stringify(payload);
    try {
      localStorage.setItem(STORE_KEY, raw);
      localStorage.setItem(LEGACY_SIMPLIFIED_KEY, String(isSimplifiedMode));
    } catch {
      // Storage may be unavailable (private mode); the cookie below still persists.
    }
    writeCookie(STORE_KEY, raw);
  }, [focusMode, reduceMotion, dyslexicFont, highContrast, tooltipsEnabled, colorBlindPalette, lightMode, isSimplifiedMode]);

  // Apply classes to the body tag so styles ripple through the whole site.
  // Achromatopsia intentionally never touches lightMode: it ships its own
  // dark AND light grayscale ramps, so it works in both themes as-is.
  useEffect(() => {
    const body = document.body;
    focusMode ? body.classList.add('focus-mode') : body.classList.remove('focus-mode');
    reduceMotion ? body.classList.add('reduce-motion') : body.classList.remove('reduce-motion');
    dyslexicFont ? body.classList.add('dyslexic-font') : body.classList.remove('dyslexic-font');
    highContrast ? body.classList.add('high-contrast') : body.classList.remove('high-contrast');
    lightMode ? body.classList.add('light-mode') : body.classList.remove('light-mode');
    isSimplifiedMode ? body.classList.add('lite-mode') : body.classList.remove('lite-mode');
    const active = colorBlindPalette !== 'none';
    active ? body.classList.add('color-blind-mode') : body.classList.remove('color-blind-mode');
    for (const cls of CB_BODY_CLASSES) body.classList.remove(cls);
    if (active) body.classList.add(`cb-${colorBlindPalette}`);
  }, [focusMode, reduceMotion, dyslexicFont, highContrast, colorBlindPalette, lightMode, isSimplifiedMode]);

  const toggleColorBlind = () => {
    setColorBlindPalette(colorBlindPalette === 'none' ? lastPalette.current : 'none');
  };

  return (
    <AccessContext.Provider value={{
      focusMode, toggleFocus: () => setFocusMode(!focusMode),
      reduceMotion, toggleMotion: () => setReduceMotion(!reduceMotion),
      dyslexicFont, toggleFont: () => setDyslexicFont(!dyslexicFont),
      highContrast, toggleContrast: () => setHighContrast(!highContrast),
      tooltipsEnabled, toggleTooltips: () => setTooltipsEnabled(!tooltipsEnabled),
      colorBlindPalette, setColorBlindPalette,
      colorBlindMode: colorBlindPalette !== 'none', toggleColorBlind,
      lightMode, toggleLightMode: () => setLightMode(!lightMode),
      isSimplifiedMode, toggleSimplifiedMode: () => setIsSimplifiedMode(!isSimplifiedMode)
    }}>
      <div className={isSimplifiedMode ? 'simplified-mode lite-mode' : 'standard-mode'}>
        {children}
      </div>
    </AccessContext.Provider>
  );
};

export const useAccess = () => {
  const context = useContext(AccessContext);
  if (!context) throw new Error('useAccess must be used within AccessibilityProvider');
  return context;
};
