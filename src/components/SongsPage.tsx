'use client';

import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, Music } from 'lucide-react';
import { songs } from '@/lib/data';
import SongCard from './SongCard';
import NowPlayingBar from './NowPlayingBar';

export default function SongsPage() {
  const [search, setSearch] = useState('');
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return songs;
    const q = search.toLowerCase();
    return songs.filter(s => s.Name.toLowerCase().includes(q));
  }, [search]);

  // Reset current track when search changes and it no longer matches
  useEffect(() => {
    if (currentIndex !== null && currentIndex >= filtered.length) {
      setCurrentIndex(null);
      setIsPlaying(false);
    }
  }, [filtered.length, currentIndex]);

  const currentSong = currentIndex !== null ? filtered[currentIndex] : null;

  // Play a song by index
  const playSong = useCallback((index: number) => {
    if (index < 0 || index >= filtered.length) return;
    setCurrentIndex(index);
    setIsPlaying(true);
  }, [filtered.length]);

  // Handle volume changes separately — don't reset the audio source
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  // Handle audio events and play/pause sync
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || currentIndex === null || !currentSong) return;

    audio.src = currentSong.src;

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onDurationChange = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (currentIndex < filtered.length - 1) {
        playSong(currentIndex + 1);
      } else {
        setIsPlaying(false);
        setCurrentTime(0);
      }
    };
    const onError = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
    };
  }, [currentIndex, currentSong, isPlaying, filtered.length, playSong]);



  const togglePlay = () => {
    if (currentIndex === null && filtered.length > 0) {
      playSong(0);
    } else {
      setIsPlaying(prev => !prev);
    }
  };

  const playNext = () => {
    if (currentIndex === null) return;
    const next = (currentIndex + 1) % filtered.length;
    playSong(next);
  };

  const playPrev = () => {
    if (currentIndex === null) return;
    const prev = (currentIndex - 1 + filtered.length) % filtered.length;
    playSong(prev);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const audio = audioRef.current;
    if (!audio || !progressRef.current || !duration) return;
    const rect = progressRef.current.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    audio.currentTime = ratio * duration;
    setCurrentTime(ratio * duration);
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) audioRef.current.volume = val;
    setIsMuted(false);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="min-h-screen pt-24 pb-32">        {/* Hidden audio element */}
      <audio ref={audioRef as React.RefObject<HTMLAudioElement>} preload="metadata" aria-label="Audio player">
        <track kind="captions" src="data:text/vtt,WEBVTT" label="English" />
      </audio>

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

      {/* Songs Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">No songs found</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((song, i) => (
              <SongCard
                key={song.id}
                song={song}
                index={i}
                isCurrentTrack={currentIndex === i}
                isPlaying={isPlaying}
                progress={progress}
                onPlay={playSong}
                onTogglePlay={togglePlay}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky Now Playing Bar */}
      {currentSong && (
        <NowPlayingBar
          currentSong={currentSong}
          isPlaying={isPlaying}
          currentTime={currentTime}
          duration={duration}
          volume={volume}
          isMuted={isMuted}
          progress={progress}
          progressRef={progressRef as React.RefObject<HTMLDivElement>}
          audioRef={audioRef as React.RefObject<HTMLAudioElement>}
          onProgressClick={handleProgressClick}
          onTogglePlay={togglePlay}
          onNext={playNext}
          onPrev={playPrev}
          onToggleMute={toggleMute}
          onVolumeChange={handleVolumeChange}
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
