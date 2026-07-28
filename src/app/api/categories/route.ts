import { NextRequest, NextResponse } from 'next/server';
import { categories } from '@/lib/data';
import { validateAuth, unauthorizedResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const auth = validateAuth(request);
  if (!auth.authenticated) {
    return unauthorizedResponse(auth.error);
  }

  return NextResponse.json({
    data: categories,
    _links: {
      self: '/api/categories',
      auth: '/api/auth',
      docs: '/api/index',
    },
  });
}
