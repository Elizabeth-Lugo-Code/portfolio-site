/*
  about.js
  Page-specific. Loads data/about.json and renders the three sections of
  about.html: intro, freelance pitch, and the contact teaser.
  Runs independently of site.js since none of this content depends on
  business/nav data.
*/

async function loadAboutData() {
  const res = await fetch('data/about.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load about.json');
  return res.json();
}

function renderIntro(intro) {
  const root = document.getElementById('about-intro-root');
  if (!root) return;

  root.innerHTML = `
    <section id="about-intro" class="intro">
      <div class="intro-text">
        <h1>${intro.headline}</h1>
        <p>${intro.sub}</p>
      </div>
      <div class="about-intro-image">
        <img src="${intro.image}" alt="${intro.imageAlt}">
      </div>
    </section>
  `;
}

function renderBio(bio) {
  const root = document.getElementById('about-bio-root');
  const paragraphs = bio.paragraphs.map(p => `
    <p>${p}</p>
  `).join('');

  root.innerHTML = `
    <section id="bio" class="bio">
      <h2>${bio.headline}</h2>
      ${paragraphs}
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadAboutData()
    .then(data => {
      renderIntro(data.intro);
      renderBio(data.bio);
    })
    .catch(err => console.error(err));
});