import React from 'react';
import Layout from '../components/Layout';
import { ShieldCheck, Lock, EyeOff, AlertTriangle, Cloud } from 'lucide-react';



export default function Safety() {
  const handleQuickExit = () => {
    // Replaces history so "Back" doesn't return here
    window.location.replace("https://www.weather.com");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-[#FF69B4]/30">
        
        {/* --- 1. DISCRETE QUICK EXIT BAR --- */}
        <div className="sticky top-0 z-50 bg-zinc-900/80 backdrop-blur-md border-b border-zinc-800 px-6 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.3em] font-bold text-zinc-500">
            <ShieldCheck size={14} className="text-[#FF69B4]" />
            Active Session Security Level: High
          </div>
          <button 
            onClick={handleQuickExit}
            className="flex items-center gap-2 bg-zinc-800 hover:bg-red-900/40 text-white text-xs uppercase tracking-widest px-4 py-2 rounded-lg transition-all border border-zinc-700 hover:border-red-500"
          >
            <Cloud size={14} />
            Quick Exit (Weather)
          </button>
        </div>

        <div className="max-w-4xl mx-auto px-6 py-20">
          <header className="mb-16">
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mb-4">
              Security & <span className="text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">Privacy Protocols</span>
            </h1>
            <p className="text-zinc-500 max-w-2xl leading-relaxed italic">
              The Dollhouse is built on the principle of absolute autonomy. 
              This page outlines our technical encryption standards and personal safety resources for our community.
            </p>
          </header>

          {/* --- SECTION 1: TECHNICAL COVER --- */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="p-8 border border-zinc-800 rounded-3xl bg-zinc-900/20">
              <Lock className="text-[#FF69B4] mb-4" size={24} />
              <h3 className="text-white font-bold uppercase mb-2 tracking-tight">Data Encryption</h3>
              <p className="text-sm leading-relaxed">
                All traffic within the Sanctuary is protected via end-to-end TLS 1.3 encryption. 
                Your IP address is obfuscated from public logs to ensure digital anonymity.
              </p>
            </div>
            <div className="p-8 border border-zinc-800 rounded-3xl bg-zinc-900/20">
              <EyeOff className="text-[#FF69B4] mb-4" size={24} />
              <h3 className="text-white font-bold uppercase mb-2 tracking-tight">Stealth Browsing</h3>
              <p className="text-sm leading-relaxed">
                We recommend using "Incognito" or "Private" modes on shared devices. 
                Always clear your cache if you share a device with others.
              </p>
            </div>
          </div>

          {/* --- SECTION 2: THE LIFELINE (HIdden in Plain Sight) --- */}
          <div className="border-t border-zinc-900 pt-16">
            <div className="flex items-start gap-6 mb-12">
              <div className="bg-[#FF69B4]/10 p-4 rounded-2xl border border-[#FF69B4]/20">
                <AlertTriangle className="text-[#FF69B4]" size={32} />
              </div>
              <div>
                <h2 className="text-2xl font-black text-white uppercase tracking-tight mb-4">
                  Emergency Support & Advocacy
                </h2>
                <p className="text-zinc-400 mb-6 leading-relaxed">
                  If you are being coerced, threatened, or held against your will—either digitally or physically—you are not alone. 
                  The following resources are confidential, free, and available 24/7.
                </p>
              </div>
            </div>

            {/* RESOURCE CARDS */}
            <div className="space-y-4">
              {/* National Human Trafficking Hotline */}
              <div className="p-6 bg-zinc-900/40 border-l-4 border-[#FF69B4] rounded-r-2xl">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                  <div>
                    <h4 className="text-white font-bold uppercase tracking-widest text-sm">National Human Trafficking Hotline</h4>
                    <p className="text-xs text-zinc-500 mt-1 uppercase">Confidential Support • 200+ Languages</p>
                  </div>
                  <div className="flex gap-4">
                    <a href="tel:1-888-373-7888" className="bg-[#FF1E89] hover:bg-white hover:text-black hover:shadow-[0_0_15px_rgba(255,255,255,0.7)] text-white px-4 py-2 rounded font-bold text-sm transition-all shadow-[0_0_15px_rgba(255,30,137,0.4)]">
                      Call 1-888-373-7888
                    </a>
                    <a href="sms:233733" className="border border-zinc-700 hover:border-[#FF69B4] px-4 py-2 rounded font-bold text-sm transition-all">
                      Text "HELP" to 233733
                    </a>
                  </div>
                </div>
              </div>

              {/* Specialized Services */}
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-2xl">
                  <h4 className="text-zinc-200 font-bold text-xs uppercase mb-2 tracking-widest">Legal & Housing Aid</h4>
                  <p className="text-xs leading-relaxed italic">
                    Referral services for emergency shelter, medical care, and legal counsel for survivors of exploitation.
                  </p>
                </div>
                <div className="p-6 bg-zinc-900/20 border border-zinc-800 rounded-2xl text-right">
                  <h4 className="text-zinc-200 font-bold text-xs uppercase mb-2 tracking-widest">TTY Access</h4>
                  <p className="text-xl font-black text-white">711</p>
                  <p className="text-xs uppercase text-zinc-600">For Hearing or Speech Impaired</p>
                </div>
              </div>
            </div>
          </div>

          {/* FOOTER NOTE */}
          <footer className="mt-20 text-center opacity-30 text-xs uppercase tracking-[0.2em]">
            Verified Safety Environment • © Dollhouse Deviants
          </footer>
        </div>
      </div>
    </Layout>
  );
}
