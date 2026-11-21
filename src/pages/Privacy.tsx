import React from 'react';
import Layout from '../components/Layout';
import { Shield, Fingerprint, Lock, ShieldCheck } from 'lucide-react';

export default function Privacy() {
  return (
    <Layout>
      <div className="w-full max-w-4xl mx-auto space-y-12">
        <header className="mb-20 border-b border-zinc-900 pb-10">
          <div className="flex items-center gap-3 mb-6">
            <Shield className="text-[#FF69B4]" size={32} />
            <span className="text-xs uppercase tracking-[0.4em] font-bold text-zinc-600">
              Privacy & Data Protocol
            </span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic">
            Zero <span className="text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">Trust</span> Architecture
          </h1>
          <p className="mt-4 text-zinc-500 italic max-w-2xl">
            Dollhouse Deviants is a Sanctuary. Our data retention, encryption, and privacy models reflect this core philosophy.
          </p>
        </header>

        <div className="space-y-16 text-sm leading-relaxed tracking-wide text-zinc-400">
          <section className="bg-zinc-900/10 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group hover:border-[#FF69B4]/50 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <ShieldCheck className="text-[#FF69B4]" size={24} />
              <h2 className="text-white font-black uppercase tracking-widest text-lg">1. The Sanctuary Promise</h2>
            </div>
            <p className="mb-4">
              We respect your right to exist without surveillance. We operate on a "Zero Trust" security model across all our endpoints. 
              We collect <strong>only the minimal data absolutely necessary</strong> for site functionality and account authentication.
            </p>
            <p className="text">
              We do not sell, rent, broker, or otherwise distribute your personal data, identity markers, or browsing habits to third-party marketers or aggregators. Period.
            </p>
          </section>

          <section className="bg-zinc-900/10 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group hover:border-[#FF69B4]/50 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <Lock className="text-[#FF69B4]" size={24} />
              <h2 className="text-white font-black uppercase tracking-widest text-lg">2. The DEV Locker: Content & Payments</h2>
            </div>
            <p className="mb-4">
              Paywalled content within <strong>The DEV Locker</strong> is billed through Stripe. 
            </p>
            <ul className="list-disc pl-6 space-y-3 mb-4 text-zinc-500">
              <li><strong className="text-zinc-300">No Raw Data:</strong> We do not store full credit card numbers or raw financial metadata on Dollhouse databases.</li>
              <li><strong className="text-zinc-300">HMAC-SHA256:</strong> All incoming payment verifications and webhooks utilize HMAC-SHA256 encrypted cryptographic signatures to ensure zero spoofing.</li>
              <li><strong className="text-zinc-300">Atomic Access:</strong> Your authentication grants access via verified tokens that cannot be intercepted by third-party scripts.</li>
            </ul>
          </section>

          <section className="bg-zinc-900/10 border border-zinc-800 p-8 rounded-2xl relative overflow-hidden group hover:border-[#FF69B4]/50 transition-colors">
            <div className="flex items-center gap-4 mb-6">
              <Fingerprint className="text-[#FF69B4]" size={24} />
              <h2 className="text-white font-black uppercase tracking-widest text-lg">3. The Echoes: Contributions & Interactions</h2>
            </div>
            <p className="mb-4">
              When engaging in <strong>The Echoes</strong> (such as posting journals, leaving comments, or interacting with the community), your interactions are secured. 
            </p>
            <p className="mb-4">
              You maintain total emotional and intellectual ownership over what you post. However, any content shared publicly in The Echoes is visible to the verified community. We do not use user posts to train external generative AI networks. If you choose to delete your account, your relational database entries are systematically wiped, though anonymized server logs may persist for legal compliance bounds.
            </p>
          </section>

          <section className="bg-zinc-900/10 border border-zinc-800 p-8 rounded-2xl">
            <h2 className="text-white font-black uppercase tracking-widest text-xs mb-4 text-zinc-500">4. Cookies & System Tracking</h2>
            <p>
              We use strictly essential session tokens to manage your login state and accessibility preferences (such as your Deviant Controls configuration). We explicitly block invasive cross-site tracking pixels that weaponize your browsing habits.
            </p>
          </section>

          <section className="pt-8 border-t border-zinc-900">
            <p className="text-[11px] uppercase tracking-[0.3em] text-zinc-600 mb-2">
              System Document: DD-PRIVACY-01
            </p>
            <p className="text-[11px] uppercase tracking-[0.3em] text-[#FF69B4]">
              Direct Inquiries: privacy@dollhousedeviants.com
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
