'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Search, ChevronLeft, Music, ExternalLink, ListMusic,
  ChevronDown, SkipBack, SkipForward, RotateCcw,
} from 'lucide-react';
import type { Song } from '@/lib/data';
import SongCard from './SongCard';
import NowPlayingBar from './NowPlayingBar';

interface SongsPageProps {
  songs: Song[];
  playlistId: string;
  title?: string;
  description?: string;
  itemsLabel?: string;
}

type SortOrder = 'playlist' | 'az' | 'za';

const SORT_LABELS: Record<SortOrder, string> = {
  playlist: 'Playlist order',
  az: 'Name A → Z',
  za: 'Name Z → A',
};

export default function SongsPage({
  songs,
  playlistId,
  title = 'Songs',
  description = 'Music and audio collection',
  itemsLabel = 'songs',
}: SongsPageProps) {
  const [search, setSearch] = useState('');
  const [currentVideoId, setCurrentVideoId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<SortOrder>('playlist');

  const filtered = useMemo(() => {
    let list = songs;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s => s.Name.toLowerCase().includes(q));
    }
    if (sortOrder === 'az') {
      list = [...list].sort((a, b) => a.Name.localeCompare(b.Name));
    } else if (sortOrder === 'za') {
      list = [...list].sort((a, b) => b.Name.localeCompare(a.Name));
    }
    return list;
  }, [search, songs, sortOrder]);

  // The current track is derived from the selection: if the selected video is
  // no longer in the filtered list (search, sort, or a refreshed songs prop),
  // currentSong falls back to null and the UI shows the whole playlist — no
  // state reset effect needed, so users never see a stale track.
  const currentSong = currentVideoId ? filtered.find((s) => s.videoId === currentVideoId) ?? null : null;

  const playSong = (index: number) => {
    const song = filtered[index];
    if (song?.videoId) setCurrentVideoId(song.videoId);
  };

  const playNext = () => {
    if (!currentSong || filtered.length === 0) return;
    const index = filtered.findIndex((s) => s.videoId === currentSong.videoId);
    const next = filtered[(index + 1) % filtered.length];
    if (next?.videoId) setCurrentVideoId(next.videoId);
  };

  const playPrev = () => {
    if (!currentSong || filtered.length === 0) return;
    const index = filtered.findIndex((s) => s.videoId === currentSong.videoId);
    const prev = filtered[(index - 1 + filtered.length) % filtered.length];
    if (prev?.videoId) setCurrentVideoId(prev.videoId);
  };

  // Show the selected video inside the playlist; otherwise the whole playlist.
  const embedSrc = useMemo(() => {
    if (currentSong?.videoId) {
      return `https://www.youtube.com/embed/${currentSong.videoId}?list=${playlistId}&autoplay=1`;
    }
    return `https://www.youtube.com/embed/videoseries?list=${playlistId}`;
  }, [currentSong, playlistId]);

  const playlistUrl = `https://www.youtube.com/playlist?list=${playlistId}`;

  return (
    <div className="min-h-screen pt-24 pb-32">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div className="max-w-xl">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500/25 to-red-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Music className="w-6 h-6 text-rose-400" />
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
                <p className="text-white/50 mt-0.5">{description}</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/20 transition"
                aria-label="Search songs"
              />
            </div>

            {/* Sort */}
            <div className="relative">
              <ListMusic className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
              <select
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value as SortOrder)}
                aria-label="Sort songs"
                className="appearance-none w-full sm:w-48 pl-10 pr-9 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500/40 focus:ring-2 focus:ring-rose-500/20 transition cursor-pointer"
              >
                {(Object.keys(SORT_LABELS) as SortOrder[]).map(key => (
                  <option key={key} value={key} className="bg-[#0a0a0f] text-white">
                    {SORT_LABELS[key]}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 mt-5">
          <span className="inline-flex items-center gap-1.5 text-sm text-white/50">
            <ListMusic className="w-4 h-4 text-rose-400" />
            {filtered.length} {itemsLabel}
          </span>
          {search && (
            <button
              type="button"
              onClick={() => setSearch('')}
              className="inline-flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200 transition-colors"
            >
              <RotateCcw className="w-3 h-3" /> Clear search
            </button>
          )}
        </div>
      </div>

      {/* Player + List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[minmax(0,480px)_1fr] gap-8 items-start">
          {/* Sticky player */}
          <div className="lg:sticky lg:top-24">
            <div className="glass rounded-2xl p-3 border border-white/10">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black/40">
                <iframe
                  key={embedSrc}
                  src={embedSrc}
                  title={currentSong ? `Now playing: ${currentSong.Name}` : `${title} playlist`}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </div>

              {/* Now playing meta */}
              <div className="flex items-center justify-between gap-4 mt-3 px-1 flex-wrap">
                <div className="min-w-0 flex-1">
                  {currentSong ? (
                    <>
                      <p className="text-[11px] uppercase tracking-wider text-rose-400 font-medium">Now playing</p>
                      <p className="text-sm text-white truncate font-medium">{currentSong.Name}</p>
                      <p className="text-xs text-white/40 truncate">{currentSong.artist || 'YouTube'}</p>
                    </>
                  ) : (
                    <>
                      <p className="text-[11px] uppercase tracking-wider text-white/30 font-medium">Playing the playlist</p>
                      <p className="text-sm text-white/70 truncate">Click a track below to jump to it</p>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={playPrev}
                    disabled={!currentSong}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40"
                    title="Previous song"
                    aria-label="Play previous song"
                  >
                    <SkipBack className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={playNext}
                    disabled={!currentSong}
                    className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-white/40"
                    title="Next song"
                    aria-label="Play next song"
                  >
                    <SkipForward className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <a
                href={playlistUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 flex items-center justify-center gap-1.5 text-sm text-rose-300 hover:text-rose-200 transition-colors py-2 rounded-lg hover:bg-rose-500/5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open playlist on YouTube
              </a>
            </div>
          </div>

          {/* Song list */}
          <div className="min-w-0">
            {filtered.length === 0 ? (
              <div className="text-center py-20 text-white/40 glass rounded-2xl">
                <div className="text-4xl mb-4">🎵</div>
                <p className="text-lg">
                  {search ? `No ${itemsLabel} match your search` : `No ${itemsLabel} found — the playlist could not be loaded right now.`}
                </p>
                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch('')}
                    className="mt-4 text-sm text-rose-300 hover:text-rose-200 transition-colors"
                  >
                    Clear search and try again
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {filtered.map((song, i) => (
                  <SongCard
                    key={song.id}
                    song={song}
                    index={i}
                    isCurrent={currentSong?.videoId === song.videoId}
                    onPlay={playSong}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Now Playing Bar */}
      {currentSong && (
        <NowPlayingBar
          currentSong={currentSong}
          onNext={playNext}
          onPrev={playPrev}
        />
      )}
    </div>
  );
}
