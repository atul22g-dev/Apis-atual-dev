import { NextRequest, NextResponse } from 'next/server';

export interface AuthResult {
  authenticated: boolean;
  error?: string;
  method?: string;
  role?: string;
}

/**
 * Check if a route requires authentication.
 */
export function isRouteProtected(pathname: string): boolean {
  const protectedRoutes = [
    '/api/frontend', '/api/landing-page', '/api/libraries',
    '/api/movies', '/api/products', '/api/fullstack',
    '/api/repositories', '/api/apps', '/api/cdns',
    '/api/wallpapers', '/api/unfinished',
    '/api/database', '/api/packages',
  ];
  return protectedRoutes.includes(pathname);
}

/**
 * Validate a request using the single API_KEY from environment.
 *
 * Supports two methods:
 * 1. API Key via X-API-Key header or `api_key` query parameter
 * 2. Bearer Token via Authorization: Bearer <token> header
 */
export function validateAuth(request: NextRequest): AuthResult {
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    // No API key configured — reject with clear instructions
    return {
      authenticated: false,
      error: 'API_KEY environment variable is not configured. Set API_KEY in your Vercel dashboard or .env.local file.',
    };
  }

  // 1. API Key check
  const apiKeyHeader = request.headers.get('X-API-Key');
  const apiKeyQuery = request.nextUrl.searchParams.get('api_key');
  if ((apiKeyHeader && apiKeyHeader === apiKey) || (apiKeyQuery && apiKeyQuery === apiKey)) {
    return { authenticated: true, method: 'api_key', role: 'admin' };
  }

  // 2. Bearer Token check
  const authHeader = request.headers.get('Authorization');
  if (authHeader?.startsWith('Bearer ') && authHeader.slice(7) === apiKey) {
    return { authenticated: true, method: 'token', role: 'admin' };
  }

  return {
    authenticated: false,
    error: 'Unauthorized. Provide a valid API key via X-API-Key header or Bearer token.',
  };
}

/**
 * Create an unauthorized JSON response.
 */
export function unauthorizedResponse(detail?: string): NextResponse {
  return NextResponse.json(
    {
      error: 'Unauthorized',
      message: detail || 'A valid API key is required to access this resource.',
      supported_methods: [
        { method: 'api_key', header: 'X-API-Key', query_param: 'api_key' },
        { method: 'bearer_token', header: 'Authorization', format: 'Bearer <token>' },
      ],
      documentation: '/api/auth',
    },
    {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Bearer realm="Atual APIs", X-API-Key',
      },
    }
  );
}
