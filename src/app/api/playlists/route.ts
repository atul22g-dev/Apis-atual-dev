import { NextRequest, NextResponse } from 'next/server';
import { PLAYLISTS } from '@/lib/songs';
import { validateAuth, unauthorizedResponse } from '@/lib/auth';

/**
 * Private playlist API — requires an API key (X-API-Key header, api_key query
 * param, or Bearer token). Returns each playlist's metadata (id, name, label,
 * emoji, playlistId, bg, liveText, description, quotes).
 *
 *   GET /api/playlists                   -> all playlists (metadata only)
 *   GET /api/playlists?id=songs          -> just one playlist
 */
export async function GET(request: NextRequest) {
  // Private — every request must authenticate before any data is returned.
  const auth = validateAuth(request);
  if (!auth.authenticated) {
    return unauthorizedResponse(auth.error);
  }

  const { searchParams } = request.nextUrl;
  const id = searchParams.get('id');

  const wanted = id ? PLAYLISTS.filter((p) => p.id === id) : PLAYLISTS;
  if (id && wanted.length === 0) {
    return NextResponse.json({ error: 'Playlist not found' }, { status: 404 });
  }

  return NextResponse.json({ data: wanted, count: wanted.length });
}

// Auth checks read the request headers, so keep this dynamic.
export const dynamic = 'force-dynamic';
