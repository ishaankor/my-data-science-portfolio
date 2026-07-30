import { NextResponse } from 'next/server';
import githubCache from '@/data/github-cache.json';

export const dynamic = 'force-dynamic';

export async function GET() {
  const primaryEndpoint = process.env.NEXT_PUBLIC_GITHUB_FETCHER_URL || 'https://github-meta-fetcher.vercel.app/api/github';

  try {
    const res = await fetch(primaryEndpoint, {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Portfolio-Proxy-Fetcher',
      },
    });

    if (res.ok) {
      const data = await res.json();
      return NextResponse.json(data, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      });
    }
  } catch (error: any) {
    console.error('Failed to proxy to Github-Meta-Fetcher:', error);
  }

  // Robust static fallback if Vercel microservice is unreachable
  return NextResponse.json(
    {
      status: 'degraded',
      user: githubCache?.user || null,
      repos: (githubCache?.repos || []) as any[],
      commits: (githubCache?.commits || []) as any[],
      fetchedAt: new Date().toISOString(),
    },
    {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    }
  );
}
