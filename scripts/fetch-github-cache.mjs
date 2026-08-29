import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, '../data/github-cache.json');
const API_URL = 'https://github-meta-fetcher.vercel.app/api/github';
const DIRECT_GITHUB_URL = 'https://api.github.com/users/ishaankor/repos?per_page=100&sort=created';

async function generateGitHubCache() {
  console.log('📡 Prebuild GitHub cache script running...');
  try {
    // 1. Try fetching from GitHub Meta Fetcher
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.repos || data.user)) {
        // Fetch direct github repo metadata to ensure created_at is present
        let reposWithCreated = data.repos || [];
        try {
          const directRes = await fetch(DIRECT_GITHUB_URL, {
            headers: { 'User-Agent': 'Portfolio-Build-Script' },
            cache: 'no-store',
          });
          if (directRes.ok) {
            const directRepos = await directRes.json();
            const directMap = new Map(directRepos.map((r) => [r.name, r]));
            reposWithCreated = reposWithCreated.map((r) => {
              const match = directMap.get(r.name);
              return {
                ...r,
                created_at: r.created_at || match?.created_at || r.pushed_at,
              };
            });
          }
        } catch {
          // Keep proxy repos
        }

        fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
        fs.writeFileSync(
          OUTPUT_PATH,
          JSON.stringify(
            {
              updatedAt: new Date().toISOString(),
              totalRepos: reposWithCreated.length || data.user?.public_repos || 20,
              user: data.user,
              repos: reposWithCreated,
              commits: data.commits || [],
              contributionCalendar: data.contributionCalendar || null,
            },
            null,
            2
          ),
          'utf8'
        );
        console.log(`✅ Successfully updated github-cache.json with ${reposWithCreated.length} repositories!`);
        return;
      }
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
