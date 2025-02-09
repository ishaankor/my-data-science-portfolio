import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm";

const projects = await fetchJSON('../lib/projects.json');
const projectsTitle = document.querySelector('.projects-title');
const projectsContainer = document.querySelector('.projects');
projectsTitle.textContent = `${projects.length} Projects`;
renderProjects(projects, projectsContainer, 'h2');
let selectedIndex = -1;
let query = '';
function renderPieChart(projectsGiven) {
    let newRolledData = d3.rollups(
        projectsGiven,
        (v) => v.length,
        (d) => d.year
    );

    let newData = newRolledData.map(([year, count]) => ({
        value: count,
        label: year
    }));

    let newArcGenerator = d3.arc().innerRadius(0).outerRadius(50);
    let newSliceGenerator = d3.pie().value(d => d.value);
    let newArcData = newSliceGenerator(newData);

    let svg = d3.select('#projects-pie-plot');
    let legend = d3.select('.legend');

    svg.selectAll('*').remove();
    legend.selectAll('*').remove();

    let colors = d3.scaleOrdinal(d3.schemeTableau10);

    svg.selectAll("path")
        .data(newArcData)
        .enter()
        .append("path")
        .attr("d", newArcGenerator)
        .attr("fill", (d, i) => colors(i))
        .on("click", function (event, d) {
            selectedYear = selectedYear === d.data.label ? null : d.data.label;
            svg.selectAll("path")
                .attr("class", pathD => (selectedYear && pathD.data.label === selectedYear ? "selected" : ".selected"));
            legend.selectAll("li")
                .attr("class", legendD => (selectedYear && legendD.label === selectedYear ? "selected" : ""));
            let filteredProjects = projects
                .filter(p => !selectedYear || p.year === selectedYear)
                .filter(p => Object.values(p).join('\n').toLowerCase().includes(query.toLowerCase()));
            renderProjects(filteredProjects, projectsContainer, 'h2');
        });        
        

    legend.selectAll("li")
        .data(newData)
        .enter()
        .append("li")
        .attr("style", (d, i) => `--color:${colors(i)}`)
        .html(d => `<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`)
        .on("click", function (_, d) {
            legend.selectAll("li")
                .attr("class", legendD => (legendD.label === d.label ? "selected" : ""));
            let selectedYear = d.label;
            let filteredProjects = projects.filter(p => p.year === selectedYear)
            renderProjects(filteredProjects, projectsContainer, 'h2');
        });
}

let selectedYear = null;
renderPieChart(projects);

let searchInput = document.querySelector('.searchBar');
searchInput.addEventListener('input', (event) => {
    query = event.target.value.toLowerCase();
    let filteredProjects = projects.filter(project => {
        let values = Object.values(project).join('\n').toLowerCase();
        return values.includes(query);
    });
    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects); 
});
