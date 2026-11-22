import React from 'react';
import Layout from '../components/Layout';
import SafeImage from '../components/SafeImage';
import { useAccess } from '../context/AccessibilityContext';
import Terminal from 'lucide-react/dist/esm/icons/terminal';
import ShoppingBag from 'lucide-react/dist/esm/icons/shopping-bag';
import Radio from 'lucide-react/dist/esm/icons/radio';
import Sparkles from 'lucide-react/dist/esm/icons/sparkles';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import CircuitBoard from 'lucide-react/dist/esm/icons/circuit-board';
import Anchor from 'lucide-react/dist/esm/icons/anchor';
import ArrowRight from 'lucide-react/dist/esm/icons/arrow-right';
import { Link } from 'react-router-dom';



const branches = [
  { name: 'The Studio', icon: Terminal, color: 'text-cyan-400', hex: '#22d3ee', glow: 'hover:shadow-[0_0_100px_rgba(34,211,238,0.4)] hover:bg-cyan-400/5 hover:border-cyan-400/50', path: '/studio', desc: 'Dev tools & site logs' },
  { name: 'The Boutique', icon: ShoppingBag, color: 'text-green-400', hex: '#4ade80', glow: 'hover:shadow-[0_0_100px_rgba(74,222,128,0.4)] hover:bg-green-400/5 hover:border-green-400/50', path: '/boutique', desc: 'Digital goods & presets' },
  { name: 'The Circuit', icon: Radio, color: 'text-[var(--neon-orange)]', hex: '#FF5F1F', glow: 'hover:shadow-[0_0_100px_rgba(255,95,31,0.4)] hover:bg-[#FF5F1F]/5 hover:border-[#FF5F1F]/50', path: '/circuit', desc: 'Community & social wire' },
  { name: 'The Creations', icon: Sparkles, color: 'text-purple-400', hex: '#c084fc', glow: 'hover:shadow-[0_0_100px_rgba(192,132,252,0.4)] hover:bg-purple-400/5 hover:border-purple-400/50', path: '/creations', desc: 'Content & portfolio' },
  { name: 'The Echoes', icon: BookOpen, color: 'text-[#FF3131]', hex: '#FF3131', glow: 'hover:shadow-[0_0_100px_rgba(255,49,49,0.4)] hover:bg-[#FF3131]/5 hover:border-[#FF3131]/50', path: '/echoes', desc: 'Personal safe journal' },
  { name: 'The DEV Locker', icon: CircuitBoard, color: 'text-[#7CF5D3]', hex: '#7CF5D3', glow: 'hover:shadow-[0_0_100px_rgba(124,245,211,0.4)] hover:bg-[#7CF5D3]/5 hover:border-[#7CF5D3]/50', path: '/dev-locker', desc: 'Builds, stickers & the workbench' },
];

export default function Hub() {
  const { isSimplifiedMode } = useAccess();

  return (
    <Layout>
      <div className="max-w-5xl w-full mx-auto pb-20 px-4">
        
        {/* Semantic H1 at top for A11Y, visually it can still be the header below */}
        <h1 className="sr-only">Dollhouse Deviants Hub</h1>

        {/* Architect's Vision */}
        <section className="mb-24 pt-10 border-b border-zinc-900 pb-20">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="shrink-0 relative">
              <div className="w-48 h-48 rounded-full border border-zinc-800 p-1.5 bg-zinc-900/50">
                <div className="w-full h-full rounded-full overflow-hidden grayscale hover:grayscale-0 transition-all duration-1000">
                  <SafeImage src="/Sonja-Profile-Picture.webp" alt="Sonja" className="w-full h-full object-cover" loading="eager" />
                </div>
              </div>
            </div>

            <div className="flex-grow text-center md:text-left">
              <h2 className="text-4xl font-black uppercase tracking-tighter mb-4 italic">
                <span className="glow-shift glow-white glow-s9">Tearing Down</span>{' '}
                <span className="glow-shift glow-cyan glow-s9">The Prison.</span>
              </h2>
              <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-2xl">
                Transitioning (MtF) was the moment I stopped building walls and started building doors. This space exists so you never have to curate a version of yourself that the world can digest.
              </p>
              <div className="mt-8 pt-6 border-t border-zinc-800/50 inline-block text-left">
                <p className="text-zinc-400 font-mono text-xs uppercase tracking-widest mb-2">Signed,</p>
                <p className="signature-font text-4xl text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">
                  -Sonja Kelley
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Header moved just above branches - Changed to H2 to respect SR-Only H1 */}
        <header className="text-center mb-12">
          <h2 className="text-4xl font-black tracking-tighter uppercase mb-2 glow-shift glow-white glow-s9">The Hub</h2>
          <p className="text-zinc-400 font-mono text-xs tracking-[0.5em] uppercase">Choose Your Branch</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-32">
          {branches.map((branch) => (
            <Link 
              key={branch.name} 
              to={branch.path} 
              className={`group relative overflow-hidden bg-zinc-900/30 border border-zinc-800 rounded-3xl transition-all duration-[600ms] hover:scale-[1.02] ${!isSimplifiedMode && `hover:shadow-2xl ${branch.glow}`}`}
            >
              {/* SHOT-TRACE ANIMATIONS ALONG THE BORDERS */}
              {!isSimplifiedMode && (
                <div className="absolute inset-0 rounded-3xl pointer-events-none">
                  {/* Bottom Line - Shoots left to right */}
                  <div 
                    className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out" 
                    style={{ backgroundColor: branch.hex, boxShadow: `0 0 15px ${branch.hex}` }} 
                  />
                  {/* Left Line - Shoots bottom to top */}
                  <div 
                    className="absolute bottom-0 left-0 w-[2px] h-0 group-hover:h-full transition-all duration-500 delay-100 ease-out" 
                    style={{ backgroundColor: branch.hex, boxShadow: `0 0 15px ${branch.hex}` }} 
                  />
                  {/* Right Line - Shoots bottom to top */}
                  <div 
                    className="absolute bottom-0 right-0 w-[2px] h-0 group-hover:h-full transition-all duration-500 delay-100 ease-out" 
                    style={{ backgroundColor: branch.hex, boxShadow: `0 0 15px ${branch.hex}` }} 
                  />
                </div>
              )}

              <div className="flex flex-col items-center text-center p-8 relative z-10">
                <branch.icon size={42} className={`${branch.color} mb-6 transition-transform duration-500 group-hover:scale-110 drop-shadow-md`} />
                <h2 className="text-xl font-black uppercase text-white tracking-tighter mb-1">{branch.name}</h2>
                <p className="text-zinc-400 text-xs font-mono uppercase tracking-widest">{branch.desc}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Thank You Section */}
        <section className="bg-zinc-900/30 rounded-[3rem] p-12 border border-zinc-800 flex flex-col items-center text-center relative overflow-hidden">
          <div className="max-w-md w-full mb-8 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
            <SafeImage 
              src="/Group_posing_with_202604082344.webp" 
              alt="Sonja Kelley and the Dollhouse Deviants community in a noir-style industrial portrait" 
              width="448"
              height="192"
              className="w-full h-auto opacity-80" 
              loading="lazy"
            />
          </div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">Support the Sanctuary</h2>
          <p className="text-zinc-500 mb-8 max-w-sm text-sm italic">"Every brick in this house is built by the community."</p>
          
          <Link to="/support" className="bg-white text-black px-10 py-4 rounded-xl font-black uppercase tracking-tighter hover:bg-cyan-400 hover:text-black border-2 border-transparent hover:border-cyan-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.8)] transition-all duration-300 flex items-center gap-3">
            View Support Tiers
            <ArrowRight size={18} />
          </Link>

          <div className="absolute -bottom-10 -right-10 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none italic">
            THANKS
          </div>
        </section>
      </div>
    </Layout>
  );
}
