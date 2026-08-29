import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, '../data/github-cache.json');
const API_URL = 'https://github-meta-fetcher.vercel.app/api/github';

async function generateGitHubCache() {
  console.log('📡 Prebuild GitHub cache script running...');
  try {
    const res = await fetch(API_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.repos || data.user)) {
        fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
        fs.writeFileSync(
          OUTPUT_PATH,
          JSON.stringify(
            {
              updatedAt: new Date().toISOString(),
              totalRepos: data.repos?.length || data.user?.public_repos || 23,
              user: data.user,
              repos: data.repos || [],
              commits: data.commits || [],
              contributionCalendar: data.contributionCalendar || null,
            },
            null,
            2
          ),
          'utf8'
        );
        console.log(`✅ Successfully updated github-cache.json with ${data.repos?.length || 0} repositories!`);
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
