import { loadPage } from '../../scripts/scripts.js';

const importMap = {
  imports: {
    'da-lit': 'https://da.live/deps/lit/dist/index.js',
    'da-y-wrapper': 'https://da.live/deps/da-y-wrapper/dist/index.js',
  },
};

function addImportmap() {
  const importmapEl = document.createElement('script');
  importmapEl.type = 'importmap';
  importmapEl.textContent = JSON.stringify(importMap);
  document.head.appendChild(importmapEl);
}

function generateSidekickPayload() {
  const { hostname, pathname } = window.location;
  const host = hostname === 'localhost'
    ? document.querySelector('meta[property="hlx:proxyUrl"]').content
    : hostname;
  const [, repo, owner] = host.split('.')[0].split('--');
  return {
    detail: {
      config: { mountpoint: `https://content.da.live/${owner}/${repo}/` },
      location: { pathname },
    },
  };
}

export default async function init(payload) {
  const ref = new URLSearchParams(window.location.search).get('quick-edit') || 'on';
  const origins = { on: 'https://da.live', local: 'http://localhost:6456' };
  const origin = origins[ref] || `https://${ref}--da-nx--adobe.aem.live`;
  addImportmap();
  const { default: loadQuickEdit } = await import(`${origin}/nx/public/plugins/quick-edit/quick-edit.js`);
  return loadQuickEdit(payload || generateSidekickPayload(), loadPage);
}
