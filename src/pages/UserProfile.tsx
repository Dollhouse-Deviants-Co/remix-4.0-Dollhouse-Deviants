import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { db } from '@/lib/firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { User, LogOut, ArrowLeft, Twitter, Instagram, MessageCircle, ExternalLink, Save, Cloud, MessageSquare, Ghost, AtSign, Music, Type } from 'lucide-react';



export default function UserProfile() {
  const { user, logout } = useAuth();
  const [userSocials, setUserSocials] = useState({ twitter: '', instagram: '', reddit: '', bluesky: '', discord: '', snapchat: '', threads: '', tiktok: '', tumblr: '' });
  const [brandSocials, setBrandSocials] = useState({ twitter: '', instagram: '', reddit: '', bluesky: '', discord: '', snapchat: '', threads: '', tiktok: '', tumblr: '' });
  const [savingSocials, setSavingSocials] = useState(false);

  useEffect(() => {
    if (!user || !db) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.socialHandles) {
          setUserSocials({
            twitter: data.socialHandles.twitter || '',
            instagram: data.socialHandles.instagram || '',
            reddit: data.socialHandles.reddit || '',
            bluesky: data.socialHandles.bluesky || '',
            discord: data.socialHandles.discord || '',
            snapchat: data.socialHandles.snapchat || '',
            threads: data.socialHandles.threads || '',
            tiktok: data.socialHandles.tiktok || '',
            tumblr: data.socialHandles.tumblr || ''
          });
        }
      }
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'config', 'brandSocials'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setBrandSocials({
          twitter: data.twitter || '',
          instagram: data.instagram || '',
          reddit: data.reddit || '',
          bluesky: data.bluesky || '',
          discord: data.discord || '',
          snapchat: data.snapchat || '',
          threads: data.threads || '',
          tiktok: data.tiktok || '',
          tumblr: data.tumblr || ''
        });
      }
    });
    return () => unsub();
  }, []);

  const handleSaveSocials = async () => {
    if (!user || !db) return;
    setSavingSocials(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);
      if (docSnap.exists()) {
        await setDoc(userRef, { socialHandles: userSocials }, { merge: true });
      } else {
        await setDoc(userRef, { unlockedAssets: [], socialHandles: userSocials });
      }
      alert("Social handles updated.");
    } catch (error) {
      console.error("Error saving socials:", error);
      alert("Failed to save socials.");
    }
    setSavingSocials(false);
  };

  if (!user) return <Navigate to="/hub" />;


  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#E5E5E5] font-sans p-6 md:p-12">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex flex-col md:flex-row justify-between items-start md:items-end border-b border-[#2D2D2D] pb-6">
          <div>
            <Link to="/hub" className="inline-flex items-center gap-2 text-[#A3A3A3] hover:text-[#FF69B4] transition-colors mb-4 font-mono text-xs uppercase tracking-widest">
              <ArrowLeft size={14} /> Return to Hub
            </Link>
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_10px_rgba(255,105,180,0.5)]">
              Deviant <span className="text-[#FF69B4]">Profile</span>
            </h1>
            <p className="text-[#A3A3A3] font-mono text-sm mt-2 tracking-widest">IDENTITY & ASSET MANAGEMENT</p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[#1A1A1B] border border-[#2D2D2D] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-[#2D2D2D]">
                <div className="w-16 h-16 bg-[#0a0a0a] border-2 border-[#FF69B4] flex items-center justify-center text-[#FF69B4] shadow-[0_0_15px_rgba(255,105,180,0.2)]">
                  <User size={32} />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-mono text-[#A3A3A3] uppercase tracking-widest">Authenticated</p>
                  <p className="text-sm font-bold text-white truncate">{user.email}</p>
                </div>
              </div>
              
              <div className="space-y-4 font-mono text-xs text-[#A3A3A3]">
                <div className="flex justify-between">
                  <span>CLEARANCE:</span>
                  <span className="text-white">STANDARD</span>
                </div>
                <div className="flex justify-between">
                  <span>STATUS:</span>
                  <span className="text-green-500">ACTIVE</span>
                </div>
              </div>

              <button 
                onClick={logout}
                className="w-full mt-8 min-h-[48px] flex items-center justify-center gap-2 bg-transparent border border-[#2D2D2D] text-[#A3A3A3] font-bold uppercase tracking-widest hover:border-red-500 hover:text-red-500 transition-all duration-300"
              >
                <LogOut size={16} />
                Sever Connection
              </button>
            </div>

            {/* Deviant Network */}
            <div className="bg-[#1A1A1B] border border-[#2D2D2D] p-6 shadow-[0_0_20px_rgba(0,0,0,0.5)]">
              <h3 className="text-lg font-black uppercase tracking-widest text-white mb-4 border-b border-[#2D2D2D] pb-2">
                Deviant <span className="text-[#FF69B4]">Network</span>
              </h3>
              
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div>
                  <label htmlFor="user-website" className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <ExternalLink size={14} /> Personal Website
                  </label>
                  <input 
                    id="user-website"
                    type="url" 
                    className="url-input w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono" 
                    aria-label="Preview Website URL" 
                    placeholder="https://..." 
                  />
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <Twitter size={14} /> Twitter / X
                  </label>
                  <input 
                    type="text" 
                    placeholder="@yourhandle"
                    value={userSocials.twitter}
                    onChange={(e) => setUserSocials({...userSocials, twitter: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono"
                  />
                  {brandSocials.twitter && !userSocials.twitter && (
                    <a href={brandSocials.twitter} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF69B4] mt-1 hover:text-white transition-colors uppercase tracking-widest">
                      <ExternalLink size={10} /> Connect with Brand
                    </a>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <Instagram size={14} /> Instagram
                  </label>
                  <input 
                    type="text" 
                    placeholder="@yourhandle"
                    value={userSocials.instagram}
                    onChange={(e) => setUserSocials({...userSocials, instagram: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono"
                  />
                  {brandSocials.instagram && !userSocials.instagram && (
                    <a href={brandSocials.instagram} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF69B4] mt-1 hover:text-white transition-colors uppercase tracking-widest">
                      <ExternalLink size={10} /> Connect with Brand
                    </a>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <MessageCircle size={14} /> Reddit
                  </label>
                  <input 
                    type="text" 
                    placeholder="u/yourhandle"
                    value={userSocials.reddit}
                    onChange={(e) => setUserSocials({...userSocials, reddit: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono"
                  />
                  {brandSocials.reddit && !userSocials.reddit && (
                    <a href={brandSocials.reddit} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF69B4] mt-1 hover:text-white transition-colors uppercase tracking-widest">
                      <ExternalLink size={10} /> Connect with Brand
                    </a>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <Cloud size={14} /> Bluesky
                  </label>
                  <input 
                    type="text" 
                    placeholder="@yourhandle.bsky.social"
                    value={userSocials.bluesky}
                    onChange={(e) => setUserSocials({...userSocials, bluesky: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono"
                  />
                  {brandSocials.bluesky && !userSocials.bluesky && (
                    <a href={brandSocials.bluesky} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF69B4] mt-1 hover:text-white transition-colors uppercase tracking-widest">
                      <ExternalLink size={10} /> Connect with Brand
                    </a>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <MessageSquare size={14} /> Discord
                  </label>
                  <input 
                    type="text" 
                    placeholder="yourusername"
                    value={userSocials.discord}
                    onChange={(e) => setUserSocials({...userSocials, discord: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono"
                  />
                  {brandSocials.discord && !userSocials.discord && (
                    <a href={brandSocials.discord} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF69B4] mt-1 hover:text-white transition-colors uppercase tracking-widest">
                      <ExternalLink size={10} /> Connect with Brand
                    </a>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <Ghost size={14} /> Snapchat
                  </label>
                  <input 
                    type="text" 
                    placeholder="@yourhandle"
                    value={userSocials.snapchat}
                    onChange={(e) => setUserSocials({...userSocials, snapchat: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono"
                  />
                  {brandSocials.snapchat && !userSocials.snapchat && (
                    <a href={brandSocials.snapchat} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF69B4] mt-1 hover:text-white transition-colors uppercase tracking-widest">
                      <ExternalLink size={10} /> Connect with Brand
                    </a>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <AtSign size={14} /> Threads
                  </label>
                  <input 
                    type="text" 
                    placeholder="@yourhandle"
                    value={userSocials.threads}
                    onChange={(e) => setUserSocials({...userSocials, threads: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono"
                  />
                  {brandSocials.threads && !userSocials.threads && (
                    <a href={brandSocials.threads} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF69B4] mt-1 hover:text-white transition-colors uppercase tracking-widest">
                      <ExternalLink size={10} /> Connect with Brand
                    </a>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <Music size={14} /> TikTok
                  </label>
                  <input 
                    type="text" 
                    placeholder="@yourhandle"
                    value={userSocials.tiktok}
                    onChange={(e) => setUserSocials({...userSocials, tiktok: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono"
                  />
                  {brandSocials.tiktok && !userSocials.tiktok && (
                    <a href={brandSocials.tiktok} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF69B4] mt-1 hover:text-white transition-colors uppercase tracking-widest">
                      <ExternalLink size={10} /> Connect with Brand
                    </a>
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">
                    <Type size={14} /> Tumblr
                  </label>
                  <input 
                    type="text" 
                    placeholder="yourhandle"
                    value={userSocials.tumblr}
                    onChange={(e) => setUserSocials({...userSocials, tumblr: e.target.value})}
                    className="w-full bg-[#0a0a0a] border border-[#2D2D2D] px-3 py-2 text-white text-sm focus:border-[#FF69B4] focus:outline-none font-mono"
                  />
                  {brandSocials.tumblr && !userSocials.tumblr && (
                    <a href={brandSocials.tumblr} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-[#FF69B4] mt-1 hover:text-white transition-colors uppercase tracking-widest">
                      <ExternalLink size={10} /> Connect with Brand
                    </a>
                  )}
                </div>
              </div>

              <button 
                onClick={handleSaveSocials}
                disabled={savingSocials}
                className="w-full mt-4 min-h-[40px] flex items-center justify-center gap-2 bg-transparent border border-[#FF69B4] text-[#FF69B4] font-bold uppercase tracking-widest text-xs hover:bg-[#FF69B4] hover:text-[#0a0a0a] transition-all duration-300"
              >
                <Save size={14} />
                {savingSocials ? "Syncing..." : "Sync Network"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
