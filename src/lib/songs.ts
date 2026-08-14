import type { Song } from './data';

// Songs are sourced live from a YouTube playlist instead of a static JSON file.
// getSongs() fetches the playlist page and parses the playlist items embedded in
// its initial data, so the list stays in sync with the playlist. It falls back
// to an empty list on any error (network, YouTube blocking, markup changes).

export const PLAYLIST_ID = 'PLIV4nZCjWE3E';
export const SONGS_PLAYLIST_URL = `https://www.youtube.com/playlist?list=${PLAYLIST_ID}`;

let cachedSongs: Song[] | null = null;

/**
 * Parse the playlist items out of YouTube's `ytInitialData` payload.
 * Playlist videos appear under `lockupViewModel` entries with a watch
 * endpoint carrying the videoId and 0-based playlist index.
 */
function extractPlaylistSongs(html: string): Song[] {
  const marker = 'var ytInitialData = ';
  const start = html.indexOf(marker);
  const end = html.indexOf(';</script>', start);
  if (start === -1 || end === -1) return [];

  const initialData = JSON.parse(html.slice(start + marker.length, end));

  const items: Array<{ index: number; videoId: string; title: string; artist: string; thumb: string }> = [];
  const seen = new Set<string>();

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === 'object') {
      const obj = node as Record<string, unknown>;
      const lockup = obj.lockupViewModel as
        | {
            rendererContext?: {
              commandContext?: {
                onTap?: {
                  innertubeCommand?: {
                    watchEndpoint?: { videoId?: string; index?: number };
                  };
                };
              };
            };
            metadata?: {
              lockupMetadataViewModel?: {
                title?: { content?: string };
                metadata?: {
                  contentMetadataViewModel?: {
                    metadataRows?: Array<{
                      metadataParts?: Array<{ text?: { content?: string } }>;
                    }>;
                  };
                };
              };
            };
            contentImage?: {
              thumbnailViewModel?: {
                image?: { url?: string; sources?: Array<{ url?: string }> };
              };
            };
          }
        | undefined;

      if (lockup) {
        const endpoint = lockup.rendererContext?.commandContext?.onTap?.innertubeCommand?.watchEndpoint;
        const videoId = endpoint?.videoId;
        if (videoId && !seen.has(videoId)) {
          seen.add(videoId);
          const meta = lockup.metadata?.lockupMetadataViewModel;
          const title = meta?.title?.content ?? '';
          const artist =
            meta?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]?.text?.content ?? '';
          const thumb =
            lockup.contentImage?.thumbnailViewModel?.image?.sources?.slice(-1)[0]?.url ??
            lockup.contentImage?.thumbnailViewModel?.image?.url ??
            '';
          items.push({
            index: endpoint.index ?? items.length,
            videoId,
            title,
            artist,
            thumb,
          });
        }
        return;
      }

      for (const key of Object.keys(obj)) {
        walk(obj[key]);
      }
    }
  };

  walk(initialData);

  items.sort((a, b) => a.index - b.index);

  return items.map((item, i) => ({
    id: i + 1,
    Name: item.title,
    src: `https://www.youtube.com/watch?v=${item.videoId}`,
    data: `https://www.youtube.com/watch?v=${item.videoId}`,
    videoId: item.videoId,
    artist: item.artist,
    thumb: item.thumb || `https://i.ytimg.com/vi/${item.videoId}/hqdefault.jpg`,
  }));
}

/** Fetch the songs from the YouTube playlist (cached per server instance). */
export async function getSongs(): Promise<Song[]> {
  if (cachedSongs) return cachedSongs;

  try {
    const res = await fetch(SONGS_PLAYLIST_URL, {
      cache: 'no-store',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
      },
    });
    if (!res.ok) return [];

    const html = await res.text();
    const songs = extractPlaylistSongs(html);
    cachedSongs = songs;
    return songs;
  } catch {
    return [];
  }
}
