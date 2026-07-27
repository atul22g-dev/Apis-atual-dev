'use client';

import { Play, ExternalLink } from 'lucide-react';

interface Song {
  id: string | number;
  Name: string;
  src: string;
  data: string;
}

interface SongCardProps {
  song: Song;
  index: number;
  isCurrentTrack: boolean;
  isPlaying: boolean;
  progress: number;
  onPlay: (index: number) => void;
  onTogglePlay: () => void;
}

export default function SongCard({
  song,
  index,
  isCurrentTrack,
  isPlaying,
  progress,
  onPlay,
  onTogglePlay,
}: SongCardProps) {
  return (
    <div
      className={`group relative glass rounded-xl p-5 text-left transition duration-300 hover:scale-[1.02] ${
        isCurrentTrack
          ? 'bg-rose-500/10 border-rose-500/30 ring-1 ring-rose-500/30'
          : 'hover:bg-white/[0.06]'
      }`}
      style={{ animationDelay: `${(index % 6) * 100}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Clickable play area: album art + song info */}
        <div
          onClick={() => {
            if (isCurrentTrack) {
              onTogglePlay();
            } else {
              onPlay(index);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (isCurrentTrack) {
                onTogglePlay();
              } else {
                onPlay(index);
              }
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={isCurrentTrack ? (isPlaying ? 'Pause' : 'Resume') : `Play ${song.Name}`}
          className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer rounded-lg p-1 -m-1 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          {/* Album art placeholder / Play button */}
          <div className={`relative w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition duration-300 ${
            isCurrentTrack && isPlaying
              ? 'bg-rose-500/20'
              : 'bg-white/5 group-hover:bg-rose-500/10'
          }`}>
            {isCurrentTrack && isPlaying ? (
              <div className="flex items-end gap-0.5 h-6">
                <span className="w-1 bg-rose-400 rounded-full animate-equalizer-1" />
                <span className="w-1 bg-rose-400 rounded-full animate-equalizer-2" />
                <span className="w-1 bg-rose-400 rounded-full animate-equalizer-3" />
                <span className="w-1 bg-rose-400 rounded-full animate-equalizer-4" />
              </div>
            ) : (
              <Play className={`w-6 h-6 transition-colors ${
                isCurrentTrack ? 'text-rose-400 fill-rose-400' : 'text-white/40 group-hover:text-rose-400'
              }`} />
            )}
          </div>

          {/* Song info */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate transition-colors ${
              isCurrentTrack ? 'text-rose-300' : 'text-white group-hover:text-rose-300'
            }`}>
              {song.Name}
            </h3>
            <p className="text-xs text-white/30 mt-1 truncate">
              {song.src.split('/').pop()?.replace(/%20/g, ' ') || 'Audio track'}
            </p>
          </div>
        </div>

        {/* Source link — sibling of the play button, not nested */}
        <a
          href={song.data}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition"
          title="View on GitHub"
          aria-label="View on GitHub"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* Progress bar for currently playing */}
      {isCurrentTrack && (
        <div className="mt-3 h-1 rounded-full bg-white/5 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-400 to-rose-500 transition duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
    </div>
  );
}
