import { NextRequest, NextResponse } from 'next/server';
import {
  frontendProjects, landingPageProjects, libraries, movies, products,
  fullstackProjects, repositories, apps, cdns, wallpapers,
  unfinishedProjects, DatabaseProjects, packages, songs,
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
  songs,
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
  const data = dataMap[category];
  if (!data) {
    return NextResponse.json({ error: 'Category not found' }, { status: 404 });
  }

  return NextResponse.json(data);
}
