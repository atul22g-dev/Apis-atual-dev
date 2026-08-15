'use client';

import { SkipBack, SkipForward, ExternalLink, Music } from 'lucide-react';

interface NowPlayingBarProps {
  currentSong: { Name: string; data: string };
  onNext: () => void;
  onPrev: () => void;
}

export default function NowPlayingBar({ currentSong, onNext, onPrev }: NowPlayingBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Song info */}
          <div className="flex items-center gap-3 min-w-0 flex-1">
            <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center shrink-0">
              <Music className="w-5 h-5 text-rose-400" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{currentSong.Name}</p>
              <p className="text-xs text-white/40 truncate">Playing on YouTube</p>
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
              onClick={onNext}
              className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition"
              title="Next"
              aria-label="Next track"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Source */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <a
              href={currentSong.data}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white/60 text-xs transition"
            >
              <ExternalLink className="w-3 h-3" />
              Watch on YouTube
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
