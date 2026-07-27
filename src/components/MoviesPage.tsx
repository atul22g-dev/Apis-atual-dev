'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Star, ChevronLeft, Film, Clock, Download } from 'lucide-react';
import { movies } from '@/lib/data';

export default function MoviesPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return movies;
    const q = search.toLowerCase();
    return movies.filter(m =>
      m.Name.toLowerCase().includes(q) ||
      m.Genres?.toLowerCase().includes(q) ||
      m.Release?.includes(q)
    );
  }, [search]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <Film className="w-8 h-8 text-red-400" />
              Movies
            </h1>
            <p className="text-white/50 mt-1">Movie collection with downloads</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search movies..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition" 
              aria-label="Search movies" />
          </div>
        </div>
        <div className="text-sm text-white/40 mt-4">{filtered.length} movies</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">No movies found</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((movie, i) => (
              <div key={movie.Key}
                className="group relative glass rounded-xl overflow-hidden hover:bg-white/[0.06] transition duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-red-500/10"
                style={{ animationDelay: `${(i % 6) * 100}ms` }}>

                {/* Poster */}
                <div className="relative aspect-[2/3] overflow-hidden bg-white/5">
                  <Image src={movie.Poster} alt={movie.Name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized />
                <div className="absolute inset-0 bg-gradient-to-t from-[#070708] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  {movie.IMDB && (
                    <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm flex items-center gap-1 text-xs">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span className="text-white font-medium">{movie.IMDB}</span>
                    </div>
                  )}
                  {movie.Quality && (
                    <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/60 backdrop-blur-sm text-xs text-white/80">
                      {movie.Quality}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-white group-hover:text-red-300 transition-colors">{movie.Name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-white/40">
                    {movie.Release && <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {movie.Release}</span>}
                    {movie.Language && <span className="px-1.5 py-0.5 rounded bg-white/5">{movie.Language}</span>}
                    {movie.Size && <span className="px-1.5 py-0.5 rounded bg-white/5">{movie.Size}</span>}
                  </div>
                  {movie.Genres && <p className="text-xs text-white/30 mt-2 line-clamp-1">{movie.Genres}</p>}
                  <p className="text-xs text-white/30 mt-1 line-clamp-2">{movie.Desc}</p>
                  {movie.downloads && movie.downloads.length > 0 && (
                    <a href={movie.downloads[0].Download} target="_blank" rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-medium transition">
                      <Download className="w-3 h-3" /> Download
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
