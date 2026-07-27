'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ArrowUpRight, LogOut, LogIn, Lock, Terminal, Code } from 'lucide-react';
import { categories } from '@/lib/data';
import { useAuth } from '@/lib/AuthContext';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition duration-300 ${
        isScrolled
          ? 'bg-[#070708]/80 backdrop-blur-xl border-b border-white/10'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href={isAuthenticated ? '/' : '/login'} className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="text-lg font-semibold text-white">
              Atual <span className="text-primary-400">APIs</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {isAuthenticated ? (
              <>
                <Link
                  href="/"                   className="px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  Home
                </Link>
                <Link
                  href="/api/index"                   className="px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition flex items-center gap-1"
                >
                  <Terminal className="w-3.5 h-3.5" />
                  API Index
                </Link>
                <div className="relative group">
                  <button type="button" className="px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition flex items-center gap-1">
                    Categories
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  <div className="absolute top-full left-0 mt-1 w-56 rounded-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 bg-[#070708]">
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/${cat.slug}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition"
                      >
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: cat.color }}
                        />
                        {cat.name}
                        <span className="ml-auto text-xs text-white/30">{cat.count}</span>
                      </Link>
                    ))}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={logout}
                  className="px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition flex items-center gap-1.5"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              !isLoading && (
                <Link
                  href="/login"
                  className="px-4 py-2 text-sm rounded-lg bg-primary-500/10 border border-primary-500/20 text-primary-300 hover:bg-primary-500/20 transition flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Sign In
                </Link>
              )
            )}
            <a
              href="https://atual-dev.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition flex items-center gap-1"
            >
              <Code className="w-4 h-4" />
              Main
            </a>
          </nav>

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition"
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden transition duration-300 ${
          isMobileMenuOpen ? 'max-h-[80vh] block visible' : 'max-h-0 hidden invisible'
        }`}
      >
        <div className="glass border-t border-white/10 p-4 space-y-1 max-h-[80vh] overflow-y-auto">
          {isAuthenticated ? (
            <>                <Link
                  href="/"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                Home
              </Link>                <Link
                  href="/api/index"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                <Terminal className="w-4 h-4" />
                API Index
              </Link>
              <div className="pt-2 pb-1 px-3 text-xs font-semibold text-white/30 uppercase tracking-wider">
                Categories
              </div>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/${cat.slug}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name}
                  <span className="ml-auto text-xs text-white/30">{cat.count}</span>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition"
                >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
          <a
            href="https://github.com/atul22g-dev"
            target="_blank"
            rel="noopener noreferrer"                   className="flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            GitHub
            <ArrowUpRight className="w-3 h-3 ml-auto" />
          </a>
        </div>
      </div>
    </header>
  );
}
