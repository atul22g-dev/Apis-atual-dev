'use client';

import { useState } from 'react';
import Link from 'next/link';
import AuthGuard from '@/components/AuthGuard';
import { categories } from '@/lib/data';
import { PLAYLISTS } from '@/lib/songs';
import { ChevronLeft, ExternalLink, Copy, Check, Terminal, Code2, Database, Loader2 } from 'lucide-react';

const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';

interface Endpoint {
  name: string;
  slug: string;
  url: string;
  description: string;
  color: string;
  count: number;
  countLabel?: string;
}

// Static sample responses shown in the docs for selected endpoints.
const SAMPLE_RESPONSES: Record<string, string> = {
  playlists: `{
  "data": [
    {
      "id": "songs",
      "name": "Personal Songs",
      "emoji": "🎵",
      "playlistId": "PLIV4nZCjWE3E",
      "liveText": "Creator's personal diary of music",
      "itemsLabel": "songs"
    }
  ],
  "count": 3
}`,
};

function ApiIndexContent() {
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);

  // Playlist-backed categories (Songs, Poetry, Standup Comedy) are not exported
  // as individual endpoints; their metadata is served by the private
  // /api/playlists endpoint listed below.
  const playlistIds = new Set(PLAYLISTS.map((p) => p.id));
  // Build the endpoint list in one pass: every category that is not playlist-
  // backed becomes an endpoint, with the combined /api/playlists endpoint last.
  const endpoints: Endpoint[] = [];
  for (const cat of categories) {
    if (playlistIds.has(cat.id)) continue;
    endpoints.push({
      name: cat.name,
      slug: cat.slug,
      url: `/api/${cat.slug}`,
      description: cat.description,
      color: cat.color,
      count: cat.count,
    });
  }
  endpoints.push({
    name: 'Playlists',
    slug: 'playlists',
    url: '/api/playlists',
    description: 'All playlist metadata (Songs, Poetry, Standup Comedy) — private, API key required',
    color: '#fb7185',
    count: PLAYLISTS.length,
    countLabel: 'playlists',
  });

  const fetchEndpoint = async (slug: string, url: string) => {
    if (expandedEndpoint === slug) {
      setExpandedEndpoint(null);
      setResponseData(null);
      return;
    }

    setExpandedEndpoint(slug);
    setIsLoading(true);
    setError(null);
    setResponseData(null);

    try {
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data = await res.json();
      setResponseData(JSON.stringify(data, null, 2));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopiedIndex(id);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-1 text-sm text-white/40 hover:text-white/70 transition-colors mb-6">
            <ChevronLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">API Index</h1>
              <p className="text-white/50 mt-1">Browse and test all available API endpoints</p>
            </div>
          </div>
        </div>

        {/* Endpoints Grid */}
        <div className="space-y-3">
          {endpoints.map((ep) => (
            <div key={ep.slug} className="glass rounded-xl border border-white/10 overflow-hidden transition duration-300">
              <div className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.03] transition-colors">
                <div
                  onClick={() => fetchEndpoint(ep.slug, ep.url)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fetchEndpoint(ep.slug, ep.url); } }}
                  role="button"
                  tabIndex={0}
                  className="flex items-center gap-4 flex-1 min-w-0 text-left cursor-pointer hover:bg-white/[0.03] transition-colors rounded-lg p-1 -m-1 focus:outline-none focus:ring-2 focus:ring-primary-500/50"
                >
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ep.color }} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-white font-medium">{ep.name}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-white/40 font-mono">GET</span>
                    </div>
                    <div className="text-sm text-primary-400 font-mono mt-0.5">{ep.url}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-white/30">{ep.count} {ep.countLabel ?? 'items'}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); copyToClipboard(`${baseUrl}${ep.url}`, ep.slug); }}
                    className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition"
                    title="Copy URL"
                    aria-label="Copy endpoint URL"
                  >
                    {copiedIndex === ep.slug ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <a href={ep.url} target="_blank" rel="noopener noreferrer"
                    className="p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition"
                    title="Open in new tab"
                    aria-label="Open endpoint in new tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <Code2 className={`w-4 h-4 text-white/30 transition-transform duration-200 ${expandedEndpoint === ep.slug ? 'rotate-180' : ''}`} />
                </div>
              </div>

              {expandedEndpoint === ep.slug && (
                <div className="border-t border-white/5">
                  <div className="p-4">
                    {/* cURL Example */}
                    <div className="mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Terminal className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-xs text-white/40 font-medium">cURL Example</span>
                      </div>
                      <div className="relative">
                        <pre className="text-xs font-mono text-white/60 bg-white/[0.02] rounded-lg p-3 overflow-x-auto border border-white/5">
                          <>curl {baseUrl}{ep.url} \<br />&nbsp;&nbsp;-H &quot;X-API-Key: YOUR_API_KEY&quot;</>
                        </pre>
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); copyToClipboard(`curl ${baseUrl}${ep.url} -H "X-API-Key: YOUR_API_KEY"`, `curl-${ep.slug}`); }}
                          className="absolute top-2 right-2 p-1.5 rounded-lg hover:bg-white/5 text-white/30 hover:text-white/60 transition"
                          aria-label="Copy cURL command"
                        >
                          {copiedIndex === `curl-${ep.slug}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Sample response */}
                    {SAMPLE_RESPONSES[ep.slug] && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Code2 className="w-3.5 h-3.5 text-white/40" />
                          <span className="text-xs text-white/40 font-medium">Sample response</span>
                        </div>
                        <div className="rounded-lg bg-[#0a0a0b] border border-white/5 overflow-hidden">
                          <pre className="text-xs font-mono text-white/70 p-4 overflow-x-auto max-h-96 overflow-y-auto">{SAMPLE_RESPONSES[ep.slug]}</pre>
                        </div>
                      </div>
                    )}

                    {/* Response */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Database className="w-3.5 h-3.5 text-white/40" />
                        <span className="text-xs text-white/40 font-medium">Live response</span>
                      </div>
                      <div className="relative rounded-lg bg-[#0a0a0b] border border-white/5 overflow-hidden">
                        {isLoading ? (
                          <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
                            <span className="ml-2 text-sm text-white/40">Fetching data...</span>
                          </div>
                        ) : error ? (
                          <div className="p-4 text-sm text-red-400">{error}</div>
                        ) : responseData ? (
                          <>
                            <div className="flex items-center justify-between px-4 py-2 border-b border-white/5 bg-white/[0.02]">
                              <span className="text-xs text-white/30">JSON</span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(responseData, `response-${ep.slug}`)}
                                className="p-1 rounded hover:bg-white/5 text-white/30 hover:text-white/60 transition"
                                aria-label="Copy response data"
                              >
                                {copiedIndex === `response-${ep.slug}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                            <pre className="text-xs font-mono text-white/70 p-4 overflow-x-auto max-h-96 overflow-y-auto">{responseData}</pre>
                          </>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <div className="mt-8 glass rounded-xl border border-white/10 p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary-400" />
            Quick Access
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {endpoints.map((ep) => (
              <a key={ep.slug} href={ep.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition text-sm">
                <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: ep.color }} />
                <span className="font-mono">{ep.url}</span>
                <ExternalLink className="w-3 h-3 ml-auto flex-shrink-0" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApiIndexPage() {
  return (
    <AuthGuard>
      <ApiIndexContent />
    </AuthGuard>
  );
}
