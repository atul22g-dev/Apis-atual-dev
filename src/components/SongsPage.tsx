'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Music, ExternalLink } from 'lucide-react';
import type { Song } from '@/lib/data';
import SongCard from './SongCard';
import NowPlayingBar from './NowPlayingBar';
import Waveform from './Waveform';

interface SongsPageProps {
  songs: Song[];
  playlistId: string;
}

export default function SongsPage({ songs, playlistId }: SongsPageProps) {
  const [search, setSearch] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return songs;
    const q = search.toLowerCase();
    return songs.filter(s => s.Name.toLowerCase().includes(q));
  }, [search, songs]);

  // Reset current track when search changes and it no longer matches
  useEffect(() => {
    if (currentIndex !== null && currentIndex >= filtered.length) {
      setCurrentIndex(null);
    }
  }, [filtered.length, currentIndex]);

  const currentSong = currentIndex !== null ? filtered[currentIndex] : null;

  const playSong = (index: number) => {
    if (index < 0 || index >= filtered.length) return;
    setCurrentIndex(index);
  };

  const playNext = () => {
    if (currentIndex === null || filtered.length === 0) return;
    setCurrentIndex((currentIndex + 1) % filtered.length);
  };

  const playPrev = () => {
    if (currentIndex === null || filtered.length === 0) return;
    setCurrentIndex((currentIndex - 1 + filtered.length) % filtered.length);
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <Music className="w-8 h-8 text-rose-400" />
              Songs
            </h1>
            <p className="text-white/50 mt-1">Music and audio collection</p>
            <Waveform
              bars={40}
              className="mt-4 h-8 w-full max-w-md [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]"
            />
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search songs..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition"
              aria-label="Search songs"
            />
          </div>
        </div>
        <div className="text-sm text-white/40 mt-4">{filtered.length} songs</div>
      </div>

      {/* YouTube Playlist Player */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10 bg-black/40">
          <iframe
            key={embedSrc}
            src={embedSrc}
            title={currentSong ? `Now playing: ${currentSong.Name}` : 'Songs playlist'}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
          />
        </div>
        <div className="flex items-center justify-between gap-4 mt-3 flex-wrap">
          <p className="text-sm text-white/50">
            {currentSong
              ? `Now playing: ${currentSong.Name}`
              : 'Playing the full playlist — click a song below to jump to it'}
          </p>
          <a
            href={playlistUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-rose-300 hover:text-rose-200 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Open playlist on YouTube
          </a>
        </div>
      </div>

      {/* Songs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">
            No songs found — the playlist could not be loaded right now.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                index={i}
                isCurrent={currentIndex === i}
                onPlay={playSong}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky Now Playing Bar */}
      {currentSong && (
        <NowPlayingBar
          currentSong={currentSong}
          onNext={playNext}
          onPrev={playPrev}
        />
      )}

      {/* CSS for equalizer animation */}
      <style jsx>{`
        @keyframes equalizer-1 {
          0%, 100% { height: 4px; }
          50% { height: 16px; }
        }
        @keyframes equalizer-2 {
          0%, 100% { height: 12px; }
          50% { height: 6px; }
        }
        @keyframes equalizer-3 {
          0%, 100% { height: 8px; }
          50% { height: 18px; }
        }
        @keyframes equalizer-4 {
          0%, 100% { height: 14px; }
          50% { height: 4px; }
        }
        :global(.animate-equalizer-1) { animation: equalizer-1 0.8s ease-in-out infinite; }
        :global(.animate-equalizer-2) { animation: equalizer-2 0.6s ease-in-out infinite; }
        :global(.animate-equalizer-3) { animation: equalizer-3 0.7s ease-in-out infinite; }
        :global(.animate-equalizer-4) { animation: equalizer-4 0.9s ease-in-out infinite; }
      `}</style>
    </div>
  );
}
