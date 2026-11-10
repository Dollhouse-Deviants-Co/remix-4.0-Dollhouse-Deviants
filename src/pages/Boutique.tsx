import React from 'react';
import Layout from '../components/Layout';
import DustCover from '../components/DustCover';
import { ShoppingBag, Mail, Zap, Monitor, Sliders } from 'lucide-react';

interface DustInfo {
  statement: string;
  image: string;
}

const boutiqueItems: Array<{
  id: string;
  name: string;
  price: string;
  icon: React.ReactNode;
  category: string;
  desc: string;
  dust?: DustInfo;
}> = [
  { 
    id: "bp-01", 
    name: "Architect Noir Preset", 
    price: "15.00", 
    icon: <Sliders size={24} />,
    category: "Editing", 
    desc: "The signature low-light, high-contrast look used across the Dollhouse Deviants visuals. Perfect for industrial or noir-style portraits." 
  },
  { 
    id: "bp-02", 
    name: "Sanctuary Stream Kit", 
    price: "35.00", 
    icon: <Monitor size={24} />,
    category: "Assets", 
    desc: "Complete OBS/Stream package including neon borders, 'Stealth Mode' overlays, and custom transitional graphics.",
    dust: {
      statement: "Pardon our dust — the stream kit is still on the workbench.",
      image: "/images/pinkie-dust-2.webp",
    },
  },
  { 
    id: "bp-03", 
    name: "Waverly Audio Archive", 
    price: "20.00", 
    icon: <Zap size={24} />,
    category: "Sound", 
    desc: "A collection of 10 ambient, industrial lo-fi tracks specifically composed for background use in private galleries.",
    dust: {
      statement: "Pardon our dust — the Waverly tapes are still being pressed.",
      image: "/images/pinkie-dust-1.webp",
    },
  }
];

export default function Boutique() {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-zinc-400 font-sans">
        <div className="max-w-7xl mx-auto px-6 py-32">
          
          <header className="mb-24 border-l-4 border-[#FF69B4] pl-8">
            <h1 className="text-6xl font-black text-white uppercase tracking-tighter italic mb-4">
              The <span className="text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">Boutique</span>
            </h1>
            <p className="text-zinc-500 max-w-xl italic text-lg leading-relaxed">
              Professional tools for unconventional creators. Procure the digital assets used to engineer the Sanctuary.
            </p>
          </header>

          <div className="grid lg:grid-cols-3 gap-12">
            {boutiqueItems.map((item) => (
              <div key={item.id} className="bg-zinc-900/20 border border-zinc-800 rounded-[3rem] p-12 flex flex-col hover:border-[#FF69B4]/50 hover:shadow-[0_0_30px_rgba(255,105,180,0.1)] transition-all duration-700 group relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-zinc-800 group-hover:text-[#FF69B4]/10 transition-colors duration-700">
                  <ShoppingBag size={80} strokeWidth={1} />
                </div>

                <div className="mb-8 w-14 h-14 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-center text-[#FF69B4] shadow-xl group-hover:shadow-[0_0_20px_rgba(255,105,180,0.3)] transition-all duration-500">
                  {item.icon}
                </div>
                
                <h2 className="text-2xl font-black text-white uppercase italic tracking-tight mb-4">{item.name}</h2>
                <p className="text-xs text-zinc-400 leading-relaxed mb-10">{item.desc}</p>
                
                <div className="mt-auto pt-8 border-t border-zinc-800 flex items-center justify-between">
                  <div className="text-3xl font-black text-white italic tracking-tighter">${item.price}</div>
                  <a 
                    href={`mailto:sonja-on-fire@dollhousedeviants.com?subject=Boutique Procurement Request: ${item.name}`}
                    className="bg-[#FF1E89] hover:bg-white hover:text-black text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all duration-500 shadow-[0_0_15px_rgba(255,30,137,0.4)] hover:shadow-[0_0_25px_rgba(255,255,255,0.6)]"
                  >
                    Procure Asset
                  </a>
                </div>

                {item.dust && (
                  <DustCover statement={item.dust.statement} imageSrc={item.dust.image} />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
