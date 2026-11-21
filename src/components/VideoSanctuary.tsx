import React, { useEffect, useRef, useState } from 'react';
import { Captions, Download, Focus, Languages, Link2, ShieldAlert, Sparkles, Upload, X } from 'lucide-react';
import { useAccess, COLOR_BLIND_PALETTES } from '../context/AccessibilityContext';
import { Tooltip } from './Tooltip';
import {
  VIDEO_PALETTE_FILTERS,
  getUpscalerProvider,
  looksLikeSrt,
  makeTrackId,
  srtToVtt,
  type SubtitleTrack,
  type SubtitleTrackInput,
} from '../lib/deviantMultimediaEngine';

/**
 * Deviant Multimedia Engine — the player (audio AND video).
 *
 * Everything here works inside the player; the viewer never has to leave it:
 * - Subtitles: attach .vtt/.srt files or a subtitle URL in any language,
 *   pick the active track, download an attached copy. Opening the subtitle
 *   panel pauses the video. kind="descriptions" tracks are listed as audio
 *   description tracks for screen-reader users.
 * - Video palettes: the same 7 typed palettes as the site, following the
 *   site palette by default or overridden per player, persisted with the
 *   other accessibility settings. Settings combine freely — high contrast
 *   AND a dyslexic-friendly font AND a palette can all be on at once.
 * - No-flash curtain: when a film carries flash warnings, a curtain covers
 *   it and names exactly what is hidden (flashing lights, swift
 *   camera-angle changes, multiple shot jumps…). Nothing reaches the
 *   viewer by surprise; only they can lift it.
 * - Focus mode: kills animations, sliding windows and motion inside the
 *   player (and follows the site Safe Motion setting too).
 * - Upscaler: a real plugin point (see deviantMultimediaEngine.ts). With
 *   no provider registered the player says so honestly and the button
 *   stays disabled — there is no fake upscaler here.
 *
 * Not wired into any page yet: no video asset exists on the site to point
 * it at (ShortFilmHero is also unused). Wiring it into a page is a
 * Sonja decision once a real film/asset is chosen.
 */

interface VideoSanctuaryProps {
  src: string;
  title: string;
  synopsis: string;
  poster?: string;
  /** Built-in subtitle / caption / audio-description tracks. */
  tracks?: SubtitleTrackInput[];
  /**
   * What the no-flash curtain must name, in plain words, e.g.
   * ["Flashing lights", "Swift camera-angle changes", "Multiple shot jumps"].
   * Empty (default) = no curtain.
   */
  flashWarnings?: string[];
}

const OFF_TRACK = 'off';

const VideoSanctuary: React.FC<VideoSanctuaryProps> = ({
  src,
  title,
  synopsis,
  poster,
  tracks = [],
  flashWarnings = [],
}) => {
  const videoId = `video-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const {
    colorBlindPalette,
    videoPalette,
    setVideoPalette,
    dmeFocusMode,
    toggleDmeFocusMode,
    reduceMotion,
    dmeCurtainsLifted,
    liftDmeCurtain,
    coverDmeCurtain,
  } = useAccess();

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [attachedTracks, setAttachedTracks] = useState<SubtitleTrack[]>(
    tracks.map((t) => ({ ...t, id: makeTrackId(), userAttached: false })),
  );
  const [activeTrackId, setActiveTrackId] = useState<string>(OFF_TRACK);
  const [subtitlePanelOpen, setSubtitlePanelOpen] = useState(false);
  const [attachUrl, setAttachUrl] = useState('');
  const [attachLang, setAttachLang] = useState('');
  const [status, setStatus] = useState('');
  const [upscaledSrc, setUpscaledSrc] = useState<string | null>(null);
  const [upscaleLabel, setUpscaleLabel] = useState('');
  const [upscaleWorking, setUpscaleWorking] = useState(false);

  const curtainLifted = dmeCurtainsLifted.includes(videoId);
  const curtained = flashWarnings.length > 0 && !curtainLifted;

  // Effective video palette: the player override wins, otherwise the site palette.
  const effectivePalette = videoPalette === 'site' ? colorBlindPalette : videoPalette;
  const videoFilter = VIDEO_PALETTE_FILTERS[effectivePalette];

  // Player focus mode: the engine toggle, or the site Safe Motion setting.
  const playerFocusMode = dmeFocusMode || reduceMotion;

  const provider = getUpscalerProvider();
  const currentSrc = upscaledSrc ?? src;

  // Apply the chosen subtitle track to the video element. <track> elements
  // render in the same order as attachedTracks, so indexes line up.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const list = video.textTracks;
    for (let i = 0; i < list.length; i += 1) {
      const track = attachedTracks[i];
      list[i].mode = track && track.id === activeTrackId ? 'showing' : 'disabled';
    }
  }, [activeTrackId, attachedTracks]);

  const pauseVideo = () => {
    videoRef.current?.pause();
  };

  const toggleSubtitlePanel = () => {
    if (!subtitlePanelOpen) pauseVideo();
    setSubtitlePanelOpen((v) => !v);
  };

  const addTrackFromText = (text: string, label: string, srclang: string) => {
    const vtt = looksLikeSrt(text) ? srtToVtt(text) : text;
    const blob = new Blob([vtt], { type: 'text/vtt' });
    const blobUrl = URL.createObjectURL(blob);
    const track: SubtitleTrack = {
      id: makeTrackId(),
      src: blobUrl,
      blobUrl,
      srclang: srclang.trim() || 'und',
      label,
      kind: 'subtitles',
      userAttached: true,
    };
    setAttachedTracks((prev) => [...prev, track]);
    setActiveTrackId(track.id);
    setStatus(`Subtitles attached: ${label}.`);
  };

  const onAttachFile = async (file: File) => {
    try {
      const text = await file.text();
      const label = file.name.replace(/\.(vtt|srt)$/i, '');
      addTrackFromText(text, label || file.name, attachLang);
    } catch {
      setStatus('Could not read that subtitle file. Try a .vtt or .srt file.');
    }
  };

  const onAttachUrl = async () => {
    const raw = attachUrl.trim();
    if (!raw) {
      setStatus('Paste a subtitle file URL first.');
      return;
    }
    let url: URL;
    try {
      url = new URL(raw);
    } catch {
      setStatus('That is not a valid URL.');
      return;
    }
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      setStatus('Subtitle URLs must start with http:// or https://.');
      return;
    }
    try {
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      const label = decodeURIComponent(url.pathname.split('/').pop() || 'subtitles').replace(/\.(vtt|srt)$/i, '');
      addTrackFromText(text, label || 'subtitles', attachLang);
      setAttachUrl('');
    } catch {
      setStatus('Could not fetch subtitles from that URL. Check the link and try again.');
    }
  };

  const removeTrack = (id: string) => {
    setAttachedTracks((prev) => {
      const doomed = prev.find((t) => t.id === id);
      if (doomed?.blobUrl) URL.revokeObjectURL(doomed.blobUrl);
      return prev.filter((t) => t.id !== id);
    });
    if (activeTrackId === id) setActiveTrackId(OFF_TRACK);
    setStatus('Subtitle track removed.');
  };

  const runUpscale = async () => {
    if (!provider) return;
    setUpscaleWorking(true);
    setStatus('Upscaling… the source keeps playing until the upscaled version is ready.');
    try {
      const result = await provider.upscale({ src, kind: 'video', title });
      setUpscaledSrc(result.src);
      setUpscaleLabel(result.label);
      setStatus(`Upscaled version ready: ${result.label}.`);
    } catch {
      setStatus('Upscaling failed. The source version is still playing.');
    } finally {
      setUpscaleWorking(false);
    }
  };

  const revertUpscale = () => {
    setUpscaledSrc(null);
    setUpscaleLabel('');
    setStatus('Back to source quality.');
  };

  return (
    <div className={`space-y-4 ${playerFocusMode ? 'dme-focus-mode' : ''}`}>
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <h3 className="text-magenta-500 font-bold glow-shift glow-auto glow-s5">{title}</h3>
        <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
          Deviant Multimedia Engine
        </span>
      </div>

      {/* The video + curtain layer */}
      <div className="relative w-full rounded-lg border-2 border-magenta-500/20 overflow-hidden bg-black">
        <video
          key={currentSrc}
          ref={videoRef}
          src={currentSrc}
          poster={poster}
          controls
          playsInline
          preload="none"
          className="w-full block"
          style={{ filter: videoFilter === 'none' ? undefined : videoFilter }}
          aria-label={title}
          aria-describedby={`${videoId}-synopsis`}
          onLoadedMetadata={() => {
            const video = videoRef.current;
            if (!video) return;
            const list = video.textTracks;
            for (let i = 0; i < list.length; i += 1) {
              const track = attachedTracks[i];
              list[i].mode = track && track.id === activeTrackId ? 'showing' : 'disabled';
            }
          }}
        >
          {attachedTracks.map((t) => (
            <track key={t.id} kind={t.kind} src={t.src} srcLang={t.srclang} label={t.label} />
          ))}
          Your browser does not support the video tag.
        </video>

        {/* No-flash curtain: names exactly what is hidden; only the viewer lifts it. */}
        {curtained && (
          <div
            role="region"
            aria-label={`Flashing content warning for ${title}`}
            className="absolute inset-0 z-10 bg-black/95 overflow-y-auto p-6 flex flex-col justify-center gap-4"
          >
            <p className="flex items-center gap-2 text-white font-bold uppercase tracking-[0.2em] text-xs">
              <ShieldAlert size={18} className="text-[#FF69B4] shrink-0" aria-hidden="true" />
              Covered for your safety — nothing here will reach you by surprise
            </p>
            <p className="text-zinc-300 text-sm leading-relaxed">
              This film is covered because it contains:
            </p>
            <ul className="list-disc pl-6 text-zinc-100 text-sm space-y-1">
              {flashWarnings.map((w) => (
                <li key={w}>{w}</li>
              ))}
            </ul>
            <p className="text-zinc-400 text-xs leading-relaxed">
              The curtain stays up until you choose to lift it. The video is paused behind it.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => {
                  liftDmeCurtain(videoId);
                  setStatus(`Curtain lifted for ${title}. Flashing content is now visible.`);
                }}
                className="bg-[#FF1E89] text-white px-5 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:bg-[#FF69B4] transition-colors"
              >
                Lift the curtain — I choose to view this
              </button>
              <button
                type="button"
                onClick={() => {
                  pauseVideo();
                  setStatus('Curtain stays up. Video paused.');
                }}
                className="border border-zinc-600 text-zinc-200 px-5 py-3 rounded-lg text-xs font-black uppercase tracking-widest hover:border-white transition-colors"
              >
                Keep it covered
              </button>
            </div>
          </div>
        )}
      </div>

      {curtainLifted && flashWarnings.length > 0 && (
        <p className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
          <span>Curtain lifted for this video — flashing content is visible.</span>
          <button
            type="button"
            onClick={() => {
              coverDmeCurtain(videoId);
              pauseVideo();
              setStatus(`Curtain back up for ${title}.`);
            }}
            className="text-[#FF69B4] font-bold uppercase tracking-widest underline underline-offset-4 hover:text-white"
          >
            Cover again
          </button>
        </p>
      )}

      {/* Engine toolbar: everything happens inside the player */}
      <div className="flex flex-wrap items-center gap-2" role="toolbar" aria-label="Video access controls">
        <Tooltip content="Subtitles: attach, pick, or download subtitle files">
          <button
            type="button"
            onClick={toggleSubtitlePanel}
            aria-pressed={subtitlePanelOpen}
            aria-expanded={subtitlePanelOpen}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-widest transition-colors ${
              subtitlePanelOpen ? 'bg-magenta-600 text-white border-magenta-600' : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-[#FF69B4]/50 hover:text-white'
            }`}
          >
            <Captions size={16} aria-hidden="true" />
            Subtitles
          </button>
        </Tooltip>

        <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-400">
          Video palette
          <select
            value={videoPalette}
            onChange={(e) => setVideoPalette(e.target.value as 'site' | (typeof COLOR_BLIND_PALETTES)[number]['id'])}
            className="bg-zinc-900 text-zinc-100 border border-zinc-700 rounded-lg px-3 py-2.5 text-xs font-bold normal-case tracking-normal hover:border-[#FF69B4]/50"
            aria-label="Video color vision palette"
          >
            <option value="site">Follow site palette</option>
            {COLOR_BLIND_PALETTES.filter((p) => p.id !== 'none').map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
            <option value="none">Off (no video palette)</option>
          </select>
        </label>

        <Tooltip content="Focus mode: turns off animations, sliding windows and motion in this player">
          <button
            type="button"
            onClick={toggleDmeFocusMode}
            aria-pressed={dmeFocusMode}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-xs font-bold uppercase tracking-widest transition-colors ${
              dmeFocusMode ? 'bg-magenta-600 text-white border-magenta-600' : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:border-[#FF69B4]/50 hover:text-white'
            }`}
          >
            <Focus size={16} aria-hidden="true" />
            Focus mode
          </button>
        </Tooltip>
      </div>

      {/* Subtitle panel: attach by file or URL, pick a track, download a copy */}
      {subtitlePanelOpen && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-4">
          <p className="text-xs text-zinc-400 leading-relaxed">
            Attach subtitles in any language — for example, an English-language film with only
            Hindi, Mandarin or French subtitles available. The video pauses while you set this up.
          </p>

          <fieldset className="space-y-2">
            <legend className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Active track</legend>
            <div className="flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setActiveTrackId(OFF_TRACK)}
                aria-pressed={activeTrackId === OFF_TRACK}
                className={`text-left px-3 py-2 rounded-lg border text-xs font-bold ${activeTrackId === OFF_TRACK ? 'bg-magenta-600 text-white border-magenta-600' : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'}`}
              >
                Subtitles off
              </button>
              {attachedTracks.map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTrackId(t.id)}
                    aria-pressed={activeTrackId === t.id}
                    className={`flex-1 text-left px-3 py-2 rounded-lg border text-xs font-bold ${activeTrackId === t.id ? 'bg-magenta-600 text-white border-magenta-600' : 'bg-zinc-900 text-zinc-300 border-zinc-700 hover:bg-zinc-800'}`}
                  >
                    {t.label} ({t.srclang})
                    {t.kind === 'descriptions' ? ' — audio description' : ''}
                    {t.kind === 'captions' ? ' — captions' : ''}
                  </button>
                  {t.blobUrl && (
                    <a
                      href={t.blobUrl}
                      download={`${t.label}.vtt`}
                      className="shrink-0 p-2 rounded-lg border border-zinc-700 text-zinc-300 hover:border-[#FF69B4]/50 hover:text-white"
                      aria-label={`Download subtitles: ${t.label}`}
                    >
                      <Download size={16} aria-hidden="true" />
                    </a>
                  )}
                  {t.userAttached && (
                    <button
                      type="button"
                      onClick={() => removeTrack(t.id)}
                      className="shrink-0 p-2 rounded-lg border border-zinc-700 text-zinc-300 hover:border-red-400 hover:text-red-300"
                      aria-label={`Remove subtitle track: ${t.label}`}
                    >
                      <X size={16} aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </fieldset>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-zinc-300 uppercase tracking-widest" htmlFor={`${videoId}-attach-lang`}>
              <span className="flex items-center gap-2">
                <Languages size={14} aria-hidden="true" /> Language of the subtitles you attach
              </span>
            </label>
            <input
              id={`${videoId}-attach-lang`}
              type="text"
              value={attachLang}
              onChange={(e) => setAttachLang(e.target.value)}
              placeholder="e.g. hi, zh, fr — leave blank if unsure"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <input
              ref={fileRef}
              type="file"
              accept=".vtt,.srt"
              className="sr-only"
              aria-label="Choose a subtitle file (.vtt or .srt)"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) void onAttachFile(file);
                e.target.value = '';
              }}
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-bold uppercase tracking-widest hover:border-[#FF69B4]/50 hover:text-white"
            >
              <Upload size={16} aria-hidden="true" />
              Attach subtitle file (.vtt / .srt)
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <label className="sr-only" htmlFor={`${videoId}-attach-url`}>
              Subtitle file URL
            </label>
            <input
              id={`${videoId}-attach-url`}
              type="url"
              value={attachUrl}
              onChange={(e) => setAttachUrl(e.target.value)}
              placeholder="https://…/subtitles-hindi.vtt"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500"
            />
            <button
              type="button"
              onClick={() => void onAttachUrl()}
              className="flex items-center gap-2 justify-center px-4 py-2.5 rounded-lg border border-zinc-700 bg-zinc-900 text-zinc-200 text-xs font-bold uppercase tracking-widest hover:border-[#FF69B4]/50 hover:text-white"
            >
              <Link2 size={16} aria-hidden="true" />
              Attach from URL
            </button>
          </div>
        </div>
      )}

      {/* Upscaler hookup: honest stub until a provider registers */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-950 p-4 space-y-2">
        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-zinc-300">
          <Sparkles size={14} className="text-[#FF69B4]" aria-hidden="true" />
          Upscaler
        </p>
        {provider ? (
          <>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Connected: {provider.label}. {upscaledSrc ? `Playing upscaled version — ${upscaleLabel}.` : 'Source quality is playing.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void runUpscale()}
                disabled={upscaleWorking || upscaledSrc !== null}
                className="px-4 py-2.5 rounded-lg bg-[#FF1E89] text-white text-xs font-black uppercase tracking-widest hover:bg-[#FF69B4] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {upscaleWorking ? 'Upscaling…' : 'Upscale this video'}
              </button>
              {upscaledSrc && (
                <button
                  type="button"
                  onClick={revertUpscale}
                  className="px-4 py-2.5 rounded-lg border border-zinc-700 text-zinc-200 text-xs font-black uppercase tracking-widest hover:border-white transition-colors"
                >
                  Revert to source quality
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <p id={`${videoId}-upscaler-note`} className="text-xs text-zinc-400 leading-relaxed">
              Not connected — no upscaler provider is configured, so this plays at source quality.
              The same provider path covers audio upscaling when one is registered.
            </p>
            <button
              type="button"
              disabled
              aria-describedby={`${videoId}-upscaler-note`}
              className="px-4 py-2.5 rounded-lg bg-zinc-800 text-zinc-500 text-xs font-black uppercase tracking-widest cursor-not-allowed"
            >
              Upscale this video
            </button>
          </>
        )}
      </div>

      {/* Status announcements for screen readers */}
      <div role="status" aria-live="polite" className="sr-only">
        {status}
      </div>
      {status && (
        <p className="text-xs text-zinc-400" aria-hidden="true">
          {status}
        </p>
      )}

      {/* This synopsis is read by JAWS/NVDA when the user focuses on the video */}
      <div id={`${videoId}-synopsis`} className="sr-only">
        {synopsis}
      </div>

      {/* A visual summary for sighted users (optional) */}
      <p className="text-zinc-400 text-sm italic">
        <span className="text-magenta-500 font-bold">Synopsis:</span> {synopsis}
      </p>
    </div>
  );
};

export default VideoSanctuary;
