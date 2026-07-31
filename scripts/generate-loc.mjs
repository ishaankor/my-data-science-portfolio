import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

console.log('📡 Generating complete historical loc.csv & loc-static.json from git log (2025-01-11 to today)...');

try {
  // Sanitize process.env to remove Git hook environment variables (GIT_DIR, GIT_INDEX_FILE, etc.)
  // that cause git log to restrict output to a single commit when executed during git hooks.
  const cleanEnv = { ...process.env };
  delete cleanEnv.GIT_DIR;
  delete cleanEnv.GIT_WORK_TREE;
  delete cleanEnv.GIT_INDEX_FILE;
  delete cleanEnv.GIT_OBJECT_DIRECTORY;
  delete cleanEnv.GIT_ALTERNATE_OBJECT_DIRECTORIES;
  delete cleanEnv.GIT_PREFIX;

  const gitLogOutput = execSync(
    'git log --pretty=format:"COMMIT_HEADER|%h|%an|%ae|%ad|%s" --date=iso-strict --numstat',
    { encoding: 'utf8', env: cleanEnv }
  );

  const lines = gitLogOutput.split('\n');
  const csvRows = ['file,added,deleted,type,commit,author,date,time,timezone,datetime,depth,message'];
  const jsonRecords = [];

  let currentCommit = null;
  let commitHasRows = false;

  const pushCommitRecord = (commit, file = 'repository', added = 0, deleted = 0, ext = 'git', depth = 0) => {
    csvRows.push(
      `${file},${added},${deleted},${ext},${commit.hash},${commit.author},${commit.date},${commit.time},${commit.timezone},${commit.datetime},${depth},"${commit.message}"`
    );
    jsonRecords.push({
      file,
      added,
      deleted,
      type: ext,
      commit: commit.hash,
      author: commit.author,
      date: commit.date,
      time: commit.time,
      timezone: commit.timezone,
      datetime: commit.datetime,
      depth,
      message: commit.message,
    });
  };

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith('COMMIT_HEADER|')) {
      if (currentCommit && !commitHasRows) {
        pushCommitRecord(currentCommit);
      }

      const parts = line.split('|');
      const hash = parts[1];
      const authorName = parts[2] || '';
      const authorEmail = parts[3] || '';
      const isoDate = parts[4];
      const message = parts[5] || 'update codebase';

      const fullAuthor = `${authorName} ${authorEmail}`.toLowerCase();
      const isBot = fullAuthor.includes('github-actions') || fullAuthor.includes('bot') || authorEmail.includes('action@github.com');
      const isWorkflowMsg = message.includes('[skip ci]') || message.includes('chore: update loc.csv') || message.includes('update code statistics');

      if (isBot || isWorkflowMsg) {
        currentCommit = null;
        commitHasRows = false;
        return;
      }

      const dateStr = isoDate.slice(0, 10);
      const timeStr = isoDate.slice(11, 19);
      const tzStr = isoDate.slice(19) || '-08:00';

      currentCommit = {
        hash,
        author: authorName || 'Ishaan Kor',
        date: dateStr,
        time: timeStr,
        timezone: tzStr,
        datetime: isoDate,
        message: message.replace(/"/g, "'"),
      };
      commitHasRows = false;
    } else if (currentCommit) {
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        const added = parseInt(parts[0], 10) || 0;
        const deleted = parseInt(parts[1], 10) || 0;
        const filePath = parts[2];

        if (
          filePath.includes('node_modules') ||
          filePath.includes('.next') ||
          filePath.includes('out/') ||
          filePath.includes('loc.csv') ||
          filePath.endsWith('.avif') ||
          filePath.endsWith('.png') ||
          filePath.endsWith('.jpg')
        ) {
          return;
        }

        const ext = path.extname(filePath).replace('.', '') || 'code';
        const depth = (filePath.match(/\//g) || []).length;

        pushCommitRecord(currentCommit, filePath, added, deleted, ext, depth);
        commitHasRows = true;
      }
    }
  });

  if (currentCommit && !commitHasRows) {
    pushCommitRecord(currentCommit);
  }

  const publicCsvPath = path.join(process.cwd(), 'public', 'loc.csv');
  const metaCsvPath = path.join(process.cwd(), 'meta', 'loc.csv');
  const staticJsonPath = path.join(process.cwd(), 'data', 'loc-static.json');

  let existingCount = 0;
  if (fs.existsSync(staticJsonPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(staticJsonPath, 'utf8'));
      if (Array.isArray(existing)) existingCount = existing.length;
    } catch (e) {}
  }

  // SAFEGUARD FOR CLOUDFLARE PAGES & CI SHALLOW CLONES (--depth 1):
  // Cloudflare Pages clones repositories with a shallow depth 1.
  // If git log yields 0 or fewer records than the committed loc-static.json, preserve the full committed dataset!
  if (existingCount > 0 && jsonRecords.length < Math.min(existingCount, 50)) {
    console.log(`⚠️ Shallow clone detected on build server (git log produced ${jsonRecords.length} records, committed dataset has ${existingCount}). Preserving full committed loc-static.json!`);
  } else {
    const csvContent = csvRows.join('\n');
    fs.writeFileSync(publicCsvPath, csvContent, 'utf8');
    if (fs.existsSync(path.dirname(metaCsvPath))) {
      fs.writeFileSync(metaCsvPath, csvContent, 'utf8');
    }
    const dataDir = path.dirname(staticJsonPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(staticJsonPath, JSON.stringify(jsonRecords, null, 2), 'utf8');
    console.log(`✅ Generated loc.csv (${csvRows.length - 1} rows) and loc-static.json (${jsonRecords.length} records)!`);
  }
} catch (err) {
  console.error('⚠️ Warning during loc telemetry generation (preserving existing loc-static.json):', err.message);
}
