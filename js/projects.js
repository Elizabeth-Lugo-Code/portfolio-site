/*
  projects.js
  Page-specific. Loads data/projects.json and renders the intro text
  plus the project grid on projects.html.
  If a project's preview image fails to load (e.g. not added yet),
  it swaps in a text placeholder instead of showing a broken image icon.
*/

async function loadProjectsData() {
  const res = await fetch('data/projects.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load projects.json');
  return res.json();
}

function renderIntro(intro) {
  const root = document.getElementById('projects-intro-root');
  if (!root) return;

  root.innerHTML = `
    <section class="page-intro">
      <h2>${intro.headline}</h2>
      <p>${intro.sub}</p>
    </section>
  `;
}

function renderGrid(items) {
  const root = document.getElementById('projects-grid-root');
  if (!root) return;

  const cardsHtml = items.map(item => `
    <div class="project-card">
      <img src="${item.image}" alt="${item.title} preview">
      <div class="project-card-content">
        <span class="project-type">${item.type}</span>
        <h3>${item.title}</h3>
        <p>${item.description}</p>
        <a href="${item.link}" target="_blank">View Project →</a>
      </div>
    </div>
  `).join('');

  root.innerHTML = `
    <section class="page-section">
      <div class="project-grid">${cardsHtml}</div>
    </section>
  `;

  // Graceful fallback for missing preview images
  root.querySelectorAll('.project-card img').forEach(img => {
    img.addEventListener('error', () => {
      const wrapper = img.parentElement;
      const placeholder = document.createElement('div');
      placeholder.className = 'project-card-placeholder';
      placeholder.textContent = 'Preview coming soon';
      img.replaceWith(placeholder);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadProjectsData()
    .then(data => {
      renderIntro(data.intro);
      renderGrid(data.items);
    })
    .catch(err => console.error(err));
});