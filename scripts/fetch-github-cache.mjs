import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const USERNAME = 'ishaankor';
const OUTPUT_PATH = path.join(__dirname, '../data/github-cache.json');

// Base fallback registry of repositories used during offline/rate-limit builds
const BASE_FALLBACK_REPOS = [
  { id: 1, name: 'my-data-science-portfolio', language: 'TypeScript', html_url: 'https://github.com/ishaankor/my-data-science-portfolio', description: 'Modern Next.js 14 & Tailwind Data Science portfolio featuring live WebGL 3D scenes and GitHub analytics.', pushed_at: '2026-07-29T02:26:49Z' },
  { id: 2, name: 'my-personal-website', language: 'TypeScript', html_url: 'https://github.com/ishaankor/my-personal-website', description: 'Personal web application showcasing machine learning projects, interactive demos, and AI automation.', pushed_at: '2026-07-29T02:33:41Z' },
  { id: 3, name: 'Transformi', language: 'Python', html_url: 'https://github.com/ishaankor/Transformi', description: 'AI-driven Discord automation bot with real-time web scraping, natural language parsing, and automated notifications.', pushed_at: '2026-07-27T23:30:29Z' },
  { id: 4, name: 'NotesTaker-AI', language: 'Python', html_url: 'https://github.com/ishaankor/NotesTaker-AI', description: 'Real-time lecture audio transcription and AI summarizer tool built with Whisper API and Gemini LLMs.', pushed_at: '2026-07-27T22:15:10Z' },
  { id: 5, name: 'Datafy', language: 'Python', html_url: 'https://github.com/ishaankor/Datafy', description: 'Automated data cleaning, feature extraction, and exploratory analysis pipeline for high-dimensional datasets.', pushed_at: '2026-07-27T21:25:02Z' },
  { id: 6, name: 'Twitter-Scraping-AI', language: 'Python', html_url: 'https://github.com/ishaankor/Twitter-Scraping-AI', description: 'Headless browser web scraper and computer vision pipeline for automated trend extraction and sentiment modeling.', pushed_at: '2026-07-27T20:45:00Z' },
  { id: 7, name: 'Daily-Motivation', language: 'Python', html_url: 'https://github.com/ishaankor/Daily-Motivation', description: 'Automated quote generator and sentiment notification bot deployed with serverless scheduled cron jobs.', pushed_at: '2026-07-27T19:10:00Z' },
  { id: 8, name: 'Cognitive-ML-Models', language: 'Jupyter Notebook', html_url: 'https://github.com/ishaankor/Cognitive-ML-Models', description: 'UCSD Cognitive Science ML research notebooks evaluating neural computation, backpropagation, and classification.', pushed_at: '2026-07-26T18:20:00Z' },
  { id: 9, name: 'ishaankor', language: 'Shell', html_url: 'https://github.com/ishaankor/ishaankor', description: 'GitHub Profile README containing interactive status badges, tech stack metrics, and open source activity logs.', pushed_at: '2026-07-27T20:21:30Z' },
];

async function fetchAllLiveRepos() {
  const headers = { 'User-Agent': 'Node-Fetch-GitHub-Cache' };
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_TOKEN.trim().length > 0) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN.trim()}`;
  }

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

async function generateGitHubCache() {
  console.log(`📡 Dynamically fetching all public GitHub repositories for @${USERNAME}...`);

  let liveRepos = await fetchAllLiveRepos();
  let repos = [];

  if (liveRepos.length > 0) {
    console.log(`✅ Successfully dynamically fetched ALL ${liveRepos.length} live repositories from GitHub API!`);
    repos = liveRepos;
  } else {
    console.log(`ℹ️ Live fetch returned 0 repos (offline or rate limited). Hydrating base cache.`);
    repos = BASE_FALLBACK_REPOS;
  }

  const cacheData = {
    updatedAt: new Date().toISOString(),
    totalRepos: repos.length,
    repos,
  };

  fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(cacheData, null, 2), 'utf8');
  console.log(`📦 GitHub data cache dynamically written to ${OUTPUT_PATH} (${repos.length} repositories total)`);
}

generateGitHubCache();
