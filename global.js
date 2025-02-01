console.log('IT’S ALIVE!');

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch projects: ${response.statusText}`);
        } else {
            console.log(response)
            const data = await response.json();
            return data; 
        }
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    projects.forEach(project => {
        const article = document.createElement('article');
        article.innerHTML = `
            <${headingLevel}>${project.title}</${headingLevel}>
            <img src="${project.image}" alt="${project.title}" width="250" height="200">
            <p>${project.description}</p>
        `;
        containerElement.appendChild(article);
    });
}

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '/my-data-science-portfolio/index.html', title: 'Home' },
    { url: '/my-data-science-portfolio//projects/index.html', title: 'Projects' },
    { url: '/my-data-science-portfolio//resume/index.html', title: 'Resume' },
    { url: 'https://github.com/ishaankor', title: 'Profile' },
    { url: '/my-data-science-portfolio//contact/index.html', title: 'Contact' }
];

const ARE_WE_HOME = document.documentElement.classList.contains('home');

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    let title = p.title;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname
    );
    if (a.host !== location.host) {
        a.setAttribute('target', '_blank');
    }
    nav.append(a);
}

document.body.insertAdjacentHTML(
    'afterbegin',
    `
        <label class="color-scheme">
            Theme:
            <select>
                <option value="light dark"> Automatic </option>
                <option value="light"> Light </option>
                <option value="dark"> Dark </option>
            </select>
        </label>`
);

let select = document.querySelector('.color-scheme select');

if ("colorScheme" in localStorage) {
    let theme = localStorage.colorScheme;
    document.documentElement.style.colorScheme = theme;
    select.value = theme; 
}

select.addEventListener('input', function (event) {
    let selectedTheme = event.target.value;
    localStorage.colorScheme = selectedTheme; 
    console.log('Color scheme changed to', selectedTheme);
    document.documentElement.style.colorScheme = selectedTheme;
});

let contact_form = document.querySelector('.contact-form')
  
contact_form?.addEventListener('submit', function (event) {
    event.preventDefault();
    let data = new FormData(contact_form)
    let url = event.target.action + "?";
    let params = [];
    for (let [name, value] of data) {
        params.push(encodeURIComponent(name) + "=" + encodeURIComponent(value));
    }
    url += params.join("&"); 
    location.href = url;
});

