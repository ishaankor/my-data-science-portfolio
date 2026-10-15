'use client';

import { useState, useEffect, useCallback } from 'react';
import githubCache from '@/data/github-cache.json';
import { portfolioData } from '@/data/portfolio';

export interface GitHubUser {
  login: string;
  avatar_url: string;
  html_url: string;
  name: string;
  bio: string;
  public_repos: number;
  created_at: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  language: string | null;
  html_url: string;
  description: string | null;
  pushed_at: string;
  created_at?: string;
  updated_at?: string;
  topics?: string[];
  private?: boolean;
}

export interface CommitItem {
  sha: string;
  shortSha: string;
  message: string;
  repoName: string;
  repoUrl: string;
  commitUrl: string;
  date: string;
  timeAgo: string;
}

export interface ContributionDay {
  date: string;
  contributionCount: number;
  color?: string;
}

export interface ContributionCalendar {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
}

export interface GitHubTelemetryData {
  user: GitHubUser;
  repos: GitHubRepo[];
  commits: CommitItem[];
  contributionCalendar: ContributionCalendar | null;
  lastPolledTime: string;
  loading: boolean;
}

const FALLBACK_USER: GitHubUser = (githubCache?.user || {
  login: portfolioData.githubUsername || 'ishaankor',
  avatar_url: `https://github.com/${portfolioData.githubUsername || 'ishaankor'}.png`,
  html_url: `https://github.com/${portfolioData.githubUsername || 'ishaankor'}`,
  name: portfolioData.name || 'Ishaan Koradia',
  bio: portfolioData.bio || '',
  public_repos: 23,
  created_at: '2022-01-01T00:00:00Z',
}) as unknown as GitHubUser;

const FALLBACK_REPOS: GitHubRepo[] = (githubCache?.repos || []) as unknown as GitHubRepo[];
const FALLBACK_COMMITS: CommitItem[] = (githubCache?.commits || []) as unknown as CommitItem[];
const FALLBACK_CALENDAR: ContributionCalendar | null = ((githubCache as any)?.contributionCalendar || null) as unknown as (ContributionCalendar | null);

const GITHUB_API_ENDPOINT =
  process.env.NEXT_PUBLIC_GITHUB_FETCHER_URL ||
  'https://personal-meta-fetcher.vercel.app/api/github';

const GITHUB_COMMITS_ENDPOINT =
  process.env.NEXT_PUBLIC_GITHUB_COMMITS_URL ||
  'https://personal-meta-fetcher.vercel.app/api/commits';

export function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'recently';
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

// Module-level singleton state to share across all mounting components
let sharedData: GitHubTelemetryData = {
  user: FALLBACK_USER,
  repos: FALLBACK_REPOS,
  commits: FALLBACK_COMMITS,
  contributionCalendar: FALLBACK_CALENDAR,
  lastPolledTime: '',
  loading: false,
};

let inFlightPromise: Promise<GitHubTelemetryData | null> | null = null;
let lastFetchTimestamp = 0;
const subscribers = new Set<() => void>();
let pollingTimer: NodeJS.Timeout | null = null;
const CLIENT_CACHE_TTL_MS = 60 * 1000; // 1 minute live stream polling window

function notifySubscribers() {
  subscribers.forEach((callback) => {
    try {
      callback();
    } catch {
      // Ignore subscriber notification error
    }
  });
}

async function fetchGitHubDataSingleton(force = false): Promise<GitHubTelemetryData | null> {
  const now = Date.now();
  // Return cached result if within TTL unless forced
  if (!force && lastFetchTimestamp > 0 && now - lastFetchTimestamp < CLIENT_CACHE_TTL_MS) {
    return sharedData;
  }

  // Deduplicate in-flight fetch
  if (inFlightPromise) {
    return inFlightPromise;
  }

  inFlightPromise = (async () => {
    try {
      const fetchHeaders = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        Pragma: 'no-cache',
      };

      const metaUrl = `${GITHUB_API_ENDPOINT}${GITHUB_API_ENDPOINT.includes('?') ? '&' : '?'}_t=${Date.now()}`;
      const commitsUrl = `${GITHUB_COMMITS_ENDPOINT}${GITHUB_COMMITS_ENDPOINT.includes('?') ? '&' : '?'}_t=${Date.now()}`;

      // Concurrently query metadata and the dedicated real-time commit stream
      const [metaResult, commitsResult] = await Promise.allSettled([
        fetch(metaUrl, { cache: 'no-store', headers: fetchHeaders }),
        fetch(commitsUrl, { cache: 'no-store', headers: fetchHeaders }),
      ]);

      let hasChanges = false;
      let commitsLoadedFromDedicated = false;

      // 1. Process dedicated fast commit stream
      if (commitsResult.status === 'fulfilled' && commitsResult.value.ok) {
        try {
          const commitsPayload = await commitsResult.value.json();
          if (Array.isArray(commitsPayload.commits) && commitsPayload.commits.length > 0) {
            sharedData.commits = commitsPayload.commits.map((c: CommitItem) => ({
              ...c,
              timeAgo: formatTimeAgo(c.date) || c.timeAgo,
            }));
            hasChanges = true;
            commitsLoadedFromDedicated = true;
          }
        } catch {
          // commits payload parse error fallback
        }
      }

      // 2. Process primary GitHub metadata (user profile, repos, calendar)
      if (metaResult.status === 'fulfilled' && metaResult.value.ok) {
        try {
          const payload = await metaResult.value.json();

          if (payload.user && JSON.stringify(payload.user) !== JSON.stringify(sharedData.user)) {
            sharedData.user = payload.user;
            hasChanges = true;
          }
          if (Array.isArray(payload.repos) && payload.repos.length > 0) {
            sharedData.repos = payload.repos;
            hasChanges = true;
          }
          // Fallback to meta commits if dedicated commits endpoint was not available or empty
          if (!commitsLoadedFromDedicated && Array.isArray(payload.commits) && payload.commits.length > 0) {
            sharedData.commits = payload.commits.map((c: CommitItem) => ({
              ...c,
              timeAgo: formatTimeAgo(c.date) || c.timeAgo,
            }));
            hasChanges = true;
          }
          if (payload.contributionCalendar) {
            sharedData.contributionCalendar = payload.contributionCalendar;
            hasChanges = true;
          }
        } catch {
          // meta payload parse error fallback
        }
      }

      if (sharedData.commits.length > 0 && !hasChanges) {
        // Re-evaluate relative time for existing commits
        sharedData.commits = sharedData.commits.map((c: CommitItem) => ({
          ...c,
          timeAgo: formatTimeAgo(c.date) || c.timeAgo,
        }));
        hasChanges = true;
      }

      sharedData.lastPolledTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      lastFetchTimestamp = Date.now();

      if (hasChanges) {
        notifySubscribers();
      }
      return sharedData;
    } catch {
      // Retain graceful cache silently without failing UI
    } finally {
      inFlightPromise = null;
    }
    return sharedData;
  })();

  return inFlightPromise;
}

export function useGitHubData() {
  const [data, setData] = useState<GitHubTelemetryData>(sharedData);

  useEffect(() => {
    const handleUpdate = () => {
      setData({ ...sharedData });
    };

    subscribers.add(handleUpdate);

    // Initial fetch if never fetched or expired
    if (lastFetchTimestamp === 0 || Date.now() - lastFetchTimestamp >= CLIENT_CACHE_TTL_MS) {
      fetchGitHubDataSingleton();
    }

    // Manage single shared polling loop (force fresh fetch every 1 minute)
    if (subscribers.size === 1 && !pollingTimer) {
      pollingTimer = setInterval(() => {
        fetchGitHubDataSingleton(true);
      }, CLIENT_CACHE_TTL_MS);
    }

    return () => {
      subscribers.delete(handleUpdate);
      if (subscribers.size === 0 && pollingTimer) {
        clearInterval(pollingTimer);
        pollingTimer = null;
      }
    };
  }, []);

  const refresh = useCallback(() => {
    return fetchGitHubDataSingleton(true);
  }, []);

  return {
    ...data,
    refresh,
  };
}
