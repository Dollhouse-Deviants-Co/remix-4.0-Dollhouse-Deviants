import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Crown from 'lucide-react/dist/esm/icons/crown';
import Check from 'lucide-react/dist/esm/icons/check';
import Lock from 'lucide-react/dist/esm/icons/lock';
import Terminal from 'lucide-react/dist/esm/icons/terminal';



const tiers = [
  {
    name: "Deviant Member",
    price: "Free",
    tagline: "The Entry Protocol",
    description: "Basic access to the Sanctuary and the public social wire.",
    features: [
      "Access to The Circuit (Social Feed)",
      "View Public Galleries",
      "Standard Boutique Access",
      "Community Chat Permissions"
    ],
    buttonText: "Join the Collective",
    highlight: false
  },
  {
    name: "Architect Tier",
    price: "$20/mo",
    tagline: "The Inner Circle",
    description: "The highest clearance level. You don't just watch the Dollhouse; you help build it.",
    features: [
      "Full Vault Access (18+ Content)",
      "Exclusive Architect-Only Logs",
      "Early Access to Boutique Drops",
      "The Neon 'Architect' Profile Badge",
      "1-on-1 Sanctuary Support Chat",
      "Ad-Free Stealth Browsing"
    ],
    buttonText: "Claim Clearance",
    highlight: true
  }
];

export default function Support() {
  return (
    <Layout>
      <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-[#FF69B4]/30">
        
        {/* --- HERO SECTION --- */}
        <section className="max-w-6xl mx-auto px-6 pt-32 pb-20 text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-[#FF69B4]/10 rounded-2xl border border-[#FF69B4]/20">
              <ShieldCheck className="text-[#FF69B4]" size={40} />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white uppercase tracking-tighter italic mb-6">
            Support the <span className="text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">Sanctuary</span>
          </h1>
          <p className="max-w-2xl mx-auto text-zinc-500 leading-relaxed text-lg italic">
            "Every brick in this house is built by the community. Your support ensures the Dollhouse remains a safe, 
            unconventional haven for creators and deviants alike."
          </p>
        </section>

        {/* --- TIER GRID --- */}
        <section className="max-w-5xl mx-auto px-6 pb-32">
          <div className="grid md:grid-cols-2 gap-8">
            {tiers.map((tier) => (
              <div 
                key={tier.name}
                className={`relative p-10 rounded-[3rem] border transition-all duration-500 group ${
                  tier.highlight 
                    ? 'bg-zinc-900/40 border-[#FF69B4]/50 shadow-[0_0_40px_rgba(255,105,180,0.1)] hover:shadow-[0_0_60px_rgba(255,105,180,0.2)]' 
                    : 'bg-zinc-900/20 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {tier.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#FF1E89] text-white text-xs font-black uppercase px-4 py-1 rounded-full tracking-[0.2em] shadow-[0_0_15px_rgba(255,30,137,0.5)]">
                    Recommended Clearance
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-2xl font-black text-white uppercase italic tracking-tight">{tier.name}</h3>
                  <p className="text-[#FF69B4] font-mono text-xs uppercase tracking-widest mt-1">{tier.tagline}</p>
                </div>

                <div className="mb-8">
                  <span className="text-4xl font-black text-white">{tier.price}</span>
                  <span className="text-zinc-500 text-xs ml-2 uppercase tracking-widest">/ Access</span>
                </div>

                <p className="text-sm text-zinc-300 mb-10 leading-relaxed">
                  {tier.description}
                </p>

                <ul className="space-y-4 mb-12">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-xs uppercase tracking-tight font-medium group-hover:text-white text-zinc-400 transition-colors">
                      <Check size={14} className="text-[#FF69B4] mt-0.5" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all border border-transparent duration-300 ${
                  tier.highlight
                    ? 'bg-[#FF1E89] hover:bg-white hover:text-black hover:border-white text-white shadow-[0_0_20px_rgba(255,30,137,0.3)] hover:shadow-[0_0_25px_rgba(255,255,255,0.7)]'
                    : 'bg-zinc-800 hover:bg-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white hover:shadow-[0_0_15px_rgba(161,161,170,0.6)]'
                }`}>
                  {tier.buttonText}
                </button>
              </div>
            ))}
          </div>

          {/* --- MISSION FOOTER --- */}
          <div className="mt-24 text-center border-t border-zinc-900 pt-16">
            <div className="flex items-center justify-center gap-4 text-zinc-700 mb-8">
              <Terminal size={16} />
              <span className="text-xs uppercase tracking-[0.5em]">System.Autonomy_Protocol // Enabled</span>
            </div>
            <p className="text-zinc-600 text-xs max-w-xl mx-auto leading-relaxed">
              Subscription funds are allocated directly to platform hosting, trans-rights advocacy through
              <strong> The Trevor Project</strong>, and the production of exclusive sanctuary content.
              All transactions are processed through high-risk secure gateways.
            </p>
            <p className="text-xs max-w-xl mx-auto leading-relaxed mt-4">
              <Link to="/trevor-project" className="text-[#FF9030] underline hover:text-white">
                What is The Trevor Project?
              </Link>
              <span className="text-zinc-600"> · </span>
              <a href="https://give.thetrevorproject.org/campaign/786401/donate" target="_blank" rel="noopener noreferrer" className="text-[#FF9030] underline hover:text-white">
                Donate to The Trevor Project
              </a>
            </p>
          </div>
        </section>
      </div>
    </Layout>
  );
}
