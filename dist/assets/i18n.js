// Curated locale content; switching changes presentation, never prototype state.
const browser = typeof document !== 'undefined';
let config = browser ? JSON.parse(document.querySelector('#locale-data')?.textContent || '{}') : {};
let locale = config.locale || 'en', messages = config.messages || {};
if (!browser) {
  const fs = await import('node:fs');
  const folder = new URL('../../locales/en/', import.meta.url);
  for (const file of fs.readdirSync(folder).filter(name => name.endsWith('.json'))) {
    Object.assign(messages, JSON.parse(fs.readFileSync(new URL(file, folder), 'utf8')));
  }
}
const subscribers = new Set(), catalogs = new Map([[locale, Promise.resolve(messages)]]);
let requestId = 0;
export const getLocale = () => locale;
export function t(key, params = {}) {
  const value = messages[key];
  if (typeof value !== 'string') return value === undefined ? key : value;
  return value.replace(/\{([\w]+)\}/g, (match, name) => Object.hasOwn(params, name) ? String(params[name]) : match);
}
export function onLocaleChange(callback) { subscribers.add(callback); return () => subscribers.delete(callback); }
// Routes come from the deployment build so a project site never escapes its prefix.
const routes = config.routes || { en: '/', tr: '/tr' };
const basePath = config.basePath || '';
const base = lang => routes[lang];
const normalizedPath = path => path.replace(/\/+$/, '') || '/';
function languageForPath() {
  const turkish = normalizedPath(base('tr'));
  return location.pathname === turkish || location.pathname.startsWith(turkish + '/') ? 'tr' : 'en';
}
function routeFor(lang) {
  if (document.body.dataset.page !== 'error') return base(lang);
  const path = basePath && (location.pathname === basePath || location.pathname.startsWith(basePath + '/'))
    ? location.pathname.slice(basePath.length) || '/' : location.pathname;
  const route = path.replace(/^\/tr(?=\/|$)/, '') || '/';
  return route === '/' ? base(lang) : base(lang).replace(/\/$/, '') + route;
}
function remember(lang) { try { localStorage.setItem('al.language', lang); } catch { /* Storage is optional. */ } }
function updateRoute(lang, mode) {
  if (mode === 'none') return;
  const next = routeFor(lang) + location.search + location.hash;
  if (next !== location.pathname + location.search + location.hash) {
    history[mode === 'replace' ? 'replaceState' : 'pushState'](history.state, '', next);
  }
}
function translateStatic() {
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const value = t(element.dataset.i18n);
    if (typeof value === 'string' && element.innerHTML !== value) element.innerHTML = value;
  });
  document.querySelectorAll('[data-i18n-attrs]').forEach(element => {
    element.dataset.i18nAttrs.split(';').filter(Boolean).forEach(pair => {
      const separator = pair.indexOf(':');
      const attribute = pair.slice(0, separator).trim(), key = pair.slice(separator + 1).trim();
      const value = t(key);
      if (attribute && typeof value === 'string') element.setAttribute(attribute, value);
    });
  });
}
function updateNavigation() {
  document.querySelectorAll('a[href]').forEach(anchor => {
    if (anchor.dataset.language) {
      const lang = anchor.dataset.language;
      anchor.href = routeFor(lang) + location.search + location.hash;
      if (lang === locale) anchor.setAttribute('aria-current', 'page');
      else anchor.removeAttribute('aria-current');
      anchor.setAttribute('lang', locale);
      anchor.setAttribute('hreflang', lang);
      return;
    }
    const href = anchor.getAttribute('href');
    const path = href?.split('#')[0];
    if (path && Object.values(routes).some(route => normalizedPath(route) === normalizedPath(path))) {
      const fragment = href.includes('#') ? href.slice(href.indexOf('#')) : '';
      anchor.setAttribute('href', base(locale) + fragment);
    }
  });
}
function updateMetadata() {
  document.documentElement.lang = locale;
  const canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = config.origin + base(locale);
  const url = document.querySelector('meta[property="og:url"]');
  if (url) url.content = config.origin + base(locale);
  const ogLocale = document.querySelector('meta[property="og:locale"]');
  if (ogLocale) ogLocale.content = locale === 'tr' ? 'tr_TR' : 'en_US';
  const alternate = document.querySelector('meta[property="og:locale:alternate"]');
  if (alternate) alternate.content = locale === 'tr' ? 'en_US' : 'tr_TR';
}
function bookmark() {
  const sections = [...document.querySelectorAll('section')];
  const line = Math.min(140, innerHeight * .2);
  const candidates = sections.filter(element => { const r = element.getBoundingClientRect(); return r.top <= line && r.bottom > line; });
  const section = candidates.at(-1) || document.querySelector('main');
  const hit = document.elementFromPoint(innerWidth / 2, line);
  const target = hit?.closest('[id]');
  const anchor = target && section?.contains(target) ? target : section;
  return { anchor, anchorId: anchor?.id, top: anchor?.getBoundingClientRect().top,
    section, sectionTop: section?.getBoundingClientRect().top, x: scrollX, y: scrollY };
}
function restorePosition(saved) {
  if (!saved) return;
  // A controller can replace a result node while keeping its stable public ID.
  const anchor = saved.anchor?.isConnected ? saved.anchor : saved.anchorId && document.getElementById(saved.anchorId);
  const y = anchor?.isConnected ? scrollY + anchor.getBoundingClientRect().top - saved.top
    : saved.section?.isConnected ? scrollY + saved.section.getBoundingClientRect().top - saved.sectionTop : saved.y;
  // Instant correction avoids a second scroll animation during a language change.
  window.scrollTo({ left: saved.x, top: y, behavior: 'instant' });
}
async function catalog(lang) {
  if (!catalogs.has(lang)) {
    catalogs.set(lang, fetch(config.urls[lang], { credentials: 'same-origin' }).then(response => {
      if (!response.ok) throw new Error('Locale unavailable');
      return response.json();
    }).catch(error => { catalogs.delete(lang); throw error; }));
  }
  return catalogs.get(lang);
}
export async function setLocale(lang, { historyMode = 'push', persist = true, restoreRouteOnFailure = true } = {}) {
  if (!['en', 'tr'].includes(lang)) return false;
  const token = ++requestId;
  const status = document.querySelector('#language-status');
  if (lang === locale) {
    // An in-flight history traversal may already have changed the address.
    // Choosing the displayed language cancels it and reconciles the URL too.
    updateRoute(lang, historyMode); updateNavigation();
    if (persist) remember(lang);
    if (status?.classList.contains('language-error')) { status.textContent = ''; status.classList.remove('language-error'); }
    return true;
  }
  try {
    const next = await catalog(lang);
    if (token !== requestId) return false;
    const saved = bookmark();
    messages = next; locale = lang;
    translateStatic(); updateMetadata();
    updateRoute(lang, historyMode);
    updateNavigation();
    for (const callback of subscribers) callback(locale);
    if (persist) remember(lang);
    if (status) { status.textContent = t('i18n.changed'); status.classList.remove('language-error'); }
    restorePosition(saved);
    requestAnimationFrame(() => { if (token === requestId) restorePosition(saved); });
    document.dispatchEvent(new CustomEvent('localechange', { detail: { locale } }));
    return true;
  } catch {
    if (token === requestId) {
      // Back/Forward moves the URL before its catalog is available. On failure,
      // keep the working page, state and address coherent so the user can retry.
      if (historyMode === 'none' && restoreRouteOnFailure) { updateRoute(locale, 'replace'); updateNavigation(); }
      if (status) { status.textContent = t('i18n.error'); status.classList.add('language-error'); }
    }
    return false;
  }
}
if (browser) {
  if (!document.querySelector('#language-status')) {
    const status = document.createElement('span'); status.id = 'language-status'; status.className = 'sr-only'; status.setAttribute('role', 'status');
    document.querySelector('.language-switcher')?.append(status);
  }
  document.addEventListener('click', event => {
    const anchor = event.target.closest('a[data-language]');
    if (!anchor || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault(); setLocale(anchor.dataset.language);
  });
  window.addEventListener('popstate', () => setLocale(languageForPath(), { historyMode: 'none' }));
  window.addEventListener('hashchange', updateNavigation);
  updateNavigation();
  // Static hosts use one root 404 document for every missing URL. Honor the
  // requested language without redirecting the missing address or saving a choice.
  if (document.body.dataset.page === 'error' && languageForPath() !== locale) {
    setLocale(languageForPath(), { historyMode: 'none', persist: false, restoreRouteOnFailure: false });
  }
  const header = document.querySelector('.site-header'), switcher = document.querySelector('.language-switcher');
  if (header && switcher) new IntersectionObserver(([entry]) => switcher.toggleAttribute('data-floating', !entry.isIntersecting)).observe(header);
}
