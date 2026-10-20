import { fetchJSON } from '../global.js';

let data = [];
let xScale, yScale;
let selectedCommits = [];
let filteredCommits = [];
let commitProgress = 100;
let commitMaxTime = new Date();
let processedFiles = new Set();
let ITEM_HEIGHT = 100;
let VISIBLE_COUNT = 10;
let totalHeight = 300;
let scrollContainer;
let spacer;
let itemsContainer;
let fileData = [];
let fileSizeProgress = 100;
let fileSizeItemHeight = 100;
let fileSizeVisibleCount = 10;
let totalFileSizeHeight = 300;
let fileSizeScrollContainer;
let fileSizeSpacer;
let fileSizeItemsContainer;

function updateScrollDimensions() {
  const commitCount = selectedCommits.length;
  totalHeight = Math.max(commitCount * ITEM_HEIGHT, 300);
  if (spacer && spacer.node()) {
    spacer.style('height', `${totalHeight}px`);
  }

  totalFileSizeHeight = Math.max(commitCount * fileSizeItemHeight, 300);
  if (fileSizeSpacer && fileSizeSpacer.node()) {
    fileSizeSpacer.style('height', `${totalFileSizeHeight}px`);
  }
}

function bindScrollEvents() {
  if (scrollContainer && scrollContainer.node()) {
    scrollContainer.on('scroll', () => {
      const scrollTop = scrollContainer.property('scrollTop');
      let startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
      const maxStartIndex = Math.max(0, selectedCommits.length - VISIBLE_COUNT);
      startIndex = Math.max(0, Math.min(startIndex, maxStartIndex));
      processedFiles = new Set();
      renderItems(startIndex);
    });
  }

  if (fileSizeScrollContainer && fileSizeScrollContainer.node()) {
    fileSizeScrollContainer.on('scroll', () => {
      const scrollTop = fileSizeScrollContainer.property('scrollTop');
      let startIndex = Math.floor(scrollTop / fileSizeItemHeight);
      const maxStartIndex = Math.max(0, selectedCommits.length - fileSizeVisibleCount);
      startIndex = Math.max(0, Math.min(startIndex, maxStartIndex));
      renderFileSizeItems(startIndex);
    });
  }
}

async function loadGitHubMeta(username) {
  const githubMeta = document.getElementById('github-meta');
  const githubActivity = document.getElementById('github-activity');
  if (!githubMeta || !githubActivity) return;

  try {
    let backendData = await fetchJSON('https://personal-meta-fetcher.vercel.app/api/commits');
    if (!backendData || !backendData.repos || backendData.repos.length === 0) {
      backendData = await fetchJSON('https://personal-meta-fetcher.vercel.app/api/github');
    }
    const user = backendData?.user || {};
    const repos = Array.isArray(backendData?.repos) ? backendData.repos : [];
    const events = Array.isArray(backendData?.commits) ? backendData.commits : [];

    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const languageCounts = repos.reduce((map, repo) => {
      if (!repo.language) return map;
      map.set(repo.language, (map.get(repo.language) || 0) + 1);
      return map;
    }, new Map());

    const topLanguages = [...languageCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4)
      .map(([language]) => language);

    const latestRepo = repos.reduce((latest, repo) => {
      if (!repo.pushed_at) return latest;
      if (!latest || new Date(repo.pushed_at) > new Date(latest.pushed_at)) {
        return repo;
      }
      return latest;
    }, null);

    const normalizedEvents = events.map((e) => {
      const type = e.type ? e.type.replace(/Event$/, '') : 'Commit';
      const dateStr = e.created_at || e.date || new Date().toISOString();
      const repoName = e.repo?.name || e.repoName || 'portfolio';
      const message = e.message || e.payload?.commits?.[0]?.message || 'codebase update';
      return { type, date: new Date(dateStr), repoName, message };
    });

    const activities = normalizedEvents.slice(0, 5);
    const eventTypes = [...normalizedEvents.reduce((map, event) => {
      map.set(event.type, (map.get(event.type) || 0) + 1);
      return map;
    }, new Map()).entries()].sort((a, b) => b[1] - a[1]);

    githubMeta.innerHTML = `
      <div class="panel-header">
        <p class="panel-label">GitHub summary</p>
        <h2>Live repo analytics</h2>
      </div>
      <div class="stats-grid">
        <div class="stat-block">
          <span class="stat-title">Repos</span>
          <span class="stat-value">${user.public_repos ?? repos.length ?? '—'}</span>
        </div>
        <div class="stat-block">
          <span class="stat-title">Followers</span>
          <span class="stat-value">${user.followers ?? '—'}</span>
        </div>
        <div class="stat-block">
          <span class="stat-title">Stars</span>
          <span class="stat-value">${totalStars}</span>
        </div>
        <div class="stat-block">
          <span class="stat-title">Top languages</span>
          <span class="stat-value">${topLanguages.join(', ') || 'None'}</span>
        </div>
        <div class="stat-block">
          <span class="stat-title">Latest push</span>
          <span class="stat-value">${latestRepo ? new Date(latestRepo.pushed_at).toLocaleDateString() : 'Active Today'}</span>
        </div>
        <div class="stat-block">
          <span class="stat-title">Latest repo</span>
          <span class="stat-value">${latestRepo ? `<a href="${latestRepo.html_url}" target="_blank">${latestRepo.name}</a>` : 'my-data-science-portfolio'}</span>
        </div>
      </div>
      <p class="panel-description">${activities.length ? `Most recent activity: ${activities[0].type} (${activities[0].message}) on ${activities[0].date.toLocaleDateString()}` : 'Live telemetry stream connected.'}</p>
    `;

    githubActivity.innerHTML = `
      <div class="panel-header">
        <p class="panel-label">GitHub activity</p>
        <h2>Recent public events</h2>
      </div>
      <div class="activity-list">
        ${activities.length
        ? activities.map(event => `<div class="activity-item">${event.type}: <strong>${event.message}</strong> in <em>${event.repoName}</em> — ${event.date.toLocaleDateString()}</div>`).join('')
        : '<div class="activity-item">Live repository activity active.</div>'}
      </div>
      <div class="stats-grid">
        <div class="stat-block">
          <span class="stat-title">Events loaded</span>
          <span class="stat-value">${events.length}</span>
        </div>
        <div class="stat-block">
          <span class="stat-title">Event types</span>
          <span class="stat-value">${eventTypes.length || 1}</span>
        </div>
      </div>
    `;
  } catch (err) {
    console.warn('Could not load GitHub live metadata:', err);
  }
}

function processFileData() {
  return d3.groups(data, (d) => d.file).map(([file, lines]) => {
    const firstLine = lines[0];
    let { author, date, time, timezone, datetime } = firstLine;
    const totalLines = lines.reduce((sum, d) => sum + (Number(d.added) || 0) + (Number(d.deleted) || 0), 0) || lines.length;
    return {
      file: typeof file === 'object' && file?.name ? file.name : file,
      totalLines,
      lines,
    };
  });
}

function renderFileSizeItems(startIndex) {
  if (!fileSizeItemsContainer || !fileSizeItemsContainer.node()) return;
  let commits = selectedCommits.length > 0 ? selectedCommits : processCommits();
  if (commits.length === 0) return;

  fileSizeItemsContainer.selectAll('div').remove();

  const endIndex = Math.min(startIndex + fileSizeVisibleCount, commits.length);
  let newFileSizeSlice = commits.slice(startIndex, endIndex);

  fileSizeItemsContainer.selectAll('div')
    .data(newFileSizeSlice)
    .enter()
    .append('div')
    .attr('class', 'file-size-item')
    .html((d, idx) => generateFileSizeNarrative(d, startIndex + idx))
    .style('position', 'absolute')
    .style('top', (_, idx) => `${(startIndex + idx) * fileSizeItemHeight}px`);

  const commitsUpTo = commits.slice(0, endIndex);
  updateFileDetails(commitsUpTo);
}

function generateFileSizeNarrative(commit, index) {
  return `
    <p>
      On ${new Date(commit.datetime).toLocaleString("en", { dateStyle: "full", timeStyle: "short" })}, I made
      <a href="${commit.url}" target="_blank">
        ${index > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}
      </a>. I edited ${commit.totalLines} lines across ${d3.rollups(commit.lines, D => D.length, d => d.file).length} files.
      Then I looked over all I had made, and I saw that it was very good.
    </p>
    `;
}

function updateFileSizeDetails(filteredFileData) {
  let fileDetailsContainer = d3.select('.file-size-details').selectAll('div').data(filteredFileData).enter().append('div');

  fileDetailsContainer.append('dt').text(d => d.file);

  fileDetailsContainer.append('dd')
    .html(d => `${d.lines.length} lines`);
}

async function loadFileData() {
  fileData = processFileData();
}

function processCommits() {
  if (!data || data.length === 0) return [];
  let commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
    let first = lines[0];
    let { author, date, time, timezone, datetime } = first;
    const totalLines = lines.reduce((sum, d) => sum + (Number(d.added) || 0) + (Number(d.deleted) || 0), 0) || lines.length;
    let ret = {
      id: commit,
      url: 'https://github.com/ishaankor/my-data-science-portfolio/commit/' + commit,
      author,
      date,
      time,
      timezone,
      datetime,
      hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
      totalLines,
    };

    Object.defineProperty(ret, 'lines', {
      value: lines,
      enumerable: false,
      writable: false,
      configurable: false
    });

    return ret;
  });

  // Sort chronologically (oldest to newest):
  // commit[0] = first commit ("my first commit, and it was glorious")
  // commit[last] = latest git commit
  commits.sort((a, b) => a.datetime - b.datetime);

  return commits;
}

async function loadData() {
  data = await d3.csv('loc.csv', (row) => ({
    ...row,
    line: Number(row.line) || 0,
    added: Number(row.added) || 0,
    deleted: Number(row.deleted) || 0,
    depth: Number(row.depth) || 0,
    length: Number(row.length) || Number(row.added) || 0,
    date: new Date(row.date + 'T00:00' + (row.timezone || '-07:00')),
    datetime: new Date(row.datetime || (row.date + 'T' + (row.time || '12:00:00') + (row.timezone || '-07:00'))),
  }));

  selectedCommits = processCommits();
  displayStats();
}

function filterCommitsByTime() {
  let commits = selectedCommits.length > 0 ? selectedCommits : processCommits();
  return commits.filter((commit) => commit.datetime <= commitMaxTime);
}

function displayStats() {
  let commits = filterCommitsByTime();
  if (!commits || commits.length === 0) {
    commits = selectedCommits.length > 0 ? selectedCommits : processCommits();
  }

  const allLines = commits.flatMap((c) => c.lines || []);
  let numFiles = d3.group(allLines, (d) => d.file).size;
  let maxDepth = d3.max(allLines, (d) => Number(d.depth) || 0) || 0;
  let longestLineLength = d3.max(allLines, (d) => Number(d.length) || Number(d.added) || 0) || 0;
  let maxLinesInCommit = d3.max(commits, (d) => d.totalLines) || 0;
  let totalLoc = allLines.reduce((sum, d) => sum + (Number(d.added) || 0), 0) || commits.length;

  const statsContainer = d3.select('#stats');
  statsContainer.selectAll('*').remove();
  statsContainer.attr('class', 'stats-summary');
  statsContainer.append('h2').attr('class', 'summary-title').text('Summary');
  const summaryGrid = statsContainer.append('div').attr('class', 'summary-grid');

  function addStat(title, value) {
    const statDiv = summaryGrid.append('div').attr('class', 'stat-block');
    statDiv.append('span').attr('class', 'stat-title').text(title);
    statDiv.append('span').attr('class', 'stat-value').text(value);
  }

  addStat('COMMITS', commits.length);
  addStat('FILES', numFiles);
  addStat('TOTAL LOC', totalLoc.toLocaleString());
  addStat('MAX DEPTH', maxDepth);
  addStat('LONGEST LINE', longestLineLength);
  addStat('MAX LINES', maxLinesInCommit.toLocaleString());
}

function updateScatterplot(filteredCommits) {
  d3.select('#chart svg').remove();

  const width = 1000;
  const height = 600;
  const margin = { top: 20, right: 20, bottom: 40, left: 50 };

  const svg = d3
    .select('#chart')
    .append('svg')
    .attr('viewBox', `0 0 ${width} ${height}`)
    .style('overflow', 'visible')
    .style('width', '100%')
    .style('height', 'auto');

  // ALWAYS anchor xScale across the FULL commit history range so the slider never glitches or shifts dots
  const baseCommits = (selectedCommits && selectedCommits.length > 0) ? selectedCommits : filteredCommits;
  const minDate = d3.min(baseCommits, (d) => d.datetime) || new Date('2025-01-11');
  const maxDate = d3.max(baseCommits, (d) => d.datetime) || new Date();

  xScale = d3
    .scaleTime()
    .domain([minDate, maxDate])
    .range([margin.left, width - margin.right])
    .nice();

  yScale = d3
    .scaleLinear()
    .domain([0, 24])
    .range([height - margin.bottom, margin.top]);

  const usableArea = {
    left: margin.left,
    right: width - margin.right,
    top: margin.top,
    bottom: height - margin.bottom,
    width: width - margin.left - margin.right,
    height: height - margin.top - margin.bottom,
  };

  const timeFormat = d3.timeFormat("%H:%M");

  function formatTime(d) {
    const hours = Math.floor(d);
    const minutes = Math.round((d - hours) * 60);
    return timeFormat(new Date(2000, 0, 1, hours, minutes));
  }

  const gridlines = svg
    .append('g')
    .attr('class', 'gridlines')
    .attr('transform', `translate(${usableArea.left}, 0)`)
    .call(
      d3.axisLeft(yScale)
        .tickSize(-usableArea.width)
        .tickFormat('')
    );

  gridlines.selectAll('line')
    .attr('stroke', '#cbd5e1')
    .attr('stroke-opacity', 0.25);

  const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%b %d'));
  const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

  svg.append('g')
    .attr('transform', `translate(0, ${height - margin.bottom})`)
    .call(xAxis);

  svg.append('g')
    .attr('transform', `translate(${margin.left}, 0)`)
    .call(yAxis);

  const [minLines, maxLines] = d3.extent(baseCommits, (d) => d.totalLines);
  const rScale = d3
    .scaleSqrt()
    .domain([minLines || 1, maxLines || 100])
    .range([3, 26]);

  const dots = svg.append('g').attr('class', 'dots');

  dots.selectAll('circle')
    .data(filteredCommits, (d) => d.id)
    .join('circle')
    .attr('cx', (d) => xScale(d.datetime))
    .attr('cy', (d) => yScale(d.hourFrac))
    .attr('r', (d) => rScale(d.totalLines))
    .style('fill-opacity', 0.75)
    .attr('fill', '#4f46e5')
    .on('mouseenter', function (event, d) {
      d3.select(event.currentTarget)
        .classed('selected', true)
        .style('fill-opacity', 1);
      updateTooltipContent(d, event);
      updateTooltipVisibility(true);
      updateTooltipPosition(event);
    })
    .on('mouseleave', function (event) {
      d3.select(event.currentTarget)
        .classed('selected', false)
        .style('fill-opacity', 0.75);
      updateTooltipVisibility(false);
    });

  brushSelector();
}

function updateTooltipContent(commit) {
  const link = document.getElementById('commit-link');
  const date = document.getElementById('commit-date');

  if (Object.keys(commit).length === 0) return;

  link.href = commit.url;
  link.textContent = commit.id;
  date.textContent = commit.datetime?.toLocaleString('en', {
    dateStyle: 'full',
  });
}

function updateTooltipVisibility(isVisible) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.hidden = !isVisible;
}

function updateTooltipPosition(event) {
  const tooltip = document.getElementById('commit-tooltip');
  tooltip.style.left = `${event.clientX}px`;
  tooltip.style.top = `${event.clientY}px`;
}

let brushSelection = null;

function brushSelector() {
  const svg = document.querySelector('svg');
  d3.select(svg).call(d3.brush().on('start brush end', brushed));
  d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
}

function brushed(event) {
  brushSelection = event.selection;
  updateSelection();
  updateSelectionCount();
  updateLanguageBreakdown();
}

function isCommitSelected(commit) {
  if (!brushSelection) {
    return false;
  }
  // TODO: return true if commit is within brushSelection
  const [[x0, y0], [x1, y1]] = brushSelection;
  const commitX = xScale(commit.datetime);
  const commitY = yScale(commit.hourFrac);
  return (commitX >= x0 && commitX <= x1 && commitY >= y0 && commitY <= y1);
}

function updateSelection() {
  d3.selectAll('circle').classed('selected', (d) => isCommitSelected(d));
}

function updateSelectionCount() {
  let commits = filterCommitsByTime();

  const selectedCommits = brushSelection
    ? commits.filter(isCommitSelected)
    : [];

  const countElement = document.getElementById('selection-count');
  countElement.textContent = `${selectedCommits.length || 'No'
    } commits selected`;

  return selectedCommits;
}

function updateLanguageBreakdown() {
  let commits = filterCommitsByTime();
  const selectedCommits = brushSelection
    ? commits.filter(isCommitSelected)
    : [];
  const container = document.getElementById('language-breakdown');

  if (selectedCommits.length === 0) {
    container.innerHTML = '';
    return;
  }
  const requiredCommits = selectedCommits.length ? selectedCommits : commits;
  const lines = requiredCommits.flatMap((d) => d.lines);

  // Use d3.rollup to count lines per language
  const breakdown = d3.rollup(
    lines,
    (v) => v.length,
    (d) => d.type
  );

  // Update DOM with breakdown
  container.innerHTML = '';

  for (const [language, count] of breakdown) {
    const proportion = count / lines.length;
    const formatted = d3.format('.1~%')(proportion);

    container.innerHTML += `
              <dt>${language}</dt>
              <dd>${count} lines (${formatted})</dd>
          `;
  }

  return breakdown;
}

let fileTypeColors = d3.scaleOrdinal(d3.schemeTableau10);

function updateFileDetails(filteredCommits) {
  let lines = filteredCommits.flatMap((d) => d.lines || []);
  let files = d3
    .groups(lines, (d) => d.file)
    .map(([name, lines]) => {
      const lineCount = lines.reduce((sum, l) => sum + (Number(l.added) || 0) + (Number(l.deleted) || 0), 0) || lines.length;
      return { name: typeof name === 'object' && name?.name ? name.name : name, lines, lineCount };
    });
  files = d3.sort(files, (d) => -d.lineCount);

  d3.select('.files').selectAll('div').remove();

  let filesContainer = d3.select('.files').selectAll('div').data(files).enter().append('div');

  filesContainer.append('dt').append('code').text(d => d.name);

  filesContainer
    .append('dt')
    .append('small')
    .html(d => `${d.lineCount} lines`);

  filesContainer.append('dd')
    .selectAll('div')
    .data(d => d.lines)
    .enter()
    .append('div')
    .attr('class', 'line')
    .style('background', d => fileTypeColors(d.type));
}

function updateTimeDisplay(timeSlider, timeDisplay) {
  if (!timeSlider || !timeDisplay) return;

  if (!selectedCommits || selectedCommits.length === 0) {
    selectedCommits = processCommits();
  }
  if (selectedCommits.length === 0) return;

  commitProgress = Number(timeSlider.value);
  const minDate = d3.min(selectedCommits, d => d.datetime);
  const maxDate = d3.max(selectedCommits, d => d.datetime);
  const timeScale = d3.scaleTime([minDate, maxDate], [0, 100]);
  commitMaxTime = timeScale.invert(commitProgress);

  timeDisplay.textContent = commitMaxTime.toLocaleString("en", { dateStyle: 'full', timeStyle: 'short' });

  const filteredCommits = filterCommitsByTime();
  updateScatterplot(filteredCommits);
  updateFileDetails(filteredCommits);
  displayStats();
}

function renderItems(startIndex) {
  if (!itemsContainer || !itemsContainer.node()) return;
  let commits = selectedCommits.length > 0 ? selectedCommits : processCommits();
  if (commits.length === 0) return;

  itemsContainer.selectAll('div').remove();

  const endIndex = Math.min(startIndex + VISIBLE_COUNT, commits.length);
  let newCommitSlice = commits.slice(startIndex, endIndex);

  // Progressive scrollytelling: display commits up to the currently visible position
  const commitsUpToVisible = commits.slice(0, endIndex);
  updateScatterplot(commitsUpToVisible);

  itemsContainer.selectAll('div')
    .data(newCommitSlice)
    .enter()
    .append('div')
    .attr('class', 'item')
    .html((d, idx) => generateNarrative(d, startIndex + idx))
    .style('position', 'absolute')
    .style('top', (_, idx) => `${(startIndex + idx) * ITEM_HEIGHT}px`);
}

function generateNarrative(commit, index) {
  return `
  <p>
    On ${new Date(commit.datetime).toLocaleString("en", { dateStyle: "full", timeStyle: "short" })}, I made
    <a href="${commit.url}" target="_blank">
      ${index > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'}
    </a>. I edited ${commit.totalLines} lines across ${d3.rollups(commit.lines, D => D.length, d => d.file).length} files.
    Then I looked over all I had made, and I saw that it was very good.
  </p>
  `;
}

document.addEventListener('DOMContentLoaded', async () => {
  scrollContainer = d3.select('#scroll-container');
  spacer = d3.select('#spacer');
  itemsContainer = d3.select('#items-container');
  fileSizeScrollContainer = d3.select('#file-size-scroll-container');
  fileSizeSpacer = d3.select('#file-size-spacer');
  fileSizeItemsContainer = d3.select('#file-size-items');

  const timeSlider = document.getElementById('time-slider');
  const timeDisplay = document.getElementById('time-display');
  if (timeSlider) {
    timeSlider.value = '100';
  }

  await loadData();
  await loadFileData();
  selectedCommits = processCommits();

  updateScrollDimensions();
  bindScrollEvents();

  if (timeSlider && timeDisplay) {
    timeSlider.addEventListener('input', function () {
      updateTimeDisplay(timeSlider, timeDisplay);
    });
  }

  await loadGitHubMeta('ishaankor');
  updateScatterplot(selectedCommits);
  updateTimeDisplay(timeSlider, timeDisplay);
  updateFileDetails(selectedCommits);
  renderItems(0);
  renderFileSizeItems(0);
});

