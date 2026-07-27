'use client';

import Link from 'next/link';
import {
  ArrowUpRight, BookOpen, Construction, Database, Film,
  FolderCog, GitBranch, Globe, Image, Music, Package, Server, ShoppingBag,
  Smartphone, Zap, BarChart3, Github
} from 'lucide-react';
import { categories } from '@/lib/data';
import AuthGuard from '@/components/AuthGuard';

const iconMap: Record<string, React.ElementType> = {
  FolderCog, Zap, BookOpen, Film, ShoppingBag, Server, GitBranch,
  Smartphone, Globe, Image, Construction, Database, Package, Music
};

const categoryColors: Record<string, { bg: string; border: string; glow: string }> = {
  'frontend': { bg: 'from-blue-500/20 to-cyan-500/10', border: 'border-blue-500/30', glow: 'group-hover:shadow-blue-500/25' },
  'landing-page': { bg: 'from-amber-500/20 to-orange-500/10', border: 'border-amber-500/30', glow: 'group-hover:shadow-amber-500/25' },
  libraries: { bg: 'from-emerald-500/20 to-green-500/10', border: 'border-emerald-500/30', glow: 'group-hover:shadow-emerald-500/25' },
  'movies': { bg: 'from-red-500/20 to-rose-500/10', border: 'border-red-500/30', glow: 'group-hover:shadow-red-500/25' },
  'products': { bg: 'from-purple-500/20 to-violet-500/10', border: 'border-purple-500/30', glow: 'group-hover:shadow-purple-500/25' },
  'fullstack': { bg: 'from-cyan-500/20 to-teal-500/10', border: 'border-cyan-500/30', glow: 'group-hover:shadow-cyan-500/25' },
  'repositories': { bg: 'from-green-500/20 to-lime-500/10', border: 'border-green-500/30', glow: 'group-hover:shadow-green-500/25' },
  'apps': { bg: 'from-yellow-500/20 to-amber-500/10', border: 'border-yellow-500/30', glow: 'group-hover:shadow-yellow-500/25' },
  'cdns': { bg: 'from-fuchsia-500/20 to-pink-500/10', border: 'border-fuchsia-500/30', glow: 'group-hover:shadow-fuchsia-500/25' },
  'wallpapers': { bg: 'from-pink-500/20 to-rose-500/10', border: 'border-pink-500/30', glow: 'group-hover:shadow-pink-500/25' },
  'songs': { bg: 'from-rose-500/20 to-red-500/10', border: 'border-rose-500/30', glow: 'group-hover:shadow-rose-500/25' },
  unfinished: { bg: 'from-orange-500/20 to-red-500/10', border: 'border-orange-500/30', glow: 'group-hover:shadow-orange-500/25' },
  'database': { bg: 'from-teal-500/20 to-emerald-500/10', border: 'border-teal-500/30', glow: 'group-hover:shadow-teal-500/25' },
  'packages': { bg: 'from-stone-500/20 to-neutral-500/10', border: 'border-stone-500/30', glow: 'group-hover:shadow-stone-500/25' },
};

function HomeContent() {
  const totalItems = categories.reduce((sum, cat) => sum + cat.count, 0);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-50" />
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/10 rounded-full blur-[120px]" />

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-primary-300 mb-6 animate-in">
            <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
            {totalItems} endpoints available
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-white mb-6 animate-in-delay-1">
            Your Central
            <br />
            <span className="text-gradient">API Dashboard</span>
          </h1>

          <p className="text-lg text-white/50 max-w-2xl mx-auto mb-10 animate-in-delay-2">
            A comprehensive collection of APIs covering projects, movies, products,
            wallpapers, and more. Access everything from one place.
          </p>

          <div className="flex items-center justify-center gap-4 animate-in-delay-3">
            <Link
              href="#categories"
              className="px-6 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-medium transition hover:shadow-lg hover:shadow-primary-500/25 active:scale-95"
            >
              Explore Categories
            </Link>
            <a
              href="https://github.com/atul22g-dev/Apis-atual-dev"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl glass glass-hover text-white/80 font-medium flex items-center gap-2 transition active:scale-95"
            >
              <Github className="w-4 h-4" />
              View on GitHub
              <ArrowUpRight className="w-3 h-3" />
            </a>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="py-12 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Categories', value: categories.length, icon: BarChart3, color: 'text-primary-400' },
              { label: 'Total Items', value: totalItems, icon: Database, color: 'text-emerald-400' },
              { label: 'Frontend', value: categories.slice(0, 3).reduce((s, c) => s + c.count, 0), icon: FolderCog, color: 'text-amber-400' },
              { label: 'Media', value: (categories.find(c => c.id === 'movies')?.count ?? 0) + (categories.find(c => c.id === 'wallpapers')?.count ?? 0) + (categories.find(c => c.id === 'songs')?.count ?? 0), icon: Film, color: 'text-rose-400' },
            ].map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="text-center animate-in-delay-4">
                  <Icon className={`w-6 h-6 ${stat.color} mx-auto mb-2`} />
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-sm text-white/40">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section id="categories" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Browse Categories</h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Select a category to explore its collection of resources and data
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const Icon = iconMap[cat.icon] || FolderCog;
              const colors = categoryColors[cat.slug] || categoryColors['projects']!;
              const delay = `animate-in-delay-${Math.min((i % 5) + 1, 5)}`;

              return (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  className={`group relative overflow-hidden rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl ${colors.glow} ${delay}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center">
                      <Icon className="w-5 h-5" style={{ color: cat.color }} />
                    </div>
                    <span className="text-2xl font-bold text-white/10">{cat.count}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-1">{cat.name}</h3>
                  <p className="text-sm text-white/40">{cat.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs text-white/30 group-hover:text-white/60 transition-colors">
                    Browse <ArrowUpRight className="w-3 h-3" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm text-white/30">
          Built with Next.js & Tailwind CSS &middot; Atual APIs &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <AuthGuard>
      <HomeContent />
    </AuthGuard>
  );
}
