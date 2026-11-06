import React from 'react';
import { Share2 } from 'lucide-react';

interface ShortFilmProps {
  title: string;
  director: string;
  duration: string;
  narrative: string;
  videoUrl: string;
  posterUrl: string;
  ethicalNote: string;
}

const ShortFilmHero: React.FC<ShortFilmProps> = ({ 
  title, director, duration, narrative, videoUrl, posterUrl, ethicalNote 
}) => {
  return (
    <div className="relative w-full aspect-[16/9] md:aspect-[21/9] bg-[#1A1A1A] overflow-hidden group border border-zinc-800/50 mb-16">
      {/* The Video Layer */}
      <video 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60 group-hover:opacity-100" 
        poster={posterUrl}
        loop 
        muted 
        playsInline 
        onMouseOver={e => e.currentTarget.play()}
        onMouseOut={e => e.currentTarget.pause()}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* The Editorial Overlay */}
      <div className="absolute inset-0 flex flex-col justify-between p-6 md:p-12 z-10 bg-gradient-to-t from-[#121212] via-transparent to-transparent opacity-90 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        
        <div className="flex justify-between items-center w-full">
          <span className="text-xs md:text-xs font-sans font-light tracking-[0.3em] uppercase text-zinc-300 bg-black/50 px-4 py-2 backdrop-blur-sm border border-zinc-700/50">
            Short Film
          </span>
          <span className="text-xs md:text-xs font-sans font-light tracking-[0.3em] uppercase text-zinc-300 bg-black/50 px-4 py-2 backdrop-blur-sm border border-zinc-700/50">
            {duration}
          </span>
        </div>
        
        <div className="mt-auto mb-8 max-w-3xl pointer-events-auto">
          <h2 className="text-4xl md:text-6xl font-serif font-light text-white mb-2 tracking-wide glow-shift glow-white glow-s11">
            {title}
          </h2>
          <p className="text-magenta-500 font-sans font-light tracking-[0.2em] uppercase text-xs md:text-sm mb-6">
            Directed by {director}
          </p>
          <p className="text-zinc-300 font-sans font-light leading-relaxed text-sm md:text-base max-w-2xl line-clamp-3">
            {narrative}
          </p>
        </div>

        <div className="flex justify-between items-end w-full border-t border-zinc-800/80 pt-6 pointer-events-auto">
          <p className="text-[11px] md:text-xs font-sans font-light tracking-widest uppercase text-zinc-500 max-w-xl">
            {ethicalNote}
          </p>
          <button 
            className="p-3 rounded-full border border-zinc-700 text-zinc-400 hover:text-magenta-500 hover:border-magenta-500 transition-colors duration-300 bg-black/50 backdrop-blur-sm"
            aria-label="Share Film"
          >
            <Share2 size={18} strokeWidth={1.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShortFilmHero;
