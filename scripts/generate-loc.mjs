import fs from 'fs';
import { execSync } from 'child_process';
import path from 'path';

console.log('📡 Generating complete historical loc.csv from git log (2025-01-11 to today)...');

try {
  // Extract git log --numstat with commit info
  const gitLogOutput = execSync(
    'git log --pretty=format:"COMMIT_HEADER|%h|%an|%ad|%s" --date=iso-strict --numstat',
    { encoding: 'utf8' }
  );

  const lines = gitLogOutput.split('\n');
  const csvRows = ['file,line,type,commit,author,date,time,timezone,datetime,depth,length,message'];

  let currentCommit = null;

  lines.forEach((line) => {
    line = line.trim();
    if (!line) return;

    if (line.startsWith('COMMIT_HEADER|')) {
      const parts = line.split('|');
      const hash = parts[1];
      const author = parts[2];
      const isoDate = parts[3]; // e.g. 2025-01-11T15:48:05-08:00
      const message = parts[4] || 'update codebase';

      // Ignore bot commits that just updated loc.csv
      if (message.includes('update loc.csv') || author.includes('github-actions')) {
        currentCommit = null;
        return;
      }

      const dt = new Date(isoDate);
      const dateStr = dt.toISOString().split('T')[0];
      const timeStr = dt.toTimeString().split(' ')[0];
      const tzStr = isoDate.slice(-6) || '-08:00';

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

        // Skip binary or build output files
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
        const lineCount = Math.max(1, Math.min(added + deleted, 50));

        for (let i = 1; i <= lineCount; i++) {
          csvRows.push(
            `${filePath},${i},${ext},${currentCommit.hash},${currentCommit.author},${currentCommit.date},${currentCommit.time},${currentCommit.timezone},${currentCommit.datetime},${depth},30,"${currentCommit.message}"`
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

  console.log(`✅ Successfully generated complete loc.csv with ${csvRows.length} rows across historical commits!`);
} catch (err) {
  console.error('Error generating loc.csv:', err);
}
