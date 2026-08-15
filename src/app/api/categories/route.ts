import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/data';
import { PLAYLISTS } from '@/lib/songs';
import { validateAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = validateAuth(request);
  if (!auth.authenticated) {
    return unauthorizedResponse(auth.error);
  }

  // Playlist-backed categories (Songs, Poetry, Standup Comedy) are intentionally
  // not exported via the API — they are served only on their pages.
  const playlistIds = new Set(PLAYLISTS.map((p) => p.id));
  const data = categories.filter((cat) => !playlistIds.has(cat.id));

  return NextResponse.json({
    data,
    _links: {
      self: '/api/categories',
      auth: '/api/auth',
      docs: '/api/index',
    },
  });
}
