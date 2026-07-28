import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

const projects = (await fetchJSON('../lib/projects.json')) || [];
const projectsTitle = document.querySelector('.projects-title');
const projectsContainer = document.querySelector('.projects');
const searchInput = document.querySelector('.searchBar');
const svg = d3.select('#projects-pie-plot');
const legendList = d3.select('.legend');
const projectsSummary = document.querySelector('#projects-summary');
const yearFilter = document.querySelector('#year-filter');

let selectedYear = null;
let query = '';
let filteredProjects = projects;

if (projectsTitle) {
    projectsTitle.textContent = `${projects.length} Projects`;
}

function normalizeText(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function buildSummary() {
    if (!projectsSummary) return;
    const years = [...new Set(projects.map(project => project.year))].sort();
    projectsSummary.innerHTML = `
        <p class="summary-label">Projects loaded</p>
        <h2>${filteredProjects.length} matches</h2>
        <p>Years available: ${years.join(', ')}</p>
    `;
}

function renderProjectCards(projectsToRender) {
    if (!projectsContainer) return;
    renderProjects(projectsToRender, projectsContainer, 'h2');
}

function buildYearButtons() {
    if (!yearFilter) return;
    const years = [...new Set(projects.map(project => project.year))].sort((a, b) => b - a);
    yearFilter.innerHTML = years.map(year => `
        <button type="button" data-year="${year}" class="${selectedYear === year ? 'active' : ''}">${year}</button>
    `).join('');
    yearFilter.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', () => {
            const year = button.dataset.year;
            selectedYear = selectedYear === year ? null : year;
            yearFilter.querySelectorAll('button').forEach(btn => btn.classList.toggle('active', btn.dataset.year === selectedYear));
            filterProjects();
        });
    });
}

function renderPieChart(projectsToPlot) {
    const byYear = d3.rollups(projectsToPlot, v => v.length, d => d.year)
        .map(([year, count]) => ({ year, count }))
        .sort((a, b) => b.count - a.count);

    const radius = 100;
    const arc = d3.arc().innerRadius(0).outerRadius(radius);
    const pie = d3.pie().value(d => d.count);
    const arcs = pie(byYear);
    const color = d3.scaleOrdinal(d3.schemeTableau10);

    svg.selectAll('*').remove();
    legendList.selectAll('*').remove();

    svg.attr('viewBox', [-radius - 20, -radius - 20, (radius + 20) * 2, (radius + 20) * 2]);

    const paths = svg.selectAll('path')
        .data(arcs)
        .join('path')
        .attr('d', arc)
        .attr('fill', (d, i) => color(i))
        .attr('stroke', '#fff')
        .attr('stroke-width', 2)
        .attr('opacity', 0.92)
        .style('cursor', 'pointer')
        .on('mouseenter', function () {
            d3.select(this).attr('opacity', 1).attr('transform', 'scale(1.03)');
        })
        .on('mouseleave', function () {
            d3.select(this).attr('opacity', 0.92).attr('transform', null);
        })
        .on('click', (event, d) => {
            const year = d.data.year;
            selectedYear = selectedYear === year ? null : year;
            buildYearButtons();
            filterProjects();
        });

    legendList.selectAll('li')
        .data(byYear)
        .join('li')
        .html(d => `<span class="swatch" style="background:${color(d.year)}"></span> ${d.year} <strong>(${d.count})</strong>`)
        .style('cursor', 'pointer')
        .on('mouseenter', (event, d) => {
            paths.filter(pathData => pathData.data.year === d.year)
                .attr('opacity', 1)
                .attr('transform', 'scale(1.03)');
        })
        .on('mouseleave', () => {
            paths.attr('opacity', 0.92).attr('transform', null);
        })
        .on('click', (event, d) => {
            selectedYear = selectedYear === d.year ? null : d.year;
            buildYearButtons();
            filterProjects();
        });
}

function filterProjects() {
    filteredProjects = projects.filter(project => {
        const matchesYear = !selectedYear || project.year === selectedYear;
        const text = normalizeText(`${project.title} ${project.description} ${project.year}`);
        const matchesQuery = normalizeText(query) ? text.includes(normalizeText(query)) : true;
        return matchesYear && matchesQuery;
    });
    buildSummary();
    renderProjectCards(filteredProjects);
    renderPieChart(filteredProjects);
}

if (searchInput) {
    searchInput.addEventListener('input', event => {
        query = event.target.value;
        filterProjects();
    });
}

buildSummary();
buildYearButtons();
filterProjects();
