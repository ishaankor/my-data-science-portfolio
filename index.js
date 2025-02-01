import { fetchJSON, renderProjects } from './global.js';

const projects = await fetchJSON('./lib/projects.json');
const latestProjects = projects.slice(0, 3);
const projectsContainer = document.querySelector('.projects');
renderProjects(latestProjects, projectsContainer, 'h2');
export async function fetchGitHubData(username) {
    return fetchJSON(`https://api.github.com/users/${username}`);
}
const githubData = await fetchGitHubData('ishaankor');
const profileStats = document.querySelector('#profile-stats');
if (profileStats) {
    profileStats.innerHTML = `
          <dl>
            <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
            <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
            <dt>Followers:</dt><dd>3</dd>
            <dt>Following:</dt><dd>3</dd>
          </dl>
      `;
}
  
  