import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, getDoc, onSnapshot, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import SafeImage from '../components/SafeImage';



type Tab = 'live' | 'schedule' | 'content' | 'socials' | 'webhooks' | 'squircle' | 'assets';

export default function AdminDashboard() {
  const { user, isAdmin, loading, loginWithGoogle, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('live');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-[#FF69B4] font-mono animate-pulse tracking-widest">
          VERIFYING CLEARANCE...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1A1A1B] border border-[#2D2D2D] p-8 text-center shadow-[0_0_30px_rgba(255,105,180,0.1)]">
          <h1 className="text-2xl font-black uppercase tracking-widest text-white mb-2">
            Command <span className="text-[#FF69B4]">Center</span>
          </h1>
          <p className="text-[#A3A3A3] text-xs font-mono mb-8">RESTRICTED ACCESS</p>
          
          <button 
            onClick={loginWithGoogle}
            className="w-full min-h-[48px] bg-transparent border-2 border-[#FF69B4] text-[#FF69B4] font-black uppercase tracking-widest hover:bg-[#FF69B4] hover:text-[#0a0a0a] transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.3)]"
          >
            Initiate Google Uplink
          </button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#1A1A1B] border border-red-600 p-8 text-center shadow-[0_0_30px_rgba(220,38,38,0.2)]">
          <h1 className="text-2xl font-black uppercase tracking-widest text-red-600 mb-4">
            Access Denied
          </h1>
          <p className="text-[#A3A3A3] text-sm mb-8">
            Clearance level insufficient for <span className="text-white">{user.email}</span>.
          </p>
          <button 
            onClick={logout}
            className="w-full min-h-[48px] bg-transparent border border-[#2D2D2D] text-white hover:border-red-600 hover:text-red-600 transition-all uppercase font-bold tracking-widest text-sm"
          >
            Sever Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#E5E5E5] font-sans flex flex-col md:flex-row">
      <aside className="w-full md:w-72 bg-[#1A1A1B] border-b md:border-b-0 md:border-r border-[#FF69B4]/30 shadow-[4px_0_20px_rgba(255,105,180,0.1)] flex flex-col z-10">
        <div className="p-6 border-b border-[#2D2D2D] min-h-[80px] flex flex-col justify-center">
          <h1 className="text-2xl font-black uppercase tracking-widest text-white drop-shadow-[0_0_8px_rgba(255,105,180,0.8)]">
            Command <span className="text-[#FF69B4]">Center</span>
          </h1>
          <p className="text-xs text-[#A3A3A3] font-mono mt-1 tracking-widest">SYSTEM ADMIN // MOBILE OPTIMIZED</p>
        </div>
        
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible p-4 gap-2 flex-1 scrollbar-hide">
          <SidebarButton active={activeTab === 'live'} onClick={() => setActiveTab('live')} label="Live Status" />
          <SidebarButton active={activeTab === 'schedule'} onClick={() => setActiveTab('schedule')} label="Weekly Logic" />
          <SidebarButton active={activeTab === 'assets'} onClick={() => setActiveTab('assets')} label="Deploy Assets" />
          <SidebarButton active={activeTab === 'socials'} onClick={() => setActiveTab('socials')} label="Brand Socials" />
          <SidebarButton active={activeTab === 'webhooks'} onClick={() => setActiveTab('webhooks')} label="Webhooks" />
          <SidebarButton active={activeTab === 'squircle'} onClick={() => setActiveTab('squircle')} label="Squircle Lab" />
        </nav>

        <button onClick={logout} className="mt-auto text-xs font-bold tracking-widest text-[#A3A3A3] hover:text-[#FF69B4] p-6 text-left uppercase transition-colors">
          TERMINATE SESSION
        </button>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full">
        <div className="max-w-5xl mx-auto w-full">
          {activeTab === 'live' && <LiveStatusTab />}
          {activeTab === 'schedule' && <WeeklyScheduleTab />}
          {activeTab === 'assets' && <AssetDeploymentTab />}
          {activeTab === 'socials' && <BrandSocialsTab />}
          {activeTab === 'webhooks' && <WebhooksTab />}
          {activeTab === 'squircle' && <SquircleLabTab />}
        </div>
      </main>
    </div>
  );
}

function SidebarButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-[48px] whitespace-nowrap text-left px-6 py-3 text-sm font-bold uppercase tracking-widest transition-all duration-300 border-l-4 md:w-full ${
        active 
          ? 'border-[#FF69B4] bg-[#FF69B4]/10 text-[#FF69B4] shadow-[inset_4px_0_15px_rgba(255,105,180,0.2)]' 
          : 'border-transparent text-[#A3A3A3] hover:bg-[#2D2D2D] hover:text-white'
      }`}
    >
      {label}
    </button>
  );
}

function ActionButton({ label, variant = 'primary', onClick, disabled }: { label: string; variant?: 'primary' | 'secondary'; onClick?: () => void; disabled?: boolean }) {
  const baseStyle = "min-h-[48px] px-8 font-black uppercase tracking-widest transition-all duration-300 border-2 flex items-center justify-center";
  const primaryStyle = "bg-transparent border-[#FF69B4] text-[#FF69B4] hover:bg-[#FF69B4] hover:text-[#0a0a0a] shadow-[0_0_15px_rgba(255,105,180,0.3)] hover:shadow-[0_0_25px_rgba(255,105,180,0.6)]";
  const secondaryStyle = "bg-[#1A1A1B] border-[#2D2D2D] text-white hover:border-[#FF69B4] hover:text-[#FF69B4] hover:shadow-[0_0_15px_rgba(255,105,180,0.6)]";
  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button 
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variant === 'primary' ? primaryStyle : secondaryStyle} ${disabled ? disabledStyle : ''} w-full md:w-auto`}
    >
      {label}
    </button>
  );
}

function LiveStatusTab() {
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'config', 'liveStatus'), (docSnap) => {
      if (docSnap.exists()) {
        setIsLive(docSnap.data().isLive || false);
      }
    });
    return () => unsub();
  }, []);

  const handleCommit = async () => {
    if (!db) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'config', 'liveStatus'), { isLive });
      
      // If going live, trigger webhook
      if (isLive) {
        try {
          const webhookDoc = await getDoc(doc(db, 'config', 'webhooks'));
          if (webhookDoc.exists()) {
            const { discordUrl, liveMessage } = webhookDoc.data();
            if (discordUrl) {
              await fetch(discordUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: liveMessage || "Dollhouse Deviants is LIVE NOW! Join the broadcast." })
              });
              console.log("Webhook triggered successfully.");
            }
          }
        } catch (webhookError) {
          console.error("Failed to trigger webhook:", webhookError);
          // Don't block the UI if webhook fails, just log it
        }
      }

      alert("Broadcast Override Committed.");
    } catch (error) {
      console.error("Error committing status:", error);
      alert("Failed to commit status.");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="border-b border-[#2D2D2D] pb-4">
        <h2 className="text-3xl font-black uppercase tracking-widest">Broadcast <span className="text-[#FF69B4]">Override</span></h2>
      </header>
      
      <div className="bg-[#1A1A1B] border border-[#2D2D2D] p-6 md:p-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-2xl font-bold uppercase tracking-wider text-white">Live Uplink</h3>
          <p className="text-[#A3A3A3] text-sm font-mono mt-2">Force 'LIVE NOW' indicators across all public nodes.</p>
        </div>
        
        <button 
          onClick={() => setIsLive(!isLive)}
          className={`min-h-[48px] w-24 rounded-full relative transition-all duration-300 border-2 flex-shrink-0 ${
            isLive 
              ? 'bg-[#FF69B4]/20 border-[#FF69B4] shadow-[0_0_25px_rgba(255,105,180,0.6)]' 
              : 'bg-[#0a0a0a] border-[#2D2D2D]'
          }`}
        >
          <div className={`absolute top-1 bottom-1 w-9 rounded-full transition-transform duration-300 ${
            isLive 
              ? 'translate-x-12 bg-[#FF69B4] shadow-[0_0_15px_#FF69B4]' 
              : 'translate-x-1 bg-[#A3A3A3]'
          }`} />
        </button>
      </div>

      <div className="flex justify-end">
        <ActionButton label={loading ? "Committing..." : "Commit Status"} onClick={handleCommit} disabled={loading} />
      </div>
    </div>
  );
}

function WeeklyScheduleTab() {
  const [schedule, setSchedule] = useState([
    { id: '1', day: 'Monday', activity: 'LIVE BUILD SESSION', platform: 'DEV Locker' },
    { id: '2', day: 'Tuesday', activity: 'NEW LOCKER DROP', platform: 'Boutique' },
    { id: '3', day: 'Thursday', activity: 'CUSTOM COMMISSIONS', platform: 'Boutique' },
    { id: '4', day: 'Weekend', activity: 'STICKER PACK PREP', platform: 'Boutique' },
  ]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'config', 'schedule'), (docSnap) => {
      if (docSnap.exists() && docSnap.data().items) {
        setSchedule(docSnap.data().items);
      }
    });
    return () => unsub();
  }, []);

  const handleSync = async () => {
    if (!db) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'config', 'schedule'), { items: schedule });
      alert("Weekly Logic Synced to Public.");
    } catch (error) {
      console.error("Error syncing schedule:", error);
      alert("Failed to sync schedule.");
    }
    setLoading(false);
  };

  const handleUpdateItem = (id: string, field: string, value: string) => {
    setSchedule(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="border-b border-[#2D2D2D] pb-4">
        <h2 className="text-3xl font-black uppercase tracking-widest">Weekly <span className="text-[#FF69B4]">Logic</span></h2>
      </header>
      
      <div className="space-y-4">
        {schedule.map((item) => (
          <div key={item.id} className="flex flex-col md:flex-row gap-3 bg-[#1A1A1B] border border-[#2D2D2D] p-4">
            <input 
              type="text" 
              value={item.day} 
              onChange={(e) => handleUpdateItem(item.id, 'day', e.target.value)}
              aria-label="Schedule Day"
              className="min-h-[48px] w-full md:w-1/4 bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-[#FF69B4] font-mono text-sm focus:border-[#FF69B4] focus:outline-none"
            />
            <input 
              type="text" 
              value={item.activity} 
              onChange={(e) => handleUpdateItem(item.id, 'activity', e.target.value)}
              aria-label="Schedule Activity"
              className="min-h-[48px] w-full md:w-1/2 bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white font-bold uppercase focus:border-[#FF69B4] focus:outline-none"
            />
            <input 
              type="text" 
              value={item.platform} 
              onChange={(e) => handleUpdateItem(item.id, 'platform', e.target.value)}
              aria-label="Schedule Platform"
              className="min-h-[48px] w-full md:w-1/4 bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-[#A3A3A3] font-mono text-sm focus:border-[#FF69B4] focus:outline-none"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row justify-between gap-4">
        <ActionButton label="+ Add Node" variant="secondary" onClick={() => setSchedule([...schedule, { id: Date.now().toString(), day: 'New Day', activity: 'NEW ACTIVITY', platform: 'Platform' }])} />
        <ActionButton label={loading ? "Syncing..." : "Sync to Public"} onClick={handleSync} disabled={loading} />
      </div>
    </div>
  );
}

function BrandSocialsTab() {
  const [twitter, setTwitter] = useState("");
  const [instagram, setInstagram] = useState("");
  const [reddit, setReddit] = useState("");
  const [bluesky, setBluesky] = useState("");
  const [discord, setDiscord] = useState("");
  const [snapchat, setSnapchat] = useState("");
  const [threads, setThreads] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [tumblr, setTumblr] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'config', 'brandSocials'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.twitter) setTwitter(data.twitter);
        if (data.instagram) setInstagram(data.instagram);
        if (data.reddit) setReddit(data.reddit);
        if (data.bluesky) setBluesky(data.bluesky);
        if (data.discord) setDiscord(data.discord);
        if (data.snapchat) setSnapchat(data.snapchat);
        if (data.threads) setThreads(data.threads);
        if (data.tiktok) setTiktok(data.tiktok);
        if (data.tumblr) setTumblr(data.tumblr);
      }
    });
    return () => unsub();
  }, []);

  const handleUpdate = async () => {
    if (!db) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'config', 'brandSocials'), { 
        twitter, instagram, reddit, bluesky, discord, snapchat, threads, tiktok, tumblr 
      });
      alert("Brand Socials Updated.");
    } catch (error) {
      console.error("Error updating brand socials:", error);
      alert("Failed to update brand socials.");
    }
    setLoading(false);
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="border-b border-[#2D2D2D] pb-4">
        <h2 className="text-3xl font-black uppercase tracking-widest">Brand <span className="text-[#FF69B4]">Socials</span></h2>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1A1A1B] border border-[#2D2D2D] p-6 md:p-10">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Twitter / X Profile URL</label>
          <input 
            type="text" 
            value={twitter} 
            onChange={(e) => setTwitter(e.target.value)}
            placeholder="https://x.com/dollhouse_deviant"
            aria-label="Twitter Profile URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Instagram Profile URL</label>
          <input 
            type="text" 
            value={instagram} 
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="https://instagram.com/dollhouse_deviant"
            aria-label="Instagram Profile URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Reddit Profile URL</label>
          <input 
            type="text" 
            value={reddit} 
            onChange={(e) => setReddit(e.target.value)}
            placeholder="https://reddit.com/user/dollhouse_deviant"
            aria-label="Reddit Profile URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Bluesky Profile URL</label>
          <input 
            type="text" 
            value={bluesky} 
            onChange={(e) => setBluesky(e.target.value)}
            placeholder="https://bsky.app/profile/dollhouse_deviant"
            aria-label="Bluesky Profile URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Discord Server URL</label>
          <input 
            type="text" 
            value={discord} 
            onChange={(e) => setDiscord(e.target.value)}
            placeholder="https://discord.gg/..."
            aria-label="Discord Server URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Snapchat Profile URL</label>
          <input 
            type="text" 
            value={snapchat} 
            onChange={(e) => setSnapchat(e.target.value)}
            placeholder="https://snapchat.com/add/dollhouse_deviant"
            aria-label="Snapchat Profile URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Threads Profile URL</label>
          <input 
            type="text" 
            value={threads} 
            onChange={(e) => setThreads(e.target.value)}
            placeholder="https://threads.net/@dollhouse_deviant"
            aria-label="Threads Profile URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">TikTok Profile URL</label>
          <input 
            type="text" 
            value={tiktok} 
            onChange={(e) => setTiktok(e.target.value)}
            placeholder="https://tiktok.com/@dollhouse_deviant"
            aria-label="TikTok Profile URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Tumblr Profile URL</label>
          <input 
            type="text" 
            value={tumblr} 
            onChange={(e) => setTumblr(e.target.value)}
            placeholder="https://dollhouse-deviant.tumblr.com"
            aria-label="Tumblr Profile URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
        </div>
      </div>
      
      <div className="flex justify-end">
        <ActionButton label={loading ? "Updating..." : "Update Socials"} onClick={handleUpdate} disabled={loading} />
      </div>
    </div>
  );
}

function WebhooksTab() {
  const [discordUrl, setDiscordUrl] = useState("");
  const [liveMessage, setLiveMessage] = useState("🚨 **Dollhouse Deviants is LIVE NOW!** 🚨\nJoin us in the DEV Locker: https://dollhousedeviants.com/dev-locker");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!db) return;
    const unsub = onSnapshot(doc(db, 'config', 'webhooks'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.discordUrl) setDiscordUrl(data.discordUrl);
        if (data.liveMessage) setLiveMessage(data.liveMessage);
      }
    });
    return () => unsub();
  }, []);

  const handleUpdate = async () => {
    if (!db) return;
    setLoading(true);
    try {
      await setDoc(doc(db, 'config', 'webhooks'), { discordUrl, liveMessage });
      alert("Webhook Configuration Updated.");
    } catch (error) {
      console.error("Error updating webhooks:", error);
      alert("Failed to update webhooks.");
    }
    setLoading(false);
  };

  const handleTest = async () => {
    if (!discordUrl) {
      alert("Please provide a Discord Webhook URL first.");
      return;
    }
    try {
      const response = await fetch(discordUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: `[TEST MESSAGE] ${liveMessage}` })
      });
      if (response.ok) {
        alert("Test webhook sent successfully!");
      } else {
        alert(`Failed to send test webhook: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error sending test webhook:", error);
      alert("Failed to send test webhook. Check console for details.");
    }
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="border-b border-[#2D2D2D] pb-4">
        <h2 className="text-3xl font-black uppercase tracking-widest">Webhook <span className="text-[#FF69B4]">Triggers</span></h2>
      </header>
      
      <div className="space-y-6 bg-[#1A1A1B] border border-[#2D2D2D] p-6 md:p-10">
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Discord Webhook URL</label>
          <input 
            type="text" 
            value={discordUrl} 
            onChange={(e) => setDiscordUrl(e.target.value)}
            placeholder="https://discord.com/api/webhooks/..."
            aria-label="Discord Webhook URL"
            className="min-h-[48px] w-full bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner" 
          />
          <p className="text-xs text-[#A3A3A3] font-mono mt-2">This URL will be hit with a POST request when Live Status is toggled ON.</p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-[#A3A3A3] mb-2">Live Notification Message</label>
          <textarea 
            value={liveMessage} 
            onChange={(e) => setLiveMessage(e.target.value)}
            rows={4}
            className="w-full bg-[#0a0a0a] border border-[#2D2D2D] p-4 text-white focus:border-[#FF69B4] focus:outline-none font-mono shadow-inner resize-y" 
          />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-end gap-4">
        <ActionButton label="Test Webhook" variant="secondary" onClick={handleTest} />
        <ActionButton label={loading ? "Updating..." : "Update Webhooks"} onClick={handleUpdate} disabled={loading} />
      </div>
    </div>
  );
}

function SquircleLabTab() {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [padding, setPadding] = useState<number>(20);
  const [bgColor, setBgColor] = useState<string>('#0a0a0a');
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleDownload = () => {
    if (!previewUrl || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      canvas.width = 512;
      canvas.height = 512;
      
      // Draw background
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, 512, 512);
      
      // Calculate padding
      const padPx = 512 * (padding / 100);
      const drawSize = 512 - (padPx * 2);
      
      // Draw image
      ctx.drawImage(img, padPx, padPx, drawSize, drawSize);
      
      // Download
      const link = document.createElement('a');
      link.download = 'pwa-icon-512x512.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    img.src = previewUrl;
  };

  return (
    <div className="animate-fade-in space-y-8">
      <header className="border-b border-[#2D2D2D] pb-4">
        <h2 className="text-3xl font-black uppercase tracking-widest">Squircle <span className="text-[#FF69B4]">Lab</span></h2>
      </header>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#1A1A1B] border border-[#2D2D2D] p-8 flex flex-col items-center justify-center">
          <p className="text-xs text-[#A3A3A3] font-mono uppercase tracking-widest mb-8 text-center">
            Samsung One UI Simulation
          </p>
          
          <div 
            className="relative w-56 h-56 rounded-[3rem] shadow-[0_0_40px_rgba(255,105,180,0.15)] border-2 border-[#2D2D2D] overflow-hidden flex items-center justify-center"
            style={{ backgroundColor: bgColor }}
          >
            {previewUrl ? (
              <SafeImage 
                src={previewUrl} 
                alt="Icon Preview" 
                className="w-full h-full object-contain transition-all duration-200" 
                style={{ padding: `${padding}%` }} 
              />
            ) : (
              <span className="text-[#2D2D2D] font-black uppercase tracking-widest text-sm text-center px-4">Upload Asset</span>
            )}
          </div>
        </div>

        <div className="bg-[#1A1A1B] border border-[#2D2D2D] p-8 flex flex-col justify-center space-y-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-bold uppercase tracking-widest text-white">Safe-Zone Padding</label>
              <span className="text-[#FF69B4] font-mono">{padding}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="40" 
              value={padding} 
              onChange={(e) => setPadding(Number(e.target.value))}
              aria-label="Icon Padding Adjustment"
              className="w-full h-2 bg-[#0a0a0a] rounded-lg appearance-none cursor-pointer accent-[#FF69B4]"
            />
            <p className="text-xs text-[#A3A3A3] font-mono mt-3">
              Adjust to ensure the logo does not clip the rounded corners on Android devices. W3C recommends ~20%.
            </p>
          </div>

          <div>
            <label className="text-sm font-bold uppercase tracking-widest text-white block mb-2">Background Color</label>
            <div className="flex gap-4">
              <input 
                type="color" 
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer bg-transparent border-0 p-0"
              />
              <input 
                type="text" 
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                aria-label="Preview Website URL"
                className="flex-1 bg-[#0a0a0a] border border-[#2D2D2D] px-4 text-white font-mono focus:border-[#FF69B4] focus:outline-none"
                placeholder="https://..." 
              />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <label className="min-h-[48px] flex items-center justify-center w-full bg-transparent border-2 border-[#2D2D2D] text-white hover:border-[#FF69B4] hover:text-[#FF69B4] cursor-pointer transition-all uppercase font-black tracking-widest text-sm">
              Select Local Image
              <input type="file" accept="image/png, image/jpeg, image/svg+xml" className="hidden" onChange={handleImageUpload} />
            </label>
            
            <button 
              onClick={handleDownload}
              disabled={!previewUrl}
              className={`min-h-[48px] flex items-center justify-center w-full border-2 uppercase font-black tracking-widest text-sm transition-all ${
                previewUrl 
                  ? 'bg-transparent border-[#FF69B4] text-[#FF69B4] hover:bg-[#FF69B4] hover:text-[#0a0a0a] shadow-[0_0_15px_rgba(255,105,180,0.3)]' 
                  : 'bg-[#0a0a0a] border-[#2D2D2D] text-[#2D2D2D] cursor-not-allowed'
              }`}
            >
              Export 512x512 PNG
            </button>
          </div>
        </div>
      </div>
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

function AssetDeploymentTab() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Digital Noir',
    description: '',
    target: 'Studio' // Studio only — Vault sealed
  });
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !storage) {
      if (!storage) setStatus({ type: 'error', msg: 'System Error: Storage offline.' });
      return;
    }

    setUploading(true);
    setStatus(null);

    try {
      // 1. Upload to Firebase Storage
      const area = 'studio';
      const storageRef = ref(
        storage,
        `gallery/${area}/${Date.now()}_${file.name}`
      );
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      // 2. Save Metadata to Firestore
      const collectionName = 'studioItems';
      await addDoc(collection(db, collectionName), {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        imageUrl: downloadURL,
        createdAt: serverTimestamp(),
        authorId: user?.uid
      });

      setStatus({ type: 'success', msg: 'Asset successfully deployed to the Sanctuary.' });
      setFormData({ title: '', category: 'Digital Noir', description: '', target: 'Studio' });
      setFile(null);
    } catch (error) {
      console.error(error);
      setStatus({ type: 'error', msg: 'Upload failed. Check system logs.' });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-8 w-full max-w-4xl mx-auto">
      <header className="border-b border-[#2D2D2D] pb-4">
        <h2 className="text-3xl font-black uppercase tracking-widest text-[#E5E5E5]">
          Asset <span className="text-[#FF69B4]">Deployment</span>
        </h2>
        <p className="text-xs text-[#A3A3A3] mt-2 uppercase tracking-[0.3em]">
          Central Command // Direct Override Protocol
        </p>
      </header>

      <form onSubmit={handleUpload} className="grid md:grid-cols-2 gap-8 md:gap-12">
        {/* LEFT: FILE UPLOAD */}
        <div className="space-y-6">
          <label className="block group cursor-pointer h-full">
            <div className="h-full min-h-[300px] bg-[#1A1A1B] border-2 border-dashed border-[#2D2D2D] rounded-[2rem] flex flex-col items-center justify-center group-hover:border-[#FF69B4]/50 transition-all overflow-hidden relative shadow-[inset_0_0_20px_rgba(0,0,0,0.5)]">
              {file ? (
                <div className="text-center p-4">
                  <ImageIcon className="mx-auto text-[#FF69B4] mb-2" size={32} />
                  <p className="text-xs text-white font-bold truncate max-w-[200px]">{file.name}</p>
                </div>
              ) : (
                <>
                  <Upload className="text-[#A3A3A3] mb-4 group-hover:text-[#FF69B4] transition-colors duration-500" size={48} />
                  <span className="text-xs uppercase font-bold tracking-widest text-[#A3A3A3]">Drop Asset Here</span>
                </>
              )}
            </div>
            <input 
              type="file" 
              className="hidden" 
              accept="image/*" 
              aria-label="URL Input"
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
            />
          </label>
        </div>

        {/* RIGHT: METADATA */}
        <div className="space-y-6 bg-[#1A1A1B] border border-[#2D2D2D] p-6 lg:p-8 rounded-[2rem]">
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-[#A3A3A3] ml-2">Deployment Target</label>
            <select 
              className="w-full bg-[#0a0a0a] border border-[#2D2D2D] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#FF69B4] shadow-inner font-mono text-sm"
              value={formData.target}
              onChange={(e) => setFormData({...formData, target: e.target.value})}
            >
              <option value="Studio">The Studio (SFW Gallery)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-[#A3A3A3] ml-2">Asset Title</label>
            <input 
              type="text" 
              placeholder="e.g. Waverly Shadows"
              aria-label="URL Input"
              className="w-full bg-[#0a0a0a] border border-[#2D2D2D] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#FF69B4] font-mono text-sm shadow-inner"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-[#A3A3A3] ml-2">Category (Studio Only)</label>
            <input 
              type="text" 
              placeholder="e.g. Digital Noir"
              aria-label="URL Input"
              className="w-full bg-[#0a0a0a] border border-[#2D2D2D] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#FF69B4] font-mono text-sm shadow-inner"
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold tracking-widest text-[#A3A3A3] ml-2">Description</label>
            <textarea 
              rows={3}
              placeholder="Technical notes or vibe description..."
              className="w-full bg-[#0a0a0a] border border-[#2D2D2D] rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#FF69B4] resize-none font-mono text-sm shadow-inner"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          {status && (
            <div className={`p-4 rounded-xl flex items-center gap-3 text-xs font-bold uppercase tracking-widest ${
              status.type === 'success' ? 'bg-[#00ff9d]/10 text-[#00ff9d] border border-[#00ff9d]/30' : 'bg-red-500/10 text-red-500 border border-red-500/30'
            }`}>
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {status.msg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={uploading || !file}
            className="w-full bg-transparent border-2 border-[#FF69B4] text-[#FF69B4] hover:bg-[#FF69B4] hover:text-[#0a0a0a] text-xs font-black py-5 rounded-xl uppercase tracking-[0.3em] transition-all duration-300 shadow-[0_0_15px_rgba(255,105,180,0.3)] hover:shadow-[0_0_25px_rgba(255,105,180,0.6)] disabled:opacity-50 flex justify-center items-center gap-2 mt-4"
          >
            {uploading ? <Loader2 className="animate-spin" size={16} /> : <Upload size={16} />}
            {uploading ? 'Deploying...' : 'Deploy to Sanctuary'}
          </button>
        </div>
      </form>
    </div>
  );
}
