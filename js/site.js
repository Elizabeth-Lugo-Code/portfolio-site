/*
  site.js
  Shared across every page. Responsible for:
  - Fetching data/site.json (nav links, business info, footer content)
  - Rendering the nav links and footer (same on every page)
  - Highlighting the current page in the nav via body[data-page]
  - Mobile hamburger toggle
  - Dispatching 'site-data-ready' in case a page script wants site.json too
*/

async function loadSiteData() {
  const res = await fetch('data/site.json', { cache: 'no-store' });
  if (!res.ok) throw new Error('Could not load site.json');
  return res.json();
}

function renderNav(data) {
  const navRoot = document.getElementById('nav-links');
  if (!navRoot) return;

  const currentPage = document.body.dataset.page;

  navRoot.innerHTML = data.nav.map(item => {
    const activeClass = item.page === currentPage ? ' class="active"' : '';
    return `<li><a href="${item.href}"${activeClass}>${item.label}</a></li>`;
  }).join('');
}

function renderFooter(data) {
  const footerRoot = document.getElementById('footer-root');
  if (!footerRoot) return;

  const currentYear = new Date().getFullYear();
  const copyrightName = (data.footer && data.footer.copyrightName) || data.business.name;

  const social = data.business.socialMedia || {};
  const socialLinksHtml = Object.entries(social)
    .filter(([, url]) => url)
    .map(([platform, url]) => {
      const label = platform.charAt(0).toUpperCase() + platform.slice(1);
      return `<a href="${url}" target="_blank">${label}</a>`;
    })
    .join('');

  footerRoot.innerHTML = `
    <div class="footer-content">
      <p>&copy; ${currentYear} ${copyrightName}. Built from scratch.</p>
      <div class="footer-links">
        <a href="mailto:${data.business.email}">Email</a>
        ${socialLinksHtml}
      </div>
    </div>
  `;
}

function initMobileNav() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('nav-links');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadSiteData()
    .then(data => {
      window.__siteData = data;
      renderNav(data);
      renderFooter(data);
      initMobileNav();
      document.dispatchEvent(new CustomEvent('site-data-ready', { detail: data }));
    })
    .catch(err => {
      console.error(err);
      const footerRoot = document.getElementById('footer-root');
      if (footerRoot) {
        footerRoot.innerHTML = '<p style="text-align:center; padding:1rem;">Site content failed to load. If you\'re opening this file directly, run it through a local server or GitHub Pages instead — browsers block JSON fetches from local files.</p>';
      }
    });
});