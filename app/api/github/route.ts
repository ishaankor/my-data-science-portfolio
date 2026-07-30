import { NextResponse } from 'next/server';
import { portfolioData } from '@/data/portfolio';
import githubCache from '@/data/github-cache.json';

export const dynamic = 'force-dynamic';

interface CachedResponse {
  user: any;
  repos: any[];
  commits: any[];
  fetchedAt: string;
}

let memoryCache: CachedResponse | null = null;
let lastFetchTime = 0;
const CACHE_DURATION_MS = 60 * 1000; // 1-minute server in-memory cache for live commit history updates

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (isNaN(seconds) || seconds < 0) return 'just now';
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export async function GET() {
  const now = Date.now();

  if (memoryCache && now - lastFetchTime < CACHE_DURATION_MS) {
    const updatedCommits = memoryCache.commits.map((c) => ({
      ...c,
      timeAgo: formatTimeAgo(c.date),
    }));

    return NextResponse.json(
      { ...memoryCache, commits: updatedCommits, cached: true },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  }

  const token = process.env.GITHUB_TOKEN?.trim();
  const headers: Record<string, string> = {
    'User-Agent': 'NextJS-GitHub-Proxy',
    Accept: 'application/vnd.github.v3+json',
  };

  if (token) {
    headers['Authorization'] = token.startsWith('github_pat_') ? `Bearer ${token}` : `token ${token}`;
  }

  try {
    const reposUrl = token
      ? `https://api.github.com/user/repos?per_page=100&sort=pushed&type=all`
      : `https://api.github.com/users/${portfolioData.githubUsername}/repos?per_page=100&sort=pushed`;

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${portfolioData.githubUsername}`, { headers, cache: 'no-store' }),
      fetch(reposUrl, { headers, cache: 'no-store' }),
      fetch(`https://api.github.com/users/${portfolioData.githubUsername}/events?per_page=30`, { headers, cache: 'no-store' }),
    ]);

    let userData: any = githubCache?.user || null;
    let reposData: any[] = (githubCache?.repos || []) as any[];
    let commitsData: any[] = [];

    if (userRes.ok) {
      userData = await userRes.json();
    }

    if (reposRes.ok) {
      const fetchedRepos = await reposRes.json();
      if (Array.isArray(fetchedRepos) && fetchedRepos.length > 0) {
        reposData = fetchedRepos.filter((r: any) => !r.fork && (r.owner?.login === portfolioData.githubUsername || r.owner?.login === undefined));
      }
    }

    // 1. Primary: Parse instant live PushEvents from GitHub Events API
    if (eventsRes.ok) {
      const events = await eventsRes.json();
      if (Array.isArray(events)) {
        const pushEvents = events.filter((e) => e.type === 'PushEvent');
        const eventCommits: any[] = [];

        pushEvents.forEach((ev: any) => {
          const repoFullName = ev.repo?.name || '';
          const repoShortName = repoFullName.split('/')[1] || repoFullName;
          const repoUrl = `https://github.com/${repoFullName}`;
          const payloadCommits = ev.payload?.commits || [];

          payloadCommits.forEach((c: any) => {
            const sha = c.sha;
            const shortSha = sha ? sha.substring(0, 7) : 'head';
            eventCommits.push({
              sha,
              shortSha,
              message: c.message?.split('\n')[0] || 'Update repository',
              repoName: repoShortName,
              repoUrl,
              commitUrl: `https://github.com/${repoFullName}/commit/${sha}`,
              date: ev.created_at,
              timeAgo: formatTimeAgo(ev.created_at),
            });
          });
        });

        if (eventCommits.length > 0) {
          const commitMap = new Map<string, any>();
          eventCommits.forEach((item) => commitMap.set(item.sha, item));
          commitsData = Array.from(commitMap.values())
            .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 5);
        }
      }
    }

    // 2. Fallback to repository commits endpoint if no PushEvents found
    if (commitsData.length === 0 && Array.isArray(reposData) && reposData.length > 0) {
      const topPushed = [...reposData]
        .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
        .slice(0, 5);

      const commitPromises = topPushed.map(async (repo) => {
        try {
          const res = await fetch(
            `https://api.github.com/repos/${portfolioData.githubUsername}/${repo.name}/commits?per_page=5`,
            { headers, cache: 'no-store' }
          );
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              return data.map((c: any) => {
                const commitDate = c.commit?.committer?.date || c.commit?.author?.date || repo.pushed_at;
                return {
                  sha: c.sha,
                  shortSha: c.sha.substring(0, 7),
                  message: c.commit?.message?.split('\n')[0] || 'Update repository',
                  repoName: repo.name,
                  repoUrl: repo.html_url,
                  commitUrl: c.html_url || `${repo.html_url}/commit/${c.sha}`,
                  date: commitDate,
                  timeAgo: formatTimeAgo(commitDate),
                };
              });
            }
          }
        } catch (e) {
          console.error(`API Proxy commit fetch error for ${repo.name}:`, e);
        }
        return [];
      });

      const nestedCommits = await Promise.all(commitPromises);
      const allFetchedCommits = nestedCommits.flat().filter(Boolean);

      if (allFetchedCommits.length > 0) {
        const commitMap = new Map<string, any>();
        allFetchedCommits.forEach((item) => commitMap.set(item.sha, item));

        commitsData = Array.from(commitMap.values())
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 5);
      }
    }

    memoryCache = {
      user: userData,
      repos: reposData,
      commits: commitsData,
      fetchedAt: new Date().toISOString(),
    };
    lastFetchTime = now;

    return NextResponse.json(
      { ...memoryCache, cached: false },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        },
      }
    );
  } catch (error: any) {
    console.error('GitHub API Proxy Handler Error:', error);

    const fallbackResponse = memoryCache || {
      user: githubCache?.user || null,
      repos: (githubCache?.repos || []) as any[],
      commits: (githubCache?.commits || []) as any[],
      fetchedAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { ...fallbackResponse, cached: true, error: error.message },
      { status: 200 }
    );
  }
}
