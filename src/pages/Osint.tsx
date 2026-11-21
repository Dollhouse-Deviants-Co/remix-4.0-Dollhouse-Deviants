import React, { useEffect, useMemo, useRef, useState } from 'react';
import Layout from '../components/Layout';
import { Tooltip } from '../components/Tooltip';
import { useAccess } from '../context/AccessibilityContext';
import Radar from 'lucide-react/dist/esm/icons/radar';
import Globe from 'lucide-react/dist/esm/icons/globe';
import Network from 'lucide-react/dist/esm/icons/network';
import Link from 'lucide-react/dist/esm/icons/link';
import FolderSearch from 'lucide-react/dist/esm/icons/folder-search';
import Database from 'lucide-react/dist/esm/icons/database';
import ScanSearch from 'lucide-react/dist/esm/icons/scan-search';
import Mail from 'lucide-react/dist/esm/icons/mail';
import UserSearch from 'lucide-react/dist/esm/icons/user-search';
import Search from 'lucide-react/dist/esm/icons/search';
import Fingerprint from 'lucide-react/dist/esm/icons/fingerprint';
import Bug from 'lucide-react/dist/esm/icons/bug';
import KeyRound from 'lucide-react/dist/esm/icons/key-round';
import Hash from 'lucide-react/dist/esm/icons/hash';
import Lock from 'lucide-react/dist/esm/icons/lock';
import Zap from 'lucide-react/dist/esm/icons/zap';
import Wifi from 'lucide-react/dist/esm/icons/wifi';
import Bluetooth from 'lucide-react/dist/esm/icons/bluetooth';
import Camera from 'lucide-react/dist/esm/icons/camera';
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check';
import BookOpen from 'lucide-react/dist/esm/icons/book-open';
import Copy from 'lucide-react/dist/esm/icons/copy';
import Check from 'lucide-react/dist/esm/icons/check';
import Info from 'lucide-react/dist/esm/icons/info';
import TriangleAlert from 'lucide-react/dist/esm/icons/triangle-alert';
import Terminal from 'lucide-react/dist/esm/icons/terminal';
import Smartphone from 'lucide-react/dist/esm/icons/smartphone';

type IconComponent = React.ComponentType<{ size?: number | string; className?: string }>;
type ToolStatus = 'termux' | 'desktop';
type ToolCategory = 'recon' | 'web' | 'people' | 'pass' | 'radio' | 'privacy';

interface Tool {
  id: string;
  name: string;
  cat: ToolCategory;
  icon: IconComponent;
  status: ToolStatus;
  what: string;
  desc: string;
  label: string;
  placeholder: string;
  hint: string;
  note: string;
  build: (target: string) => string;
}

const CATEGORIES: { id: ToolCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All tools' },
  { id: 'recon', label: 'Recon' },
  { id: 'web', label: 'Web testing' },
  { id: 'people', label: 'People OSINT' },
  { id: 'pass', label: 'Passwords' },
  { id: 'radio', label: 'Wi-Fi · Bluetooth · Cameras' },
  { id: 'privacy', label: 'Privacy' },
];

const TOOLS: Tool[] = [
  {
    id: 'nmap', name: 'Nmap', cat: 'recon', icon: Radar, status: 'termux',
    what: 'Scans a network or host — finds live devices and open ports.',
    desc: 'The first tool to reach for. Finds what is on a network and which ports/services each device exposes.',
    label: 'Target — IP or your LAN range', placeholder: '192.168.1.0/24',
    hint: 'Use your own LAN range, e.g. 192.168.1.0/24, or one host like 192.168.1.1.',
    note: 'Install: pkg install nmap',
    build: (t) => `nmap -sV ${t || '192.168.1.0/24'}`,
  },
  {
    id: 'amass', name: 'Amass', cat: 'recon', icon: Globe, status: 'termux',
    what: 'Maps a domain’s subdomains and attack surface.',
    desc: 'Deep subdomain enumeration for a domain you own or are hired to test. Slower than Subfinder, more complete.',
    label: 'Domain', placeholder: 'example.com',
    hint: 'A domain you own or have permission to test.',
    note: 'Install: setup step 12 below (Go install of Amass v4).',
    build: (t) => `amass enum -d ${t || 'example.com'}`,
  },
  {
    id: 'subfinder', name: 'Subfinder', cat: 'recon', icon: Link, status: 'termux',
    what: 'Fast subdomain finder for a domain.',
    desc: 'Quick passive subdomain enumeration. Best first pass before Amass.',
    label: 'Domain', placeholder: 'example.com',
    hint: 'A domain you own or have permission to test.',
    note: 'Install via Go: go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest',
    build: (t) => `subfinder -d ${t || 'example.com'}`,
  },
  {
    id: 'httpx', name: 'HTTPX', cat: 'recon', icon: Network, status: 'termux',
    what: 'Checks which hosts/URLs are actually live on the web.',
    desc: 'Probes hosts and reports status codes, titles and tech — turns a subdomain list into a live target list.',
    label: 'Host or URL', placeholder: 'example.com',
    hint: 'One host, e.g. example.com.',
    note: 'Install via Go: go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest',
    build: (t) => `httpx -u ${t || 'example.com'} -title -status-code -tech-detect`,
  },
  {
    id: 'feroxbuster', name: 'Feroxbuster', cat: 'web', icon: FolderSearch, status: 'termux',
    what: 'Finds hidden folders and files on a website.',
    desc: 'Directory and file brute-forcing against a site you own or are testing with permission.',
    label: 'Site URL', placeholder: 'https://example.com',
    hint: 'Full URL of your own test site.',
    note: 'Install: pkg install feroxbuster. Download the wordlist first: curl -L https://raw.githubusercontent.com/danielmiessler/SecLists/master/Discovery/Web-Content/common.txt -o ~/common.txt — then run the command above. Replaces Gobuster, which is broken on this Termux.',
    build: (t) => `feroxbuster -u ${t || 'https://example.com'} -w ~/common.txt`,
  },
  {
    id: 'sqlmap', name: 'SQLMap', cat: 'web', icon: Database, status: 'termux',
    what: 'Tests a web page for SQL injection flaws.',
    desc: 'Automated SQL injection detection. Only against apps you own or are authorized to test — it can damage a database.',
    label: 'URL with a parameter', placeholder: 'https://example.com/page?id=1',
    hint: 'Must include a query parameter, e.g. ?id=1.',
    note: 'Install: pip only — there is no pkg package. Run: pip install sqlmap --break-system-packages (pkg install sqlmap will always fail with “Unable to locate package”). If pip says externally-managed-environment, --break-system-packages is the Termux fix.',
    build: (t) => `sqlmap -u "${t || 'https://example.com/page?id=1'}" --batch --dbs`,
  },
  {
    id: 'nikto', name: 'Nikto', cat: 'web', icon: ScanSearch, status: 'termux',
    what: 'Scans a web server for known-dangerous files and settings.',
    desc: 'Noisy but thorough web server scanner — outdated software, risky files, bad headers.',
    label: 'Site URL or host', placeholder: 'https://example.com',
    hint: 'Your own server or test target.',
    note: 'Install: pkg install nikto',
    build: (t) => `nikto -h ${t || 'https://example.com'}`,
  },
  {
    id: 'harvester', name: 'theHarvester', cat: 'people', icon: Mail, status: 'termux',
    what: 'Gathers emails, names and subdomains tied to a domain.',
    desc: 'OSINT collection from public sources — search engines, PGP servers, certificate logs.',
    label: 'Domain', placeholder: 'example.com',
    hint: 'A company or your own domain.',
    note: 'Install: git clone theHarvester, then pip install -r requirements.txt inside it.',
    build: (t) => `theHarvester -d ${t || 'example.com'} -b all`,
  },
  {
    id: 'maigret', name: 'Maigret', cat: 'people', icon: UserSearch, status: 'termux',
    what: 'Finds where a username is registered across hundreds of sites.',
    desc: 'Username OSINT across far more sites than Sherlock. Expect some false positives — verify before you rely on a hit. On Termux/Android the command below uses --dns-resolver threaded so it falls back to the system DNS resolver instead of aiodns.',
    label: 'Username', placeholder: 'username',
    hint: 'A username you are researching.',
    note: 'If you see “Too many errors of type Connecting failure (DNS)”, use --dns-resolver threaded — that is why the command above already includes it: on Termux/Android, aiodns fails DNS for most sites, and threaded falls back to the system DNS resolver. Install: do setup steps 5–6 first (prebuilt Termux dependencies, including cmake + c-ares), then on its own: pip install maigret --break-system-packages. Do NOT pip install cryptography — it fails to build on Android aarch64. pycares comes from aiodns, it needs CMake, and it fails with “RuntimeError: CMake >= 3.5 is required to build pycares” when CMake is missing — cmake + c-ares from step 5 are the fix, and pip builds pycares from source. python-pycares does NOT exist as a Termux package, do not try to pkg install it.',
    build: (t) => `maigret --dns-resolver threaded ${t || 'username'}`,
  },
  {
    id: 'sherlock', name: 'Sherlock', cat: 'people', icon: Search, status: 'termux',
    what: 'Checks a username on ~400 social networks.',
    desc: 'The classic username hunter. Maigret covers more sites; Sherlock is the simpler, lighter option.',
    label: 'Username', placeholder: 'username',
    hint: 'A username you are researching.',
    note: 'Install: git clone Sherlock, then pip install -r requirements.txt inside it.',
    build: (t) => `sherlock ${t || 'username'}`,
  },
  {
    id: 'holehe', name: 'Holehe', cat: 'people', icon: Fingerprint, status: 'termux',
    what: 'Checks which sites an email address has accounts on.',
    desc: 'Uses each site’s password-reset flow to test whether an email is registered — no password needed, nothing is sent to the inbox.',
    label: 'Email address', placeholder: 'name@example.com',
    hint: 'An email you own or are authorized to check.',
    note: 'Install: do setup steps 5–6 first (prebuilt Termux dependencies), then on its own: pip install holehe --break-system-packages. Do NOT pip install cryptography — it fails to build on Android aarch64. If a build still fails, the last 20 lines name the wheel that failed.',
    build: (t) => `holehe ${t || 'name@example.com'}`,
  },
  {
    id: 'spiderfoot', name: 'SpiderFoot', cat: 'people', icon: Bug, status: 'desktop',
    what: 'Automated OSINT sweep on a domain, IP, email or name.',
    desc: 'Runs 200+ data sources in one sweep. It works in Termux but is heavy and slow on a phone — run it on your Surface or Toshiba and view results in its web UI.',
    label: 'Target', placeholder: 'example.com',
    hint: 'Domain, IP, email or name.',
    note: 'Best on desktop. Phone: expect long scans and heavy battery use.',
    build: (t) => `sf.py -s ${t || 'example.com'}`,
  },
  {
    id: 'hydra', name: 'Hydra', cat: 'pass', icon: KeyRound, status: 'termux',
    what: 'Brute-force login tester for SSH, FTP and more — your lab only.',
    desc: 'Tries username/password lists against a login service. For checking your own devices’ password strength in your own lab. Pointing it anywhere else is an attack, not a test.',
    label: 'Target host IP', placeholder: '192.168.1.10',
    hint: 'Your own lab device. Command tests its SSH login with the rockyou wordlist.',
    note: 'Install: NOT pkg install hydra in the main repo — it is thc-hydra in tur-repo. Run: pkg install tur-repo, then pkg update, then pkg install thc-hydra. Fallback: pkg install root-repo, then pkg install hydra. Edit -l for the username you are testing.',
    build: (t) => `hydra -l admin -P ~/wordlists/rockyou.txt ssh://${t || '192.168.1.10'}`,
  },
  {
    id: 'hashid', name: 'Hash-Identifier', cat: 'pass', icon: Hash, status: 'termux',
    what: 'Tells you what type a hash string is.',
    desc: 'Paste a hash, get the likely algorithm (MD5, SHA, bcrypt…) so you know which cracking tool and mode to use.',
    label: 'Hash string', placeholder: '5d41402abc4b2a76b9719d911017c592',
    hint: 'The full hash, no spaces.',
    note: 'Install: git clone Hash-Identifier, or use a pip hash identifier of your choice.',
    build: (t) => `hash-identifier "${t || 'PASTE-HASH'}"`,
  },
  {
    id: 'john', name: 'John the Ripper', cat: 'pass', icon: Lock, status: 'termux',
    what: 'Cracks password hashes — slow on a phone.',
    desc: 'Legendary hash cracker. It runs in Termux, but a phone CPU crawls: fine for a quick lab hash, use Hashcat on desktop for real lists.',
    label: 'Hash file name', placeholder: 'hashes.txt',
    hint: 'A file in your Termux home folder containing your lab hashes.',
    note: 'Install: pkg install john',
    build: (t) => `john --wordlist=~/wordlists/rockyou.txt ${t || 'hashes.txt'}`,
  },
  {
    id: 'hashcat', name: 'Hashcat', cat: 'pass', icon: Zap, status: 'desktop',
    what: 'Fastest hash cracker — needs a real GPU.',
    desc: 'Listed so you know it from the grid: Hashcat is the desktop GPU cracker. On a phone it is a slideshow. Run it on your Surface / Toshiba.',
    label: 'Hash file name', placeholder: 'hashes.txt',
    hint: 'Mode 22000 is WPA; mode 0 is MD5 — change -m to match your hash type.',
    note: 'Desktop only. “HxcHashCat” in the grid is the same tool, not a second one.',
    build: (t) => `hashcat -m 22000 -a 0 ${t || 'hashes.txt'} rockyou.txt`,
  },
  {
    id: 'wifiscan', name: 'Wi-Fi Scan', cat: 'radio', icon: Wifi, status: 'termux',
    what: 'Lists devices and services on the Wi-Fi network you’re joined to.',
    desc: 'What the phone genuinely can do: once you are connected to your own Wi-Fi, sweep it and see every device, its open ports and services. It cannot capture WPA handshakes or deauth — that needs monitor mode (ESP32 Marauder / Flipper / desktop adapter).',
    label: 'Your LAN range', placeholder: '192.168.1.0/24',
    hint: 'Find it in your phone’s Wi-Fi details — usually 192.168.1.0/24 or 192.168.0.0/24.',
    note: 'Install: pkg install nmap. -sn = ping sweep, discovery only.',
    build: (t) => `nmap -sn ${t || '192.168.1.0/24'}`,
  },
  {
    id: 'btscan', name: 'Bluetooth Scan', cat: 'radio', icon: Bluetooth, status: 'termux',
    what: 'Discovers nearby Bluetooth & BLE devices — including non-discoverable BLE.',
    desc: 'BLE devices advertise constantly, so this finds trackers, watches, earbuds and beacons even when they are not in pairing mode. A silent classic-Bluetooth device with discovery off will not appear — catching those needs an Ubertooth or ESP32 sniffer.',
    label: 'Scan length in seconds', placeholder: '20',
    hint: 'Longer = more devices found. 20–30 seconds is a good sweep.',
    note: 'Needs Termux:API + bluetooth permission, or run: pkg install bluez, then hcitool lescan. Stop anytime with Ctrl+C.',
    build: (t) => {
      const s = parseInt(t, 10);
      return `timeout ${Number.isNaN(s) || s < 1 ? 20 : s} bluetoothctl scan on`;
    },
  },
  {
    id: 'camfind', name: 'Camera Finder', cat: 'radio', icon: Camera, status: 'termux',
    what: 'Finds IP cameras (RTSP / ONVIF) on your own network.',
    desc: 'Sweeps your LAN for the ports cameras stream on — 554 (RTSP), 8554, 2020 and 80/8080 with ONVIF — and prints likely camera addresses so you can audit your own cameras’ settings and passwords.',
    label: 'Your LAN range', placeholder: '192.168.1.0/24',
    hint: 'Your own network only.',
    note: 'Install: pkg install nmap. Open a found address in VLC as rtsp:// to verify it is yours.',
    build: (t) => `nmap -p 554,8554,2020,80,8080 --open -sV --script rtsp-sdp ${t || '192.168.1.0/24'}`,
  },
  {
    id: 'torcheck', name: 'Tor Check', cat: 'privacy', icon: ShieldCheck, status: 'termux',
    what: 'Starts Tor and verifies your traffic is routed through it.',
    desc: 'Starts the Tor service in Termux and checks the exit — confirms you are actually anonymous before you browse, not just hoping.',
    label: '', placeholder: '',
    hint: '',
    note: 'Install: pkg install tor. For app-level Tor on Android, use Orbot from F-Droid.',
    build: () => 'tor & sleep 5 && curl -s https://check.torproject.org/api/ip',
  },
  {
    id: 'wayback', name: 'Wayback', cat: 'recon', icon: BookOpen, status: 'termux',
    what: 'Pulls archived snapshots of a page from the Wayback Machine.',
    desc: 'See what a page used to say — deleted posts, old prices, changed claims. Pure OSINT gold, no install needed, just curl.',
    label: 'Domain or URL', placeholder: 'example.com',
    hint: 'Returns the list of archived snapshot timestamps.',
    note: 'No install needed — uses curl, already in Termux.',
    build: (t) => `curl -s "http://archive.org/wayback/available?url=${t || 'example.com'}"`,
  },
];

interface SetupStep {
  title: string;
  text: string;
  cmd: string;
}

const SETUP_STEPS: SetupStep[] = [
  {
    title: '1 · Storage access',
    text: 'Lets Termux see your Downloads folder, where the scripts live.',
    cmd: 'termux-setup-storage',
  },
  {
    title: '2 · Update Termux',
    text: 'Refresh the package lists, then upgrade what is installed. Do not skip this — Feroxbuster and other main-repo packages only appear after a fresh pkg update.',
    cmd: 'pkg update -y && pkg upgrade -y',
  },
  {
    title: '3 · Core tools',
    text: 'The pkg-installable tools from the grid, in one line. Feroxbuster and dirb are in this line — they are in the main repo, but only after the fresh update in step 2. SQLMap and Hydra are NOT in this line: they are not main-repo pkg packages, so they install in steps 4 and 9 instead.',
    cmd: 'pkg install -y python git golang curl wget nmap feroxbuster dirb nikto john whois tor bluez',
  },
  {
    title: '4 · SQLMap',
    text: 'SQLMap is pip only — there is no pkg package, so pkg install sqlmap will always say “Unable to locate package”. If pip says externally-managed-environment, --break-system-packages is the Termux fix. If a build still fails, the last 20 lines name the wheel that failed.',
    cmd: 'pip install sqlmap --break-system-packages',
  },
  {
    title: '5 · Build dependencies for Holehe + Maigret',
    text: 'Do these BEFORE Holehe or Maigret — bare pip install holehe maigret does not build in Termux. These are the prebuilt Termux build dependencies they need, so pip is not compiling everything from source. cmake and c-ares are in this line for pycares: pycares comes from aiodns (a Maigret dependency), it needs CMake, and it fails with “RuntimeError: CMake >= 3.5 is required to build pycares” if CMake is missing — if pip still tries to build pycares, cmake + c-ares are the fix.',
    cmd: 'pkg install clang make pkg-config libffi openssl libxml2 libxslt libjpeg-turbo zlib freetype rust binutils cmake c-ares',
  },
  {
    title: '6 · Prebuilt cryptography + lxml',
    text: 'Prebuilt Termux builds of cryptography and lxml. python-pycares does NOT exist in Termux main, so it is not in this line — do not try to pkg install it. Instead, pip builds pycares from source when Maigret installs in step 8, using cmake + c-ares from step 5. Do NOT pip install cryptography — it fails to build on Android aarch64 and shadows the working pkg build. This pkg version is the one Holehe and Maigret should use.',
    cmd: 'pkg install -y python-cryptography python-lxml',
  },
  {
    title: '7 · Holehe — on its own',
    text: 'Install Holehe separately, one tool at a time — do not combine it with Maigret in one pip line. If pip says externally-managed-environment, --break-system-packages is the Termux fix. If a build still fails, the last 20 lines name the wheel that failed.',
    cmd: 'pip install holehe --break-system-packages',
  },
  {
    title: '8 · Maigret — on its own',
    text: 'Install Maigret separately, after Holehe finishes. pycares comes from aiodns, it needs CMake, and it fails with “RuntimeError: CMake >= 3.5 is required to build pycares” when CMake is missing — steps 5–6 install cmake and c-ares, and pip builds pycares from source. If pip says externally-managed-environment, --break-system-packages is the Termux fix. If a build still fails, the last 20 lines name the wheel that failed.',
    cmd: 'pip install maigret --break-system-packages',
  },
  {
    title: '9 · Hydra (THC-Hydra)',
    text: 'Hydra is NOT pkg install hydra in the main repo — it is thc-hydra in tur-repo. Run the line below (it does pkg install tur-repo, then pkg update, then pkg install thc-hydra, in order). Fallback if that fails: pkg install root-repo, then pkg update, then pkg install hydra.',
    cmd: 'pkg install tur-repo && pkg update && pkg install thc-hydra',
  },
  {
    title: '10 · Fix a bad mirror — termux-tools first, then change repo',
    text: 'Use this if Feroxbuster still says “Unable to locate package” after a fresh pkg update, or if your mirror is bad. termux-change-repo is NOT a built-in command that always exists — it comes with the termux-tools package, so on a fresh install it says “command not found” until you install that package. Run the line below in order: it installs termux-tools first, then runs termux-change-repo (pick Main, Single Mirror, Grimler), then runs pkg update. After that, re-run step 3.',
    cmd: 'pkg install termux-tools -y && termux-change-repo && pkg update',
  },
  {
    title: '10b · Manual fallback (1 of 2) — rewrite sources.list in nano',
    text: 'If termux-change-repo is STILL “command not found” after step 10, do it by hand. Open the file in nano, delete everything in the file and replace the WHOLE file with exactly this one line, nothing else: deb https://packages.termux.dev/apt/termux-main stable main — then save with Ctrl+O, Enter, and exit with Ctrl+X.',
    cmd: 'nano $PREFIX/etc/apt/sources.list',
  },
  {
    title: '10c · Manual fallback (2 of 2) — update, then install termux-tools',
    text: 'After saving sources.list in step 10b, run the line below. It refreshes your package lists from the official Termux repo first, then installs termux-tools — so termux-change-repo will exist from now on.',
    cmd: 'pkg update && pkg install termux-tools -y',
  },
  {
    title: '11 · Go recon tools',
    text: 'Subfinder and HTTPX, built from source with Go.',
    cmd: 'go install -v github.com/projectdiscovery/subfinder/v2/cmd/subfinder@latest && go install -v github.com/projectdiscovery/httpx/cmd/httpx@latest',
  },
  {
    title: '12 · Amass',
    text: 'Subdomain mapping. Large Go build — give it a few minutes.',
    cmd: 'go install -v github.com/owasp-amass/amass/v4/...@master',
  },
  {
    title: '13 · Git-clone tools',
    text: 'Sherlock, theHarvester and Hash-Identifier are git clones with pip requirements, one folder each.',
    cmd: 'cd ~ && git clone https://github.com/sherlock-project/sherlock.git && git clone https://github.com/laramies/theHarvester.git && git clone https://github.com/An0nUD4Y/Hash-Identifier.git',
  },
  {
    title: '14 · Install their requirements',
    text: 'Run inside each cloned folder. Use the prebuilt python-cryptography from step 6 so pip does not compile it — do NOT pip install cryptography.',
    cmd: 'cd ~/sherlock && pip install -r requirements.txt && cd ~/theHarvester && pip install -r requirements/base.txt',
  },
  {
    title: '15 · Make “hub” a command',
    text: 'Optional: type hub anywhere in Termux to reopen your menu script, if you saved dd-termux-hub.sh to your home folder.',
    cmd: 'echo "alias hub=\'bash ~/dd-termux-hub.sh\'" >> ~/.bashrc',
  },
];

const DISCOVERY_NOTES: { icon: IconComponent; title: string; body: string }[] = [
  {
    icon: Wifi,
    title: 'Wi-Fi discovery — works on the phone',
    body: 'Lists every network and device on your own LAN. Tap the Wi-Fi Scan or Nmap tile for the command. Cracking a Wi-Fi password (WPA handshake + dictionary) needs monitor mode — stock Android Wi-Fi can’t do it. That job is ESP32 Marauder or a Flipper, or Aircrack-ng on your Surface with a USB adapter.',
  },
  {
    icon: Bluetooth,
    title: 'Bluetooth discovery — including hidden',
    body: 'The Bluetooth Scan tile finds BLE devices that are advertising — including ones not set to “discoverable,” because BLE beacons broadcast anyway. A classic Bluetooth device with discovery fully off stays silent until it talks; finding those needs an Ubertooth or ESP32 sniffer. No app gets around that — it’s the radio, not the software.',
  },
  {
    icon: Camera,
    title: 'Camera discovery — works on your LAN',
    body: 'The Camera Finder tile scans your own network for RTSP / ONVIF camera streams and prints their addresses. Only run it on a network you own. Testing default logins on a camera that isn’t yours is off-limits — on your own cameras, it’s how you check they aren’t still on factory passwords.',
  },
  {
    icon: KeyRound,
    title: 'Brute-force logins — your lab only',
    body: 'The Hydra tile builds the login-testing command (SSH, FTP, router admin, etc.) against your own lab devices. Point it at anything you don’t own and it’s no longer pentesting.',
  },
];

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (timer.current !== null) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
      className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-[#FF69B4]/50 bg-[#FF1E89]/10 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#FF1E89] hover:text-white focus-visible:outline-2 focus-visible:outline-[#00E5FF]"
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export default function Osint() {
  const { isSimplifiedMode } = useAccess();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<ToolCategory | 'all'>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [target, setTarget] = useState('');
  const [copiedCmd, setCopiedCmd] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const copyTimer = useRef<number | null>(null);

  useEffect(() => {
    document.title = 'Deviant OSINT | Dollhouse Deviants';
  }, []);

  useEffect(() => {
    return () => {
      if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    };
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (category !== 'all' && tool.cat !== category) return false;
      if (!q) return true;
      return `${tool.name} ${tool.what} ${tool.desc}`.toLowerCase().includes(q);
    });
  }, [query, category]);

  const selected = selectedId ? TOOLS.find((t) => t.id === selectedId) ?? null : null;
  const builtCommand = selected ? selected.build(target.trim()) : '';

  const selectTool = (id: string) => {
    setSelectedId(id);
    setTarget('');
    setCopiedCmd(false);
  };

  useEffect(() => {
    if (selectedId) detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [selectedId]);

  const copyCommand = async () => {
    if (!builtCommand) return;
    try {
      await navigator.clipboard.writeText(builtCommand);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = builtCommand;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setCopiedCmd(true);
    if (copyTimer.current !== null) window.clearTimeout(copyTimer.current);
    copyTimer.current = window.setTimeout(() => setCopiedCmd(false), 2000);
  };

  const glow = isSimplifiedMode ? '' : 'glow-shift glow-auto glow-s9';

  return (
    <Layout>
      <div className="w-full max-w-6xl">
        <header className="mb-10 text-center">
          <p className="font-mono text-[11px] uppercase tracking-[0.4em] text-[#00E5FF]">
            Free · No paywall · No sign-in
          </p>
          <h1 className={`mt-4 text-5xl font-black uppercase tracking-tighter text-white md:text-7xl ${glow}`}>
            Deviant <span className="text-[#FF1E89]">OSINT</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-zinc-400">
            Your tap-and-go hub for the Termux security &amp; OSINT toolkit. Tap a tool, type the target,
            copy the ready-built command, paste it in Termux — it runs.
          </p>
          <p className="mx-auto mt-4 flex max-w-2xl items-start gap-2 rounded-sm border border-[#FF3131]/50 bg-[#FF3131]/10 p-3 text-left text-sm text-zinc-200">
            <TriangleAlert size={18} className="mt-0.5 shrink-0 text-[#FF3131]" aria-hidden="true" />
            <span>
              <strong>Use only on your own devices, your own network, or with written permission.</strong>
              {' '}A web page can’t run Termux scripts by itself — Android won’t let it. Each tile builds
              the exact command for you. One tap copies it; paste into Termux and press Enter.
            </span>
          </p>
        </header>

        {/* Search + category filter */}
        <div className="mb-8 flex flex-col gap-4">
          <label htmlFor="osint-search" className="sr-only">Search tools</label>
          <div className="flex items-center gap-2 rounded-sm border border-zinc-800 bg-zinc-900/60 px-4">
            <Search size={18} className="shrink-0 text-zinc-500" aria-hidden="true" />
            <input
              id="osint-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search tools — try “username”, “wifi”, or “hash”"
              className="w-full bg-transparent py-3 text-white placeholder:text-zinc-500 focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter tools by category">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setCategory(cat.id)}
                aria-pressed={category === cat.id}
                className={`rounded-full border px-4 py-2 text-[11px] font-black uppercase tracking-widest transition-colors ${
                  category === cat.id
                    ? 'border-[#FF69B4] bg-[#FF1E89] text-white'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400 hover:border-zinc-600 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool grid */}
        {filtered.length === 0 ? (
          <p className="rounded-sm border border-zinc-800 bg-zinc-900/60 p-6 text-center text-zinc-400">
            No tool matches that search. Clear the search or pick a different category.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3" aria-label="OSINT tools">
            {filtered.map((tool) => {
              const Icon = tool.icon;
              const active = selectedId === tool.id;
              return (
                <li key={tool.id}>
                  <Tooltip content={tool.what}>
                    <button
                      type="button"
                      onClick={() => selectTool(tool.id)}
                      aria-pressed={active}
                      aria-label={`${tool.name} — ${tool.what}`}
                      className={`flex h-full w-full flex-col rounded-[1.5rem] border bg-zinc-900/40 p-5 text-left transition-all duration-300 focus-visible:outline-2 focus-visible:outline-[#00E5FF] ${
                        active
                          ? 'border-[#FF69B4] shadow-[0_0_20px_rgba(255,30,137,0.3)]'
                          : 'border-zinc-800 hover:border-[#FF69B4]/50 hover:shadow-[0_0_20px_rgba(255,105,180,0.1)]'
                      }`}
                    >
                      <span className="mb-3 flex items-center justify-between">
                        <Icon size={32} className="text-[#00E5FF]" aria-hidden="true" />
                        <span
                          className={`rounded-full border px-2 py-1 text-[10px] font-black uppercase tracking-widest ${
                            tool.status === 'termux'
                              ? 'border-[#00E5FF]/40 text-[#00E5FF]'
                              : 'border-[#FF5F1F]/40 text-[#FF5F1F]'
                          }`}
                        >
                          {tool.status === 'termux' ? 'Works in Termux' : 'Desktop best'}
                        </span>
                      </span>
                      <span className="text-lg font-black uppercase tracking-tight text-white">{tool.name}</span>
                      <span className="mt-1 text-sm leading-relaxed text-zinc-400">{tool.what}</span>
                    </button>
                  </Tooltip>
                </li>
              );
            })}
          </ul>
        )}

        {/* Selected tool — live command builder */}
        {selected && (
          <section
            ref={detailRef}
            aria-label={`${selected.name} command builder`}
            className="mt-8 rounded-[1.5rem] border border-[#FF69B4]/50 bg-zinc-900/60 p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">{selected.name}</h2>
                <p className="mt-1 max-w-2xl text-sm leading-relaxed text-zinc-400">{selected.desc}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(null)}
                className="rounded-sm border border-zinc-700 px-3 py-2 text-[11px] font-black uppercase tracking-widest text-zinc-300 hover:border-white hover:text-white"
              >
                Close
              </button>
            </div>
            {selected.label ? (
              <div className="mt-5">
                <label htmlFor="osint-target" className="mb-2 block text-[11px] font-black uppercase tracking-widest text-zinc-300">
                  {selected.label}
                </label>
                <input
                  id="osint-target"
                  type="text"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  placeholder={selected.placeholder}
                  autoComplete="off"
                  className="w-full rounded-sm border border-zinc-700 bg-black px-4 py-3 font-mono text-white placeholder:text-zinc-600 focus:border-[#FF69B4] focus:outline-none"
                />
                {selected.hint ? <p className="mt-2 text-xs text-zinc-500">{selected.hint}</p> : null}
              </div>
            ) : null}
            <div className="mt-5">
              <p className="mb-2 text-[11px] font-black uppercase tracking-widest text-zinc-300">Run this in Termux</p>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
                <code className="min-w-0 flex-1 break-all rounded-sm border border-zinc-800 bg-black p-4 font-mono text-sm text-[#00E5FF]">
                  {builtCommand}
                </code>
                <button
                  type="button"
                  onClick={copyCommand}
                  aria-label={copiedCmd ? 'Command copied' : 'Copy command'}
                  className="inline-flex shrink-0 items-center gap-2 rounded-sm border border-[#FF69B4]/50 bg-[#FF1E89]/10 px-4 py-3 text-[11px] font-black uppercase tracking-widest text-white transition-colors hover:bg-[#FF1E89] focus-visible:outline-2 focus-visible:outline-[#00E5FF]"
                >
                  {copiedCmd ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
                  {copiedCmd ? 'Copied' : 'Copy command'}
                </button>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-zinc-400">{selected.note}</p>
            </div>
          </section>
        )}

        {/* Discovery limits */}
        <section aria-labelledby="osint-discovery" className="mt-16">
          <h2 id="osint-discovery" className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
            Wi-Fi, Bluetooth &amp; camera discovery
          </h2>
          <p className="mb-6 text-sm text-zinc-400">
            The three you asked for, straight: what the phone can do alone, and where it stops.
          </p>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {DISCOVERY_NOTES.map((item) => {
              const Icon = item.icon;
              return (
                <article key={item.title} className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900/40 p-5">
                  <h3 className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-white">
                    <Icon size={18} className="shrink-0 text-[#00E5FF]" aria-hidden="true" />
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.body}</p>
                </article>
              );
            })}
          </div>
        </section>

        {/* First-time setup */}
        <section aria-labelledby="osint-setup" className="mt-16">
          <h2 id="osint-setup" className="mb-2 text-2xl font-black uppercase tracking-tight text-white">
            First-time setup
          </h2>
          <p className="mb-2 text-sm text-zinc-400">
            Install Termux from F-Droid (the Play Store version is dead), then run these in Termux — one line
            at a time, Enter, wait for the prompt.
          </p>
          <p className="mb-6 flex items-start gap-2 rounded-sm border border-[#FF3131]/50 bg-[#FF3131]/10 p-3 text-sm text-zinc-200">
            <TriangleAlert size={18} className="mt-0.5 shrink-0 text-[#FF3131]" aria-hidden="true" />
            <span>
              If Termux came from the Google Play Store, stop — it will fail. The Play Store version has been
              abandoned since 2020, its package lists are stale, and installs fail with “Unable to locate
              package.” Uninstall it and install Termux from F-Droid instead, then run the steps below.
            </span>
          </p>
          <ol className="space-y-4">
            {SETUP_STEPS.map((step) => (
              <li key={step.title} className="rounded-[1.5rem] border border-zinc-800 bg-zinc-900/40 p-5">
                <h3 className="text-sm font-black uppercase tracking-widest text-white">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{step.text}</p>
                <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <code className="min-w-0 flex-1 break-all rounded-sm border border-zinc-800 bg-black p-3 font-mono text-xs text-[#00E5FF]">
                    {step.cmd}
                  </code>
                  <CopyButton text={step.cmd} label={step.title} />
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Real home-screen tap-to-run */}
        <section aria-labelledby="osint-widget" className="mt-16 rounded-[1.5rem] border border-zinc-800 bg-zinc-900/40 p-6">
          <h2 id="osint-widget" className="flex items-center gap-2 text-2xl font-black uppercase tracking-tight text-white">
            <Smartphone size={22} className="text-[#00E5FF]" aria-hidden="true" />
            Real home-screen tap-to-run
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            This page builds the command; it can’t run Termux by itself. For true one-tap home-screen
            launching, install <strong className="text-white">Termux:Widget</strong> from F-Droid, then use
            the shortcut pack from the Deviant OSINT repo — one script that creates a ready-made launcher in{' '}
            <code className="font-mono text-[#00E5FF]">~/.shortcuts/</code> for every tool above, each one
            prompting for its target and running it. Long-press your home screen → Widgets → Termux:Widget →
            pick a tool. That widget is your home-screen icon; tapping it runs the script, no typing.
          </p>
          <p className="mt-3 flex items-start gap-2 text-sm text-zinc-400">
            <Info size={16} className="mt-0.5 shrink-0 text-[#00E5FF]" aria-hidden="true" />
            <span>
              The shortcut pack and the Termux menu hub (<code className="font-mono text-[#00E5FF]">dd-termux-hub.sh</code>)
              ship in the Deviant OSINT repo alongside this page. Tools marked “Desktop best” are listed so
              you know what they are; they need your Surface or Toshiba, not the phone.
            </span>
          </p>
          <p className="mt-4 flex items-start gap-2 text-sm text-zinc-400">
            <Terminal size={16} className="mt-0.5 shrink-0 text-[#00E5FF]" aria-hidden="true" />
            <span>
              Add this page itself to your home screen from Brave: open{' '}
              <code className="font-mono text-[#00E5FF]">dollhousedeviants.com/osint</code> in Brave, tap ⋮,
              then Add to Home screen. It uses this site’s DD icon.
            </span>
          </p>
        </section>

        <p className="mt-10 text-center text-xs uppercase tracking-[0.3em] text-zinc-600">
          Deviant OSINT — free, for your own lab and your own networks.
        </p>
      </div>
    </Layout>
  );
}
