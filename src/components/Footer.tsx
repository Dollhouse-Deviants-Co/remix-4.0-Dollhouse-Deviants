import React from 'react';
import { Link } from 'react-router-dom';
import { useAccess } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { Zap, ZapOff } from 'lucide-react';

const SafetyResources = () => {
  const handleQuickExit = () => {
    // Instantly sends them to a neutral page
    window.location.replace("https://www.weather.com");
  };

  return (
    <div className="mt-8 pt-8 border-t border-zinc-900 flex flex-wrap gap-6 text-xs uppercase tracking-widest text-zinc-400">
      {/* DISCRETE LINK */}
      <a href="/safety" className="text-[#FF69B4] hover:text-white transition-all">
        Personal Safety & Site Security
      </a>
      
      {/* QUICK ESCAPE */}
      <button 
        onClick={handleQuickExit}
        className="bg-zinc-800 px-3 py-1 rounded hover:bg-red-900 text-white font-bold transition-colors"
      >
        Quick Exit
      </button>
      
      <span className="ml-auto opacity-30 flex items-center">
        Hotline: 1-888-373-7888 (Confidential 24/7)
      </span>
    </div>
  );
};

export default function Footer() {
  const { isSimplifiedMode, toggleSimplifiedMode } = useAccess();
  const { user, loginWithGoogle, logout } = useAuth();

  // 1. Replace 'YOUR_ID_HERE' with the ID you copied from PayPal
  const paypalId = "AZVCASBGAJ8AL"; 
  
  // 2. This is your new, correctly-sized Media Kit direct download link
  const mediaKitUrl = "https://drive.google.com/uc?export=download&id=1a0cLF-MOWv43YIt_XFtTuaiNoZmaEceD";

  return (
    <footer className="bg-black text-zinc-400 py-16 px-8 border-t border-zinc-900 mt-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand & Philanthropy */}
        <div className="space-y-6">
          <h2 className="text-[#FF69B4] font-bold tracking-tighter text-xl italic underline decoration-zinc-800 glow-shift glow-pink glow-s9">DOLLHOUSE DEVIANTS</h2>
          <div className="text-[11px] leading-relaxed uppercase tracking-[0.2em] flex flex-col items-start gap-1">
            <span>A Sanctuary for the Unconventional.</span>
            <span className="flex items-center gap-2">Built by <span className="signature-font text-[#FF69B4] text-2xl normal-case tracking-normal transform translate-y-1 glow-shift glow-pink glow-s7">Sonja Kelley</span>.</span>
          </div>
          <div className="pt-4 border-t border-zinc-900 mt-6 inline-block">
            <p className="text-[10px] uppercase tracking-widest text-zinc-400 mb-2">Proudly Supporting</p>
            <a href="https://give.thetrevorproject.org/campaign/786401/donate" target="_blank" rel="noopener noreferrer" className="inline-block border border-transparent hover:border-[#E65100] hover:shadow-[0_0_15px_rgba(230,81,0,0.6)] px-4 py-2 -ml-4 rounded-lg text-[#FF9030] text-xs font-black uppercase tracking-[0.2em] hover:text-white transition-all duration-300">
              THE TREVOR PROJECT →
            </a>
            <Link to="/trevor-project" className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors mt-1">
              What <em>is</em> The Trevor Project?
            </Link>
          </div>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-6">Explore</h3>
          <ul className="text-xs space-y-4 uppercase tracking-widest">
            <li><Link to="/our-story" className="text-[#FF69B4] hover:text-white transition-colors">Our Story</Link></li>
            <li><Link to="/studio" className="text-[#FF69B4] hover:text-white transition-colors">The Studio</Link></li>
            <li><Link to="/boutique" className="text-[#FF69B4] hover:text-white transition-colors">The Boutique</Link></li>
            <li><Link to="/circuit" className="text-[#FF69B4] hover:text-white transition-colors">The Circuit</Link></li>
            <li><Link to="/creations" className="text-[#FF69B4] hover:text-white transition-colors">The Gallery</Link></li>
            <li><Link to="/echoes" className="text-[#FF69B4] hover:text-white transition-colors">The Echoes</Link></li>
            <li><Link to="/vault" className="text-[#FF69B4] hover:text-white transition-colors italic">The Vault (18+)</Link></li>
          </ul>
        </div>

        {/* Monetary Support Section */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-6">Contribute</h3>
          <div className="space-y-6">
            <p className="text-xs leading-relaxed">
              Help us keep the Dollhouse open for the collective. 
              Your support funds trans creators and mental health advocacy.
            </p>
            {/* The Tactful Button linking to the new Support page */}
            <Link 
              to="/support"
              className="inline-block border border-[#FF69B4] text-[#FF69B4] px-6 py-2 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#FF69B4] hover:text-white transition-all shadow-[0_0_15px_rgba(255,105,180,0.2)] hover:shadow-[0_0_20px_rgba(255,105,180,0.5)]"
            >
              Support the Vision
            </Link>
          </div>
        </div>

        {/* Resources & Compliance */}
        <div>
          <h3 className="text-white text-xs font-bold uppercase tracking-[0.3em] mb-6">Resources</h3>
          <ul className="text-xs space-y-4 uppercase tracking-widest">
            <li>
              <a href={mediaKitUrl} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="text-zinc-300 hover:text-white transition-colors flex items-center gap-2">
                Download Media Kit
              </a>
            </li>
            <li><Link to="/safety" className="hover:text-[#FF69B4] transition-colors text-[#FF69B4]">Personal Safety & Site Security</Link></li>
            <li><Link to="/trevor-project" className="text-[#FF69B4] hover:text-white transition-colors">What is The Trevor Project?</Link></li>
            <li><Link to="/compliance" className="text-[#FF69B4] hover:text-white transition-colors">2257 Compliance</Link></li>
            <li><Link to="/privacy" className="text-[#FF69B4] hover:text-white transition-colors">Privacy & Consent</Link></li>
            <li><Link to="/terms" className="text-[#FF69B4] hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-zinc-900 flex flex-col md:flex-row justify-center items-center gap-6 relative">
        <p className="text-[10px] tracking-[0.5em] text-zinc-400 text-center">
          ALL CONTENT © 2026 DOLLHOUSE DEVIANTS PRODUCTIONS • WAVERLY, IA
        </p>
        <button 
          onClick={user ? logout : loginWithGoogle} 
          className="md:absolute md:right-0 text-xs text-zinc-400 uppercase border border-transparent px-4 py-2 rounded-lg hover:text-[#FF69B4] hover:border-[#FF69B4] hover:shadow-[0_0_15px_rgba(255,105,180,0.6)] transition-all duration-300 tracking-widest"
        >
          {user ? 'Sign Out' : 'Sonja (Founder) Login'}
        </button>
      </div>
      
      <div className="max-w-7xl mx-auto w-full">
        <SafetyResources />
      </div>
    </footer>
  );
}
