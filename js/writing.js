/*
  writing.js
  Page-specific. Loads data/writing.json and renders the intro text
  plus the author bio + CTA on writing.html.

  The CTA links out to a separate stories-update site that doesn't
  exist yet. While cta.href is still the "#" placeholder, the button
  renders in a disabled-looking style instead of a clickable link, so
  it doesn't send visitors to a dead anchor. Once writing.json's
  cta.href is updated to a real URL, it automatically renders as a
  normal working button — no other change needed.
*/

async function loadWritingData() {
  const res = await fetch('data/writing.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load writing.json');
  return res.json();
}

function renderIntro(intro) {
  const root = document.getElementById('writing-intro-root');
  if (!root) return;

  root.innerHTML = `
    <section class="page-intro">
      <h2>${intro.headline}</h2>
      <p>${intro.sub}</p>
    </section>
  `;
}

function renderBio(bio, cta) {
  const root = document.getElementById('writing-bio-root');
  if (!root) return;

  const paragraphsHtml = bio.paragraphs.map(p => `<p>${p}</p>`).join('');

  const isPlaceholder = !cta.href || cta.href === '#';
  const ctaHtml = isPlaceholder
    ? `<span class="download-btn btn-disabled">${cta.label}</span>`
    : `<a href="${cta.href}" class="download-btn" target="_blank">${cta.label}</a>`;
  const noteHtml = cta.note ? `<p class="contact-note">${cta.note}</p>` : '';

  root.innerHTML = `
    <section class="bio">
      ${paragraphsHtml}
      ${ctaHtml}
      ${noteHtml}
    </section>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  loadWritingData()
    .then(data => {
      renderIntro(data.intro);
      renderBio(data.bio, data.cta);
    })
    .catch(err => console.error(err));
});