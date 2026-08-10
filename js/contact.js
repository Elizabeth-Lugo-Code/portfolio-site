/*
  contact.js
  Page-specific. Loads data/contact.json and renders the intro text
  plus the contact card on contact.html.
  The email CTA uses a plain mailto: link, which opens the visitor's
  default email client with your address prefilled — no backend needed.
*/

async function loadContactData() {
  const res = await fetch('data/contact.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load contact.json');
  return res.json();
}

function renderIntro(intro) {
  const root = document.getElementById('contact-intro-root');
  if (!root) return;

  root.innerHTML = `
    <section class="page-intro">
      <h2>${intro.headline}</h2>
      <p>${intro.sub}</p>
    </section>
  `;
}

function renderCard(info) {
  const root = document.getElementById('contact-card-root');
  if (!root) return;

  const mailtoHref = info.emailSubject
    ? `mailto:${info.email}?subject=${encodeURIComponent(info.emailSubject)}`
    : `mailto:${info.email}`;

  const phoneHtml = info.showPhone ? `
    <p>${info.phoneCta} <a href="tel:+1${info.phoneLink}">${info.phone}</a></p>
    <p class="contact-note">${info.phoneNote}</p>
  ` : '';

  root.innerHTML = `
    <section class="page-section">
      <div class="contact-card">
        <a href="${mailtoHref}" class="download-btn" target="_blank">${info.emailCta}</a>
        <button type="button" class="copy-email-btn" id="copy-email-btn">Copy email address</button>
        ${phoneHtml}
        <p>Connect with me on <a href="${info.linkedin}" target="_blank">LinkedIn</a>
           or check out my work on <a href="${info.github}" target="_blank">GitHub</a>.</p>
      </div>
    </section>
  `;

  const copyBtn = document.getElementById('copy-email-btn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(info.email).then(() => {
        const originalText = copyBtn.textContent;
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadContactData()
    .then(data => {
      renderIntro(data.intro);
      renderCard(data.info);
    })
    .catch(err => console.error(err));
});