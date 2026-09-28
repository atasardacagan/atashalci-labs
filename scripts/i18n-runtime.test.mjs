import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

// A small browser fixture exercises the shipping module, not a duplicate router.
// Layout values are deterministic; visual/reflow checks belong in browser QA.
const catalogs = {
  en: { heading: 'Ideas need direction.', label: 'English label', 'i18n.changed': 'Language changed.', 'i18n.error': 'Please try again.' },
  tr: { heading: 'Fikirler yön ister.', label: 'Türkçe etiket', 'i18n.changed': 'Dil değiştirildi.', 'i18n.error': 'Yeniden deneyin.' },
};
let instance = 0;
async function fixture({ locale = 'en', path = '/', page = 'home', basePath = '', routes = { en: '/', tr: '/tr' }, initialFetch } = {}) {
  const state = { y: 800, x: 0, frames: [], changes: [], requests: [], values: new Map(), events: new Map(), windowEvents: new Map(), fetch: initialFetch };
  let url = new URL(path, 'https://example.test');
  class Element {
    constructor(id = '', top = 0) { this.id = id; this.top = top; this.isConnected = true; this.dataset = {}; this.attributes = new Map(); this.classes = new Set(); this.classList = { contains: value => this.classes.has(value), add: value => this.classes.add(value), remove: value => this.classes.delete(value) }; }
    getBoundingClientRect() { return { top: this.top - state.y, bottom: this.top + 2000 - state.y }; }
    closest() { return this; }
    contains(element) { return element === this || element === state.anchor; }
    setAttribute(key, value) { this.attributes.set(key, String(value)); }
    getAttribute(key) { return this.attributes.get(key) ?? null; }
    removeAttribute(key) { this.attributes.delete(key); }
    set href(value) { this.setAttribute('href', value); }
    get href() { return new URL(this.getAttribute('href'), url).href; }
    get innerHTML() { return this.html; }
    set innerHTML(value) { this.html = value; state.translate?.(value); }
  }
  const config = new Element('locale-data');
  config.textContent = JSON.stringify({ locale, messages: catalogs[locale], urls: { en: basePath + '/en.json', tr: basePath + '/tr.json' }, origin: 'https://example.test', basePath, routes });
  const status = new Element('language-status'); status.textContent = '';
  const section = new Element('experiments', 700), anchor = new Element('result', 870);
  state.section = section; state.anchor = anchor;
  const heading = new Element(); heading.dataset.i18n = 'heading'; heading.html = catalogs[locale].heading;
  const label = new Element(); label.dataset.i18nAttrs = 'aria-label:label';
  const canonical = new Element(), ogURL = new Element(), ogLocale = new Element(), alternate = new Element();
  const languages = ['en', 'tr'].map(language => { const link = new Element(); link.dataset.language = language; link.href = routes[language]; return link; });
  const home = new Element(); home.href = routes.en + '#studio';
  const nodes = new Map([['#locale-data', config], ['#language-status', status], ['main', section], ['link[rel="canonical"]', canonical], ['meta[property="og:url"]', ogURL], ['meta[property="og:locale"]', ogLocale], ['meta[property="og:locale:alternate"]', alternate]]);
  const document = {
    body: { dataset: { page } }, documentElement: { lang: locale },
    querySelector: selector => nodes.get(selector) || null,
    querySelectorAll: selector => selector === '[data-i18n]' ? [heading] : selector === '[data-i18n-attrs]' ? [label] : selector === 'section' ? [section] : selector === 'a[href]' ? [...languages, home] : [],
    getElementById: id => state.anchor?.id === id && state.anchor.isConnected ? state.anchor : null,
    elementFromPoint: () => state.anchor,
    addEventListener: (name, handler) => state.events.set(name, handler),
    dispatchEvent: event => state.changes.push(event.detail.locale),
  };
  const history = {
    state: { untouched: true },
    pushState(value, _, path) { state.historyCalls.push(['push', path]); url = new URL(path, url); },
    replaceState(value, _, path) { state.historyCalls.push(['replace', path]); url = new URL(path, url); },
  };
  state.historyCalls = [];
  const globals = {
    document, history,
    location: { get pathname() { return url.pathname; }, get search() { return url.search; }, get hash() { return url.hash; } },
    localStorage: { setItem: (key, value) => state.values.set(key, value) },
    window: { addEventListener: (name, handler) => state.windowEvents.set(name, handler), scrollTo: ({ left, top }) => { state.x = left; state.y = top; } },
    innerWidth: 1440, innerHeight: 900,
    fetch: target => { state.requests.push(target); return state.fetch ? state.fetch(target) : Promise.resolve({ ok: true, json: async () => catalogs[target.includes('tr') ? 'tr' : 'en'] }); },
    requestAnimationFrame: callback => state.frames.push(callback),
    CustomEvent: class { constructor(type, init) { this.type = type; this.detail = init.detail; } },
  };
  const old = new Map();
  for (const [key, value] of Object.entries(globals)) { old.set(key, Object.getOwnPropertyDescriptor(globalThis, key)); Object.defineProperty(globalThis, key, { value, configurable: true, writable: true }); }
  for (const [key, getter] of [['scrollY', () => state.y], ['scrollX', () => state.x]]) { old.set(key, Object.getOwnPropertyDescriptor(globalThis, key)); Object.defineProperty(globalThis, key, { get: getter, configurable: true }); }
  const runtime = await import(new URL(`../dist/assets/i18n.js?test=${++instance}`, import.meta.url));
  return { runtime, state, document, status, heading, label, canonical, ogURL, ogLocale, languages, home,
    moveURL: path => { url = new URL(path, url); },
    get url() { return url.pathname + url.search + url.hash; },
    replaceAnchor({ sameId = true } = {}) { state.anchor.isConnected = false; state.anchor = new Element(sameId ? 'result' : 'different', 1030); },
    frames() { state.frames.splice(0).forEach(callback => callback()); },
    close() { for (const [key, descriptor] of old) { if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key]; } },
  };
}
async function withPage(options, callback) { const page = await fixture(options); try { await callback(page); } finally { page.close(); } }
const deferred = () => { let resolve, reject; const promise = new Promise((yes, no) => { resolve = yes; reject = no; }); return { promise, resolve, reject }; };
const reply = lang => ({ ok: true, json: async () => catalogs[lang] });

await test('switch updates presentation, metadata, URLs and preference without changing history state', () => withPage({ path: '/?ref=studio#experiments' }, async p => {
  const stateToken = history.state;
  let notifications = 0; p.runtime.onLocaleChange(() => notifications++);
  assert.equal(await p.runtime.setLocale('tr'), true); p.frames();
  assert.equal(p.url, '/tr?ref=studio#experiments');
  assert.equal(p.document.documentElement.lang, 'tr');
  assert.equal(p.heading.innerHTML, catalogs.tr.heading);
  assert.equal(p.label.getAttribute('aria-label'), catalogs.tr.label);
  assert.equal(p.canonical.href, 'https://example.test/tr');
  assert.equal(p.ogURL.content, 'https://example.test/tr');
  assert.equal(p.ogLocale.content, 'tr_TR');
  assert.equal(p.home.getAttribute('href'), '/tr#studio');
  assert.equal(p.languages[1].getAttribute('aria-current'), 'page');
  assert.equal(p.state.values.get('al.language'), 'tr');
  assert.equal(history.state, stateToken); assert.equal(notifications, 1);
  assert.equal(p.state.y, 800); assert.deepEqual(p.state.changes, ['tr']);
}));

await test('unchanged language is a no-op and unsupported languages are rejected', () => withPage({}, async p => {
  assert.equal(await p.runtime.setLocale('en'), true);
  assert.equal(await p.runtime.setLocale('fr'), false);
  assert.deepEqual(p.state.requests, []); assert.deepEqual(p.state.historyCalls, []);
  assert.equal(p.state.values.get('al.language'), 'en');
}));

await test('click failure preserves the working document, route and choice; retry works', () => withPage({}, async p => {
  p.state.fetch = async () => ({ ok: false });
  assert.equal(await p.runtime.setLocale('tr'), false);
  assert.equal(p.runtime.getLocale(), 'en'); assert.equal(p.url, '/');
  assert.equal(p.state.values.has('al.language'), false);
  assert.equal(p.status.textContent, catalogs.en['i18n.error']);
  p.state.fetch = async () => reply('tr');
  assert.equal(await p.runtime.setLocale('tr'), true);
  assert.equal(p.state.requests.length, 2); assert.equal(p.status.classList.contains('language-error'), false);
}));

await test('choosing the current language cancels a slow translation and does not re-render', () => withPage({}, async p => {
  const fetch = deferred(); p.state.fetch = () => fetch.promise;
  const first = p.runtime.setLocale('tr');
  assert.equal(await p.runtime.setLocale('en'), true);
  fetch.resolve(reply('tr')); assert.equal(await first, false);
  assert.equal(p.url, '/'); assert.equal(p.runtime.getLocale(), 'en'); assert.deepEqual(p.state.changes, []);
}));

await test('concurrent requests share one catalog fetch and only the latest commits', () => withPage({}, async p => {
  const fetch = deferred(); p.state.fetch = () => fetch.promise;
  const first = p.runtime.setLocale('tr'), second = p.runtime.setLocale('tr');
  fetch.resolve(reply('tr'));
  assert.deepEqual(await Promise.all([first, second]), [false, true]);
  assert.equal(p.state.requests.length, 1); assert.deepEqual(p.state.changes, ['tr']);
  await p.runtime.setLocale('en'); await p.runtime.setLocale('tr');
  assert.equal(p.state.requests.length, 1);
}));

await test('a stale request failure cannot overwrite the latest successful presentation', () => withPage({}, async p => {
  const fetch = deferred(); p.state.fetch = () => fetch.promise;
  const first = p.runtime.setLocale('tr'); await p.runtime.setLocale('en');
  fetch.reject(new Error('offline')); assert.equal(await first, false);
  assert.equal(p.status.textContent, ''); assert.equal(p.status.classList.contains('language-error'), false);
}));

await test('failed history translation repairs the URL while retaining the section and current language', () => withPage({ path: '/#experiments' }, async p => {
  p.moveURL('/tr?ref=back#experiments');
  p.state.fetch = async () => { throw new Error('offline'); };
  assert.equal(await p.runtime.setLocale('tr', { historyMode: 'none' }), false);
  assert.equal(p.url, '/?ref=back#experiments'); assert.equal(p.state.y, 800);
  assert.equal(p.runtime.getLocale(), 'en');
  assert.deepEqual(p.state.historyCalls, [['replace', '/?ref=back#experiments']]);
  assert.equal(p.status.textContent, catalogs.en['i18n.error']);
}));

await test('choosing the rendered language during pending history translation reconciles the address', () => withPage({}, async p => {
  const fetch = deferred(); p.state.fetch = () => fetch.promise;
  p.moveURL('/tr#studio'); const pending = p.runtime.setLocale('tr', { historyMode: 'none' });
  await p.runtime.setLocale('en');
  fetch.resolve(reply('tr')); assert.equal(await pending, false);
  assert.equal(p.url, '/#studio'); assert.equal(p.runtime.getLocale(), 'en');
  assert.deepEqual(p.state.historyCalls, [['push', '/#studio']]);
}));

await test('history switching does not add an entry; optional persistence stays optional', () => withPage({}, async p => {
  p.moveURL('/tr#experiments');
  assert.equal(await p.runtime.setLocale('tr', { historyMode: 'none', persist: false }), true);
  assert.equal(p.url, '/tr#experiments'); assert.deepEqual(p.state.historyCalls, []);
  assert.equal(p.state.values.size, 0);
}));

await test('404 switching keeps the missing path, query and fragment', () => withPage({ path: '/missing/nested?from=link#detail', page: 'error' }, async p => {
  await p.runtime.setLocale('tr');
  assert.equal(p.url, '/tr/missing/nested?from=link#detail');
  await p.runtime.setLocale('en');
  assert.equal(p.url, '/missing/nested?from=link#detail');
}));

await test('scroll position is sampled after fetch, preserving user scroll during loading', () => withPage({}, async p => {
  const fetch = deferred(); p.state.fetch = () => fetch.promise;
  const pending = p.runtime.setLocale('tr'); p.state.y = 830;
  p.state.translate = () => { p.state.anchor.top += 160; p.state.section.top += 160; };
  fetch.resolve(reply('tr')); await pending; p.frames();
  assert.equal(p.state.y, 990);
}));

await test('recreated result anchors retain their visual offset across translated reflow', () => withPage({}, async p => {
  p.runtime.onLocaleChange(() => p.replaceAnchor());
  await p.runtime.setLocale('tr'); p.frames();
  assert.equal(p.state.y, 960);
}));

await test('removed result anchors fall back to their retained logical section', () => withPage({}, async p => {
  p.runtime.onLocaleChange(() => { p.replaceAnchor({ sameId: false }); p.state.section.top += 160; });
  await p.runtime.setLocale('tr'); p.frames();
  assert.equal(p.state.y, 960);
}));

await test('blocked preference storage never prevents a switch', () => withPage({}, async p => {
  localStorage.setItem = () => { throw new Error('blocked'); };
  assert.equal(await p.runtime.setLocale('tr'), true);
  assert.equal(p.url, '/tr');
}));

await test('language links keep native modified-click behavior and intercept primary clicks only', () => withPage({}, async p => {
  const click = p.state.events.get('click'); let prevented = 0;
  const event = { target: { closest: () => p.languages[1] }, button: 0, preventDefault: () => prevented++ };
  click({ ...event, ctrlKey: true }); assert.equal(prevented, 0); assert.equal(p.state.requests.length, 0);
  click({ ...event, button: 1 }); assert.equal(prevented, 0);
  click(event); await new Promise(resolve => setImmediate(resolve));
  assert.equal(prevented, 1); assert.equal(p.runtime.getLocale(), 'tr');
}));

await test('prepaint preference uses explicit saved choice only, retaining queries and sections', async () => {
  const source = await readFile(new URL('../dist/assets/locale-preference.js', import.meta.url), 'utf8');
  function run(pathname, preference, blocked = false) {
    let destination = null;
    vm.runInNewContext(source, { location: { pathname, search: '?ref=test', hash: '#lab-001', replace: value => { destination = value; } }, localStorage: { getItem() { if (blocked) throw new Error('blocked'); return preference; } }, navigator: { language: 'tr-TR' } });
    return destination;
  }
  assert.equal(run('/', null), null); assert.equal(run('/', 'en'), null);
  assert.equal(run('/', 'tr'), '/tr?ref=test#lab-001');
  assert.equal(run('/tr', 'en'), null); assert.equal(run('/missing', 'tr'), null);
  assert.equal(run('/', 'tr', true), null);
});

const project = { basePath: '/atashalci-labs', routes: { en: '/atashalci-labs/', tr: '/atashalci-labs/tr/' } };
await test('project deployment switches routes, navigation, catalogs and metadata inside its prefix', () => withPage({ ...project, path: '/atashalci-labs/?ref=preview#lab-001' }, async p => {
  await p.runtime.setLocale('tr');
  assert.equal(p.url, '/atashalci-labs/tr/?ref=preview#lab-001');
  assert.equal(p.canonical.href, 'https://example.test/atashalci-labs/tr/');
  assert.equal(p.ogURL.content, p.canonical.href);
  assert.equal(p.home.getAttribute('href'), '/atashalci-labs/tr/#studio');
  assert.equal(p.languages[0].getAttribute('href'), '/atashalci-labs/?ref=preview#lab-001');
  assert.deepEqual(p.state.requests, ['/atashalci-labs/tr.json']);
  await p.runtime.setLocale('en');
  assert.equal(p.url, '/atashalci-labs/?ref=preview#lab-001');
  assert.equal(p.home.getAttribute('href'), '/atashalci-labs/#studio');
}));

await test('project Back and Forward detect the Turkish directory without creating history entries', () => withPage({ ...project, path: project.routes.en }, async p => {
  p.moveURL('/atashalci-labs/tr/#lab-001');
  await p.state.windowEvents.get('popstate')();
  assert.equal(p.runtime.getLocale(), 'tr');
  assert.equal(p.url, '/atashalci-labs/tr/#lab-001');
  p.moveURL('/atashalci-labs/#lab-001');
  await p.state.windowEvents.get('popstate')();
  assert.equal(p.runtime.getLocale(), 'en');
  assert.deepEqual(p.state.historyCalls, []);
}));

await test('project 404 switching preserves the missing suffix without repeating the project prefix', () => withPage({ ...project, path: '/atashalci-labs/missing/nested?ref=preview#detail', page: 'error' }, async p => {
  await p.runtime.setLocale('tr');
  assert.equal(p.url, '/atashalci-labs/tr/missing/nested?ref=preview#detail');
  await p.runtime.setLocale('en');
  assert.equal(p.url, '/atashalci-labs/missing/nested?ref=preview#detail');
  assert.equal(p.home.getAttribute('href'), project.routes.en + '#studio');
}));

await test('a static host root 404 honors a Turkish missing URL without redirecting or persisting', () => withPage({ ...project, path: '/atashalci-labs/tr/missing?ref=preview#detail', page: 'error' }, async p => {
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(p.runtime.getLocale(), 'tr');
  assert.equal(p.document.documentElement.lang, 'tr');
  assert.equal(p.url, '/atashalci-labs/tr/missing?ref=preview#detail');
  assert.equal(p.home.getAttribute('href'), project.routes.tr + '#studio');
  assert.deepEqual(p.state.historyCalls, []);
  assert.equal(p.state.values.size, 0);
}));

await test('an unavailable initial 404 translation keeps the attempted address and usable English fallback', () => withPage({ ...project, path: '/atashalci-labs/tr/missing', page: 'error', initialFetch: async () => ({ ok: false }) }, async p => {
  await new Promise(resolve => setImmediate(resolve));
  assert.equal(p.runtime.getLocale(), 'en');
  assert.equal(p.url, '/atashalci-labs/tr/missing');
  assert.deepEqual(p.state.historyCalls, []);
  assert.equal(p.state.values.size, 0);
  assert.equal(p.status.textContent, catalogs.en['i18n.error']);
}));

await test('project error paths resembling a locale name are still English', () => withPage({ ...project, path: '/atashalci-labs/trends', page: 'error' }, async p => {
  assert.equal(p.runtime.getLocale(), 'en');
  assert.deepEqual(p.state.requests, []);
  await p.runtime.setLocale('tr');
  assert.equal(p.url, '/atashalci-labs/tr/trends');
}));

await test('project preference redirects only its own English entry using the configured Turkish path', async () => {
  const source = await readFile(new URL('../dist/assets/locale-preference.js', import.meta.url), 'utf8');
  function run(pathname, preference) {
    let destination = null;
    vm.runInNewContext(source, {
      document: { currentScript: { dataset: { enPath: project.routes.en, trPath: project.routes.tr } } },
      location: { pathname, search: '?ref=preview', hash: '#lab-001', replace: value => { destination = value; } },
      localStorage: { getItem: () => preference },
    });
    return destination;
  }
  assert.equal(run(project.routes.en, 'tr'), project.routes.tr + '?ref=preview#lab-001');
  assert.equal(run(project.routes.en, null), null);
  assert.equal(run('/', 'tr'), null);
  assert.equal(run(project.routes.tr, 'en'), null);
  assert.equal(run('/atashalci-labs/missing', 'tr'), null);
});
