import { NextRequest, NextResponse } from 'next/server';
import {
  frontendProjects, landingPageProjects, libraries, movies, products,
  fullstackProjects, repositories, apps, cdns, wallpapers,
  unfinishedProjects, DatabaseProjects, packages,
} from '@/lib/data';
import { validateAuth, unauthorizedResponse, isRouteProtected } from '@/lib/auth';

const dataMap: Record<string, any[]> = {
  frontend: frontendProjects,
  'landing-page': landingPageProjects,
  libraries,
  movies,
  products,
  fullstack: fullstackProjects,
  repositories,
  apps,
  cdns,
  wallpapers,
  unfinished: unfinishedProjects,
  database: DatabaseProjects,
  packages,
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ category: string }> }
) {
  const { category } = await params;

  // Check auth for protected routes
  const pathname = `/api/${category}`;
  if (isRouteProtected(pathname)) {
    const auth = validateAuth(request);
    if (!auth.authenticated) {
      return unauthorizedResponse(auth.error);
    }
  }

  // Return data. Playlist-backed categories (Songs, Poetry, Standup Comedy) are
  // intentionally NOT exported via the API — they are served only on their
  // pages (see src/app/[slug]/page.tsx).
  const data = dataMap[category];
  if (!data) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

// Auth checks read the request headers on every call, so keep this dynamic.
export const dynamic = 'force-dynamic';
