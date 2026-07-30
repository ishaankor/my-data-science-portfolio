import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

console.log('📡 Generating complete historical loc.csv from git log (2025-01-11 to today)...');

try {
  const gitLogOutput = execSync(
    'git log --pretty=format:"COMMIT_HEADER|%h|%an|%ad|%s" --date=iso-strict --numstat',
    { encoding: 'utf8' }
  );

  const lines = gitLogOutput.split('\n');
  // One row per file per commit — stores real added/deleted counts
  const csvRows = ['file,added,deleted,type,commit,author,date,time,timezone,datetime,depth,message'];

  let currentCommit = null;

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith('COMMIT_HEADER|')) {
      const parts = line.split('|');
      const hash = parts[1];
      const author = parts[2];
      const isoDate = parts[3]; // e.g. 2026-07-29T21:03:19-07:00
      const message = parts[4] || 'update codebase';

      // Skip bot commits
      if (message.includes('update loc.csv') || author.includes('github-actions')) {
        currentCommit = null;
        return;
      }

      // Parse date/time directly from the original ISO string to preserve local timezone
      const dateStr = isoDate.slice(0, 10);        // "2026-07-29"
      const timeStr = isoDate.slice(11, 19);       // "21:03:19"
      const tzStr = isoDate.slice(19) || '-08:00'; // "-07:00"

      currentCommit = {
        hash,
        author,
        date: dateStr,
        time: timeStr,
        timezone: tzStr,
        datetime: isoDate,
        message: message.replace(/,/g, ' '),
      };
    } else if (currentCommit) {
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        const added = parseInt(parts[0]) || 0;
        const deleted = parseInt(parts[1]) || 0;
        const filePath = parts[2];

        // Skip binary, build output, and generated files
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

        // One row per file per commit with REAL added/deleted counts
        csvRows.push(
          `${filePath},${added},${deleted},${ext},${currentCommit.hash},${currentCommit.author},${currentCommit.date},${currentCommit.time},${currentCommit.timezone},${currentCommit.datetime},${depth},"${currentCommit.message}"`
        );
      }
    }
  });

  const publicCsvPath = path.join(process.cwd(), 'public', 'loc.csv');
  const metaCsvPath = path.join(process.cwd(), 'meta', 'loc.csv');

  const csvContent = csvRows.join('\n');
  fs.writeFileSync(publicCsvPath, csvContent, 'utf8');
  if (fs.existsSync(path.dirname(metaCsvPath))) {
    fs.writeFileSync(metaCsvPath, csvContent, 'utf8');
  }

  console.log(`✅ Generated loc.csv with ${csvRows.length - 1} file-commit rows (accurate added/deleted counts)!`);
} catch (err) {
  console.error('Error generating loc.csv:', err);
}
