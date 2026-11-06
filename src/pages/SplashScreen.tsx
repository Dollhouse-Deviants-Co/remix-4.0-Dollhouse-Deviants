import React, { useState } from 'react';
import { Cat, Bell } from 'lucide-react';
import { useAccess } from '../context/AccessibilityContext';



const SplashScreen = () => {
  const [email, setEmail] = useState('');
  // Pulled from your AccessibilityContext!
  const { isSimplifiedMode, toggleSimplifiedMode } = useAccess(); 

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // This is where you will eventually link to your professional email/database
    console.log("Subscribing:", email);
    alert("Deviant alert set! We'll notify you when the Vault opens.");
    setEmail('');
  };

  return (
    <div className="relative min-h-screen w-full bg-[#050505] overflow-hidden flex flex-col items-center justify-center font-sans">
      
      {/* BACKGROUND LAYER: The Neon Kitty Curtain */}
      {!isSimplifiedMode && (
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {/* Placeholder Kitties - scattered across the background */}
          <Cat className="absolute top-10 left-[10%] w-16 h-16 text-[#FF69B4] drop-shadow-[0_0_8px_rgba(255,105,180,0.8)] -rotate-12" />
          <Cat className="absolute top-[20%] right-[15%] w-20 h-20 text-[#D946EF] drop-shadow-[0_0_12px_rgba(217,70,239,0.8)] rotate-12" />
          <Cat className="absolute top-[50%] left-[5%] w-12 h-12 text-[#FF1E89] drop-shadow-[0_0_8px_rgba(255,30,137,0.8)] rotate-45" />
          <Cat className="absolute bottom-[25%] right-[10%] w-24 h-24 text-[#D946EF] drop-shadow-[0_0_15px_rgba(232,121,249,0.8)] -rotate-6" />
          <Cat className="absolute bottom-10 left-[20%] w-16 h-16 text-[#FF69B4] drop-shadow-[0_0_8px_rgba(255,105,180,0.8)] rotate-180" />
        </div>
      )}

      {/* MAIN CONTENT LAYER */}
      <div className="relative z-10 flex flex-col items-center gap-6 px-4 max-w-5xl w-full mt-8">
        
        {/* Headline */}
        <h1 className={`text-5xl md:text-7xl font-black uppercase tracking-widest text-center ${isSimplifiedMode ? 'text-[#FF69B4]' : 'text-[#FF69B4] glow-shift glow-pink glow-s13'}`}>
          Coming Soon
        </h1>

        {/* The New Logo */}
        <div className="w-full max-w-md md:max-w-lg relative">
          <img referrerPolicy="no-referrer"
            src="/dd-sfw-logo-no-main.webp" 
            alt="Dollhouse Deviants Neon House Logo"
            className={`w-full h-auto ${isSimplifiedMode ? '' : 'drop-shadow-[0_0_25px_rgba(255,20,147,0.4)]'}`}
          />
        </div>

        {/* URL */}
        <h2 className={`text-2xl md:text-4xl font-bold tracking-wider text-center mt-4 ${isSimplifiedMode ? 'text-white' : 'text-white glow-shift glow-white glow-s11'}`}>
          DOLLHOUSEDEVIANTS.COM
        </h2>

        {/* Email Signup Form */}
        <div className="flex flex-col items-center mt-6 w-full max-w-md">
          <p className="text-zinc-300 mb-3 font-mono text-sm tracking-wide">Notify me the second the Vault opens.</p>
          <form onSubmit={handleSubscribe} className="flex w-full relative">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              aria-label="URL Input"
              required
              className={`w-full bg-black/60 border border-[#FF69B4]/50 rounded-full py-3 pl-6 pr-32 text-white placeholder-zinc-500 focus:outline-none focus:border-[#FF69B4] focus:ring-1 focus:ring-[#FF69B4] ${isSimplifiedMode ? '' : 'backdrop-blur-md'}`}
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 bg-[#FF69B4]/40 hover:bg-[#FF1E89] text-white border border-[#FF69B4] rounded-full px-5 text-xs font-bold tracking-wider transition-colors flex items-center gap-2 hover:shadow-[0_0_15px_rgba(255,30,137,0.4)]"
            >
              <Bell size={14} />
              ALERT ME
            </button>
          </form>
        </div>
      </div>

      {/* LITE MODE TOGGLE (Bottom Right) */}
      <div className="absolute bottom-6 right-6 z-20">
        <button
          onClick={toggleSimplifiedMode}
          className="flex items-center gap-3 bg-black/60 border border-zinc-700 hover:border-[#FF69B4] rounded-full px-4 py-2 transition-all backdrop-blur-md cursor-pointer hover:shadow-[0_0_15px_rgba(255,105,180,0.2)]"
        >
          <div className={`w-10 h-6 rounded-full p-1 transition-colors ${isSimplifiedMode ? 'bg-white' : 'bg-zinc-800'}`}>
            <div className={`w-4 h-4 rounded-full transition-transform ${isSimplifiedMode ? 'translate-x-4 bg-black' : 'translate-x-0 bg-white'}`} />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-xs text-white font-bold uppercase tracking-wider leading-tight">Simplified View</span>
            <span className="text-[11px] text-zinc-400 uppercase tracking-widest leading-tight">(Data Saving)</span>
          </div>
        </button>
      </div>

    </div>
  );
};

export default SplashScreen;
