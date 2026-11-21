import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { useAccess } from '../context/AccessibilityContext';

interface TooltipProps {
  children: ReactNode;
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

/**
 * Fast custom tooltip (SOP 2026-11-01): pops up ~500ms after hover OR
 * keyboard focus, hides on leave / blur / Escape, and respects the global
 * "Tooltips" switch from the Sensory Suite (default on, persisted).
 * When tooltips are off, nothing renders at all.
 */
export function Tooltip({ children, content, position = 'top', className = '' }: TooltipProps) {
  const { tooltipsEnabled } = useAccess();
  const [open, setOpen] = useState(false);
  const timer = useRef<number | null>(null);
  const tipId = useRef(`dd-tip-${Math.random().toString(36).slice(2, 9)}`);

  const clearTimer = () => {
    if (timer.current !== null) {
      window.clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const schedule = () => {
    if (!tooltipsEnabled || !content) return;
    clearTimer();
    timer.current = window.setTimeout(() => setOpen(true), 500);
  };

  const hide = () => {
    clearTimer();
    setOpen(false);
  };

  useEffect(() => {
    if (!tooltipsEnabled) setOpen(false);
    return clearTimer;
  }, [tooltipsEnabled]);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
  };

  return (
    <span
      className={`group relative inline-flex ${className}`}
      onMouseEnter={schedule}
      onMouseLeave={hide}
      onFocus={schedule}
      onBlur={hide}
      onKeyDown={(e) => {
        if (e.key === 'Escape') hide();
      }}
    >
      {children}
      {tooltipsEnabled && content && open && (
        <span
          role="tooltip"
          id={tipId.current}
          className={`absolute ${positionClasses[position]} w-max max-w-[220px] whitespace-normal bg-[#050505] border border-[#FF69B4] text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-sm shadow-[0_0_15px_rgba(255,105,180,0.5)] z-[9999] pointer-events-none animate-in fade-in zoom-in-95 duration-200`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
