import React, { useEffect, useRef, useState } from 'react';
import { useAccess, COLOR_BLIND_PALETTES } from '../context/AccessibilityContext';
import { Settings, Brain } from 'lucide-react';

/**
 * Deviant Controls / Sensory Suite.
 *
 * Menu fixes (2026-11-10): real dialog semantics, focus moves into the panel
 * on open and back to the trigger on close, the drag handle is a plain
 * container (not a <nav>) with arrow-key moving for keyboard users, a
 * dragged position is re-clamped on resize / rotation so it can never end
 * up off-screen, and on phone widths the panel is a bottom sheet — a real
 * small-screen layout, not a scaled-down desktop panel. The 7 typed
 * palettes and their persistence are untouched.
 */
export default function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { focusMode, toggleFocus, reduceMotion, toggleMotion, dyslexicFont, toggleFont, highContrast, toggleContrast, colorBlindPalette, setColorBlindPalette, lightMode, toggleLightMode, isSimplifiedMode, toggleSimplifiedMode, tooltipsEnabled, toggleTooltips, videoPalette, setVideoPalette, dmeFocusMode, toggleDmeFocusMode } = useAccess();
  const boxRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const dragFrom = useRef<{ px: number; py: number; ox: number; oy: number } | null>(null);
  // Explicit position once the user grabs the panel; null = docked bottom-left.
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const closePanel = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  // Opening moves focus into the panel (close button); Escape closes the
  // panel and returns focus to the trigger.
  useEffect(() => {
    if (!isOpen) return;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closePanel();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen]);

  // Rotation / resize must never strand a dragged panel off-screen: re-clamp
  // the position, and on phone widths drop back to the docked bottom sheet.
  useEffect(() => {
    const reClamp = () => {
      if (window.innerWidth < 640) {
        setPos(null);
        return;
      }
      setPos((p) => {
        if (!p) return p;
        const el = boxRef.current;
        const w = el ? el.getBoundingClientRect().width : 320;
        const h = el ? el.getBoundingClientRect().height : 400;
        return {
          x: Math.min(Math.max(p.x, 8), Math.max(8, window.innerWidth - w - 8)),
          y: Math.min(Math.max(p.y, 8), Math.max(8, window.innerHeight - h - 8)),
        };
      });
    };
    window.addEventListener('resize', reClamp);
    window.addEventListener('orientationchange', reClamp);
    return () => {
      window.removeEventListener('resize', reClamp);
      window.removeEventListener('orientationchange', reClamp);
    };
  }, []);

  const clampPos = (x: number, y: number) => {
    const el = boxRef.current;
    const w = el ? el.getBoundingClientRect().width : 320;
    const h = el ? el.getBoundingClientRect().height : 400;
    return {
      x: Math.min(Math.max(x, 8), Math.max(8, window.innerWidth - w - 8)),
      y: Math.min(Math.max(y, 8), Math.max(8, window.innerHeight - h - 8)),
    };
  };

  const onDragStart = (e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    dragFrom.current = { px: e.clientX, py: e.clientY, ox: r.left, oy: r.top };
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const onDragMove = (e: React.PointerEvent) => {
    const d = dragFrom.current;
    if (!d) return;
    setPos(clampPos(d.ox + e.clientX - d.px, d.oy + e.clientY - d.py));
  };

  const onDragEnd = () => {
    dragFrom.current = null;
  };

  // Keyboard alternative to dragging: focus the panel header and nudge it
  // with the arrow keys (Shift = bigger steps).
  const onHandleKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 64 : 16;
    const el = boxRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    let next: { x: number; y: number } | null = null;
    if (e.key === 'ArrowLeft') next = clampPos(r.left - step, r.top);
    else if (e.key === 'ArrowRight') next = clampPos(r.left + step, r.top);
    else if (e.key === 'ArrowUp') next = clampPos(r.left, r.top - step);
    else if (e.key === 'ArrowDown') next = clampPos(r.left, r.top + step);
    if (next) {
      e.preventDefault();
      setPos(next);
    }
  };

  return (
    <div
      ref={boxRef}
      className="fixed bottom-8 left-8 z-[10000] group max-sm:bottom-4 max-sm:left-4"
      style={pos ? { left: pos.x, top: pos.y, bottom: 'auto' } : undefined}
    >
      {/* The "Easy Button" */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-zinc-950 border border-[#FF69B4]/30 hover:border-[#FF69B4] text-white p-4 rounded-full shadow-[0_0_15px_rgba(255,105,180,0.15)] transition-all duration-300 hover:scale-110 flex items-center justify-center hover:shadow-[0_0_25px_rgba(255,105,180,0.4)] overflow-hidden"
        aria-label="Sensory Settings"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="dd-sensory-suite"
      >
        <div className="absolute inset-0 bg-[#FF69B4]/5 group-hover:bg-[#FF69B4]/10 transition-colors pointer-events-none" />
        {/* The custom icon (composite gear + brain) using Lucide Icons to ensure it renders */}
        <div className="relative h-7 w-7 flex items-center justify-center z-10">
          <Settings className="absolute inset-0 h-full w-full text-zinc-500 group-hover:text-[#FF69B4] transition-colors duration-300 animate-[spin_6s_linear_infinite]" />
          <Brain className="absolute inset-0 h-4 w-4 m-auto text-zinc-300 group-hover:text-white transition-colors duration-300" />
        </div>
      </button>

      {/* Branded Label: visible on hover AND on keyboard focus, not hover-only */}
      <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity text-[11px] uppercase font-bold italic text-magenta-500 tracking-wider whitespace-nowrap">
        Deviant Controls
      </span>

      {/* The Neurodiversity Menu: fits the viewport, scrolls, drag by header, resizable on fine pointers */}
      {isOpen && (
        <div
          id="dd-sensory-suite"
          role="dialog"
          aria-modal="false"
          aria-labelledby="dd-sensory-suite-title"
          className="dd-resizable absolute bottom-24 left-0 w-80 min-w-[18rem] max-w-[calc(100vw-4rem)] max-h-[calc(100dvh-14rem)] overflow-y-auto [resize:both] bg-zinc-950 border border-zinc-800 p-6 rounded-2xl shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 max-sm:w-[calc(100vw-2rem)] max-sm:max-w-none max-sm:bottom-[4.75rem] max-sm:max-h-[65dvh] max-sm:[resize:none]"
        >
          <div
            className="flex justify-between items-center mb-6 pb-4 border-b border-magenta-900/30 cursor-grab active:cursor-grabbing [touch-action:none] select-none"
            aria-label="Sensory settings panel header. Drag to move, or focus here and use the arrow keys."
            tabIndex={0}
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
            onKeyDown={onHandleKeyDown}
          >
            <h3 id="dd-sensory-suite-title" className="text-magenta-500 font-bold uppercase tracking-[0.2em] text-xs glow-shift glow-auto glow-s5">Sensory Suite</h3>
            <button ref={closeRef} onClick={closePanel} className="text-magenta-500 text-xl font-black" aria-label="Close sensory settings">×</button>
          </div>

          <div className="space-y-4">
            <Toggle label="Focus Mode (Hide Distractions)" active={focusMode} onClick={toggleFocus} />
            <Toggle label="Safe Motion (Stop Animations)" active={reduceMotion} onClick={toggleMotion} />
            <Toggle label="Readable Font (ADHD/Dyslexia)" active={dyslexicFont} onClick={toggleFont} />
            <Toggle label="High Contrast" active={highContrast} onClick={toggleContrast} />
            <fieldset className="w-full text-left p-4 rounded-lg border bg-zinc-800 border-zinc-700">
              <legend className="px-1 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Color Vision Palette
              </legend>
              <div className="mt-1 flex flex-col gap-2">
                {COLOR_BLIND_PALETTES.map((p) => (
                  <PaletteOption
                    key={p.id}
                    id={p.id}
                    label={p.label}
                    hint={p.hint}
                    selected={colorBlindPalette === p.id}
                    tooltipsOn={tooltipsEnabled}
                    onSelect={() => setColorBlindPalette(p.id)}
                  />
                ))}
              </div>
            </fieldset>
            <Toggle label="Light Theme" active={lightMode} onClick={toggleLightMode} />
            <fieldset className="w-full text-left p-4 rounded-lg border bg-zinc-800 border-zinc-700">
              <legend className="px-1 text-xs font-bold text-zinc-400 uppercase tracking-widest">
                Video Palette (Multimedia Engine)
              </legend>
              <div className="mt-1 flex flex-col gap-2">
                <PaletteOption
                  id="site"
                  label="Follow site palette"
                  hint="Video uses the Color Vision Palette above"
                  selected={videoPalette === 'site'}
                  tooltipsOn={tooltipsEnabled}
                  onSelect={() => setVideoPalette('site')}
                />
                {COLOR_BLIND_PALETTES.filter((p) => p.id !== 'none').map((p) => (
                  <PaletteOption
                    key={p.id}
                    id={p.id}
                    label={p.label}
                    hint={p.hint}
                    selected={videoPalette === p.id}
                    tooltipsOn={tooltipsEnabled}
                    onSelect={() => setVideoPalette(p.id)}
                  />
                ))}
                <PaletteOption
                  id="none"
                  label="Off (no video palette)"
                  hint="Video plays unfiltered"
                  selected={videoPalette === 'none'}
                  tooltipsOn={tooltipsEnabled}
                  onSelect={() => setVideoPalette('none')}
                />
              </div>
            </fieldset>
            <Toggle label="Player Focus Mode (Video)" active={dmeFocusMode} onClick={toggleDmeFocusMode} />
            <Toggle label="Simplified View (Hide Images)" active={isSimplifiedMode} onClick={toggleSimplifiedMode} />
            <Toggle label="Tooltips" active={tooltipsEnabled} onClick={toggleTooltips} />
          </div>

          <p className="mt-6 text-[11px] text-zinc-600 uppercase leading-relaxed italic border-t border-zinc-900 pt-6">
             built with devotion for the neurodivergent community
          </p>
        </div>
      )}
    </div>
  );
}

const PaletteOption: React.FC<{ id: string; label: string; hint: string; selected: boolean; tooltipsOn: boolean; onSelect: () => void }> = ({ id, label, hint, selected, tooltipsOn, onSelect }) => {
  const [tipOpen, setTipOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const tipId = `dd-palette-tip-${id}`;

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const scheduleTip = () => {
    if (!tooltipsOn) return;
    clearTimer();
    timer.current = window.setTimeout(() => setTipOpen(true), 500);
  };

  const hideTip = () => {
    clearTimer();
    setTipOpen(false);
  };

  return (
    <span className="relative block">
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-describedby={tooltipsOn ? tipId : undefined}
        onMouseEnter={scheduleTip}
        onMouseLeave={hideTip}
        onFocus={scheduleTip}
        onBlur={hideTip}
        onKeyDown={(e) => { if (e.key === 'Escape') hideTip(); }}
        className={`w-full text-left p-3 rounded-lg text-xs font-bold transition-all flex justify-between items-center gap-3 border ${selected ? 'bg-magenta-600 text-white border-magenta-600' : 'bg-zinc-950 text-zinc-300 hover:bg-zinc-700 border-zinc-700'}`}
      >
        <span>
          {label}
          <span className="block text-[10px] font-normal uppercase tracking-widest opacity-70">{hint}</span>
        </span>
        <span className={`px-3 py-1 text-xs uppercase font-black tracking-widest shrink-0 ${selected ? 'bg-white/20 text-white' : 'text-zinc-500'}`}>
          {selected ? 'ON' : 'OFF'}
        </span>
      </button>
      {tooltipsOn && tipOpen && (
        <span
          role="tooltip"
          id={tipId}
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max max-w-[220px] whitespace-normal bg-[#050505] border border-[#FF69B4] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-[0_0_15px_rgba(255,105,180,0.5)] z-[9999] pointer-events-none"
        >
          {hint}
        </span>
      )}
    </span>
  );
};

const Toggle = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
  <button
    onClick={onClick}
    aria-pressed={active}
    className={`w-full text-left p-4 rounded-lg text-xs font-bold transition-all flex justify-between items-center border ${active ? 'bg-magenta-600 text-white border-magenta-600' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 border-zinc-700'}`}
  >
    {label}
    <span className={`px-3 py-1 text-xs uppercase font-black tracking-widest ${active ? 'bg-white/20 text-white' : 'text-zinc-500'}`}>
      {active ? 'ON' : 'OFF'}
    </span >
  </button>
);
