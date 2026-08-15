import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  categories,
  frontendProjects, landingPageProjects, libraries,
  fullstackProjects, repositories, apps, cdns,
  unfinishedProjects, DatabaseProjects, packages,
} from '@/lib/data';
import type { Song } from '@/lib/data';
import { getSongs, PLAYLISTS, type PlaylistInfo } from '@/lib/songs';
import CategoryPage from '@/components/CategoryPage';
import MoviesPageComponent from '@/components/MoviesPage';
import ProductsPageComponent from '@/components/ProductsPage';
import WallpapersPageComponent from '@/components/WallpapersPage';
import SongsPageComponent from '@/components/SongsPage';
import AuthGuard from '@/components/AuthGuard';

const dataMap: Record<string, { data: any[]; transform?: (item: any) => any }> = {
  frontend: { data: frontendProjects },
  'landing-page': { data: landingPageProjects },
  libraries: { data: libraries },
  fullstack: { data: fullstackProjects },
  repositories: { data: repositories },
  apps: { data: apps },
  cdns: { data: cdns, transform: (c: any) => ({ ...c, id: c.name }) },
  unfinished: { data: unfinishedProjects },
  database: {
    data: DatabaseProjects,
    transform: (p: any) => ({ id: p.name, title: p.name, name: p.name, db: p.db, desc: `Health: ${p['db-check']}`, demo: p.status, type: p.type }),
  },
  packages: {
    data: packages,
    transform: (p: any) => ({ id: p.name, title: p.name, name: p.name, src: p.src, demo: p.demo, type: p.type }),
  },
};

const customPages: Record<string, React.ComponentType> = {
  movies: MoviesPageComponent,
  products: ProductsPageComponent,
  wallpapers: WallpapersPageComponent,
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = categories.find(c => c.slug === slug);
  if (!cat) return { title: 'Not Found' };
  return {
    title: `${cat.name} | Atual APIs`,
    description: cat.description,
  };
}

function CategoryContent({
  slug,
  songs,
  playlist,
}: {
  slug: string;
  songs?: Song[];
  playlist?: PlaylistInfo;
}) {
  // Songs-style pages (Songs, Poetry, Standup Comedy) are backed by live data
  // from their YouTube playlist.
  if (songs && playlist) {
    return (
      <SongsPageComponent
        songs={songs}
        playlistId={playlist.playlistId}
        title={playlist.name}
        description={playlist.liveText}
        itemsLabel={playlist.itemsLabel}
      />
    );
  }

  // Render custom pages (movies, products, wallpapers)
  const CustomPage = customPages[slug];
  if (CustomPage) return <CustomPage />;

  // Look up category info
  const cat = categories.find(c => c.slug === slug);

  if (!cat) notFound();

  // Look up data
  const entry = dataMap[slug];

  if (!entry) notFound();

  const items = entry.transform ? entry.data.map(entry.transform) : entry.data;

  return (
    <CategoryPage
      title={cat.name}
      description={cat.description}
      color={cat.color}
      items={items}
    />
  );
}

export default async function CategoryPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  // Songs-style pages fetch their items live from the YouTube playlist.
  const playlist = PLAYLISTS.find((p) => p.id === slug);
  const songs = playlist ? await getSongs(playlist.playlistId) : undefined;
  return (
    <AuthGuard>
      <CategoryContent slug={slug} songs={songs} playlist={playlist} />
    </AuthGuard>
  );
}

// Re-render periodically so the playlist data stays fresh. Matches the songs
// cache TTL in src/lib/songs.ts, so a newly added song appears within ~5 min.
export const revalidate = 300;
