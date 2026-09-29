import { t, onLocaleChange } from './i18n.js';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#mobile-nav');
const header = document.querySelector('.atelier-header');
const content = [...document.querySelectorAll('main, footer')];
function renderMenu() {
  if (menu) menu.querySelector('[data-i18n]').textContent = t(menu.getAttribute('aria-expanded') === 'true' ? 'atelier.menu.close' : 'atelier.menu.open');
}
function setMenu(open, focus = false) {
  if (!menu || !navigation) return;
  menu.setAttribute('aria-expanded', String(open)); navigation.hidden = !open;
  document.body.classList.toggle('menu-open', open);
  content.forEach(element => element.inert = open);
  renderMenu(); scheduleHeaderTone();
  if (focus) menu.focus({ preventScroll: true });
}
function closeMenu(focus = false) { setMenu(false, focus); }
if (menu && navigation) {
  menu.hidden = false;
  menu.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(true); });
  document.addEventListener('keydown', event => {
    if (navigation.hidden) return;
    if (event.key === 'Escape') { event.preventDefault(); closeMenu(true); }
    if (event.key === 'Tab') {
      const controls = [...header.querySelectorAll('a,button'), ...navigation.querySelectorAll('a,button')].filter(element => element.getClientRects().length);
      const first = controls[0], last = controls.at(-1);
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });
}
let headerFrame = 0;
function refreshHeaderTone() {
  headerFrame = 0;
  if (!header) return;
  for (const target of [header.querySelector('.atelier-brand'), header.querySelector('.language-slot')]) {
    if (!target) continue;
    const rect = target.getBoundingClientRect();
    let node = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2)
      .find(element => !header.contains(element) && !element.closest('.al-cursor'));
    let light = true, surface = '#f8f3ef';
    while (node && node !== document.documentElement) {
      const color = getComputedStyle(node).backgroundColor;
      const rgb = color.match(/[\d.]+/g)?.map(Number);
      if (rgb?.length >= 3 && (rgb.length < 4 || rgb[3] > .8)) {
        surface = color;
        light = (rgb[0] * .299 + rgb[1] * .587 + rgb[2] * .114) > 145; break;
      }
      node = node.parentElement;
    }
    target.dataset.tone = light ? 'light' : 'dark';
    target.style.setProperty('--header-surface', surface);
  }
}
function scheduleHeaderTone() { if (!headerFrame) headerFrame = requestAnimationFrame(refreshHeaderTone); }
window.addEventListener('scroll', scheduleHeaderTone, { passive: true });
window.addEventListener('resize', scheduleHeaderTone, { passive: true });
onLocaleChange(scheduleHeaderTone); scheduleHeaderTone();

let edition = 0, lighting = 'day', mood = 0;
const editorial = document.querySelector('#editorial-demo');
const spatial = document.querySelector('#spatial-demo');
const expressive = document.querySelector('#expressive-demo');
let edited = { edition: false, lighting: false, mood: false };
function renderStudies() {
  if (editorial) {
    editorial.dataset.edition = String(edition);
    document.querySelector('#editorial-title').innerHTML = t('atelier.editorial.titles')[edition];
    document.querySelector('#edition-status').textContent = edited.edition ? t('atelier.editorial.feedback', { number: String(edition + 1).padStart(2, '0') }) : t('atelier.editorial.status');
  }
  if (spatial) {
    spatial.dataset.light = lighting;
    spatial.querySelectorAll('button[data-light]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.light === lighting)));
    document.querySelector('#spatial-status').textContent = edited.lighting ? t(lighting === 'day' ? 'atelier.spatial.dayStatus' : 'atelier.spatial.nightStatus') : t('atelier.spatial.status');
  }
  if (expressive) {
    expressive.dataset.mood = String(mood);
    expressive.querySelectorAll('button[data-mood]').forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.mood) === mood)));
    document.querySelector('#expressive-status').textContent = edited.mood ? t('atelier.expressive.feedback')[mood] : t('atelier.expressive.status');
  }
}
document.querySelector('#edition-next')?.addEventListener('click', () => { edition = (edition + 1) % 3; edited.edition = true; renderStudies(); });
spatial?.querySelectorAll('button[data-light]').forEach(button => button.addEventListener('click', () => { lighting = button.dataset.light; edited.lighting = true; renderStudies(); }));
expressive?.querySelectorAll('button[data-mood]').forEach(button => button.addEventListener('click', () => { mood = Number(button.dataset.mood); edited.mood = true; renderStudies(); }));
document.querySelectorAll('.study-controls, #edition-next').forEach(control => control.hidden = false);

const copy = document.querySelector('.copy-email');
let copyState = '';
function renderCopy() {
  if (!copy) return;
  copy.textContent = t(copyState === 'success' ? 'site.copy.success' : 'site.copy.action');
  document.querySelector('#copy-status').textContent = copyState ? t(copyState === 'success' ? 'site.copy.status' : 'site.copy.failure') : '';
}
if (copy) {
  copy.hidden = false;
  copy.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('info@atashalci.com'); copyState = 'success'; }
    catch { copyState = 'failure'; }
    renderCopy();
  });
}
document.querySelectorAll('[data-share-experiment]').forEach(button => {
  const region = button.closest('.experiment-share');
  const status = region.querySelector('[role="status"]');
  const fallback = region.querySelector('input');
  let outcome = '', attempt = 0;
  const experimentUrl = () => {
    const url = new URL(location.href); url.search = ''; url.hash = button.dataset.shareExperiment;
    return url.href;
  };
  function renderShare() {
    status.textContent = outcome ? t(`static.journey.share_${outcome}`) : '';
    fallback.hidden = outcome !== 'manual'; fallback.value = experimentUrl();
  }
  button.addEventListener('click', async () => {
    const currentAttempt = ++attempt; button.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(experimentUrl());
      if (currentAttempt === attempt) outcome = 'copied';
    } catch { if (currentAttempt === attempt) outcome = 'manual'; }
    finally {
      if (currentAttempt === attempt) {
        button.disabled = false; renderShare();
        if (outcome === 'manual') { fallback.focus({ preventScroll: true }); fallback.select(); }
      }
    }
  });
  fallback.addEventListener('click', () => fallback.select());
  onLocaleChange(() => {
    if (button.disabled) { attempt++; button.disabled = false; outcome = ''; }
    if (outcome === 'copied') outcome = '';
    renderShare();
  });
  renderShare(); region.hidden = false;
});
function renderLocale() { renderMenu(); renderStudies(); renderCopy(); }
renderLocale(); onLocaleChange(renderLocale);
document.body.dataset.atelierReady = '';
