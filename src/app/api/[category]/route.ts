import { NextRequest, NextResponse } from 'next/server';
import {
  frontendProjects, landingPageProjects, libraries, movies, products,
  fullstackProjects, repositories, apps, cdns, wallpapers,
  unfinishedProjects, DatabaseProjects, packages,
} from '@/lib/data';
import { getSongs } from '@/lib/songs';
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
  index: [],
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

  // Return data
  // Songs are sourced live from the YouTube playlist rather than a static file.
  const data = category === 'songs' ? await getSongs() : dataMap[category];
  if (!data) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}

// Serve songs live from YouTube on every request
export const dynamic = 'force-dynamic';
