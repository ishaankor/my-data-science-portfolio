console.log('IT’S ALIVE!');

export async function fetchJSON(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Error fetching or parsing JSON data:', error);
        return null;
    }
}

export function renderProjects(projects, containerElement, headingLevel = 'h2') {
    containerElement.innerHTML = '';
    if (!Array.isArray(projects)) {
        return;
    }

    projects.forEach((project, index) => {
        const article = document.createElement('article');
        article.className = 'project-card reveal';
        article.dataset.delay = index % 4 + 1;
        article.innerHTML = `
            <div class="project-card-content">
                <${headingLevel}>${project.title}</${headingLevel}>
                <img src="${project.image}" alt="${project.title}" loading="lazy">
                <p>${project.description}</p>
                <div class="project-meta">
                    <span>${project.year}</span>
                </div>
            </div>
        `;
        containerElement.appendChild(article);
        requestAnimationFrame(() => {
            article.classList.add('revealed');
        });
    });
}

function setupScrollReveal() {
    const selectors = [
        '.hero-copy',
        '.hero-panel',
        '.summary-card',
        '.dashboard-panel',
        '.panel-header',
        '.metric-chart',
        '.recommender-panel',
        '.personal-card',
        '.section-copy',
        '.activity-item',
        '.projects-controls',
        '.projects-chart',
        '.project-card'
    ];

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -10% 0px'
    });

    document.querySelectorAll(selectors.join(',')).forEach(node => {
        if (!node.classList.contains('reveal')) {
            node.classList.add('reveal');
        }
        observer.observe(node);
    });
}

window.addEventListener('DOMContentLoaded', setupScrollReveal);

function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}

const pages = [
    { url: '/my-data-science-portfolio/index.html', title: 'Home' },
    { url: '/my-data-science-portfolio/projects/index.html', title: 'Projects' },
    { url: '/my-data-science-portfolio/resume/index.html', title: 'Resume' },
    { url: '/my-data-science-portfolio/meta/index.html', title: 'Meta' },
    { url: 'https://github.com/ishaankor', title: 'Profile' },
    { url: '/my-data-science-portfolio/contact/index.html', title: 'Contact' }
];

const nav = document.createElement('nav');
document.body.prepend(nav);

for (const page of pages) {
    const link = document.createElement('a');
    link.href = page.url;
    link.textContent = page.title;
    link.classList.toggle(
        'current',
        link.host === location.host && link.pathname === location.pathname
    );
    if (link.host !== location.host) {
        link.target = '_blank';
    }
    nav.append(link);
}

const themeControl = document.createElement('label');
themeControl.className = 'color-scheme';
themeControl.innerHTML = `
    Theme:
    <select>
        <option value="light dark">Automatic</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
    </select>
`;
document.body.prepend(themeControl);

const select = themeControl.querySelector('select');
if ('colorScheme' in localStorage) {
    const savedTheme = localStorage.colorScheme;
    document.documentElement.style.colorScheme = savedTheme;
    select.value = savedTheme;
}
select.addEventListener('input', event => {
    const selectedTheme = event.target.value;
    localStorage.colorScheme = selectedTheme;
    document.documentElement.style.colorScheme = selectedTheme;
});

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const data = new FormData(contactForm);
        const url = event.target.action + '?';
        const params = [];
        for (const [name, value] of data) {
            params.push(`${encodeURIComponent(name)}=${encodeURIComponent(value)}`);
        }
        location.href = url + params.join('&');
    });
}

