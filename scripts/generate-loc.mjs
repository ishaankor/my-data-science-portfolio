import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

console.log('📡 Generating live up-to-date loc.csv from git log...');

try {
  // Extract git log --numstat with commit info
  const gitLogOutput = execSync(
    'git log --pretty=format:"COMMIT_HEADER|%h|%an|%ad|%at" --date=iso-strict --numstat',
    { encoding: 'utf8' }
  );

  const lines = gitLogOutput.split('\n');
  const csvRows = ['file,line,type,commit,author,date,time,timezone,datetime,depth,length'];

  let currentCommit = null;

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith('COMMIT_HEADER|')) {
      const parts = line.split('|');
      const hash = parts[1];
      const author = parts[2];
      const isoDate = parts[3]; // e.g. 2026-07-29T20:55:47-07:00
      const timestamp = parts[4];

      const dt = new Date(isoDate);
      const dateStr = dt.toISOString().split('T')[0];
      const timeStr = dt.toTimeString().split(' ')[0];
      const tzStr = isoDate.slice(-6) || '-07:00';

      currentCommit = {
        hash,
        author,
        date: dateStr,
        time: timeStr,
        timezone: tzStr,
        datetime: isoDate,
      };
    } else if (currentCommit) {
      const parts = line.split(/\s+/);
      if (parts.length >= 3) {
        const added = parseInt(parts[0]) || 0;
        const deleted = parseInt(parts[1]) || 0;
        const filePath = parts[2];

        // Skip binary or node_modules files
        if (filePath.includes('node_modules') || filePath.includes('.next') || filePath.endsWith('.avif') || filePath.endsWith('.png') || filePath.endsWith('.jpg')) {
          return;
        }

        const ext = path.extname(filePath).replace('.', '') || 'code';
        const depth = (filePath.match(/\//g) || []).length;
        const lineCount = Math.max(1, added + deleted);

        for (let i = 1; i <= Math.min(lineCount, 50); i++) {
          csvRows.push(
            `${filePath},${i},${ext},${currentCommit.hash},${currentCommit.author},${currentCommit.date},${currentCommit.time},${currentCommit.timezone},${currentCommit.datetime},${depth},30`
          );
        }
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

  console.log(`✅ Successfully generated loc.csv with ${csvRows.length} rows up to today!`);
} catch (err) {
  console.error('Error generating loc.csv:', err);
}
