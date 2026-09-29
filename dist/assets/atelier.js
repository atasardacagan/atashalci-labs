import { t, onLocaleChange } from './i18n.js';

const menu = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#mobile-nav');
function renderMenu() {
  if (menu) menu.querySelector('[data-i18n]').textContent = t(menu.getAttribute('aria-expanded') === 'true' ? 'atelier.menu.close' : 'atelier.menu.open');
}
function closeMenu(focus = false) {
  if (!menu || !navigation) return;
  menu.setAttribute('aria-expanded', 'false'); navigation.hidden = true; renderMenu();
  if (focus) menu.focus();
}
if (menu && navigation) {
  menu.hidden = false;
  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open)); navigation.hidden = !open; renderMenu();
  });
  navigation.addEventListener('click', event => { if (event.target.closest('a')) closeMenu(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !navigation.hidden) closeMenu(true); });
  matchMedia('(min-width:801px)').addEventListener('change', event => { if (event.matches) closeMenu(); });
}

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
