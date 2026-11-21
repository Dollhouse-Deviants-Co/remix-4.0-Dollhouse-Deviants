import React from 'react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';
import { FounderSignature } from '../components/FounderSignature';



export default function About() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#FF69B4]/30 flex flex-col">
      {/* Navigation */}
      <nav className="p-8 flex justify-between items-center border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="text-[#FF69B4] font-bold uppercase tracking-widest text-xs hover:text-white transition-colors">
          ← Back to Hub
        </Link>
        <h1 className="text-2xl font-light tracking-[0.4em] uppercase">Our Story</h1>
        <div className="w-20"></div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/60 to-black z-10" />
        <div className="absolute inset-0">
          <img 
            referrerPolicy="no-referrer"
            src="/Group_posing_with_202604082344.webp" 
            alt="The Collective" 
            className="w-full h-full object-cover opacity-50 grayscale hover:grayscale-0 transition-all duration-1000"
          />
        </div>
        
        <div className="relative z-20 text-center px-6 max-w-4xl">
          <h2 className="text-6xl md:text-8xl font-bold italic tracking-tighter leading-none mb-8">
            Built, Not <span className="text-[#FF69B4] drop-shadow-[0_0_15px_rgba(255,105,180,0.5)]">Born.</span>
          </h2>
          <p className="text-zinc-400 uppercase tracking-[0.5em] text-sm flex items-center justify-center gap-2">
            The <span className="signature-font text-[#FF69B4] text-3xl normal-case tracking-normal drop-shadow-[0_0_15px_rgba(255,105,180,0.5)] transform -translate-y-1">Sonja Kelley</span> Narrative
          </p>
        </div>
      </section>

      {/* The Manifesto Section (The Script That Brought Tears) */}
      <section className="max-w-4xl mx-auto py-32 px-8">
        <div className="space-y-12">
          <div className="border-l-2 border-[#FF69B4] pl-8 py-4">
             <p className="text-2xl md:text-3xl font-light leading-relaxed italic text-zinc-200">
               "For years, I lived in a Dollhouse built by other people—a place where I was expected to sit still, 
               follow a script that wasn't mine, and hide the parts of me that didn't fit the mold."
             </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-zinc-400 font-light leading-relaxed">
            <p>
              Dollhouse Deviants wasn't born in a boardroom; it was forged in the fire of survival. 
              They called me a 'Deviant' before I even knew what the word meant. They used the term 
              to describe a woman who walked through the fires of Schizophrenia, Bipolar disorder, 
              and PTSD. They used it to label my transition from the life I was given to the life 
              I was meant for.
            </p>
            <p>
              In those dark rooms, I realized something: <span className="text-white font-bold">A Dollhouse is only a prison if you didn't build it yourself.</span> 
              I decided to stop running from the labels. I decided to own them. Today, 'Deviant' 
              is my liberation. The Dollhouse is my sanctuary.
            </p>
          </div>
          
          <div className="flex justify-end pt-8">
             <FounderSignature />
          </div>
        </div>
      </section>

      {/* The Pillars of the Empire */}
      <section className="bg-zinc-900/30 py-32 border-y border-zinc-900">
        <div className="max-w-7xl mx-auto px-8">
          <h3 className="text-[#FF69B4] font-bold tracking-widest text-xs uppercase mb-16 text-center">The Four Pillars</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: 'The Studio', desc: 'Turning struggle into high-fashion editorial art.' },
              { title: 'The Boutique', desc: 'Adorning ourselves in the beauty we always deserved.' },
              { title: 'The Gallery', desc: 'A community space for the trans and neurodivergent voice.' },
              { title: 'The DEV Locker', desc: 'Where the code lives. Builds, stickers, and the workbench behind the Dollhouse.' }
            ].map((pillar) => (
              <div key={pillar.title} className="p-8 border border-zinc-800 hover:border-[#FF69B4]/50 hover:shadow-[0_0_20px_rgba(255,105,180,0.1)] transition-all duration-500 group">
                <h4 className="text-white font-bold italic uppercase mb-4 group-hover:text-[#FF69B4]">{pillar.title}</h4>
                <p className="text-xs text-zinc-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-48 text-center px-8 flex-grow">
        <h2 className="text-4xl md:text-5xl font-bold tracking-tighter mb-12 uppercase italic">
          Join the <span className="text-[#FF69B4]">Collective.</span>
        </h2>
        <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
          <a href="https://drive.google.com/file/d/1xAhAvD821tWoYjh1dbAlxKiM8N2TqWWN/view?usp=sharing" 
             target="_blank" 
             rel="noopener noreferrer"
             className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-[#FF1E89] hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,30,137,0.5)]">
            Download Media Kit
          </a>
          <Link to="/creations" className="px-12 py-4 border border-zinc-700 text-white font-bold uppercase tracking-widest text-xs hover:border-[#FF69B4] hover:shadow-[0_0_15px_rgba(255,105,180,0.3)] transition-all">
            Become a Contributor
          </Link>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}
