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

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith('COMMIT_HEADER|')) {
      const parts = line.split('|');
      const hash = parts[1];
      const authorName = parts[2] || '';
      const authorEmail = parts[3] || '';
      const isoDate = parts[4]; // e.g. 2026-07-29T21:03:19-07:00
      const message = parts[5] || 'update codebase';

      // Filter out automated bot runs and [skip ci] maintenance commits
      const fullAuthor = `${authorName} ${authorEmail}`.toLowerCase();
      const isBot = fullAuthor.includes('github-actions') || fullAuthor.includes('bot');
      const isWorkflowMsg = message.includes('[skip ci]') || message.includes('chore: update loc.csv');

      if (isBot || isWorkflowMsg) {
        currentCommit = null;
        return;
      }

      // Parse date/time directly from original ISO string to preserve local timezone
      const dateStr = isoDate.slice(0, 10);        // "2026-07-29"
      const timeStr = isoDate.slice(11, 19);       // "21:03:19"
      const tzStr = isoDate.slice(19) || '-08:00'; // "-07:00"

      currentCommit = {
        hash,
        author: authorName || 'Ishaan Kor',
        date: dateStr,
        time: timeStr,
        timezone: tzStr,
        datetime: isoDate,
        message: message.replace(/"/g, "'"),
      };
    } else if (currentCommit) {
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        const added = parseInt(parts[0], 10) || 0;
        const deleted = parseInt(parts[1], 10) || 0;
        const filePath = parts[2];

        // Skip binary, build output, and generated telemetry files
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

        csvRows.push(
          `${filePath},${added},${deleted},${ext},${currentCommit.hash},${currentCommit.author},${currentCommit.date},${currentCommit.time},${currentCommit.timezone},${currentCommit.datetime},${depth},"${currentCommit.message}"`
        );

        jsonRecords.push({
          file: filePath,
          added,
          deleted,
          type: ext,
          commit: currentCommit.hash,
          author: currentCommit.author,
          date: currentCommit.date,
          time: currentCommit.time,
          timezone: currentCommit.timezone,
          datetime: currentCommit.datetime,
          depth,
          message: currentCommit.message,
        });
      }
    }
  });

  const publicCsvPath = path.join(process.cwd(), 'public', 'loc.csv');
  const metaCsvPath = path.join(process.cwd(), 'meta', 'loc.csv');
  const staticJsonPath = path.join(process.cwd(), 'data', 'loc-static.json');

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
} catch (err) {
  console.error('Error generating loc telemetry:', err);
}
