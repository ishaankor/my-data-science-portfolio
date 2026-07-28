import { fetchJSON, renderProjects } from './global.js';

const projects = (await fetchJSON('./lib/projects.json')) || [];
const featuredProjects = projects.slice(0, 4);
const projectsContainer = document.querySelector('.projects');
const learningList = document.querySelector('#learning-list');
const recommenderSummary = document.querySelector('#recommender-summary');
const recommenderResults = document.querySelector('#recommender-results');
const queryInput = document.querySelector('#query-input');
const projectYearChart = document.querySelector('#project-year-chart');

renderProjects(featuredProjects, projectsContainer, 'h3');
renderLearning();
renderProjectYearChart(projects);
renderRecommender(projects);
loadGitHubAnalytics('ishaankor');

function renderLearning() {
    const skills = [
        'Prompt engineering for AI demos',
        'Python automation and scraping',
        'Data visualization with JavaScript',
        'Machine learning pipelines',
        'Live API-driven dashboards'
    ];

    if (!learningList) return;
    learningList.innerHTML = skills.map(skill => `<li>${skill}</li>`).join('');
}

function normalizeText(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function scoreProject(project, queryTokens) {
    const content = normalizeText(`${project.title} ${project.description} ${project.year}`);
    const contentTokens = new Set(content.split(' '));
    let score = 0;
    queryTokens.forEach(token => {
        if (contentTokens.has(token)) {
            score += 2;
        } else if ([...contentTokens].some(word => word.startsWith(token))) {
            score += 1;
        }
    });
    if (project.year >= '2023') {
        score += 0.5;
    }
    return score;
}

function renderRecommender(projectsList) {
    if (!queryInput || !recommenderSummary || !recommenderResults) return;

    const defaultProjects = projectsList.slice(0, 3);
    recommenderSummary.textContent = 'Start typing a topic to see the best matching projects from this portfolio.';
    recommenderResults.innerHTML = defaultProjects.map(projectCard).join('');

    queryInput.addEventListener('input', event => {
        const query = normalizeText(event.target.value);
        if (!query) {
            recommenderSummary.textContent = 'Start typing a topic to see the best matching projects from this portfolio.';
            recommenderResults.innerHTML = defaultProjects.map(projectCard).join('');
            return;
        }

        const queryTokens = query.split(' ').filter(Boolean);
        const scored = projectsList
            .map(project => ({ project, score: scoreProject(project, queryTokens) }))
            .filter(item => item.score > 0)
            .sort((a, b) => b.score - a.score);

        if (!scored.length) {
            recommenderSummary.textContent = `No strong matches found for “${event.target.value}”. Try a different topic or browse all projects.`;
            recommenderResults.innerHTML = '';
            return;
        }

        recommenderSummary.textContent = `Best matches for “${event.target.value}”.`;
        recommenderResults.innerHTML = scored.slice(0, 3).map(item => projectCard(item.project)).join('');
    });
}

function projectCard(project) {
    return `
        <article class="recommender-card">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <p class="project-card-meta">Year: ${project.year}</p>
        </article>
    `;
}

function renderProjectYearChart(projectsList) {
    if (!projectYearChart) return;

    const counts = projectsList.reduce((map, project) => {
        map.set(project.year, (map.get(project.year) || 0) + 1);
        return map;
    }, new Map());

    const years = [...counts.keys()].sort();
    const maxCount = Math.max(...counts.values(), 1);

    projectYearChart.innerHTML = years.map(year => {
        const value = counts.get(year) || 0;
        const height = Math.max(35, Math.round((value / maxCount) * 100));
        return `
            <div class="year-bar">
                <div class="bar" style="height: ${height}%;"></div>
                <span>${year}</span>
            </div>
        `;
    }).join('');
}

async function loadGitHubAnalytics(username) {
    const githubPanel = document.querySelector('#github-analytics');
    if (!githubPanel) return;

    const userResponse = await fetchJSON(`https://api.github.com/users/${username}`);
    const reposResponse = await fetchJSON(`https://api.github.com/users/${username}/repos?per_page=100&sort=pushed`);
    const user = userResponse || {};
    const repos = Array.isArray(reposResponse) ? reposResponse : [];

    const totalStars = repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0);
    const topLanguages = [...repos.reduce((map, repo) => {
        if (!repo.language) return map;
        map.set(repo.language, (map.get(repo.language) || 0) + 1);
        return map;
    }, new Map()).entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 4)
        .map(([language]) => language);

    const popularRepos = repos
        .sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0))
        .slice(0, 3)
        .map(repo => `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`)
        .join(', ');

    githubPanel.innerHTML = `
        <div class="panel-header">
            <p class="panel-label">GitHub analytics</p>
            <h2>Live profile summary</h2>
        </div>
        <div class="stats-grid">
            <div class="stat-block">
                <span class="stat-title">Public repos</span>
                <span class="stat-value">${user.public_repos ?? '—'}</span>
            </div>
            <div class="stat-block">
                <span class="stat-title">Public gists</span>
                <span class="stat-value">${user.public_gists ?? '—'}</span>
            </div>
            <div class="stat-block">
                <span class="stat-title">Followers</span>
                <span class="stat-value">${user.followers ?? '—'}</span>
            </div>
            <div class="stat-block">
                <span class="stat-title">Top languages</span>
                <span class="stat-value">${topLanguages.join(', ') || 'None'}</span>
            </div>
            <div class="stat-block">
                <span class="stat-title">Total stars</span>
                <span class="stat-value">${totalStars}</span>
            </div>
            <div class="stat-block">
                <span class="stat-title">Popular repos</span>
                <span class="stat-value">${popularRepos || 'No repos yet'}</span>
            </div>
        </div>
    `;
}
