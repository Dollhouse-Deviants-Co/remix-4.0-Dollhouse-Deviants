import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

/** Clean Trevor donate link — no ad tracking params. Same URL as the footer. */
export const TREVOR_DONATE_URL =
  'https://give.thetrevorproject.org/campaign/786401/donate';

/**
 * Fired whenever a visitor clicks through to donate to The Trevor Project.
 * Trevor gives no donation callback, so this only ever means "went to donate" —
 * never a claim that a donation completed. TrevorToast listens for it.
 */
export function announceTrevorDonate(): void {
  window.dispatchEvent(new CustomEvent('dd:trevor-donate'));
}

export default function TrevorBanner() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div className="fixed z-[9999] bottom-6 right-6 flex flex-col items-end gap-2">
      <a
        href={TREVOR_DONATE_URL}
        target="_blank"
        rel="noopener noreferrer"
        onClick={announceTrevorDonate}
        aria-label="Donate to The Trevor Project (opens in a new tab)"
        className="flex items-center gap-4 bg-black/80 hover:bg-zinc-900 border border-orange-500/30 p-2 pl-4 rounded-full backdrop-blur-sm transition-all duration-500 group hover:scale-105 shadow-2xl"
      >
        <div className="hidden md:block text-right">
          <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-400 leading-tight">
            Support a project we believe in <span className="text-orange-500 font-bold">wholeheartedly</span>
          </p>
          <p className="text-[10px] uppercase tracking-widest text-zinc-400 mt-0.5">Click to donate</p>
        </div>

        {/* Orange Badge with Text */}
        <div className="h-10 flex items-center justify-center gap-2 bg-[#E65100] rounded-full px-5 shadow-[0_0_15px_rgba(230,81,0,0.4)]">
          <Heart size={14} className="text-white fill-white animate-pulse" />
          <span className="text-white font-black text-xs tracking-widest whitespace-nowrap">THE TREVOR PROJECT</span>
        </div>
      </a>

      {/* "What IS The Trevor Project?" — hosted page, same tab */}
      <button
        type="button"
        onClick={() => setShowInfo((v) => !v)}
        aria-expanded={showInfo}
        className="text-[11px] uppercase tracking-[0.2em] text-[#FF9030] hover:text-white bg-black/80 border border-orange-500/30 rounded-full px-3 py-1.5 backdrop-blur-sm transition-colors"
      >
        What <em>IS</em> The Trevor Project?
      </button>
      {showInfo && (
        <p className="max-w-[240px] text-right text-xs leading-relaxed text-zinc-300 bg-black/80 border border-orange-500/30 rounded-2xl px-4 py-3 backdrop-blur-sm">
          Just what <em>IS</em> &lsquo;The Trevor Project&rsquo; you ask...?{' '}
          <Link to="/trevor-project" className="text-[#FF9030] underline hover:text-white">
            Click here to find out
          </Link>{' '}
          — we&rsquo;d love to tell you!
        </p>
      )}
    </div>
  );
}
