import { t, onLocaleChange } from './i18n.js';

const hero = document.querySelector('.atelier-hero');
const toggle = hero?.querySelector('.hero-motion-toggle');
if (hero && toggle) {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  let pausedByVisitor = false;
  let inView = false;

  function renderMotion() {
    const playing = !pausedByVisitor && !reducedMotion.matches && inView && !document.hidden && menu?.getAttribute('aria-expanded') !== 'true';
    hero.dataset.gardenState = playing ? 'playing' : 'paused';
    toggle.hidden = reducedMotion.matches;
    toggle.dataset.paused = String(pausedByVisitor);
    const label = toggle.querySelector('[data-i18n]');
    const key = pausedByVisitor ? 'atelier.garden.play' : 'atelier.garden.pause';
    label.dataset.i18n = key;
    label.textContent = t(key);
  }

  toggle.addEventListener('click', () => { pausedByVisitor = !pausedByVisitor; renderMotion(); });
  document.addEventListener('visibilitychange', renderMotion);
  reducedMotion.addEventListener('change', renderMotion);
  onLocaleChange(renderMotion);
  if (menu) {
    new MutationObserver(renderMotion).observe(menu, { attributes: true, attributeFilter: ['aria-expanded'] });
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(entries => {
      inView = entries.some(entry => entry.isIntersecting);
      renderMotion();
    }, { threshold: 0 }).observe(hero);
  } else {
    inView = true;
  }
  renderMotion();
}
