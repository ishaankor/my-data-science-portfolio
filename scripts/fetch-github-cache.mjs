import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = 'ishaankor';
const OUTPUT_PATH = path.join(__dirname, '../data/github-cache.json');

function formatTimeAgo(dateString) {
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

const BASE_FALLBACK_REPOS = [
  { id: 1, name: 'my-data-science-portfolio', language: 'TypeScript', html_url: 'https://github.com/ishaankor/my-data-science-portfolio', description: 'Modern Next.js 14 & Tailwind Data Science portfolio featuring live WebGL 3D scenes and GitHub analytics.', pushed_at: '2026-07-29T02:26:49Z' },
  { id: 2, name: 'my-personal-website', language: 'TypeScript', html_url: 'https://github.com/ishaankor/my-personal-website', description: 'Personal web application showcasing machine learning projects, interactive demos, and AI automation.', pushed_at: '2026-07-29T02:33:41Z' },
  { id: 3, name: 'Transformi', language: 'Python', html_url: 'https://github.com/ishaankor/Transformi', description: 'AI-driven Discord automation bot with real-time web scraping, natural language parsing, and automated notifications.', pushed_at: '2026-07-27T23:30:29Z' },
  { id: 4, name: 'NotesTaker-AI', language: 'Python', html_url: 'https://github.com/ishaankor/NotesTaker-AI', description: 'Real-time lecture audio transcription and AI summarizer tool built with Whisper API and Gemini LLMs.', pushed_at: '2026-07-27T22:15:10Z' },
  { id: 5, name: 'Datafy', language: 'Python', html_url: 'https://github.com/ishaankor/Datafy', description: 'Automated data cleaning, feature extraction, and exploratory analysis pipeline for high-dimensional datasets.', pushed_at: '2026-07-27T21:25:02Z' },
];

function getAuthHeaders() {
  const headers = { 'User-Agent': 'Node-Fetch-GitHub-Cache' };
  let token = '';

  const envPath = path.join(__dirname, '../.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const match = envContent.match(/GITHUB_TOKEN=([^\r\n]+)/);
    if (match) {
      token = match[1].trim();
    }
  }

  if (!token) {
    token = process.env.GITHUB_TOKEN?.trim() || '';
  }

  if (token && token.length > 0) {
    headers['Authorization'] = token.startsWith('github_pat_') ? `Bearer ${token}` : `token ${token}`;
  }

  return headers;
}

async function fetchAllLiveRepos(headers) {
  let allRepos = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const url = `https://api.github.com/users/${USERNAME}/repos?per_page=100&page=${page}&sort=pushed`;
    try {
      const res = await fetch(url, { headers });

      if (!res.ok) {
        if (page === 1) {
          console.warn(`⚠️ GitHub API returned status ${res.status}. Utilizing fallback repository cache.`);
        }
        break;
      }

      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        const parsed = data.map((r) => ({
          id: r.id,
          name: r.name,
          language: r.language,
          html_url: r.html_url,
          description: r.description,
          pushed_at: r.pushed_at,
          updated_at: r.updated_at,
        }));
        allRepos = allRepos.concat(parsed);

        if (data.length < 100) {
          hasMore = false;
        } else {
          page++;
        }
      } else {
        hasMore = false;
      }
    } catch (e) {
      console.warn(`⚠️ Network fetch error on page ${page}: ${e.message}`);
      hasMore = false;
    }
  }

  return allRepos;
}

async function fetchLiveCommits(repos, headers) {
  if (!Array.isArray(repos) || repos.length === 0) return [];

  const topActive = [...repos]
    .sort((a, b) => new Date(b.pushed_at).getTime() - new Date(a.pushed_at).getTime())
    .slice(0, 5);

  console.log(`⚡ Authenticated commit sync across recent repos (${topActive.slice(0, 3).map(r => r.name).join(', ')})...`);

  const commitPromises = topActive.map(async (repo) => {
    try {
      const url = `https://api.github.com/repos/${USERNAME}/${repo.name}/commits?per_page=5`;
      const res = await fetch(url, { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          return data.map((c) => {
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
      console.warn(`⚠️ Error fetching commits for ${repo.name}: ${e.message}`);
    }
    return [];
  });

  const nested = await Promise.all(commitPromises);
  const allCommits = nested.flat().filter(Boolean);

  const commitMap = new Map();
  allCommits.forEach((item) => commitMap.set(item.sha, item));

  return Array.from(commitMap.values())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);
}

async function generateGitHubCache() {
  console.log(`📡 Dynamically fetching all public GitHub data with token for @${USERNAME}...`);

  const headers = getAuthHeaders();
  let liveRepos = await fetchAllLiveRepos(headers);
  let repos = [];

  if (liveRepos.length > 0) {
    console.log(`✅ Successfully dynamically fetched ALL ${liveRepos.length} live repositories!`);
    repos = liveRepos;
  } else {
    console.log(`ℹ️ Live fetch returned 0 repos (offline or rate limited). Hydrating base cache.`);
    repos = BASE_FALLBACK_REPOS;
  }

  const commits = await fetchLiveCommits(repos, headers);
  console.log(`✅ Successfully fetched ${commits.length} recent commits across all repositories!`);

  const cacheData = {
    updatedAt: new Date().toISOString(),
    totalRepos: repos.length,
    repos,
    commits,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(cacheData, null, 2), 'utf8');
  console.log(`📦 GitHub data cache dynamically written to ${OUTPUT_PATH} (${repos.length} repos, ${commits.length} commits)`);
}

generateGitHubCache();
