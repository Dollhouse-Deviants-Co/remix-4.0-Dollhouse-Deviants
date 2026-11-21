import React from 'react';
import Layout from '../components/Layout';
import { FileWarning, AlertOctagon, Scale, ShieldAlert } from 'lucide-react';

export default function Terms() {
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto space-y-12">
        <header className="mb-20 border-b border-zinc-900 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <FileWarning className="text-[#FF69B4]" size={32} />
            <span className="text-xs uppercase tracking-[0.4em] font-bold text-zinc-600">
              Legal & Conduct Agreements
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic">
            Terms of <span className="text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">Service</span>
          </h1>
          <p className="mt-4 text-zinc-500 italic max-w-2xl">
            Tearing down the walls requires mutual respect. These are the unbreakable rules of our sanctuary.
          </p>
        </header>

        <div className="space-y-16 text-sm leading-relaxed tracking-wide text-zinc-400">
          <section className="bg-black/40 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group hover:border-[#FF69B4]/50 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <AlertOctagon className="text-[#FF69B4]" size={24} />
              <h2 className="text-white font-black uppercase tracking-widest text-lg">1. Access & Community Standards</h2>
            </div>
            <p className="mb-4">
              <strong>Dollhouse Deviants is open to everyone.</strong> This is a general-audience creative space: art, code, music, and community. By using this ecosystem, you agree to keep it that way. 
            </p>
            <p className="mb-4">
              We do not host adult or explicit material anywhere on this site. Do not post it, link to it, or solicit it here — accounts that do are removed.
            </p>
          </section>

          <section className="bg-black/40 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group hover:border-[#FF69B4]/50 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <ShieldAlert className="text-[#FF69B4]" size={24} />
              <h2 className="text-white font-black uppercase tracking-widest text-lg">2. Intellectual Property (The DEV Locker)</h2>
            </div>
            <p className="mb-4">
              All visual, audio, and written content on this site is the exclusive intellectual property of Dollhouse Deviants Productions and its sovereign creators.
            </p>
            <p className="text-[#FF69B4] italic font-bold">
              Unsanctioned distribution, scraping, recording, or reproducing of paywalled material is a direct violation of international copyright law.
            </p>
            <p className="mt-4">
              Violation of this protocol will trigger an immediate account termination and we reserve the right to pursue full legal and financial restitution.
            </p>
          </section>

          <section className="bg-black/40 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group hover:border-[#FF69B4]/50 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <Scale className="text-[#FF69B4]" size={24} />
              <h2 className="text-white font-black uppercase tracking-widest text-lg">3. Interaction Rules (The Echoes)</h2>
            </div>
            <p className="mb-4">
              <strong>The Echoes</strong> is a safe space journal and community for the beautifully unconventional. Harassment, transphobia, ableism, racism, or non-consensual behavior of any kind will not be tolerated.
            </p>
            <ul className="list-disc pl-6 space-y-3 mb-4 text-zinc-500">
              <li><strong className="text-zinc-300">Absolute Consent:</strong> Do not post unsolicited explicit material or solicit others aggressively.</li>
              <li><strong className="text-zinc-300">Sanctuary First:</strong> We prioritize the psychological safety of our creators and neurodivergent community members above all else.</li>
              <li><strong className="text-zinc-300">Zero Warning:</strong> We reserve the right to ban users who disrupt the sanctuary without warning or refund.</li>
            </ul>
          </section>

          <section className="bg-black/40 border border-zinc-800 p-8 rounded-2xl">
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-4 text-zinc-500">4. Billing & Subscriptions</h2>
            <p className="mb-4">
              Access to The DEV Locker and bespoke interactive tier sections are billed through secure checkout via Stripe. All subscription models are explicitly detailed before transaction. Chargebacks filed fraudulently will result in immediate blacklisting from the Dollhouse network.
            </p>
          </section>

          <section className="pt-8 border-t border-zinc-900">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-600 mb-2">
              System Document: DD-TERMS-01
            </p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF69B4]">
              Legal Inquiries: legal@dollhousedeviants.com
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
