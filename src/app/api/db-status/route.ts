import { NextRequest, NextResponse } from 'next/server';
import { DatabaseProjects } from '@/lib/data';

export async function GET(request: NextRequest) {
  const targetUrl = request.nextUrl.searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json(
      { error: 'Missing required query parameter: url' },
      { status: 400 }
    );
  }

  // Security: only allow URLs from the known database projects list
  const knownUrls = DatabaseProjects.flatMap((project) => [
    project['db-check'],
    project.status,
  ]);

  if (!knownUrls.includes(targetUrl)) {
    return NextResponse.json(
      { error: 'Invalid url. Must be a known database project status or db-check URL.' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(targetUrl, {
      signal: AbortSignal.timeout(10_000),
    });

    const data = await response.json();

    return NextResponse.json({
      project: targetUrl,
      status: response.ok ? 'healthy' : 'unhealthy',
      statusCode: response.status,
      data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : 'Unknown error occurred';

    return NextResponse.json(
      {
        project: targetUrl,
        status: 'unreachable',
        error: message,
      },
      { status: 502 }
    );
  }
}
