'use client';

import {
  Music, Play, Pause, SkipBack, SkipForward,
  ExternalLink, Volume2, VolumeX
} from 'lucide-react';

function formatTime(seconds: number): string {
  if (isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

interface NowPlayingBarProps {
  currentSong: { Name: string; data: string };
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  progress: number;
  progressRef: React.RefObject<HTMLDivElement>;
  audioRef: React.RefObject<HTMLAudioElement>;
  onProgressClick: (e: React.MouseEvent<HTMLDivElement>) => void;
  onTogglePlay: () => void;
  onNext: () => void;
  onPrev: () => void;
  onToggleMute: () => void;
  onVolumeChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function NowPlayingBar({
  currentSong,
  isPlaying,
  currentTime,
  duration,
  volume,
  isMuted,
  progress,
  progressRef,
  onProgressClick,
  onTogglePlay,
  onNext,
  onPrev,
  onToggleMute,
  onVolumeChange,
  audioRef,
}: NowPlayingBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Progress bar (clickable) */}
        <div
          ref={progressRef}
          onClick={onProgressClick}
          onKeyDown={(e) => {
            const audio = audioRef.current;
            if (audio && duration) {
              if (e.key === 'ArrowRight') { audio.currentTime = Math.min(audio.currentTime + 5, duration); }
              if (e.key === 'ArrowLeft') { audio.currentTime = Math.max(audio.currentTime - 5, 0); }
            }
          }}
          role="slider"
          tabIndex={0}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={duration}
          aria-valuenow={currentTime}
          className="absolute top-0 left-0 right-0 h-1 bg-white/5 cursor-pointer group/progress hover:h-1.5 transition"
        >
          <div
            className="h-full bg-gradient-to-r from-rose-400 to-rose-500 relative"
            style={{ width: `${progress}%` }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-rose-400 shadow-lg shadow-rose-500/50 opacity-0 group-hover/progress:opacity-100 transition-opacity" />
          </div>
        </div>

        <div className="flex items-center justify-between gap-4">
          {/* Left: Song info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
              {isPlaying ? (
                <div className="flex items-end gap-[2px] h-4">
                  <span className="w-0.5 bg-rose-400 rounded-full animate-equalizer-1" />
                  <span className="w-0.5 bg-rose-400 rounded-full animate-equalizer-2" />
                  <span className="w-0.5 bg-rose-400 rounded-full animate-equalizer-3" />
                </div>
              ) : (
                <Music className="w-5 h-5 text-rose-400" />
              )}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentSong.Name}</p>
              <p className="text-xs text-white/40 truncate">
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>

          {/* Center: Controls */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onPrev}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition"
              title="Previous"
              aria-label="Previous track"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="p-3 rounded-full bg-rose-500 hover:bg-rose-400 text-white transition hover:scale-105 active:scale-95 shadow-lg shadow-rose-500/25"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              type="button"
              onClick={onNext}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition"
              title="Next"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Volume & source */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <button
              type="button"
              onClick={onToggleMute}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition"
              title={isMuted ? 'Unmute' : 'Mute'}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isMuted ? 0 : volume}
              onChange={onVolumeChange}
              className="w-20 accent-rose-400"
              title="Volume"
            />
            <a
              href={currentSong.data}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/60 text-xs transition"
            >
              <ExternalLink className="w-3 h-3" />
              Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
