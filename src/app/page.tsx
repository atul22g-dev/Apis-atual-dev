import { categories } from '@/lib/data';
import { getSongs, PLAYLISTS } from '@/lib/songs';
import AuthGuard from '@/components/AuthGuard';
import HomeContent from '@/components/HomeContent';

export default async function Home() {
  // Keep the Songs-style card counts in sync with the live YouTube playlists
  // (the counts in src/lib/data.ts are just fallbacks when the fetch fails).
  // Each playlist fetch is independent (separate YouTube playlist, separate
  // cache key), so start them all at once instead of waiting one at a time.
  const playlistCounts = await Promise.all(
    PLAYLISTS.map(async (playlist) => ({
      id: playlist.id,
      count: (await getSongs(playlist.playlistId)).length,
    }))
  );
  const liveCounts = new Map<string, number>();
  for (const { id, count } of playlistCounts) {
    if (count > 0) liveCounts.set(id, count);
  }
  const liveCategories = categories.map((cat) => {
    const count = liveCounts.get(cat.id);
    return count !== undefined ? { ...cat, count } : cat;
  });

  return (
    <AuthGuard>
      <HomeContent categories={liveCategories} />
    </AuthGuard>
  );
}

// Re-render periodically so the Songs count stays in sync with the playlist.
export const revalidate = 300;
