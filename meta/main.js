let data = [];
let xScale, yScale;

function processCommits() {
    return d3
      .groups(data, (d) => d.commit)
      .map(([commit, lines]) => {
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
  
function displayStats() {
    let commits = processCommits();

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

function createScatterplot() {
    let commits = processCommits();
    const sortedCommits = d3.sort(commits, (d) => -d.totalLines);

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
      .domain(d3.extent(commits, (d) => d.datetime))
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
    
    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
    const rScale = d3
        .scaleSqrt()
        .domain([minLines, maxLines])
        .range([2, 30]);

    const dots = svg.append('g')
        .attr('class', 'dots')
        .selectAll('circle')
        .data(sortedCommits)
        .join('circle')
        .attr('cx', (d) => xScale(d.datetime))
        .attr('cy', (d) => yScale(d.hourFrac))
        .attr('r', (d) => rScale(d.totalLines))
        .style('fill-opacity', 0.7)
        .attr('fill', 'steelblue')
        .on('mouseenter', function (event, d, i) {
            d3.select(event.currentTarget).style('fill-opacity', 1);
            updateTooltipContent(d, event);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
        })
        .on('mouseleave', function () {
            d3.select(event.currentTarget).style('fill-opacity', 0.7);
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

function brushSelector() {
    const svg = document.querySelector('svg');
    d3.select(svg).call(d3.brush().on('start brush end', brushed));

    // Raise dots and everything after overlay
    d3.select(svg).selectAll('.dots, .overlay ~ *').raise();
}
  
let brushSelection = null;

function brushed(event) {
  brushSelection = event.selection;
  console.log(brushSelection)
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
  // Update visual state of dots based on selection
  d3.selectAll('circle').classed('selected', (d) => isCommitSelected(d));
}

function updateSelectionCount() {
    let commits = processCommits();

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
    let commits = processCommits();
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
  
document.addEventListener('DOMContentLoaded', async () => {
  await loadData();
  await createScatterplot();
});
