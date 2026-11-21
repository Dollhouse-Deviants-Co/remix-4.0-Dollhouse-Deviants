import React, { useState, useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import ShieldAlert from 'lucide-react/dist/esm/icons/shield-alert';
import Lock from 'lucide-react/dist/esm/icons/lock';
import Mail from 'lucide-react/dist/esm/icons/mail';
import { useAuth } from '../context/AuthContext';
import { RoleGuard, ArchitectBadge, UserRole } from '../components/RoleGuard';
import { UpgradeModal } from '../components/UpgradeModal';
import DustCover from '../components/DustCover';

/**
 * Temporary "Pardon our dust" covers for placeholder Vault items.
 * Keyed by vault.json item id. Items without an entry stay listed as-is.
 */
const VAULT_DUST: Record<number, { statement: string; image: string }> = {
  1: {
    statement: 'Pardon our dust — the gallery is still being hung.',
    image: '/images/pinkie-dust-3.webp',
  },
  2: {
    statement: 'Pardon our dust — the log is still being written.',
    image: '/images/pinkie-dust-4.webp',
  },
  3: {
    statement: 'Pardon our dust — the footage is still in the cutting room.',
    image: '/images/pinkie-dust-5.webp',
  },
  4: {
    statement: 'Pardon our dust — the filters are still in the darkroom.',
    image: '/images/pinkie-dust-6.webp',
  },
};

const LIVE_CAM_DUST = {
  statement: 'Pardon our dust — the stage is still being wired.',
  image: '/images/pinkie-dust-7.webp',
};

interface VaultItem {
  id: number;
  title: string;
  price: string;
  desc: string;
  requiredRole: UserRole;
}

export default function Vault() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [vaultItems, setVaultItems] = useState<VaultItem[]>([]);
  const { user, isAdmin } = useAuth();
  const headingRef = useRef<HTMLImageElement>(null);

  // Check if they previously verified (passed the gate)
  useEffect(() => {
    // Load vault index
    fetch('/data/vault.json')
      .then(res => res.json())
      .then(data => setVaultItems(data))
      .catch(err => console.error('Archives unreachable:', err));

    const verified = sessionStorage.getItem('vault_verified');
    if (verified === 'true') {
      setIsAuthorized(true);
    }
  }, []);

  // Role derivation now uses the proper DB-backed role if available
  const currentUserRole: UserRole = user?.role || (isAdmin ? 'architect' : 'deviant');

  // SCROLL TO TOP LOGIC & FOCUS MANAGEMENT
  useEffect(() => {
    if (isAuthorized) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      // Move focus to the main content/heading for accessibility
      setTimeout(() => {
        headingRef.current?.focus();
      }, 100);
    }
  }, [isAuthorized]);

  return (
    <Layout>
      <Helmet>
        <title>The Vault | Restricted Access | Dollhouse Deviants</title>
        <meta name="title" content="The Vault | Restricted Access | Dollhouse Deviants" />
        <meta name="description" content="[ARCHITECT CLEARANCE REQUIRED] Access the official restricted archives of Dollhouse Deviants. Explore uncurated galleries, exclusive 18+ content, and private creative deep-dives by Sonja Kelley. Enter the inner sanctum of the Sanctuary." />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="icon" href="/the-vault-logo-better.webp" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://dollhousedeviants.com/the-vault" />
        <meta property="og:title" content="The Vault | Inner Sanctum" />
        <meta property="og:description" content="Entry into the restricted archives. Architectural clearance required for the inner sanctum." />
        <meta property="og:image" content="/the-vault-logo-better.webp" />

        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:title" content="The Vault | Restricted" />
        <meta property="twitter:description" content="Architectural clearance required. 18+ restricted access." />
        <meta property="twitter:image" content="/the-vault-logo-better.webp" />
      </Helmet>
      <div className="min-h-screen bg-black flex flex-col items-center overflow-x-hidden font-sans relative">
        
        <style>{`
          @keyframes neon-pulse {
            0%, 100% { filter: drop-shadow(0 0 15px #ff00de) brightness(1); }
            50% { filter: drop-shadow(0 0 5px #ff00de) brightness(0.8); }
          }
          .neon-pulse { animation: neon-pulse 3s infinite ease-in-out; }
          .reflection-mask {
            mask-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 80%);
            -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0) 80%);
          }
        `}</style>

        {/* --- 1. THE MASSIVE LOGO SECTION --- */}
        <section className="w-full flex flex-col items-center pt-10 relative">
          <div className="w-full max-w-[95vw] neon-pulse z-20">
            <img referrerPolicy="no-referrer" 
              src="/the-vault-logo-better.webp" 
              alt="The Vault" 
              ref={headingRef}
              tabIndex={-1}
              decoding="async"
              className="w-full h-auto object-contain outline-none"
            />
          </div>

          {/* If NOT authorized, show the pure void so the overlay sits nicely over empty space */}
          {!isAuthorized && <div className="h-48 md:h-72"></div>}

          {/* GRAND NOW FEATURING ELEMENT - Flat & Clean */}
          {isAuthorized && (
            <div className="w-full max-w-7xl mx-auto px-6 -mt-8 md:-mt-24 relative z-30 mb-20 flex flex-col items-center text-center">
              
              {/* Image Container with Floating Badge */}
              <div className="w-full max-w-4xl relative rounded-2xl overflow-hidden border border-zinc-800 shadow-[0_0_60px_rgba(0,0,0,1)] mb-8 group">
                
                {/* Clean Floating Badge positioned Top-Left on the image */}
                <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 flex items-center gap-3 bg-black/80 backdrop-blur-md px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-[#FF69B4]/50 shadow-[0_0_20px_rgba(255,105,180,0.3)]">
                  <span className="w-2 h-2 rounded-full bg-[#FF69B4] animate-pulse shadow-[0_0_8px_#FF69B4]"></span>
                  <span className="text-white font-mono tracking-[0.2em] uppercase text-xs sm:text-xs font-bold">Now Featuring</span>
                </div>

                <img referrerPolicy="no-referrer" 
                  src="/the-vault-logo-better.webp" 
                  alt="Live Now On Cam" 
                  className="w-full h-auto object-cover transition-transform duration-1000 group-hover:scale-[1.02]" 
                />
              </div>

              <h2 className="text-4xl sm:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">
                Live Now <span className="text-[#FF69B4]">On Cam</span>
              </h2>

              <p className="text-zinc-400 text-sm md:text-base font-mono mb-8 max-w-2xl px-4">
                The heavy door is open. Step inside the official NSFW Vault broadcast. Authorized Entry Only. Prepare for the ultimate raw Deviant experience.
              </p>
              
              <a 
                href="mailto:sonja-on-fire@dollhousedeviants.com?subject=Feature Access Request: Live Cam Broadcast"
                className="flex justify-center items-center gap-3 px-12 py-5 bg-[#FF1E89] text-white font-black uppercase tracking-widest text-sm hover:bg-white hover:text-black transition-all duration-300 rounded-xl shadow-[0_0_30px_rgba(255,30,137,0.4)] hover:shadow-[0_0_40px_rgba(255,255,255,0.6)]"
              >
                <Mail size={18} />
                Secure Access - $45
              </a>

              <DustCover statement={LIVE_CAM_DUST.statement} imageSrc={LIVE_CAM_DUST.image} />
            </div>
          )}

          {/* The Floor Reflection pushed safely behind everything */}
          <div className={`w-full max-w-[95vw] opacity-20 scale-y-[-1] reflection-mask blur-[2px] pointer-events-none select-none z-10 ${isAuthorized ? '-mt-48 md:-mt-72' : ''}`}>
            <img referrerPolicy="no-referrer" 
              src="/the-vault-logo-better.webp" 
              alt="" 
              className="w-full h-auto object-contain"
            />
          </div>
        </section>

        {/* --- 2. VAULT CONTENT GRID --- */}
        {isAuthorized && (
          <section className="max-w-7xl w-full mx-auto px-6 py-32">
            <header className="mb-16 border-l-4 border-[#FF69B4] pl-8">
              <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">Vault Access</h2>
              <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-2">Manual Procurement Protocol</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {vaultItems.map((item) => (
                <RoleGuard 
                  key={item.id} 
                  userRole={currentUserRole} 
                  requiredRole={item.requiredRole}
                  fallback={
                    <div 
                      onClick={() => {
                        if (item.requiredRole === 'architect' && currentUserRole !== 'architect') {
                          setIsUpgradeModalOpen(true);
                        }
                      }}
                      className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-8 flex flex-col hover:border-[#FF69B4]/50 transition-all duration-500 cursor-pointer h-full text-center items-center justify-center min-h-[300px]"
                    >
                      <div className="aspect-square bg-black rounded-2xl mb-6 flex items-center justify-center p-6 border border-zinc-800 pointer-events-none w-full">
                        <Lock className="text-zinc-700" size={32} />
                      </div>
                      <p className="text-xs uppercase tracking-widest text-zinc-500 font-bold">
                        Clearance Required: <span className="text-[#FF69B4]">{item.requiredRole}</span>
                      </p>
                    </div>
                  }
                >
                  <div className="bg-zinc-900/40 border border-zinc-800 rounded-[2rem] p-8 flex flex-col hover:border-[#FF69B4]/50 transition-all duration-500 group h-full hover:shadow-[0_0_30px_rgba(255,105,180,0.15)] relative overflow-hidden">
                    <div className="aspect-square bg-black rounded-2xl mb-6 flex items-center justify-center border border-zinc-800 group-hover:bg-zinc-900 transition-colors">
                      <Lock className="text-zinc-800 group-hover:text-[#FF69B4] transition-colors" size={48} />
                    </div>
                    <div className="flex items-start justify-between mb-2 gap-2">
                      <h3 className="text-white font-bold uppercase text-lg tracking-tighter leading-tight">{item.title}</h3>
                      {item.requiredRole === 'architect' && <ArchitectBadge />}
                    </div>
                    <p className="text-zinc-500 text-xs mb-8 grow">{item.desc}</p>
                    
                    <div className="mt-auto">
                      <div className="text-2xl font-black text-white mb-4 italic">${item.price}</div>
                      
                      {/* CONTACT BUTTON REPLACE PAYPAL */}
                      <a 
                        href={`mailto:sonja-on-fire@dollhousedeviants.com?subject=Vault Access Request: ${item.title}`}
                        className="flex items-center justify-center gap-2 w-full bg-zinc-800 hover:bg-[#FF1E89] hover:shadow-[0_0_20px_rgba(255,30,137,0.4)] text-white font-bold py-4 rounded-xl uppercase text-xs tracking-widest transition-all duration-300"
                      >
                        <Mail size={16} />
                        Contact for Access
                      </a>
                    </div>

                    {VAULT_DUST[item.id] && (
                      <DustCover
                        statement={VAULT_DUST[item.id].statement}
                        imageSrc={VAULT_DUST[item.id].image}
                      />
                    )}
                  </div>
                </RoleGuard>
              ))}
            </div>
          </section>
        )}

        {/* --- 3. SECONDARY BOTTOM LOGO --- */}
        <section className="w-full py-32 flex justify-center border-t border-zinc-900">
          <div className="w-full max-w-[95vw] opacity-50 grayscale hover:grayscale-0 transition-all duration-1000">
            <img referrerPolicy="no-referrer" src="/the-vault-logo-better.webp" alt="Dollhouse Deviants" className="w-full h-auto" />
          </div>
        </section>

        {/* --- 4. AGE GATE OVERLAY --- */}
        {!isAuthorized && (
          <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-3xl flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-zinc-900 border border-zinc-800 p-12 rounded-[3rem] text-center shadow-[0_0_50px_rgba(255,105,180,0.2)]">
              <ShieldAlert className="mx-auto text-[#FF69B4] mb-6" size={64} />
              <h2 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 italic">Entry Protocol</h2>
              <p className="text-zinc-500 text-sm mb-10 leading-relaxed">
                You are entering <span className="text-white">The Vault</span>. <br/>
                This is a restricted 18+ sanctuary.
              </p>
              <button 
                onClick={() => setIsAuthorized(true)}
                className="w-full bg-[#FF1E89] hover:bg-white hover:text-black border border-transparent hover:border-white text-white font-black py-4 rounded-2xl uppercase tracking-[0.2em] hover:shadow-[0_0_25px_rgba(255,255,255,0.7)] shadow-[0_0_20px_rgba(255,30,137,0.4)] transition-all duration-300"
              >
                Confirm & Enter
              </button>
            </div>
          </div>
        )}

        {/* --- MODAL TRIGGER --- */}
        <UpgradeModal 
          isOpen={isUpgradeModalOpen} 
          onClose={() => setIsUpgradeModalOpen(false)} 
        />
      </div>
    </Layout>
  );
}
