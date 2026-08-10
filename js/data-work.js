/*
  data-work.js
  Page-specific. Loads data/data-work.json and renders the intro text
  plus the analytics project grid on data-work.html.
  Reuses the .projects / .project-grid / .project-card CSS classes
  from the Projects page since the card layout is the same shape.
*/

async function loadDataWorkData() {
  const res = await fetch('data/data-work.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load data-work.json');
  return res.json();
}

function renderIntro(intro) {
  const root = document.getElementById('data-work-intro-root');
  if (!root) return;

  root.innerHTML = `
    <section class="page-intro">
      <h2>${intro.headline}</h2>
      <p>${intro.sub}</p>
    </section>
  `;
}

function renderGrid(items) {
  const root = document.getElementById('data-work-grid-root');
  if (!root) return;

  const cardsHtml = items.map(item => {
    const imageHtml = item.image
      ? `<img src="${item.image}" alt="${item.title} preview">`
      : '';
    const typeHtml = item.type
      ? `<span class="project-type">${item.type}</span>`
      : '';

    return `
      <div class="project-card">
        ${imageHtml}
        <div class="project-card-content">
          ${typeHtml}
          <h3>${item.title}</h3>
          <p>${item.description}</p>
          <a href="${item.link}" target="_blank">View Project →</a>
        </div>
      </div>
    `;
  }).join('');

  root.innerHTML = `
    <section class="page-section">
      <div class="project-grid">${cardsHtml}</div>
    </section>
  `;

  // Graceful fallback for missing preview images
  root.querySelectorAll('.project-card img').forEach(img => {
    img.addEventListener('error', () => {
      const placeholder = document.createElement('div');
      placeholder.className = 'project-card-placeholder';
      placeholder.textContent = 'Preview coming soon';
      img.replaceWith(placeholder);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDataWorkData()
    .then(data => {
      renderIntro(data.intro);
      renderGrid(data.items);
    })
    .catch(err => console.error(err));
});