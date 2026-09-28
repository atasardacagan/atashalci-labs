import { t, getLocale, onLocaleChange } from './i18n.js';
import { setArrowLabel } from './icons.js';

const menu = document.querySelector('.menu-toggle'), mobile = document.querySelector('#mobile-nav');
function renderMenu() {
  if (!menu) return;
  const open = menu.getAttribute('aria-expanded') === 'true';
  menu.innerHTML = `${t(open ? 'site.menuClose' : 'site.menu')} <span>${open ? '−' : '+'}</span>`;
}
function closeMenu(focus = false) {
  if (!menu || !mobile) return;
  mobile.hidden = true; menu.setAttribute('aria-expanded', 'false'); renderMenu();
  if (focus) menu.focus();
}
menu?.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  mobile.hidden = !open; menu.setAttribute('aria-expanded', String(open)); renderMenu();
});
mobile?.querySelectorAll('a:not([data-locale])').forEach(a => a.addEventListener('click', () => closeMenu()));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && mobile && !mobile.hidden) closeMenu(true); });
matchMedia('(min-width:601px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

function setupTabs(selector, onChange) {
  const tabs = [...document.querySelectorAll(selector)];
  function activate(tab, focus = false) {
    if (!tab) return;
    if (focus) tab.focus();
    if (tab.getAttribute('aria-selected') === 'true') return;
    tabs.forEach(item => { item.setAttribute('aria-selected', String(item === tab)); item.tabIndex = item === tab ? 0 : -1; });
    onChange(tab);
  }
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => activate(tab));
    tab.addEventListener('keydown', e => {
      let n;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = (i + 1) % tabs.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = (i + tabs.length - 1) % tabs.length;
      if (e.key === 'Home') n = 0;
      if (e.key === 'End') n = tabs.length - 1;
      if (n !== undefined) { e.preventDefault(); activate(tabs[n], true); }
    });
  });
  return { tabs, activate };
}
function renderCapability(tab) {
  if (!tab) return;
  const data = t('site.capabilities')[tab.dataset.cap], panel = document.querySelector('#cap-panel');
  panel.setAttribute('aria-labelledby', tab.id);
  panel.innerHTML = `<p class="cap-purpose">${data.purpose}</p><ul>${data.items.map(item => `<li>${item}</li>`).join('')}</ul><p class="cap-detail">${data.detail}</p>`;
  document.querySelector('.stack-symbol')?.setAttribute('data-active', tab.dataset.cap);
}
const capTabs = setupTabs('[data-cap]', renderCapability);
function setText(id, value) { const el = document.getElementById(id); if (el) el.textContent = value; }

let stageIndex = 0, productRecorded = false;
const previous = document.querySelector('#previous-stage'), next = document.querySelector('#next-stage');
function renderProduct() {
  const run = document.querySelector('#run-product');
  if (!run) return;
  setText('product-route', t(productRecorded ? 'site.product.route' : 'site.product.unrouted'));
  setText('product-task', t(productRecorded ? 'site.product.task' : 'site.product.none'));
  setArrowLabel(run, t(productRecorded ? 'site.product.reset' : 'site.product.run'), productRecorded ? null : 'right');
  setText('product-result', t(productRecorded ? 'site.product.result' : 'site.product.empty'));
}
function renderStage(tab, preserveState = false) {
  if (!tab) return;
  if (!preserveState) productRecorded = false;
  stageIndex = Number(tab.dataset.stage);
  const production = t('site.production')[stageIndex], panel = document.querySelector('#production-panel');
  const activeId = document.activeElement?.id;
  panel.setAttribute('aria-labelledby', tab.id);
  document.querySelector('#production-art').innerHTML = production.art;
  document.querySelector('#production-title').innerHTML = production.title;
  setText('production-description', production.description); setText('production-state', production.state);
  setText('stage-count', String(stageIndex + 1).padStart(2, '0') + ' / 06');
  document.querySelector('#stage-count').setAttribute('aria-label', t('site.stageAnnouncement', { state: production.state, number: stageIndex + 1 }));
  previous.disabled = stageIndex === 0; next.disabled = stageIndex === 5;
  document.querySelector('#run-product')?.addEventListener('click', () => { productRecorded = !productRecorded; renderProduct(); });
  renderProduct();
  if (preserveState && activeId === 'run-product') document.getElementById(activeId)?.focus({ preventScroll: true });
}
const stageTabs = setupTabs('[data-stage]', renderStage);
previous?.addEventListener('click', () => { stageTabs.activate(stageTabs.tabs[Math.max(0, stageIndex - 1)]); if (stageIndex === 0) stageTabs.tabs[0].focus(); });
next?.addEventListener('click', () => { stageTabs.activate(stageTabs.tabs[Math.min(5, stageIndex + 1)]); if (stageIndex === 5) stageTabs.tabs[5].focus(); });

const contactEmail = document.querySelector('.contact-email')?.textContent.trim(), copy = document.querySelector('.copy-email');
let copyState = 'idle', contactWord = null, contactWordLocale = getLocale();
function renderCopy() {
  if (!copy) return;
  copy.innerHTML = `${t(copyState === 'success' ? 'site.copy.success' : 'site.copy.action')} <span>${copyState === 'success' ? '✓' : '⧉'}</span>`;
  setText('copy-status', copyState === 'idle' ? '' : t(copyState === 'success' ? 'site.copy.status' : 'site.copy.failure'));
}
copy?.addEventListener('click', async () => {
  if (!contactEmail) return;
  try { await navigator.clipboard.writeText(contactEmail); copyState = 'success'; }
  catch { copyState = 'failure'; }
  renderCopy();
});
function renderContactWord() {
  const word = contactWord === null ? t('site.contact.defaultWord') : contactWord.toLocaleLowerCase(contactWordLocale);
  setText('contact-word', word);
  const link = document.querySelector('.contact-variable');
  if (link) { if (contactWord === null) link.style.removeProperty('--word-width'); else link.style.setProperty('--word-width', String(Math.max(6, Array.from(word).length * .9 + 1.4))); }
  if (link && contactEmail) link.href = 'mailto:' + contactEmail + '?subject=' + encodeURIComponent(t(contactWord === null ? 'site.contact.subject' : 'site.contact.wordSubject', { word }));
}
document.addEventListener('direction-word', e => { if (e.detail.userEdited === false) return; contactWord = e.detail.word; contactWordLocale = getLocale(); renderContactWord(); });
function updateClock() {
  const el = document.querySelector('#istanbul-time');
  if (el) {
    const now = new Date();
    el.textContent = new Intl.DateTimeFormat(getLocale() === 'tr' ? 'tr-TR' : 'en-GB', { timeZone: 'Europe/Istanbul', hour: '2-digit', minute: '2-digit', hour12: false }).format(now) + ' / UTC +03:00';
    el.dateTime = now.toISOString();
  }
}
function renderLocale() {
  renderMenu(); renderCapability(capTabs.tabs.find(tab => tab.getAttribute('aria-selected') === 'true'));
  renderStage(stageTabs.tabs[stageIndex], true); renderCopy(); renderContactWord(); updateClock();
}
renderLocale();
onLocaleChange(renderLocale);
setInterval(updateClock, 60000);
document.querySelectorAll('.cap-tabs,.production-tabs,.production-actions,.copy-email').forEach(control => control.removeAttribute('inert'));
document.body.setAttribute('data-site-ready', '');
