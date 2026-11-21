import React from 'react';
import Layout from '../components/Layout';
import { Heart, ShieldCheck, Sparkles } from 'lucide-react';
import { FounderSignature } from '../components/FounderSignature';



export default function OurStory() {
  return (
    <Layout>
      <div className="max-w-4xl w-full mx-auto pb-20 pt-10 px-4">
        <h1 className="text-5xl md:text-6xl font-black uppercase text-white tracking-tighter leading-[0.9] mb-12">
          <span className="text-cyan-400 font-italic italic">Sonja</span> (Founder)'s Note.
        </h1>
        
        <div className="prose prose-invert prose-lg text-zinc-400 space-y-8 font-light leading-relaxed">
          <p>Dollhouse Deviants is a living archive of my survival and my joy. I realized the safe spaces I was looking for didn't exist in the loud corners of the mainstream internet.</p>
          <p className="text-white border-l-2 border-cyan-400 pl-6 italic py-2 text-2xl font-medium">
            "We were built to be seen, but we were never built to be processed. Here, you are processed only by your own rules."
          </p>
          <p>This sanctuary is for the neurodivergent minds and trans souls navigating the world with strength. We are the builders.</p>
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-900">
          <p className="text-zinc-600 font-mono text-xs uppercase tracking-widest mb-4">With love and radical empathy,</p>
          <FounderSignature />
        </div>
      </div>
    </Layout>
  );
}
