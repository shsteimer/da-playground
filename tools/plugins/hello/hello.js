// eslint-disable-next-line import/no-unresolved
import DA_SDK from 'https://da.live/nx/utils/sdk.js';

const params = new URLSearchParams(window.location.search);
const variant = params.get('type') || 'default';
const { origin } = window.location;
const proxied = origin.includes('preview.da.live');

const info = document.querySelector('.info');
const actions = document.querySelector('.actions');

function addInfo(label, value, cls) {
  const dt = document.createElement('dt');
  dt.textContent = label;
  const dd = document.createElement('dd');
  dd.textContent = value;
  if (cls) dd.className = cls;
  info.append(dt, dd);
}

function addButton(label, onClick) {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  actions.append(btn);
}

document.querySelector('.variant').textContent = `Variant: ${variant}`;
addInfo('Served from', origin, proxied ? 'ok' : 'warn');
addInfo('Preview proxy', proxied ? 'yes ✅' : 'no ⚠️');

// Window experiences have no opener channel, so the SDK never resolves there.
const sdk = await Promise.race([
  DA_SDK,
  new Promise((resolve) => { setTimeout(() => resolve(null), 3000); }),
]);

if (!sdk) {
  addInfo('DA SDK', 'not connected (expected for window experience)');
} else {
  const { context, actions: da } = sdk;
  addInfo('DA SDK', 'connected', 'ok');
  Object.entries(context || {}).forEach(([key, value]) => addInfo(key, `${value}`));

  const message = `Hello World from the ${variant} plugin!`;
  if (da?.sendText) addButton('Insert "Hello World"', () => da.sendText(message));
  if (da?.sendText && da?.closeLibrary) {
    addButton('Insert & close', () => {
      da.sendText(message);
      da.closeLibrary();
    });
  }
}
