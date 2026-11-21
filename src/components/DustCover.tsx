import React from 'react';

interface DustCoverProps {
  /** Per-item "Pardon our dust" statement, shown as a quote under the poster and read to screen readers. */
  statement: string;
  /** Pinkie poster image, e.g. "/images/pinkie-dust-1.webp". */
  imageSrc: string;
  /** Alt text for the Pinkie poster image. */
  imageAlt?: string;
}

const PLANKS = [
  { top: '12%', rotate: '-2.5deg', bg: '#7A4A21' },
  { top: '42%', rotate: '1.5deg', bg: '#8B5A2B' },
  { top: '72%', rotate: '-1deg', bg: '#6B3F1D' },
] as const;

/**
 * Temporary "Pardon our dust" cover for placeholder products.
 *
 * A few flat wooden boards nailed across the card, with gaps between them so
 * the card underneath stays partly visible as a sneak peek, plus a small
 * Pinkie poster taped to the corner. The overlay sits above the card's
 * mailto/Procure button, so the button cannot be clicked while covered.
 *
 * Static by design: no animation, no gradients, no glows, no shadows.
 * Flat colors with 1px borders only, so it reads in pure grayscale.
 * The statement is visible text and is also exposed via role="status"
 * and aria-label for screen readers.
 */
export default function DustCover({ statement, imageSrc, imageAlt = 'Pinkie' }: DustCoverProps) {
  return (
    <div
      className="absolute inset-0 z-20 overflow-hidden"
      role="status"
      aria-label={statement}
    >
      {/* Wooden boards, nailed across the card — gaps between them are the sneak peek. */}
      <div aria-hidden="true" className="absolute inset-0">
        {PLANKS.map((plank) => (
          <div
            key={plank.top}
            className="absolute left-[-5%] w-[110%] border border-[#3D260E]"
            style={{ top: plank.top, height: '52px', backgroundColor: plank.bg, transform: `rotate(${plank.rotate})` }}
          >
            {/* Nail dots at each end of the plank. */}
            <span className="absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-black bg-[#2A1A0C]" />
            <span className="absolute right-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full border border-black bg-[#2A1A0C]" />
          </div>
        ))}
      </div>

      {/* Pinkie poster, taped to the top-right corner of the boards,
          with its statement as a quoted caption right underneath it. */}
      <figure
        aria-hidden="true"
        className="absolute right-3 top-3 w-[132px] rotate-[4deg] border border-white bg-black"
      >
        {/* Tape strips holding the poster up. */}
        <span className="absolute -top-2 left-2 h-3 w-7 -rotate-[30deg] bg-white/70" />
        <span className="absolute -top-2 right-2 h-3 w-7 rotate-[30deg] bg-white/70" />
        <img src={imageSrc} alt="" className="block h-auto w-full" loading="lazy" />
        <blockquote className="border-t border-[#FF1E89] px-2 py-2">
          <p className="text-center text-[11px] font-bold italic leading-snug text-white">
            &ldquo;{statement}&rdquo;
          </p>
        </blockquote>
      </figure>

      {/* Screen-reader-only duplicate of the poster description; the visible
          statement is already announced via role="status" + aria-label. */}
      <span className="sr-only">{imageAlt} poster taped to the boards.</span>
    </div>
  );
}
