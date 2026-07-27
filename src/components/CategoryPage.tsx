'use client';

import { useState, useMemo, Fragment } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ArrowUpRight, ExternalLink, Github, Star, Clock, ChevronLeft } from 'lucide-react';

interface Item {
  id?: string | number;
  title?: string;
  name?: string;
  src?: string;
  demo?: string;
  desc?: string;
  img?: string;
  stars?: number;
  price?: number;
  company?: string;
  category?: string;
  type?: 'App' | 'demo' | 'database' | 'Pkg';
  db?: string;
}

interface CategoryPageProps {
  title: string;
  description: string;
  icon: string;
  color: string;
  items: Item[];
  renderCard?: (item: Item, index: number) => React.ReactNode;
  basePath: string;
}

export default function CategoryPage({
  title,
  description,
  color,
  items,
  renderCard,
  basePath,
}: CategoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return items;
    const q = searchQuery.toLowerCase();
    return items.filter((item) => {
      const searchable = `${item.title || item.name || ''} ${item.desc || ''} ${item.company || ''}`.toLowerCase();
      return searchable.includes(q);
    });
  }, [items, searchQuery]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{title}</h1>
            <p className="text-white/50 mt-1">{description}</p>
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder={`Search ${title.toLowerCase()}...`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 focus:bg-white/[0.07] transition"
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <span className="text-sm text-white/40">{filteredItems.length} items</span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filteredItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-white/40 text-lg">No results found</p>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="mt-4 text-sm text-primary-400 hover:text-primary-300 transition-colors"
            >
              Clear search and try again
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item, index) =>
              renderCard ? (
                <Fragment key={`card-${item.id}`}>{renderCard(item, index)}</Fragment>
              ) : (
                <DefaultCard key={`card-${item.id}`} item={item} index={index} />
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function DefaultCard({ item, index }: { item: Item; index: number}) {
  
  return (
    <div
      className="group relative glass rounded-xl p-5 hover:bg-white/[0.06] transition duration-300 hover:scale-[1.02]"
      style={{ animationDelay: `${(index % 6) * 100}ms` }}
    >
      {/* Image */}
      {item.img && (
        <div className="relative w-full h-40 rounded-lg overflow-hidden mb-4 bg-white/5">
          <Image
            src={item.img}
            alt={item.title || item.name || ''}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <h3 className="font-semibold text-white group-hover:text-primary-300 transition-colors">
          {item.title || item.name}
        </h3>
        {item.type && item.type !== 'demo' && (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wider bg-white/10 text-white/60 border border-white/10">
            {item.type ===  "database" ? item.db : item.type}
          </span>
        )}
      </div>

      {item.desc && (
        <p className="text-sm text-white/40 mt-1 line-clamp-2">{item.desc}</p>
      )}

      {item.stars !== undefined && (
        <div className="flex items-center gap-1 mt-2 text-xs text-amber-400">
          <Star className="w-3 h-3 fill-current" />
          {item.stars}
        </div>
      )}

      <div className="flex items-center gap-2 mt-3">
        {item.demo && (
          <Link
            href={item.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors"
          >
            <ExternalLink className="w-3 h-3" />
            {item.type === 'App' ? 'Download' : item.type === 'database' ? 'Status' : item.type === 'Pkg' ? "Package" : "Demo"}
          </Link>
        )}
        {item.src  && (
          <Link
            href={item.src}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors"
          >
            <Github className="w-3 h-3" />
            Source
          </Link>
        )}
      </div>
    </div>
  );
}

export { DefaultCard };
