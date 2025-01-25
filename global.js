console.log('IT’S ALIVE!');

const ARE_WE_HOME = document.documentElement.classList.contains('home');

function $$(selector, context = document) {
  return Array.from(context.querySelectorAll(selector));
}

let pages = [
    { url: '../index.html', title: 'Home' },
    { url: '../contact/index.html', title: 'Contact' },
    { url: '../projects/index.html', title: 'Projects' },
    { url: 'https://github.com/ishaankor', title: 'Profile' },
    { url: '../resume/index.html', title: 'Resume' }
];

let nav = document.createElement('nav');
document.body.prepend(nav);

for (let p of pages) {
    let url = p.url;
    if (!ARE_WE_HOME && !url.startsWith('http')) {
        url = '../' + url;
    }  
    let title = p.title;
    let a = document.createElement('a');
    a.href = url;
    a.textContent = title;
    nav.append(a);
    a.classList.toggle(
        'current',
        a.host === location.host && a.pathname === location.pathname,
    );
    if (a.host !== location.host) {
        a.toggleAttribute('target', '_blank')
    }
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
