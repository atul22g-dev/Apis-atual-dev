'use client';

import { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, ShoppingBag, Star, ChevronLeft } from 'lucide-react';
import { products } from '@/lib/data';

export default function ProductsPage() {
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    if (!search.trim()) return products;
    const q = search.toLowerCase();
    return products.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.company?.toLowerCase().includes(q) ||
      p.category?.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q)
    );
  }, [search]);

  const formatter = useMemo(() => new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }), []);

  const formatPrice = useCallback((price: number) => {
    return formatter.format(price / 100);
  }, [formatter]);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
          <ChevronLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white flex items-center gap-3">
              <ShoppingBag className="w-8 h-8 text-purple-400" />
              Products
            </h1>
            <p className="text-white/50 mt-1">Tech products and accessories catalog</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input type="text" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-white/20 transition" 
              aria-label="Search products" />
          </div>
        </div>
        <div className="text-sm text-white/40 mt-4">{filtered.length} products</div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-white/40">No products found</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((product, i) => (
              <div key={product.id}
                className="group relative glass rounded-xl p-5 hover:bg-white/[0.06] transition duration-300 hover:scale-[1.02]"
                style={{ animationDelay: `${(i % 6) * 100}ms` }}>

                <div className="relative w-full h-48 rounded-lg overflow-hidden mb-4 bg-white/5">
                  <Image src={product.image} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" unoptimized />
                  {product.featured && (
                    <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs">Featured</span>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  {product.company && <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 uppercase tracking-wider">{product.company}</span>}
                  {product.category && <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40">{product.category}</span>}
                </div>

                <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors">{product.name}</h3>
                <div className="text-lg font-bold text-white mt-1">{formatPrice(product.price)}</div>

                {product.colors && product.colors.length > 0 && (
                  <div className="flex items-center gap-1 mt-2">
                    {product.colors.map((color, ci) => (
                      <span key={ci} className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: color }} />
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2 mt-2 text-xs text-white/40">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, si) => (
                      <Star key={si} className={`w-3 h-3 ${si < Math.round(product.stars) ? 'fill-amber-400 text-amber-400' : 'text-white/10'}`} />
                    ))}
                  </div>
                  <span>({product.reviews})</span>
                </div>

                {product.stock !== undefined && (
                  <div className="mt-2 text-xs">
                    {product.stock > 0 ? (
                      <span className="text-emerald-400/60">{product.stock} in stock</span>
                    ) : (
                      <span className="text-red-400/60">Out of stock</span>
                    )}
                  </div>
                )}

                <p className="text-xs text-white/30 mt-2 line-clamp-2">{product.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
