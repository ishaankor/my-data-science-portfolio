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
    // 1. Fetch from proxy backend (try primary meta, fallback to fast stream)
    let res = await fetch(COMMITS_API_URL, { cache: 'no-store' }).catch(() => null);
    if (!res || !res.ok) {
      res = await fetch(API_URL, { cache: 'no-store' }).catch(() => null);
    }

    if (res && res.ok) {
      const data = await res.json();
      if (data && (data.repos || data.user || data.commits)) {
        const repos = data.repos || [];

        let existingCalendar = null;
        try {
          if (fs.existsSync(OUTPUT_PATH)) {
            const old = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
            existingCalendar = old.contributionCalendar || null;
          }
        } catch {}

        fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
        fs.writeFileSync(
          OUTPUT_PATH,
          JSON.stringify(
            {
              updatedAt: new Date().toISOString(),
              totalRepos: repos.length || data.user?.public_repos || 21,
              user: data.user,
              repos: repos,
              commits: data.commits || [],
              contributionCalendar: data.contributionCalendar || existingCalendar,
            },
            null,
            2
          ),
          'utf8'
        );
        console.log(`✅ Successfully updated github-cache.json via proxy with ${repos.length} repositories!`);
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
