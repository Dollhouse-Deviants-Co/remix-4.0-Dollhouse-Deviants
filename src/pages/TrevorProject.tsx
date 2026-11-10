import React, { useEffect } from 'react';
import Layout from '../components/Layout';
import { Heart, Phone, MessageSquare, MessagesSquare, ExternalLink } from 'lucide-react';
import { TREVOR_DONATE_URL, announceTrevorDonate } from '../components/TrevorBanner';

const GET_HELP_URL = 'https://www.thetrevorproject.org/Get-Help/';
const TREVOR_HOME_URL = 'https://www.thetrevorproject.org/';

/**
 * Hosted "What Is The Trevor Project?" page.
 *
 * Copy is written in Dollhouse Deviants' own words (Nov 5, 2026 draft), with
 * one short attributed mission quote. It does NOT copy Trevor's pages
 * wholesale and does NOT use their logo — plain text + links out to official
 * Trevor pages. Crisis numbers verified Nov 5, 2026 from
 * thetrevorproject.org/Get-Help/ — re-check them on every site update, and
 * link out for the live version. Do NOT add a "Press 3" 988 LGBTQ option:
 * that subnetwork stopped operating July 17, 2025.
 */
export default function TrevorProject() {
  useEffect(() => {
    document.title = 'What Is The Trevor Project? | Dollhouse Deviants';
  }, []);

  return (
    <Layout>
      <div className="min-h-screen bg-black text-zinc-400 font-sans selection:bg-[#E65100]/30">
        <div className="max-w-4xl mx-auto px-6 py-20">
          <header className="mb-12">
            <p className="text-[#FF9030] text-xs font-black uppercase tracking-[0.3em] mb-4">
              Proudly Supporting
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter italic mb-4">
              What <em>Is</em> The Trevor Project?
            </h1>
            <p className="text-zinc-500 max-w-2xl leading-relaxed italic">
              A lifeline for LGBTQ+ young people. Here&apos;s what they do, why we
              stand behind them, and how to reach them — or help them keep going.
            </p>
          </header>

          {/* --- GET HELP NOW: crisis box first --- */}
          <section
            aria-labelledby="trevor-crisis-heading"
            className="mb-16 p-8 border-l-4 border-[#E65100] border-y border-r border-zinc-800 rounded-r-3xl bg-zinc-900/40"
          >
            <h2 id="trevor-crisis-heading" className="text-2xl font-black text-white uppercase tracking-tight mb-4">
              If you&apos;re struggling right now
            </h2>
            <p className="leading-relaxed mb-6">
              You are not alone — and you don&apos;t have to carry this by yourself.
              The Trevor Project is free, confidential, and 24/7, for LGBTQ+ young
              people under 25.
            </p>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF9030] shrink-0" aria-hidden="true" />
                <span>
                  <strong className="text-white">Call:</strong>{' '}
                  <a href="tel:+18664887386" className="text-white font-bold underline hover:text-[#FF9030]">
                    1-866-488-7386
                  </a>{' '}
                  (Trevor Lifeline)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MessageSquare size={18} className="text-[#FF9030] shrink-0" aria-hidden="true" />
                <span>
                  <strong className="text-white">Text:</strong> text{' '}
                  <strong className="text-white">START</strong> to{' '}
                  <strong className="text-white">678-678</strong>
                </span>
              </li>
              <li className="flex items-center gap-3">
                <MessagesSquare size={18} className="text-[#FF9030] shrink-0" aria-hidden="true" />
                <span>
                  <strong className="text-white">Chat:</strong>{' '}
                  <a href={GET_HELP_URL} target="_blank" rel="noopener noreferrer" className="text-white font-bold underline hover:text-[#FF9030]">
                    Start a chat on Trevor&apos;s site
                  </a>{' '}
                  (opens in a new tab)
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-[#FF9030] shrink-0" aria-hidden="true" />
                <span>
                  <strong className="text-white">TTY (Deaf / Hard of Hearing):</strong>{' '}
                  <a href="tel:+18668033699" className="text-white font-bold underline hover:text-[#FF9030]">
                    1-866-803-3699
                  </a>
                </span>
              </li>
            </ul>
            <p className="leading-relaxed mt-6">
              <strong className="text-white">Anyone in crisis:</strong> call or text{' '}
              <a href="tel:988" className="text-white font-bold underline hover:text-[#FF9030]">988</a>{' '}
              (Suicide &amp; Crisis Lifeline, free, 24/7).{' '}
              <strong className="text-white">In immediate danger:</strong> call{' '}
              <a href="tel:911" className="text-white font-bold underline hover:text-[#FF9030]">911</a>.
            </p>
            <p className="text-sm italic mt-4">
              Dollhouse Deviants is not a crisis service. If you need help right
              now, please contact Trevor or 988 directly — they are trained for
              this, and they answer around the clock.
            </p>
          </section>

          {/* --- WHAT IS IT --- */}
          <section aria-labelledby="trevor-what-heading" className="mb-16">
            <h2 id="trevor-what-heading" className="text-2xl font-black text-white uppercase tracking-tight mb-4">
              What is The Trevor Project?
            </h2>
            <p className="leading-relaxed mb-4">
              The Trevor Project is the world&apos;s largest suicide prevention and
              mental health organization for LGBTQ+ young people. Its mission, in
              its own words, is <strong className="text-white">&ldquo;to end suicide among LGBTQ+ young people.&rdquo;</strong>
            </p>
            <p className="leading-relaxed mb-4">
              It started with a film. In 1994, filmmakers Celeste Lecesne, Peggy
              Rajski, and Randy Stone made <em>Trevor</em>, an Academy Award-winning
              short about a 13-year-old gay boy. When it was about to air on HBO in
              1998, they realized there was no support line for young viewers who
              felt like Trevor — so they built one. The Trevor Project was officially
              founded on March 25, 1998, and its lifeline became the first nationwide,
              around-the-clock crisis line for LGBTQ youth in the U.S.
            </p>
            <p className="leading-relaxed">
              It has been there ever since — for one generation of LGBTQ young people,
              and now for the next.
            </p>
          </section>

          {/* --- WHAT THEY DO --- */}
          <section aria-labelledby="trevor-do-heading" className="mb-16">
            <h2 id="trevor-do-heading" className="text-2xl font-black text-white uppercase tracking-tight mb-6">
              What they actually do
            </h2>
            <ul className="space-y-4 text-sm leading-relaxed">
              <li className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/20">
                <strong className="text-white block uppercase tracking-widest text-xs mb-1">Lifeline, Text &amp; Chat</strong>
                Free, confidential crisis counseling, 24 hours a day, 7 days a week,
                by phone, text, and chat, from trained counselors who understand what
                LGBTQ+ young people face. You can share as much or as little as you like.
              </li>
              <li className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/20">
                <strong className="text-white block uppercase tracking-widest text-xs mb-1">TrevorSpace</strong>
                A moderated online community where LGBTQ young people ages 13–24 can
                connect, talk, and find each other — a safe space, not a feed that
                punishes you for being yourself.
              </li>
              <li className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/20">
                <strong className="text-white block uppercase tracking-widest text-xs mb-1">Advocacy</strong>
                Working in all 50 states to change hearts, minds, and laws so young
                LGBTQ lives are protected, not debated.
              </li>
              <li className="p-6 border border-zinc-800 rounded-2xl bg-zinc-900/20">
                <strong className="text-white block uppercase tracking-widest text-xs mb-1">Research &amp; Education</strong>
                Including the U.S. National Survey on LGBTQ Youth Mental Health, so
                policy and care are built on evidence, not guesswork. Their research
                found one accepting adult in a young person&apos;s life can reduce their
                risk of attempting suicide by 40%. They also publish guides for young
                people and for the parents, teachers, and friends around them.
              </li>
            </ul>
            <p className="leading-relaxed mt-6">
              Every year, 1.8 million LGBTQ+ young people in the United States
              seriously consider suicide. That is why Trevor exists — and why it has
              to keep answering.
            </p>
          </section>

          {/* --- WHY WE SUPPORT THEM --- */}
          <section aria-labelledby="trevor-why-heading" className="mb-16">
            <h2 id="trevor-why-heading" className="text-2xl font-black text-white uppercase tracking-tight mb-4">
              Why Dollhouse Deviants supports them
            </h2>
            <p className="leading-relaxed mb-4">
              Because this is what the sanctuary is for.
            </p>
            <p className="leading-relaxed mb-4">
              Dollhouse Deviants is a safe place for trans creators, neurodivergent
              minds, and the beautifully unconventional — a place to be seen as you
              are, not as the world tells you to be. The Trevor Project does that
              same work at the moment it matters most: when a young person is alone
              with the worst night of their life and needs one person who believes them.
            </p>
            <p className="leading-relaxed">
              We support them wholeheartedly. Not as a badge. As a promise: nobody
              here gets left alone with that night.
            </p>
          </section>

          {/* --- DONATE --- */}
          <section aria-labelledby="trevor-donate-heading" className="mb-16 text-center border border-zinc-800 rounded-3xl bg-zinc-900/20 p-8">
            <Heart size={28} className="text-[#E65100] mx-auto mb-4" aria-hidden="true" />
            <h2 id="trevor-donate-heading" className="text-2xl font-black text-white uppercase tracking-tight mb-4">
              How to donate
            </h2>
            <p className="leading-relaxed max-w-xl mx-auto mb-6">
              Your gift goes directly to The Trevor Project, a 501(c)(3) nonprofit.
              It keeps their crisis counselors answering — phone, text, and chat —
              free, 24/7, for every LGBTQ+ young person who reaches out. We
              don&apos;t take a cut, and we don&apos;t hold your gift.
            </p>
            <a
              href={TREVOR_DONATE_URL}
              target="_blank"
              rel="noopener noreferrer"
              onClick={announceTrevorDonate}
              className="inline-flex items-center gap-2 bg-[#E65100] hover:bg-white hover:text-black text-white px-8 py-3 rounded-full font-black uppercase tracking-[0.2em] text-xs transition-all shadow-[0_0_15px_rgba(230,81,0,0.4)]"
            >
              Donate to The Trevor Project <ExternalLink size={14} aria-hidden="true" />
            </a>
            <p className="text-xs mt-4">Opens Trevor&apos;s official donate page in a new tab.</p>
          </section>

          {/* --- LEARN MORE + NON-AFFILIATION --- */}
          <section aria-labelledby="trevor-more-heading" className="mb-8">
            <h2 id="trevor-more-heading" className="text-2xl font-black text-white uppercase tracking-tight mb-4">
              Learn more on Trevor&apos;s own site
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={GET_HELP_URL} target="_blank" rel="noopener noreferrer" className="text-[#FF9030] underline hover:text-white">
                  Get help now — Trevor&apos;s Get Help page
                </a>
              </li>
              <li>
                <a href={TREVOR_HOME_URL} target="_blank" rel="noopener noreferrer" className="text-[#FF9030] underline hover:text-white">
                  The Trevor Project — thetrevorproject.org
                </a>
              </li>
              <li>
                <a href={TREVOR_DONATE_URL} target="_blank" rel="noopener noreferrer" onClick={announceTrevorDonate} className="text-[#FF9030] underline hover:text-white">
                  Donate
                </a>
              </li>
            </ul>
            <p className="text-sm leading-relaxed mt-8 border-t border-zinc-900 pt-8">
              Dollhouse Deviants is a proud supporter of The Trevor Project. We are{' '}
              <strong className="text-white">not</strong> The Trevor Project, we are
              not affiliated with it, and we are not a crisis service. We do not take
              crisis calls, we do not see your donation, and we cannot help you in an
              emergency. If you are in crisis, please contact The Trevor Project or
              988 directly — that is what they are there for, and that is the fastest
              way to a trained person who can help.
            </p>
          </section>

          <footer className="mt-20 text-center opacity-30 text-xs uppercase tracking-[0.2em]">
            You are not alone • © Dollhouse Deviants
          </footer>
        </div>
      </div>
    </Layout>
  );
}
