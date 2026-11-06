import React from 'react';
import { Link } from 'react-router-dom';
import { Aperture, Gem, Radio, PenTool, BookOpen, Key } from 'lucide-react';
import Layout from '../components/Layout';
import SafeImage from '../components/SafeImage';



const Home = () => {
  const branches = [
    { name: 'THE STUDIO', subtext: 'SFW PRODUCTION', icon: <Aperture />, path: '/studio', glow: 'glow-cyan', hoverBorder: 'hover:border-[#00E5FF]', color: '#00E5FF' },
    { name: 'THE BOUTIQUE', subtext: 'JEWELRY & APPAREL', icon: <Gem />, path: '/boutique', glow: 'glow-green', hoverBorder: 'hover:border-[#39FF14]', color: '#39FF14' },
    { name: 'THE CIRCUIT', subtext: 'COMMUNITY FEED', icon: <Radio />, path: '/circuit', glow: 'glow-orange', hoverBorder: 'hover:border-[#FF5F1F]', color: '#FF5F1F' },
    { name: 'CREATIONS', subtext: 'MEMBER GALLERY', icon: <PenTool />, path: '/creations', glow: 'glow-purple', hoverBorder: 'hover:border-[#D946EF]', color: '#D946EF' },
    { name: 'THE ECHOES', subtext: 'INTERACTIVE SAFE SPACE JOURNAL', icon: <BookOpen />, path: '/echoes', glow: 'glow-scarlet', hoverBorder: 'hover:border-[#FF3131]', color: '#FF3131' },
    { name: 'THE VAULT', subtext: 'NSFW SANCTUARY', icon: <Key />, path: '/vault', glow: 'glow-magenta', hoverBorder: 'hover:border-[#FF69B4]', color: '#FF69B4' },
  ];

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-6 py-20 w-full">
        
        {/* Restored Headline - Editorial Style */}
        <div className="z-10 text-center mb-24 mt-10">
          <h1 className="text-5xl md:text-7xl font-serif font-semibold tracking-widest uppercase text-white mb-6">
            <span className="glow-shift glow-white glow-s13">Dollhouse</span> <span className="text-[#FF69B4] italic glow-shift glow-pink glow-s13">Deviants</span>
          </h1>
          <p className="text-zinc-400 font-sans font-light text-sm tracking-[0.3em] uppercase">
            Select Your Experience
          </p>
        </div>

        {/* The New Grid Layout - Asymmetrical Masonry / Editorial Feel */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 lg:gap-2 mb-32 max-w-7xl mx-auto">
          {branches.map((branch, index) => (
            <Link 
              key={branch.name}
              to={branch.path}
              aria-label={`${branch.name}: ${branch.subtext}`}
              className={`group relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/3] bg-[#1A1A1A] border border-zinc-800/50 flex flex-col items-center justify-center overflow-hidden transition-all duration-700 hover:border-zinc-500 ${index === 0 || index === 3 ? 'md:col-span-2 lg:col-span-1' : ''}`}
            >
              {/* Subtle Background Fade */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-700 z-10" />
              
              {/* The Hover Glow Effect - More pronounced */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 blur-3xl`} style={{ backgroundColor: branch.color }} />
              
              {/* Content Container */}
              <div className="relative z-20 flex flex-col items-center text-center p-8 transform transition-transform duration-700 group-hover:scale-105">
                <div className="mb-6 text-zinc-500 transition-colors duration-500" aria-hidden="true" style={{ color: 'inherit' }}>
                   {React.cloneElement(branch.icon, { size: 32, strokeWidth: 1, className: "group-hover:opacity-100 opacity-60 transition-opacity" })}
                </div>
                
                <h2 className="text-2xl md:text-3xl font-serif font-light tracking-widest uppercase mb-3 text-white transition-colors duration-500" aria-hidden="true">
                  <span className={`transition-all duration-300 glow-shift glow-auto glow-s9`}>{branch.name}</span>
                </h2>
                
                <p className="text-zinc-400 text-xs font-sans font-light tracking-[0.4em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-y-4 group-hover:translate-y-0" aria-hidden="true">
                  {branch.subtext}
                </p>
              </div>

              {/* Elegant Bottom Border Accent instead of shooting neon */}
              <div 
                className="absolute bottom-0 left-0 h-[1px] w-0 group-hover:w-full transition-all duration-1000 ease-out z-20"
                style={{ backgroundColor: branch.color }}
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>

        {/* Restored Founder's Manifesto Component - Editorial Layout */}
        <section className="max-w-6xl mx-auto mb-32 z-10 relative px-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-5 space-y-8">
              <h2 className="text-[#FF69B4] font-sans font-light tracking-[0.4em] uppercase text-xs glow-shift glow-pink glow-s5">A Letter from Sonja</h2>
              <h3 className="text-4xl md:text-5xl font-serif font-light italic leading-snug text-white">
                "A Dollhouse is only a prison if you didn't <span className="text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">build it yourself</span>."
              </h3>
            </div>
            <div className="lg:col-span-1 hidden lg:block">
              <div className="w-[1px] h-32 bg-zinc-800 mx-auto"></div>
            </div>
            <div className="lg:col-span-6 space-y-8 text-zinc-400 leading-loose font-sans font-light text-lg">
              <p>
                Dollhouse Deviants was forged in the fire of survival. For too long, labels like 
                "deviant" and "dollhouse" were used to confine me. Today, I reclaim them.
              </p>
              <p>
                Whether navigating the complexities of mental health or the beautiful road of 
                transition, I found that my "deviance" was actually my liberation. This space 
                is a sanctuary for those who refuse to fit the mold.
              </p>
              <p className="font-serif italic text-white pt-6 text-xl flex items-center gap-2">
                — <span className="signature-font text-[#FF69B4] text-3xl not-italic glow-shift glow-pink glow-s7 transform -translate-y-1">Sonja Kelley</span>, Founder & Lead Deviant
              </p>
            </div>
          </div>
        </section>

        {/* Restored Community Appreciation Section - Luxury Card */}
        <section className="max-w-4xl mx-auto mb-16 z-10 relative text-center">
          <Link to="/support" className="block relative group overflow-hidden border border-zinc-800/50 bg-[#1A1A1A] hover:border-[#FF69B4]/50 transition-all duration-700">
            <div className="absolute inset-0 bg-[#FF69B4]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            
            <div className="aspect-[21/9] overflow-hidden relative">
              <SafeImage 
                src="/Group_posing_with_202604082344.webp" 
                alt="Sonja Kelley and the Dollhouse Deviants community in a noir-style industrial portrait" 
                className="w-full h-full object-cover object-center grayscale-[80%] group-hover:grayscale-[20%] group-hover:scale-105 transition-all duration-1000 origin-center"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1551818255-e6e10975bc17?auto=format&fit=crop&w=1200&q=80";
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A] via-[#1A1A1A]/80 to-transparent"></div>
            </div>
            
            <div className="px-8 pb-16 pt-8 relative z-10 -mt-16">
              <h3 className="text-3xl font-serif font-light tracking-widest uppercase text-white mb-6">
                To Our <span className="text-[#FF69B4] italic drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">Community</span>
              </h3>
              <p className="text-zinc-400 text-sm max-w-2xl mx-auto leading-loose font-sans font-light mb-12">
                Whether you're here to support the vision, contribute your art, or just peruse the space—thank you. 
                Your presence here means the world. You make all this possible. No pressure, just appreciation.
              </p>
              <span className="inline-block px-10 py-4 border border-zinc-700 text-xs font-sans font-black uppercase tracking-[0.3em] text-white group-hover:border-[#FF69B4] group-hover:text-[#FF69B4] transition-all duration-500 bg-[#121212]/50 backdrop-blur-sm">
                View Support Options
              </span>
            </div>
          </Link>
        </section>

      </div>
    </Layout>
  );
};

export default Home;
