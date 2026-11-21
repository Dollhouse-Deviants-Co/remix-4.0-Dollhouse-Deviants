import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import Palette from 'lucide-react/dist/esm/icons/palette';
import Eye from 'lucide-react/dist/esm/icons/eye';
import Maximize2 from 'lucide-react/dist/esm/icons/maximize-2';
import Camera from 'lucide-react/dist/esm/icons/camera';
import Layers from 'lucide-react/dist/esm/icons/layers';
import PinkieAuditor from '../components/PinkieAuditor';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';



const galleryCategories = ["All", "Digital Noir", "Sanctuary", "Experimental", "Tech / Dev"];

export default function Studio() {
  const [filter, setFilter] = useState("All");
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, "studioItems"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setItems(fetchedItems);
    });
    return () => unsubscribe();
  }, []);

  const filteredItems = filter === "All" 
    ? items 
    : items.filter(item => item.category === filter);

  return (
    <Layout>
      <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-[#FF69B4]/30">
        
        {/* --- HERO SECTION --- */}
        <section className="max-w-7xl mx-auto px-6 pt-32 pb-20">
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16 border-b border-zinc-900 pb-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Palette className="text-[#FF69B4]" size={32} />
                <span className="text-xs uppercase tracking-[0.4em] font-bold text-zinc-600">
                  Creative Engineering // Studio Floor
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic">
                Deviant <span className="text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">Gallery</span>
              </h1>
            </div>
            
            {/* CATEGORY FILTER */}
            <div className="flex flex-wrap gap-4">
              {galleryCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  aria-pressed={filter === cat}
                  className={`px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                    filter === cat 
                      ? 'bg-[#FF1E89] border-[#FF69B4] text-white shadow-[0_0_15px_rgba(255,30,137,0.3)] hover:shadow-[0_0_20px_rgba(255,105,180,0.6)]' 
                      : 'bg-zinc-900 border-zinc-800 text-zinc-500 hover:border-zinc-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </header>

          {/* --- PINKIE AUDITOR SECTION --- */}
          <div className="mb-20 max-w-2xl">
            <PinkieAuditor />
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-600 mt-4 px-2">
              Note: Queries are logged and audited for sanctuary safety. Reasoning Engine // Project: dollhouse-deviants
            </p>
          </div>

          {/* --- THE MASONRY GRID --- */}
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredItems.map((item) => (
              <div 
                key={item.id} 
                className="relative group overflow-hidden rounded-[2rem] border border-zinc-800 bg-zinc-900 transition-all duration-700 hover:border-[#FF69B4]/50 hover:shadow-[0_0_20px_rgba(255,105,180,0.1)]"
              >
                {/* IMAGE RENDERING */}
                <div className="aspect-[3/4] bg-zinc-800 flex items-center justify-center relative overflow-hidden">
                  {item.imageUrl ? (
                    <img referrerPolicy="no-referrer" 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <Camera className="text-zinc-700 group-hover:scale-110 transition-transform duration-700" size={48} />
                  )}
                  
                  {/* OVERLAY ON HOVER */}
                  <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8 backdrop-blur-sm">
                    <div className="flex items-center gap-2 text-[#FF69B4] text-xs font-black uppercase tracking-widest mb-2">
                      <Layers size={14} />
                      {item.category}
                    </div>
                    <h3 className="text-xl font-bold text-white uppercase italic tracking-tight mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-zinc-400 mb-6 leading-relaxed italic line-clamp-3">
                      {item.description}
                    </p>
                    <button className="flex items-center gap-2 text-white text-xs font-black uppercase tracking-[0.2em] border-t border-zinc-800 pt-4 hover:text-[#FF69B4] hover:drop-shadow-[0_0_8px_rgba(255,105,180,0.5)] transition-all">
                      <Maximize2 size={14} />
                      View High-Res
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* --- STUDIO STATS / LOGS --- */}
        <section className="max-w-7xl mx-auto px-6 py-32 border-t border-zinc-900">
          <div className="grid md:grid-cols-4 gap-12 text-center">
            <div>
              <div className="text-4xl font-black text-white italic mb-2 tracking-tighter">24</div>
              <div className="text-xs uppercase tracking-widest text-zinc-600">Active Commissions</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white italic mb-2 tracking-tighter">158</div>
              <div className="text-xs uppercase tracking-widest text-zinc-600">Processed Assets</div>
            </div>
            <div>
              <div className="text-4xl font-black text-white italic mb-2 tracking-tighter">4K</div>
              <div className="text-xs uppercase tracking-widest text-zinc-600">Standard Resolution</div>
            </div>
            <div>
              <div className="text-4xl font-black text-[#FF69B4] italic mb-2 tracking-tighter drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">100%</div>
              <div className="text-xs uppercase tracking-widest text-zinc-600">Architect Verified</div>
            </div>
          </div>
        </section>

        {/* --- FOOTER MISSION --- */}
        <footer className="py-20 flex flex-col items-center border-t border-zinc-900 opacity-30 grayscale hover:grayscale-0 transition-all duration-1000">
           <img referrerPolicy="no-referrer" 
             src="/dd-sfw-logo-no-main.webp" 
             alt="Dollhouse Deviants" 
             className="h-12 mb-4 opacity-50" 
           />
           <p className="text-[11px] uppercase tracking-[0.5em]">The Studio // Build Protocol Alpha</p>
        </footer>
      </div>
    </Layout>
  );
}
