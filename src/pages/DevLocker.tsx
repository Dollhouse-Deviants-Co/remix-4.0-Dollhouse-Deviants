import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
import CircuitBoard from 'lucide-react/dist/esm/icons/circuit-board';
import Play from 'lucide-react/dist/esm/icons/play';
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw';
import Sticker from 'lucide-react/dist/esm/icons/sticker';
import Clapperboard from 'lucide-react/dist/esm/icons/clapperboard';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';

const MINT = '#7CF5D3';
const PINK = '#FF1E89';

/**
 * The DEV Locker — the SFW workbench that replaces the sealed Vault.
 * Mint-cyan + neon-pink circuit boards (never green + copper),
 * the coder-girl avatar and Pinkie front and center, a watch-it-build
 * simulation, a shelf for recorded build sessions, and the sticker line.
 * The Locker shows you how it's made; the Boutique is where you take
 * a piece home.
 */

function CircuitBackdrop() {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
      preserveAspectRatio="xMidYMid slice"
      viewBox="0 0 1200 600"
    >
      <g fill="none" strokeWidth="2">
        <path d="M0 80 H300 L360 140 H700 L760 200 H1200" stroke={MINT} />
        <path d="M0 520 H220 L280 460 H520 L580 400 H900" stroke={PINK} />
        <path d="M1200 120 H900 L840 180 H520" stroke={MINT} />
        <path d="M1200 480 H980 L920 420 H640 L580 360" stroke={PINK} />
        <path d="M180 0 V120 L240 180 V320" stroke={MINT} />
        <path d="M1020 0 V100 L960 160 V300" stroke={PINK} />
        <path d="M420 600 V480 L480 420" stroke={MINT} />
        <path d="M760 600 V500 L700 440" stroke={PINK} />
      </g>
      <g fill={MINT}>
        <circle cx="360" cy="140" r="5" />
        <circle cx="760" cy="200" r="5" />
        <circle cx="240" cy="180" r="5" />
        <circle cx="480" cy="420" r="5" />
      </g>
      <g fill={PINK}>
        <circle cx="280" cy="460" r="5" />
        <circle cx="920" cy="420" r="5" />
        <circle cx="960" cy="160" r="5" />
        <circle cx="700" cy="440" r="5" />
      </g>
      <g stroke={MINT} strokeWidth="2">
        <rect x="520" y="240" width="120" height="80" rx="6" />
        <rect x="540" y="260" width="80" height="40" rx="4" fill="#0a0a0a" />
      </g>
      <g stroke={PINK} strokeWidth="2">
        <rect x="180" y="380" width="90" height="60" rx="6" />
      </g>
    </svg>
  );
}

type Part = {
  id: string;
  label: string;
  fromX: number;
  fromY: number;
  fromRotate: number;
  delay: number;
  node: React.ReactNode;
};

const PARTS: Part[] = [
  {
    id: 'traces',
    label: 'Circuit traces',
    fromX: -260,
    fromY: -140,
    fromRotate: -18,
    delay: 0,
    node: (
      <svg aria-hidden="true" viewBox="0 0 120 60" className="h-10 w-24">
        <g fill="none" strokeWidth="2">
          <path d="M0 15 H50 L65 30 H120" stroke={MINT} />
          <path d="M0 45 H40 L55 30 H90" stroke={PINK} />
        </g>
        <circle cx="65" cy="30" r="3" fill={MINT} />
        <circle cx="55" cy="30" r="3" fill={PINK} />
      </svg>
    ),
  },
  {
    id: 'chip',
    label: 'Processor chip',
    fromX: 280,
    fromY: -160,
    fromRotate: 22,
    delay: 0.35,
    node: (
      <div
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-md border-2 text-[10px] font-black tracking-widest"
        style={{ borderColor: MINT, color: MINT, background: '#0a0a0a' }}
      >
        DD-01
      </div>
    ),
  },
  {
    id: 'avatar',
    label: 'Coder girl avatar',
    fromX: -280,
    fromY: 150,
    fromRotate: -12,
    delay: 0.7,
    node: (
      <img
        src="/Sonja-Profile-Picture.webp"
        alt="Sonja, the coder girl, phone in hand in front of the Dollhouse Deviants mural"
        className="h-16 w-16 rounded-full border-2 object-cover"
        style={{ borderColor: PINK }}
      />
    ),
  },
  {
    id: 'pinkie',
    label: 'Pinkie',
    fromX: 280,
    fromY: 150,
    fromRotate: 14,
    delay: 1.05,
    node: (
      <img
        src="/neon-cat-1.webp"
        alt="Pinkie, the neon pink cat outline — auditor and mascot"
        className="h-16 w-16 rounded-full border-2 bg-black object-cover"
        style={{ borderColor: MINT }}
      />
    ),
  },
  {
    id: 'code',
    label: 'Code lines',
    fromX: 0,
    fromY: -220,
    fromRotate: 0,
    delay: 1.4,
    node: (
      <div aria-hidden="true" className="space-y-1.5 font-mono text-[10px] leading-none">
        <p style={{ color: MINT }}>const deviant = build()</p>
        <p style={{ color: PINK }}>await ship(deviant)</p>
        <p className="text-zinc-400">/* whaa-bammm */</p>
      </div>
    ),
  },
];

function WatchItBuild() {
  const reduceMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [built, setBuilt] = useState(reduceMotion ? true : false);

  const replay = () => {
    setBuilt(false);
    setRun((r) => r + 1);
  };

  return (
    <section aria-labelledby="watch-it-build" className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-[#0a0a0a] p-6 md:p-10">
      <CircuitBackdrop />
      <div className="relative">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 id="watch-it-build" className="text-2xl font-black uppercase tracking-widest text-white md:text-3xl">
              Watch it <span style={{ color: MINT }}>build</span>
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">
              No magic, no mystery. Parts fly in, snap together, and there is an app.
              This is the simulation — the real build sessions are on the shelf below.
            </p>
          </div>
          {!reduceMotion && (
            <button
              type="button"
              onClick={replay}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:text-black"
              style={{ borderColor: MINT }}
              aria-label="Replay the build simulation"
            >
              <RotateCcw size={14} aria-hidden="true" /> Replay the build
            </button>
          )}
        </div>

        <div className="relative mx-auto flex h-[420px] max-w-2xl items-center justify-center">
          {/* App frame the parts assemble into */}
          <div className="relative z-10 w-64 rounded-3xl border-2 bg-[#121212] p-4 shadow-[0_0_40px_rgba(124,245,211,0.15)]" style={{ borderColor: MINT }}>
            <div className="mb-3 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: MINT }}>dev-locker / app</span>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: built ? PINK : '#3f3f46' }} aria-hidden="true" />
            </div>
            <div className="min-h-[180px]">
              {built ? (
                <div>
                  <p className="font-mono text-xs leading-relaxed text-zinc-300">
                    <span style={{ color: MINT }}>✓ traces routed</span><br />
                    <span style={{ color: PINK }}>✓ chip seated</span><br />
                    <span className="text-zinc-300">✓ avatar + Pinkie aboard</span><br />
                    <span className="text-zinc-300">✓ shipped</span>
                  </p>
                  <p className="mt-4 text-center text-lg font-black uppercase tracking-widest text-white">
                    Whaa-bammm.
                  </p>
                  <p className="text-center font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                    There&apos;s an app.
                  </p>
                </div>
              ) : (
                <p className="flex h-[180px] items-center justify-center text-center font-mono text-xs uppercase tracking-widest text-zinc-600">
                  Waiting for parts…
                </p>
              )}
            </div>
            <div className="mt-3 flex gap-2">
              <span className="flex-1 rounded-full py-2 text-center text-[11px] font-black uppercase tracking-widest text-black" style={{ background: PINK }}>Open</span>
              <span className="flex-1 rounded-full border border-zinc-700 py-2 text-center text-[11px] font-black uppercase tracking-widest text-zinc-300">Source</span>
            </div>
          </div>

          {/* Flying parts */}
          {PARTS.map((part) => (
            <motion.div
              key={`${part.id}-${run}`}
              className="absolute z-20"
              initial={reduceMotion ? { opacity: 1, x: 0, y: 0, rotate: 0 } : { opacity: 0, x: part.fromX, y: part.fromY, rotate: part.fromRotate }}
              animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
              transition={reduceMotion ? { duration: 0 } : { delay: part.delay, type: 'spring', stiffness: 120, damping: 14 }}
              onAnimationComplete={part.id === 'code' && !reduceMotion ? () => setBuilt(true) : undefined}
              aria-label={part.label}
            >
              {part.node}
            </motion.div>
          ))}
        </div>
        <p className="mt-4 text-center font-mono text-[11px] uppercase tracking-widest text-zinc-500">
          Simulated build — pieces, parts, and a little pink solder.
        </p>
      </div>
    </section>
  );
}

const STICKERS = [
  {
    img: '/Sonja-Profile-Picture.webp',
    alt: 'Sonja, the coder girl — phone in hand, Dollhouse Deviants mural behind her',
    name: 'Coder Girl',
    blurb: 'Sonja on the job. Phone in hand, mural at her back, building the thing.',
    border: PINK,
  },
  {
    img: '/neon-cat-1.webp',
    alt: 'Pinkie — a neon pink cat outline on black',
    name: 'Pinkie',
    blurb: 'The neon cat. Auditor, mascot, quality control — she signs off on every build.',
    border: MINT,
  },
  {
    img: null,
    alt: '',
    name: 'The Board',
    blurb: 'The circuit itself. Mint-cyan traces, neon-pink solder, zero green, zero copper.',
    border: MINT,
  },
];

export default function DevLocker() {
  return (
    <Layout>
      <Helmet>
        <title>The DEV Locker | Dollhouse Deviants</title>
        <meta
          name="description"
          content="The DEV Locker — where the code lives. Watch builds come together, catch recorded build sessions, and grab the stickers: the coder girl, Pinkie, and the circuit board itself."
        />
      </Helmet>

      <div className="relative min-h-screen overflow-hidden bg-[#0a0a0a] text-[#E5E5E5]">
        <CircuitBackdrop />
        <main className="relative mx-auto max-w-6xl px-6 py-16 md:px-10 md:py-24">
          <header className="mb-12 text-center md:mb-16">
            <p className="mb-4 flex items-center justify-center gap-2 font-mono text-xs uppercase tracking-[0.3em]" style={{ color: MINT }}>
              <CircuitBoard size={16} aria-hidden="true" /> Dollhouse Deviants — The Workbench
            </p>
            <h1 className="text-5xl font-black uppercase tracking-tighter text-white drop-shadow-[0_0_20px_rgba(255,30,137,0.4)] md:text-7xl">
              The <span className="text-[#FF1E89]">DEV</span> Locker
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-zinc-400 md:text-lg">
              Where the code lives. Watch a build snap together, catch the recorded
              sessions, and take home the pieces as stickers. The Locker shows you
              how it&apos;s made — the Boutique is where you take a piece home.
            </p>
          </header>

          <WatchItBuild />

          {/* Build sessions shelf */}
          <section aria-labelledby="build-sessions" className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <Clapperboard size={22} style={{ color: PINK }} aria-hidden="true" />
              <h2 id="build-sessions" className="text-2xl font-black uppercase tracking-widest text-white md:text-3xl">
                Build sessions
              </h2>
            </div>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Sonja records build sessions as she ships. The simulation above is the
              preview — the real tapes land here, firsthand, no edits hiding the work.
            </p>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <article className="rounded-3xl border border-dashed border-zinc-700 bg-[#121212] p-8">
                <p className="font-mono text-xs uppercase tracking-[0.3em]" style={{ color: MINT }}>Session 01 — Coming soon</p>
                <h3 className="mt-3 text-xl font-black uppercase tracking-wide text-white">First tape drops soon</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  The first recorded build session lands here. Until then, the
                  simulation above is the honest preview of how it goes.
                </p>
                <p className="mt-4 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-zinc-500">
                  <Play size={14} aria-hidden="true" /> No video yet — check back
                </p>
              </article>
              <article className="rounded-3xl border border-zinc-800 bg-[#121212] p-8">
                <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#FF69B4]">How sessions work</p>
                <h3 className="mt-3 text-xl font-black uppercase tracking-wide text-white">Recorded, not performed</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  Real sessions, real mistakes, real fixes. If a build goes sideways
                  on tape, that&apos;s the tape — that&apos;s the point.
                </p>
              </article>
            </div>
          </section>

          {/* Sticker lineup */}
          <section aria-labelledby="sticker-lineup" className="mt-16">
            <div className="mb-6 flex items-center gap-3">
              <Sticker size={22} style={{ color: MINT }} aria-hidden="true" />
              <h2 id="sticker-lineup" className="text-2xl font-black uppercase tracking-widest text-white md:text-3xl">
                The sticker line
              </h2>
            </div>
            <p className="mb-8 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Every sticker is a piece of the build — the coder girl, Pinkie, and the
              board itself. They drop in the Boutique. Same art, same colors, stuck
              to whatever you own.
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {STICKERS.map((sticker) => (
                <article
                  key={sticker.name}
                  className="group rounded-3xl border bg-[#121212] p-6 transition-all hover:-translate-y-1"
                  style={{ borderColor: `${sticker.border}55` }}
                >
                  <div className="mb-5 flex h-40 items-center justify-center overflow-hidden rounded-2xl bg-black">
                    {sticker.img ? (
                      <img
                        src={sticker.img}
                        alt={sticker.alt}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <svg aria-hidden="true" viewBox="0 0 200 120" className="h-full w-full">
                        <g fill="none" strokeWidth="2.5">
                          <path d="M10 30 H80 L100 50 H190" stroke={MINT} />
                          <path d="M10 90 H60 L80 70 H150" stroke={PINK} />
                          <path d="M100 10 V50" stroke={MINT} />
                          <path d="M150 110 V70" stroke={PINK} />
                        </g>
                        <circle cx="100" cy="50" r="4" fill={MINT} />
                        <circle cx="80" cy="70" r="4" fill={PINK} />
                        <rect x="110" y="60" width="50" height="34" rx="5" stroke={MINT} strokeWidth="2" />
                      </svg>
                    )}
                  </div>
                  <h3 className="text-lg font-black uppercase tracking-wide text-white">{sticker.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{sticker.blurb}</p>
                  <p className="mt-4 font-mono text-[11px] uppercase tracking-widest" style={{ color: sticker.border }}>
                    Sticker — dropping in the Boutique
                  </p>
                  <Link
                    to="/boutique"
                    className="mt-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:text-[#FF69B4]"
                  >
                    See it in the Boutique <ArrowRight size={14} aria-hidden="true" />
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <footer className="mt-16 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.25em] text-zinc-500">
              Built in the open. Mint cyan traces, neon pink solder.
            </p>
          </footer>
        </main>
      </div>
    </Layout>
  );
}
