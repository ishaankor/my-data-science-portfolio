import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, '../data/github-cache.json');
const API_URL = 'https://personal-meta-fetcher.vercel.app/api/github';
const COMMITS_API_URL = 'https://personal-meta-fetcher.vercel.app/api/commits';

async function generateGitHubCache() {
  console.log('📡 Prebuild GitHub cache script running via personal-meta-fetcher proxy...');
  try {
    let existingData = null;
    try {
      if (fs.existsSync(OUTPUT_PATH)) {
        existingData = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
      }
    } catch {}

    const existingCalendar = existingData?.contributionCalendar || null;
    const existingRepos = (Array.isArray(existingData?.repos) && existingData.repos.length > 0) ? existingData.repos : [];
    const existingUser = existingData?.user || null;
    const existingCommits = (Array.isArray(existingData?.commits) && existingData.commits.length > 0) ? existingData.commits : [];

    // Concurrently query both proxy endpoints to guarantee fresh commits and contributionCalendar
    let commitsData = null;
    let metaData = null;

    const [commitsRes, metaRes] = await Promise.allSettled([
      fetch(COMMITS_API_URL, { cache: 'no-store' }),
      fetch(API_URL, { cache: 'no-store' }),
    ]);

    if (commitsRes.status === 'fulfilled' && commitsRes.value?.ok) {
      commitsData = await commitsRes.value.json().catch(() => null);
    }
    if (metaRes.status === 'fulfilled' && metaRes.value?.ok) {
      metaData = await metaRes.value.json().catch(() => null);
    }

    // Only update cache if at least one remote fetch succeeded and returned valid telemetry
    if (commitsData || metaData) {
      const user = commitsData?.user || metaData?.user || existingUser;
      const repos = (commitsData?.repos && commitsData.repos.length > 0)
        ? commitsData.repos
        : ((metaData?.repos && metaData.repos.length > 0) ? metaData.repos : existingRepos);
      const commits = (commitsData?.commits && commitsData.commits.length > 0)
        ? commitsData.commits
        : ((metaData?.commits && metaData.commits.length > 0) ? metaData.commits : existingCommits);
      const contributionCalendar = commitsData?.contributionCalendar || metaData?.contributionCalendar || existingCalendar;

      fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
      fs.writeFileSync(
        OUTPUT_PATH,
        JSON.stringify(
          {
            updatedAt: new Date().toISOString(),
            totalRepos: repos.length || user?.public_repos || 21,
            user: user,
            repos: repos,
            commits: commits,
            contributionCalendar: contributionCalendar,
          },
          null,
          2
        ),
        'utf8'
      );
      console.log(`✅ Successfully updated github-cache.json via proxy (${repos.length} repos, ${commits.length} commits, calendar total: ${contributionCalendar?.totalContributions || 0})!`);
      return;
    } else {
      console.log('ℹ️ Proxy unreachable or offline during prebuild, keeping existing cached telemetry.');
      return;
    }
  } catch (err) {
    console.warn('⚠️ Network fetch failed during prebuild, retaining existing cache if available.', err.message);
  }

  if (!fs.existsSync(OUTPUT_PATH)) {
    const defaultData = {
      updatedAt: new Date().toISOString(),
      user: { login: 'ishaankor', name: 'Ishaan Koradia', public_repos: 20 },
      repos: [],
      commits: [],
    };
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

generateGitHubCache();
