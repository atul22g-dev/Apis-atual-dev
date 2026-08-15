import type { Song } from './data';
import playlistsData from '@/docs/media/playlists.json';

// Song *items* are sourced live from YouTube playlists: getSongs() fetches a
// playlist page and parses the playlist items embedded in its initial data, so
// the list stays in sync with the playlist. Results are cached per playlist for
// a short TTL so newly added songs show up within a few minutes without
// hammering YouTube on every request.
//
// The playlist *definitions* live in src/docs/media/playlists.json — the
// single source of truth in the data folder. These playlists power the
// Songs-style pages and the combined /api/playlists endpoint.

export interface PlaylistInfo {
  /** Slug used in URLs, e.g. 'songs'. */
  id: string;
  /** Display name shown on the page and the homepage grid. */
  name: string;
  /** Short display label, e.g. 'Standup'. */
  label: string;
  /** Emoji used for the playlist. */
  emoji: string;
  /** YouTube playlist id. */
  playlistId: string;
  /** Background image name. */
  bg: string;
  /** Live one-liner shown under the page title. */
  liveText: string;
  /** Noun used for the item count, e.g. 'songs' / 'poems'. */
  itemsLabel: string;
  /** Personality quotes for the playlist. */
  quotes: string[];
}

/** The playlists powering the Songs-style pages. */
export const PLAYLISTS: PlaylistInfo[] = playlistsData as PlaylistInfo[];

/** Default playlist id (the original Songs playlist). */
export const PLAYLIST_ID = PLAYLISTS[0].playlistId;

// How long a fetched song list is considered fresh (ms).
export const SONGS_CACHE_TTL = 5 * 60 * 1000;

// Stop following continuation tokens after this many pages, to bound work
// even if a playlist is enormous or YouTube misbehaves.
const MAX_CONTINUATIONS = 3;

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36';

interface CachedSongs {
  songs: Song[];
  fetchedAt: number;
}

// One cache entry per playlist id.
const caches = new Map<string, CachedSongs>();

/**
 * Pull the `ytInitialData` JSON payload out of a YouTube HTML page.
 * Returns null when the page doesn't contain it (e.g. blocked or errored).
 */
function parseInitialData(html: string): unknown | null {
  const marker = 'var ytInitialData = ';
  const start = html.indexOf(marker);
  const end = html.indexOf(';</script>', start);
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(html.slice(start + marker.length, end));
  } catch {
    return null;
  }
}

/**
 * Parse playlist items out of a `ytInitialData` payload. Handles both current
 * `lockupViewModel` entries (with a watch endpoint carrying the videoId and
 * 0-based playlist index) and the older `playlistVideoRenderer` shape.
 */
function extractPlaylistSongs(initialData: unknown): Song[] {
  const items: Array<{ index: number; videoId: string; title: string; artist: string; thumb: string }> = [];
  const seen = new Set<string>();

  const addItem = (index: number, videoId: string, title: string, artist: string, thumb: string) => {
    if (!videoId || seen.has(videoId)) return;
    seen.add(videoId);
    items.push({ index, videoId, title, artist, thumb });
  };

  const walk = (node: unknown): void => {
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === 'object') {
      const obj = node as Record<string, unknown>;

      // Current markup: lockupViewModel with a watchEndpoint on tap.
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
        // Only playlist entries carry a 0-based playlist index; related-video
        // shelves (which YouTube embeds alongside the playlist) don't, so skip
        // anything without one.
        if (videoId && endpoint.index !== undefined) {
          const meta = lockup.metadata?.lockupMetadataViewModel;
          const title = meta?.title?.content ?? '';
          const artist =
            meta?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]?.text?.content ?? '';
          const thumb =
            lockup.contentImage?.thumbnailViewModel?.image?.sources?.slice(-1)[0]?.url ??
            lockup.contentImage?.thumbnailViewModel?.image?.url ??
            '';
          addItem(endpoint.index, videoId, title, artist, thumb);
        }
        return;
      }

      // Older markup: playlistVideoRenderer.
      const video = obj.playlistVideoRenderer as
        | {
            videoId?: string;
            index?: { videoId?: string };
            title?: { runs?: Array<{ text?: string }> };
            shortBylineText?: { runs?: Array<{ text?: string }> };
            thumbnail?: { thumbnails?: Array<{ url?: string }> };
          }
        | undefined;

      if (video) {
        const videoId = video.videoId;
        if (videoId) {
          const title = video.title?.runs?.map((r) => r.text ?? '').join('') ?? '';
          const artist = video.shortBylineText?.runs?.map((r) => r.text ?? '').join('') ?? '';
          const thumb = video.thumbnail?.thumbnails?.slice(-1)[0]?.url ?? '';
          const index = video.index?.videoId ? Number(video.index.videoId) : NaN;
          addItem(Number.isNaN(index) ? items.length : index, videoId, title, artist, thumb);
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

/** Extract the next continuation token from a `ytInitialData` payload, if any. */
function findContinuationToken(root: unknown): string | null {
  let token: string | null = null;
  const walk = (node: unknown): void => {
    if (token) return;
    if (Array.isArray(node)) {
      node.forEach(walk);
      return;
    }
    if (node && typeof node === 'object') {
      const obj = node as Record<string, unknown>;
      const cont =
        (obj.continuationItemViewModel as Record<string, unknown> | undefined)?.continuationCommand as
          | { innertubeCommand?: { continuationCommand?: { token?: string } } }
          | undefined;
      if (cont?.innertubeCommand?.continuationCommand?.token) {
        token = cont.innertubeCommand.continuationCommand.token;
        return;
      }
      const legacy =
        (obj.continuationItemRenderer as Record<string, unknown> | undefined)?.continuationEndpoint as
          | { continuationCommand?: { token?: string } }
          | undefined;
      if (legacy?.continuationCommand?.token) {
        token = legacy.continuationCommand.token;
        return;
      }
      for (const key of Object.keys(obj)) {
        if (token) return;
        walk(obj[key]);
      }
    }
  };
  walk(root);
  return token;
}

/**
 * Follow the playlist continuation pagination. YouTube only embeds the first
 * ~100 playlist items in the initial page, so without this the tail of a large
 * playlist (where newly added songs land) would never be fetched. Continuation
 * responses can also carry unrelated "related playlists" shelves — only items
 * with a watch endpoint are collected.
 */
async function fetchContinuationSongs(token: string): Promise<Array<{ index: number; song: Song }>> {
  const extra: Array<{ index: number; song: Song }> = [];
  let nextToken: string | null = token;

  for (let page = 0; page < MAX_CONTINUATIONS && nextToken; page++) {
    const res = await fetch('https://www.youtube.com/youtubei/v1/browse?prettyPrint=false', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify({
        context: {
          client: { clientName: 'WEB', clientVersion: '2.20250210.01.00', hl: 'en', gl: 'US' },
        },
        continuation: nextToken,
      }),
    });
    if (!res.ok) break;

    const json = await res.json();
    const actions =
      (json.onResponseReceivedActions as Array<{ appendContinuationItemsAction?: { continuationItems?: unknown[] } }> | undefined) ??
      [];

    let sawSong = false;
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
          // Only paginated playlist entries carry a playlist index; related
          // videos and playlist shelves in continuation responses don't.
          if (endpoint?.videoId && endpoint.index !== undefined) {
            sawSong = true;
            const meta = lockup.metadata?.lockupMetadataViewModel;
            const artist =
              meta?.metadata?.contentMetadataViewModel?.metadataRows?.[0]?.metadataParts?.[0]?.text?.content ?? '';
            const thumb =
              lockup.contentImage?.thumbnailViewModel?.image?.sources?.slice(-1)[0]?.url ??
              lockup.contentImage?.thumbnailViewModel?.image?.url ??
              '';
            extra.push({
              index: endpoint.index,
              song: {
                id: 0,
                Name: meta?.title?.content ?? '',
                src: `https://www.youtube.com/watch?v=${endpoint.videoId}`,
                data: `https://www.youtube.com/watch?v=${endpoint.videoId}`,
                videoId: endpoint.videoId,
                artist,
                thumb: thumb || `https://i.ytimg.com/vi/${endpoint.videoId}/hqdefault.jpg`,
              },
            });
          }
          return;
        }
        for (const key of Object.keys(obj)) {
          walk(obj[key]);
        }
      }
    };
    for (const action of actions) {
      for (const item of action.appendContinuationItemsAction?.continuationItems ?? []) {
        walk(item);
      }
    }

    nextToken = findContinuationToken(json);
    // Stop early once a continuation page stops returning songs (e.g. the
    // "related playlists" shelf at the end of the list).
    if (!sawSong) break;
  }

  return extra;
}

/**
 * Fetch the songs from a YouTube playlist (cached for SONGS_CACHE_TTL).
 * Defaults to the main Songs playlist.
 */
export async function getSongs(playlistId: string = PLAYLIST_ID): Promise<Song[]> {
  const cached = caches.get(playlistId);
  if (cached && Date.now() - cached.fetchedAt < SONGS_CACHE_TTL) {
    return cached.songs;
  }

  try {
    const res = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`, {
      cache: 'no-store',
      headers: { 'User-Agent': USER_AGENT },
    });
    if (!res.ok) return cached?.songs ?? [];

    const html = await res.text();
    const initialData = parseInitialData(html);
    let songs = initialData ? extractPlaylistSongs(initialData) : [];

    // If the playlist is larger than what YouTube embeds in the initial page,
    // pull the remaining items (which include newly added songs) via pagination.
    const continuationToken = initialData ? findContinuationToken(initialData) : null;
    if (continuationToken) {
      const extra = await fetchContinuationSongs(continuationToken);
      if (extra.length > 0) {
        const merged = new Map<number, Song>();
        for (const song of songs) merged.set(song.id - 1, song);
        for (const { index, song } of extra) merged.set(index, song);
        songs = [...merged.values()].map((song, i) => ({ ...song, id: i + 1 }));
      }
    }

    caches.set(playlistId, { songs, fetchedAt: Date.now() });
    return songs;
  } catch {
    // Fall back to the previous snapshot rather than showing an empty list.
    return cached?.songs ?? [];
  }
}
