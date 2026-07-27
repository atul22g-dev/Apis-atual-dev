'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      window.location.href = '/';
    }
  }, [isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(password);
      if (!result.success) {
        setError(result.message || 'Invalid password');
      }
      // AuthContext handles redirect via useEffect on isAuthenticated change
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-50" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-[120px]" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-blue-600 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white">Access Required</h1>
          <p className="text-white/50 mt-2">Enter the password to access the dashboard</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/10">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/70 mb-2">
                Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-primary-500/50 focus:ring-1 focus:ring-primary-500/25 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading || !password}
              className="w-full py-3 rounded-xl bg-primary-500 hover:bg-primary-600 disabled:bg-primary-500/50 text-white font-medium transition hover:shadow-lg hover:shadow-primary-500/25 disabled:cursor-not-allowed active:scale-[0.98] flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Unlock Dashboard
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-base text-white text-center">
              Made with ❤️ by <a href="https://github.com/atual-dev" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">Atual</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
