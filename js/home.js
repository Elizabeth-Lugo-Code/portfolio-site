/*
  home.js
  Page-specific. Loads data/home.json and renders the three sections of
  index.html: intro, freelance pitch, and the contact teaser.
  Runs independently of site.js since none of this content depends on
  business/nav data.
*/

async function loadHomeData() {
  const res = await fetch('data/home.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load home.json');
  return res.json();
}

function renderIntro(intro) {
  const root = document.getElementById('home-intro-root');
  if (!root) return;

  root.innerHTML = `
    <section id="about" class="intro">
      <div class="intro-text">
        <h1>${intro.headline}</h1>
        <p>${intro.sub}</p>
      </div>
      <div class="intro-image">
        <img src="${intro.image}" alt="${intro.imageAlt}">
      </div>
    </section>
  `;
}

function renderFreelance(freelance) {
  const root = document.getElementById('home-freelance-root');
  if (!root) return;

  const businessListHtml = freelance.targetBusinesses
    .map(b => `<li>${b}</li>`)
    .join('');

  root.innerHTML = `
    <section id="freelance" class="freelance">
      <h2>${freelance.headline}</h2>
      <p>${freelance.body}</p>
      <ul class="freelance-list">${businessListHtml}</ul>
      <a href="${freelance.cta.href}" class="download-btn">${freelance.cta.label}</a>
    </section>
  `;
}

function renderContactTeaser(contactTeaser) {
  const root = document.getElementById('home-contact-root');
  if (!root) return;

  root.innerHTML = `
    <section id="contact" class="contact">
      <h2>${contactTeaser.headline}</h2>
      <div class="contact-card">
        <p>${contactTeaser.sub}</p>
        <a href="${contactTeaser.cta.href}" class="download-btn">${contactTeaser.cta.label}</a>
      </div>
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadHomeData()
    .then(data => {
      renderIntro(data.intro);
      renderFreelance(data.freelance);
      renderContactTeaser(data.contactTeaser);
    })
    .catch(err => console.error(err));
});