'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ChevronLeft, Image as ImageIcon, X, ChevronLeft as ArrowLeft, ChevronRight } from 'lucide-react';
import { wallpapers } from '@/lib/data';

export default function WallpapersPage() {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return wallpapers;
    const q = search.toLowerCase();
    return wallpapers.filter(w => w.Name.toLowerCase().includes(q));
  }, [search]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (selectedIndex === null) return;
    if (e.key === 'Escape') setSelectedIndex(null);
    if (e.key === 'ArrowLeft') setSelectedIndex(prev => prev !== null && prev > 0 ? prev - 1 : filtered.length - 1);
    if (e.key === 'ArrowRight') setSelectedIndex(prev => prev !== null && prev < filtered.length - 1 ? prev + 1 : 0);
  }, [selectedIndex, filtered.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const selected = selectedIndex !== null ? filtered[selectedIndex] : null;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <ImageIcon className="w-8 h-8 text-pink-400" />
              Wallpapers
            </h1>
            <p className="text-white/50 mt-1">Curated wallpaper collection</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search wallpapers..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition" 
              aria-label="Search wallpapers" />
          </div>
        </div>
        <div className="text-sm text-white/40 mt-4">{filtered.length} wallpapers</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">No wallpapers found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
            {filtered.map((wp, i) => (
              <button key={wp.id} type="button" onClick={() => setSelectedIndex(i)}
                className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-white/5 hover:ring-2 hover:ring-pink-500/50 transition duration-300 hover:scale-[1.02]"
                aria-label={`View ${wp.Name}`}
                style={{ animationDelay: `${(i % 10) * 50}ms` }}>
                <Image src={wp.url} alt={wp.Name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                  <span className="text-white text-sm font-medium">{wp.Name}</span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={() => setSelectedIndex(null)}>
          <button type="button" onClick={() => setSelectedIndex(null)} className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Close">
            <X className="w-5 h-5 text-white" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedIndex(prev => prev !== null && prev > 0 ? prev - 1 : filtered.length - 1); }}
            className="absolute left-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Previous">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <button type="button" onClick={(e) => { e.stopPropagation(); setSelectedIndex(prev => prev !== null && prev < filtered.length - 1 ? prev + 1 : 0); }}
            className="absolute right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors" aria-label="Next">
            <ChevronRight className="w-5 h-5 text-white" />
          </button>
          <Image src={selected.url} alt={selected.Name}
            width={800}
            height={1200}
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-xl"
            onClick={(e) => e.stopPropagation()}
            unoptimized />
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-black/60 backdrop-blur-sm text-white text-sm">
            {selected.Name} &middot; {selectedIndex! + 1} / {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
}
