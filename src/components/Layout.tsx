import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import { useAccess } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';
import { Zap } from 'lucide-react';
import { Nameplate } from './Nameplate';
import { AccessibilityToggle } from './AccessibilityToggle';
import { Tooltip } from './Tooltip';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isSimplifiedMode, toggleSimplifiedMode } = useAccess();
  const { user: currentUser, loginWithGoogle } = useAuth();
  const [showSlowLoadTrigger, setShowSlowLoadTrigger] = useState(false);

  useEffect(() => {
    // If Simplified Mode is already on, don't show the trigger
    if (isSimplifiedMode) return;

    // Check if user previously dismissed it
    const isDismissed = localStorage.getItem('dd_dismissed_slow_load') === 'true';
    if (isDismissed) return;

    // Show the slow load trigger after 4 seconds to catch users on slow connections
    const timer = setTimeout(() => {
      setShowSlowLoadTrigger(true);
    }, 4000);

    return () => clearTimeout(timer);
  }, [isSimplifiedMode]);

  return (
    <div className="min-h-screen bg-black flex flex-col relative overflow-x-hidden font-sans selection:bg-magenta-500/30 selection:text-white">
      {/* Skip to Content Link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only" 
        style={{ position: 'absolute', top: 0, left: 0, zIndex: 9999, backgroundColor: '#FF69B4', color: 'white', padding: '1rem', fontWeight: 'bold', textTransform: 'uppercase' }}
      >
        Skip to main content
      </a>
      {/* Slow Load Trigger Banner */}
      {showSlowLoadTrigger && !isSimplifiedMode && (
        <div className="fixed top-0 left-0 w-full z-[10000] bg-[#050505] border-b border-[#FF69B4]/30 p-3 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-top-4 shadow-xl">
          <span className="text-zinc-300 text-xs tracking-widest uppercase text-center font-mono">
            If the site isn't loading fast, we've got your back.
          </span>
          <button 
            onClick={() => {
              toggleSimplifiedMode();
              setShowSlowLoadTrigger(false);
            }}
            className="flex items-center gap-2 bg-transparent text-[#FF69B4] border border-[#FF69B4]/50 px-4 py-1.5 rounded-none text-xs font-black uppercase tracking-widest hover:bg-[#FF69B4] hover:text-white hover:border-[#FF1E89] hover:shadow-[0_0_20px_rgba(255,105,180,0.8)] transition-all duration-300"
          >
            <Zap size={12} />
            Enable Simplified View
          </button>
          <button 
            onClick={() => {
              setShowSlowLoadTrigger(false);
              localStorage.setItem('dd_dismissed_slow_load', 'true');
            }}
            className="absolute right-4 text-zinc-400 hover:text-white text-xs transition-colors"
            aria-label="Dismiss"
          >
            ✕
          </button>
        </div>
      )}

      {/* Background radial glow - subtle and luxurious */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,105,180,0.03)_0%,_rgba(18,18,18,0)_70%)] pointer-events-none"></div>

      {/* Navigation Landmark - Pushed to top left */}
      <nav className="z-20 w-full px-4 sm:px-6 py-6 flex flex-wrap justify-between items-center gap-y-4" aria-label="Main Navigation">
         <div className="flex items-center gap-4 sm:gap-6">
           <a href="/" className="flex items-center gap-4 text-white font-serif tracking-widest text-4xl hover:text-[#FF69B4] transition-colors duration-500">
             <img referrerPolicy="no-referrer"
               src="/dd-sfw-logo-no-main.webp"
               alt="Dollhouse Deviants Logo"
               width="80"
               height="80"
               fetchPriority="high"
               loading="eager"
               decoding="async"
               className="h-20 w-auto rounded-sm object-contain shadow-[0_0_15px_rgba(255,105,180,0.15)]"
             />
             <span className="uppercase font-light hidden md:inline-block">Dollhouse Deviants</span>
           </a>
           
           {/* Site-wide Core Values Symbols */}
           <div className="flex items-center gap-3 pl-4 sm:pl-6 border-l border-zinc-800">
             <Tooltip content="Neurodiversity">
               <img referrerPolicy="no-referrer" 
                 src="/neurodiversity.webp" 
                 alt="Neurodiversity Affirming"
                 width="48"
                 height="48"
                 className="h-12 w-12 object-contain hover:scale-110 hover:shadow-[0_0_20px_rgba(255,105,180,0.3)] transition-all duration-300 rounded-full sharp-icon" 
                 onError={(e) => {
                   e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 12c-2-2.67-4-4-6-4a4 4 0 1 0 0 8c2 0 4-1.33 6-4Zm0 0c2 2.67 4 4 6 4a4 4 0 0 0 0-8c-2 0-4 1.33-6 4Z"/></svg>`;
                   e.currentTarget.classList.add("opacity-50");
                 }}
               />
             </Tooltip>
             <Tooltip content="Transgender Affirming">
               <img referrerPolicy="no-referrer" 
                 src="/trans-symbol.webp" 
                 alt="Transgender Affirming"
                 width="48"
                 height="48"
                 className="h-12 w-12 object-contain hover:scale-110 hover:shadow-[0_0_20px_rgba(255,105,180,0.5)] transition-all duration-300 sharp-icon" 
                 onError={(e) => {
                   e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="%23FF69B4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 17v5"/><path d="M9 20h6"/><path d="m15 9 5-5"/><path d="M20 8V4h-4"/><path d="m9 9-5-5"/><path d="M4 8V4h4"/><path d="m5 5 3 3"/></svg>`;
                 }}
               />
             </Tooltip>
             <Tooltip content="Highly Accessible">
               <img referrerPolicy="no-referrer" 
                 src="/accessibility-a11y.webp" 
                 alt="Accessibility Prioritized"
                 width="48"
                 height="48"
                 className="h-12 w-12 object-contain invert hue-rotate-180 brightness-200 hover:scale-110 drop-shadow-[0_0_5px_rgba(255,105,180,0.3)] hover:drop-shadow-[0_0_15px_rgba(255,105,180,0.8)] transition-all duration-300 sharp-icon" 
                 onError={(e) => {
                   e.currentTarget.src = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M18 8c0-.5-.4-1-1-1H7c-.6 0-1 .5-1 1"/><path d="M12 2v6"/><path d="M12 15V8"/><path d="m6 20 4-5"/><path d="m18 20-4-5"/></svg>`;
                 }}
               />
             </Tooltip>
           </div>
         </div>
         
         <div className="flex items-center gap-4 sm:gap-6">
           <AccessibilityToggle />
           
           {/* INSIDE YOUR PROFILE/NAVBAR SECTION */}
           <div className="flex items-center gap-4 pl-4 sm:pl-6 border-l border-zinc-800">
             {currentUser ? (
               <>
                 <div className="text-right hidden md:block">
                   <Nameplate 
                     name={currentUser.displayName || 'Sonja (Founder)'} 
                     role={(currentUser as any).role || 'architect'} 
                     className="text-sm justify-end"
                   />
                   <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 mt-1">
                     System Status: Online
                   </p>
                 </div>
                 
                 <Tooltip content="Manage Identity" position="bottom">
                   <div className="w-14 h-14 shrink-0 rounded-full border border-[#FF69B4]/20 overflow-hidden relative group shadow-[0_0_15px_rgba(255,105,180,0.15)] transition-all duration-700 hover:border-[#FF69B4]/50 cursor-pointer">
                     <img referrerPolicy="no-referrer" 
                       src="/Sonja-Profile-Picture.webp" 
                       alt="User Avatar" 
                       className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-1000"
                       onError={(e) => {
                         e.currentTarget.src = `https://ui-avatars.com/api/?name=${currentUser.displayName || 'User'}&background=FF69B4&color=fff&bold=true`;
                       }}
                     />
                     <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#FF69B4]/20 to-transparent h-1 w-full animate-scan-slow pointer-events-none" />
                   </div>
                 </Tooltip>
               </>
             ) : (
               <Tooltip content="System Login" position="bottom">
                  <button className="flex items-center gap-3 group cursor-pointer w-full text-left" aria-label="Log into system" onClick={loginWithGoogle}>
                 <div className="text-right hidden md:block">
                   <p className="text-sm tracking-widest text-zinc-400 font-bold uppercase group-hover:text-[#FF69B4] transition-colors">Log In</p>
                   <p className="text-xs uppercase tracking-[0.3em] text-zinc-400 mt-1">
                     System Status: Offline
                   </p>
                 </div>
                 <div className="w-14 h-14 shrink-0 rounded-full border border-zinc-800 border-dashed flex items-center justify-center text-zinc-400 group-hover:border-[#FF69B4] group-hover:text-[#FF69B4] transition-all bg-zinc-900/50">
                    <span className="text-sm tracking-widest font-black uppercase">?</span>
                 </div>
                </button>
              </Tooltip>
             )}
           </div>
         </div>
      </nav>
      
      {/* Main Content Landmark */}
      <main id="main-content" className="flex-grow flex flex-col items-center relative z-10 px-4 sm:px-8 pt-12 pb-32 w-full">
        {children}
      </main>

      {/* Footer is outside main */}
      <footer className="z-10 w-full">
        <Footer />
      </footer>
    </div>
  );
}
