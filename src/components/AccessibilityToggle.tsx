import React from 'react';
import { Eye, ZapOff } from 'lucide-react';
import { useAccess } from '../context/AccessibilityContext';
import { Tooltip } from './Tooltip';

export const AccessibilityToggle = () => {
  const { isSimplifiedMode, toggleSimplifiedMode } = useAccess();

  return (
    <Tooltip content={isSimplifiedMode ? "Disable simplified view" : "Enable simplified view to reduce motion and complexity"}>
      <button
        onClick={() => toggleSimplifiedMode()}
        aria-label={isSimplifiedMode ? "Disable simplified view" : "Enable simplified view"}
        aria-pressed={isSimplifiedMode}
        className={`flex items-center gap-3 px-5 py-3 rounded-xl border transition-all duration-300 group ${
          isSimplifiedMode 
            ? 'bg-[#FF1E89] border-[#FF69B4] text-white shadow-[0_0_20px_rgba(255,105,180,0.8)]' 
            : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-[#FF69B4]/50 hover:text-white hover:shadow-[0_0_15px_rgba(255,105,180,0.4)]'
        }`}
      >
        {isSimplifiedMode ? <ZapOff size={20} /> : <Eye size={20} className="group-hover:text-white transition-colors" />}
        <span className="text-sm uppercase font-black tracking-widest hidden sm:inline-block">
          {isSimplifiedMode ? 'Simplified View: ON' : 'Simplified View: OFF'}
        </span>
      </button>
    </Tooltip>
  );
};
