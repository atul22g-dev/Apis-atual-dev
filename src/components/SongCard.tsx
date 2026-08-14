'use client';

import Image from 'next/image';
import { Play, ExternalLink, Music } from 'lucide-react';
import type { Song } from '@/lib/data';

interface SongCardProps {
  song: Song;
  index: number;
  isCurrent: boolean;
  onPlay: (index: number) => void;
}

export default function SongCard({ song, index, isCurrent, onPlay }: SongCardProps) {
  return (
    <div
      className={`group relative glass rounded-xl p-5 text-left transition duration-300 hover:scale-[1.02] ${
        isCurrent
          ? 'bg-rose-500/10 border-rose-500/30 ring-1 ring-rose-500/30'
          : 'hover:bg-white/[0.06]'
      }`}
      style={{ animationDelay: `${(index % 6) * 100}ms` }}
    >
      <div className="flex items-center gap-4">
        {/* Clickable play area: thumbnail + song info */}
        <div
          onClick={() => onPlay(index)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onPlay(index);
            }
          }}
          role="button"
          tabIndex={0}
          aria-label={`Play ${song.Name}`}
          className="flex items-center gap-4 flex-1 min-w-0 cursor-pointer rounded-lg p-1 -m-1 focus:outline-none focus:ring-2 focus:ring-rose-500/50"
        >
          {/* Thumbnail / Play button */}
          <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-white/5 flex items-center justify-center">
            {song.thumb ? (
              <Image
                src={song.thumb}
                alt=""
                fill
                sizes="56px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <Music className="w-6 h-6 text-white/40" />
            )}

            {isCurrent ? (
              <div className="absolute inset-0 bg-rose-950/60 flex items-end justify-center gap-0.5 pb-2">
                <span className="w-1 bg-rose-400 rounded-full animate-equalizer-1" />
                <span className="w-1 bg-rose-400 rounded-full animate-equalizer-2" />
                <span className="w-1 bg-rose-400 rounded-full animate-equalizer-3" />
                <span className="w-1 bg-rose-400 rounded-full animate-equalizer-4" />
              </div>
            ) : (
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition flex items-center justify-center">
                <Play className="w-6 h-6 text-white/0 group-hover:text-white transition-colors drop-shadow" />
              </div>
            )}
          </div>

          {/* Song info */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold truncate transition-colors ${
              isCurrent ? 'text-rose-300' : 'text-white group-hover:text-rose-300'
            }`}>
              {song.Name}
            </h3>
            <p className="text-xs text-white/30 mt-1 truncate">
              {song.artist || 'YouTube'}
            </p>
          </div>
        </div>

        {/* Source link — sibling of the play button, not nested */}
        <a
          href={song.data}
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 p-2 rounded-lg text-white/20 hover:text-white/60 hover:bg-white/5 transition"
          title="Watch on YouTube"
          aria-label="Watch on YouTube"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
}
