import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import {
  categories,
  frontendProjects, landingPageProjects, libraries, movies, products,
  fullstackProjects, repositories, apps, cdns, wallpapers,
  unfinishedProjects, DatabaseProjects, packages, songs,
} from '@/lib/data';
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
  movies: { data: movies },
  products: { data: products },
  fullstack: { data: fullstackProjects },
  repositories: { data: repositories },
  apps: { data: apps },
  cdns: { data: cdns, transform: (c: any) => ({ ...c, id: c.name }) },
  wallpapers: { data: wallpapers },
  unfinished: { data: unfinishedProjects },
  database: {
    data: DatabaseProjects,
    transform: (p: any) => ({ id: p.name, title: p.name, name: p.name, db: p.db, desc: `Health: ${p['db-check']}`, demo: p.status, type: p.type }),
  },
  packages: {
    data: packages,
    transform: (p: any) => ({ id: p.name, title: p.name, name: p.name, src: p.src, demo: p.demo, type: p.type }),
  },
  songs: {
    data: songs,
    transform: (s: any) => ({ id: s.id, name: s.Name, title: s.Name, src: s.src, demo: s.data }),
  },
};

const customPages: Record<string, React.ComponentType> = {
  movies: MoviesPageComponent,
  products: ProductsPageComponent,
  wallpapers: WallpapersPageComponent,
  songs: SongsPageComponent,
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

function CategoryContent({ slug }: { slug: string }) {
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
      icon={cat.icon}
      color={cat.color}
      items={items}
      basePath={`/${slug}`}
    />
  );
}

export default async function CategoryPageRoute({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <AuthGuard>
      <CategoryContent slug={slug} />
    </AuthGuard>
  );
}
