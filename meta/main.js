let data = [];
let xScale, yScale;
let selectedCommits = processCommits();
let filteredCommits = [];
let commitProgress = 100;
let commitMaxTime = new Date();
let processedFiles = new Set();
let NUM_ITEMS = 27; // Ideally, let this value be the length of your commit history
let ITEM_HEIGHT = 100; // Feel free to change
let VISIBLE_COUNT = 10; // Feel free to change as well
let totalHeight = 10;
let story_commits = processCommits();
const scrollContainer = d3.select('#scroll-container');
const spacer = d3.select('#spacer');
spacer.style('height', `${totalHeight}px`);
const itemsContainer = d3.select('#items-container');
scrollContainer.on('scroll', () => {
  const scrollTop = scrollContainer.property('scrollTop');
  console.log(scrollTop);
  let startIndex = Math.floor(scrollTop / ITEM_HEIGHT);
  startIndex = Math.max(0, Math.min(startIndex, selectedCommits.length - VISIBLE_COUNT));
  processedFiles = new Set();
  renderItems(startIndex);
});
let fileData = selectedCommits;
let fileSizeProgress = 100;
let fileMaxTime = new Date();
let fileSizeNumItems = 27;
let fileSizeItemHeight = 100;
let fileSizeVisibleCount = 10;
let totalFileSizeHeight = 10;
const fileSizeScrollContainer = d3.select('#commit-container');
const fileSizeSpacer = d3.select('#file-size-spacer');
fileSizeSpacer.style('height', `${totalFileSizeHeight}px`);
const fileSizeItemsContainer = fileSizeScrollContainer.select('#scroll-container');
fileSizeItemsContainer.on('scroll', () => {
  const scrollTop = fileSizeItemsContainer.property('scrollTop');
  console.log("!");
  let startIndex = Math.floor(scrollTop / fileSizeItemHeight);
  startIndex = Math.max(0, Math.min(startIndex, selectedCommits.length - fileSizeVisibleCount));
  const filteredFileData = selectedCommits.slice(startIndex, startIndex + fileSizeVisibleCount);
  renderFileSizeItems(startIndex);
  updateFileDetails(filteredFileData);
});

function processFileData() {
  return d3.groups(data, (d) => d.file).map(([file, lines]) => {
    const firstLine = lines[0];
    let { author, date, time, timezone, datetime } = firstLine;
    return {
      file: file.name,
      totalLines: lines.length,
      lines,
    };
  });
}

function renderFileSizeItems(startIndex) {
  fileSizeItemsContainer.selectAll('div').remove();

  let newFileSizeSlice = selectedCommits.slice(startIndex, startIndex + fileSizeVisibleCount);
  
  fileSizeItemsContainer.selectAll('div')
    .data(newFileSizeSlice)
    .enter()
    .append('div')
    .attr('class', 'file-size-item')
    .html((d, idx) => generateFileSizeNarrative(d, idx))
    .style('position', 'absolute')
    .style('top', (_, idx) => `${idx * fileSizeItemHeight}px`);

  updateFileDetails(newFileSizeSlice);
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
  let commits = d3.groups(data, (d) => d.commit).map(([commit, lines]) => {
    let first = lines[0];
    let { author, date, time, timezone, datetime } = first;
    let ret = {
      id: commit,
      url: 'https://github.com/vis-society/lab-7/commit/' + commit,
      author,
      date,
      time,
      timezone,
      datetime,
      hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
      totalLines: lines.length,
    };

    Object.defineProperty(ret, 'lines', {
      value: lines,
      enumerable: false,
      writable: false,
      configurable: false
    });

    return ret;
  });

  return commits;
}

async function loadData() {
    data = await d3.csv('loc.csv', (row) => ({
      ...row,
      line: Number(row.line), // or just +row.line
      depth: Number(row.depth),
      length: Number(row.length),
      date: new Date(row.date + 'T00:00' + row.timezone),
      datetime: new Date(row.datetime),
    }));

    displayStats();
}

function filterCommitsByTime() {
    let commits = processCommits();
    return commits.filter((commit) => commit.datetime <= commitMaxTime);
}

function displayStats() {
    let commits = filterCommitsByTime();

    let numFiles = d3.group(data, (d) => d.file).size;
    let maxDepth = d3.max(data, (d) => d.depth);
    let longestLineLength = d3.max(data, (d) => d.length);
    let maxLinesInCommit = d3.max(commits, (d) => d.totalLines);

    const statsContainer = d3.select('#stats').attr('class', 'stats-summary');
    statsContainer.append('h2').attr('class', 'summary-title').text('Summary');
    const summaryGrid = statsContainer.append('div').attr('class', 'summary-grid');

    function addStat(title, value) {
        const statDiv = summaryGrid.append('div').attr('class', 'stat-block');
        statDiv.append('span').attr('class', 'stat-title').text(title);
        statDiv.append('span').attr('class', 'stat-value').text(value);
    }

    addStat('COMMITS', commits.length);
    addStat('FILES', numFiles);
    addStat('TOTAL LOC', data.length);
    addStat('MAX DEPTH', maxDepth);
    addStat('LONGEST LINE', longestLineLength);
    addStat('MAX LINES', maxLinesInCommit);
}

function updateScatterplot(filteredCommits) {
    d3.select('svg').remove();

    const width = 1000;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 30, left: 40 };

    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('overflow', 'visible');

    xScale = d3
        .scaleTime()
        .domain(d3.extent(filteredCommits, (d) => d.datetime))
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

    const timeFormat = d3.timeFormat("%H:%M"); // Format as HH:MM

    function formatTime(d) {
        const hours = Math.floor(d);
        const minutes = Math.round((d - hours) * 60); // Convert fraction to minutes
        return timeFormat(new Date(2000, 0, 1, hours, minutes)); // Use dummy date
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
        .attr('stroke', 'lightgray')
        .attr('stroke-opacity', 0.3)

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.timeFormat('%a %d'));
    const yAxis = d3.axisLeft(yScale).tickFormat(formatTime);

    svg.append('g')
        .attr('transform', `translate(0, ${height - margin.bottom})`)
        .call(xAxis);

    svg.append('g')
        .attr('transform', `translate(${margin.left}, 0)`)
        .call(yAxis);
    
    const [minLines, maxLines] = d3.extent(filteredCommits, (d) => d.totalLines);
    const rScale = d3
        .scaleSqrt()
        .domain([minLines, maxLines])
        .range([2, 30]);

    svg.append('g')
        .attr('class', 'dots')
        .selectAll('circle')
        .data(filteredCommits)
        .join('circle')
        .attr('cx', (d) => xScale(d.datetime))
        .attr('cy', (d) => yScale(d.hourFrac))
        .attr('r', (d) => rScale(d.totalLines))
        .style('fill-opacity', 0.7)
        .attr('fill', 'steelblue')
        .on('mouseenter', function (event, d) {
            d3.select(event.currentTarget)
                .classed('selected', true)
                .style('fill-opacity', 1);
            updateTooltipContent(d, event);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
        })
        .on('mouseleave', function () {
            d3.select(event.currentTarget)
                .classed('selected', false)
                .style('fill-opacity', 0.7);
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
    countElement.textContent = `${
      selectedCommits.length || 'No'
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
  let lines = filteredCommits.flatMap((d) => d.lines);
  let files = d3
    .groups(lines, (d) => d.file)
    .map(([name, lines]) => {
      return { name, lines };
    });
  files = d3.sort(files, (d) => -d.lines.length);

  d3.select('.files').selectAll('div').remove();

  let filesContainer = d3.select('.files').selectAll('div').data(files).enter().append('div');

  filesContainer.append('dt').append('code').text(d => d.name);

  filesContainer
    .append('dt')
    .append('small')
    .html(d => `${d.lines.length} lines`);

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

  let commits = processCommits();
  selectedCommits = commits;

  commitProgress = Number(timeSlider.value); 
  const timeScale = d3.scaleTime([d3.min(selectedCommits, d => d.datetime), d3.max(selectedCommits, d => d.datetime)], [0, 100]);
  commitMaxTime = timeScale.invert(commitProgress);

  timeDisplay.textContent = commitMaxTime.toLocaleString("en", { dateStyle: 'full', timeStyle: 'short' });

  const filteredCommits = filterCommitsByTime();
  updateScatterplot(filteredCommits);

  updateFileDetails(filteredCommits);
}

function renderItems(startIndex) {
  let commits = processCommits();
  itemsContainer.selectAll('div').remove();

  const endIndex = Math.min(startIndex + VISIBLE_COUNT, commits.length);
  
  let newCommitSlice = commits.slice(startIndex, endIndex);
  
  updateScatterplot(newCommitSlice);

  itemsContainer.selectAll('div')
      .data(newCommitSlice)
      .enter()
      .append('div')
      .attr('class', 'item')
      .html((d, idx) => {
        return generateNarrative(d, idx); 
      })
      .style('position', 'absolute')
      .style('top', (_, idx) => `${idx * ITEM_HEIGHT}px`);

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

document.getElementById('time-slider').addEventListener('input', function (event) {
    updateTimeDisplay();
});

document.addEventListener('DOMContentLoaded', async () => {
  const timeSlider = document.getElementById('time-slider');
  const timeDisplay = document.getElementById('time-display');
  if (timeSlider && timeDisplay) {
      timeSlider.addEventListener('input', function () {
          updateTimeDisplay(timeSlider, timeDisplay); 
      });
  }

  await loadData();
  await loadFileData();
  updateScatterplot(selectedCommits);
  updateTimeDisplay(timeSlider, timeDisplay);
  updateFileDetails(selectedCommits);
  renderItems(0);
  renderFileSizeItems(0);
});

