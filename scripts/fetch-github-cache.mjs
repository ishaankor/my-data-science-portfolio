import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUTPUT_PATH = path.join(__dirname, '../data/github-cache.json');

async function generateGitHubCache() {
  console.log('📡 Prebuild GitHub cache script running...');
  if (!fs.existsSync(OUTPUT_PATH)) {
    const defaultData = {
      updatedAt: new Date().toISOString(),
      user: { login: 'ishaankor', name: 'Ishaan Koradia', public_repos: 23 },
      repos: [],
      commits: [],
    };
    fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(defaultData, null, 2), 'utf8');
  }
}

generateGitHubCache();
