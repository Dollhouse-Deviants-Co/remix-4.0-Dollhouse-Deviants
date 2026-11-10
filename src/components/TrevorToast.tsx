import React, { useEffect, useState } from 'react';

/**
 * Trevor thank-you toast.
 *
 * Sonja's original Trevor Toast lived outside the repo and was never committed,
 * so this is a minimal rebuild: when a visitor clicks through to donate,
 * TrevorBanner (or the /trevor-project page) dispatches a `dd:trevor-donate`
 * window event and this toast appears. Trevor gives no donation callback, so
 * the wording thanks the visitor for going to support Trevor — it never claims
 * a donation completed.
 *
 * Accessibility: role="status" (polite live region), keyboard-dismissible,
 * no animation at all (safe under reduced motion), text + icon, never
 * color-only meaning.
 */
export default function TrevorToast() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const show = () => setVisible(true);
    window.addEventListener('dd:trevor-donate', show);
    return () => window.removeEventListener('dd:trevor-donate', show);
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), 10000);
    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed z-[10000] bottom-6 left-6 max-w-sm bg-black border-l-4 border-[#E65100] border-y border-r border-zinc-800 rounded-r-2xl shadow-2xl px-5 py-4"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-white font-black uppercase tracking-widest text-sm">
            Thank you for supporting The Trevor Project
          </p>
          <p className="text-zinc-400 text-xs leading-relaxed mt-1">
            Your gift goes directly to Trevor — we don&apos;t take a cut, and we
            don&apos;t see your donation. Their page is open in a new tab.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisible(false)}
          aria-label="Dismiss thank-you message"
          className="shrink-0 text-zinc-400 hover:text-white border border-zinc-700 hover:border-[#E65100] rounded-lg px-2 py-1 text-xs font-bold transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
