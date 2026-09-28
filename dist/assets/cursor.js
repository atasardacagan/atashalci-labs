import './i18n.js';
/** A/L cursor: progressive enhancement, independent of the product/scene state. */
const owner = Symbol.for('atashalci.cursor');
const clickable = 'a[href],button,summary,[role="button"],[role="tab"],[role="link"]';
const native = 'input,textarea,select,option,label,[contenteditable]:not([contenteditable="false"]),[data-cursor="native"],iframe,video[controls],audio[controls]';
const unavailable = ':disabled,[aria-disabled="true"],[inert]';

// One owner across reinitialization. Touch-only devices keep only capability listeners.
export function mountCursor() {
  window[owner]?.destroy();
  const fine = matchMedia('(any-hover: hover) and (any-pointer: fine)');
  const primary = matchMedia('(hover: hover) and (pointer: fine)');
  const forced = matchMedia('(forced-colors: active)');
  const lifecycle = new AbortController();
  let active = null;
  const controller = { destroy() {
    lifecycle.abort();
    active?.destroy();
    active = null;
    if (window[owner] === controller) delete window[owner];
  } };
  window[owner] = controller;
  function syncCapability() {
    const enabled = (fine.matches || primary.matches) && !forced.matches;
    if (enabled && !active) active = createCursor();
    else if (!enabled) { active?.destroy(); active = null; }
  }
  for (const query of [fine, primary, forced]) query.addEventListener('change', syncCapability, { signal: lifecycle.signal });
  syncCapability();
  return controller;
}

function createCursor() {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const events = new AbortController();
  const overlay = document.createElement('div');
  overlay.className = 'al-cursor';
  overlay.hidden = true;
  overlay.setAttribute('aria-hidden', 'true');
  overlay.innerHTML = '<div class="al-cursor-trail"><svg class="al-cursor-frame" viewBox="0 0 26 26" focusable="false"><path d="M9 2.5H2.5V9 M17 23.5H23.5V17"/><path class="al-cursor-slash" d="M20 8L23 1"/><path class="al-cursor-guides" d="M-2 22H3 M22 -2V3"/></svg></div><div class="al-cursor-point"><span class="al-cursor-label"></span></div>';
  const point = overlay.querySelector('.al-cursor-point');
  const trail = overlay.querySelector('.al-cursor-trail');
  const label = overlay.querySelector('.al-cursor-label');
  let x = 0, y = 0, tx = 0, ty = 0, frame = 0, previousTime = 0;
  let engaged = false, visible = false, dirty = false, destroyed = false;
  let buttons = 0, dragging = false, pressedControl = null, lastElement = null;
  let width = root.clientWidth, height = root.clientHeight;
  let calm = reduced.matches || root.classList.contains('motion-paused');
  let sceneObserver, bodyObserver;

  function set(name, value) {
    if (overlay.dataset[name] !== value) overlay.dataset[name] = value;
  }
  function hide() {
    if (root.hasAttribute('data-al-cursor')) delete root.dataset.alCursor;
    if (visible) {
      set('visible', 'false');
      set('mode', 'default');
      set('pressed', 'false');
      if (label.textContent) label.textContent = '';
    }
    visible = false;
    if (frame) cancelAnimationFrame(frame);
    frame = 0; previousTime = 0;
  }
  function suspend() {
    engaged = false; dirty = false; buttons = 0; dragging = false;
    pressedControl = null; lastElement = null;
    hide();
  }
  function destroy() {
    if (destroyed) return;
    destroyed = true;
    suspend();
    events.abort();
    sceneObserver?.disconnect();
    bodyObserver?.disconnect();
    overlay.remove();
  }
  // Every entry point fails to the native pointer; no global error handler is needed.
  function safely(callback) {
    return (...args) => { if (!destroyed) try { callback(...args); } catch { destroy(); } };
  }
  function listen(target, type, callback, options = {}) {
    target.addEventListener(type, safely(callback), { passive: true, ...options, signal: events.signal });
  }
  function inside() { return x >= 0 && y >= 0 && x < width && y < height; }
  function wantsNative(element) {
    return !(element instanceof Element) || !inside() || dragging ||
      !!element.closest(native + ',' + unavailable) ||
      (buttons !== 0 && (!pressedControl || element.closest(clickable) !== pressedControl));
  }

  function resolve(element) {
    lastElement = element;
    if (!engaged || document.hidden || wantsNative(element)) { hide(); return; }
    if (!overlay.isConnected) { destroy(); return; }
    const control = element.closest(clickable);
    const caption = control?.dataset.cursorLabel || '';
    const region = element.closest('[data-cursor="target"]');
    const regionStopped = region?.classList.contains('fallback') ||
      (region?.id === 'signal-stage' && document.querySelector('#signal-pause')?.getAttribute('aria-pressed') === 'true');
    const mode = control ? (caption ? 'label' : 'hover') : region && !regionStopped && !calm ? 'target' : 'default';
    // Finish surface reads before any cursor writes. This runs once per dirty frame.
    const tone = surfaceTone(element);
    if (!visible) { tx = x; ty = y; }
    set('mode', mode); set('tone', tone); set('calm', String(calm));
    set('pressed', String(buttons === 1 && !!control));
    if (label.textContent !== caption) label.textContent = caption;
    visible = true;
  }

  function draw(time) {
    frame = 0;
    if (!overlay.isConnected) { destroy(); return; }
    if (dirty) { dirty = false; resolve(document.elementFromPoint(x, y)); }
    if (!visible) return;
    const dt = Math.min(Math.max(0, time - previousTime), 40);
    previousTime = time;
    const ease = calm ? 1 : 1 - Math.exp(-dt / 42);
    tx += (x - tx) * ease; ty += (y - ty) * ease;
    const distance = Math.hypot(x - tx, y - ty);
    // Keep the exact point inside its own registration frame during fast traversals.
    if (distance > 8) { tx = x + (tx - x) * 8 / distance; ty = y + (ty - y) * 8 / distance; }
    const settled = Math.hypot(x - tx, y - ty) < .08;
    if (settled) { tx = x; ty = y; }
    point.style.transform = 'translate3d(' + x + 'px,' + y + 'px,0)';
    trail.style.transform = 'translate3d(' + tx + 'px,' + ty + 'px,0)';
    set('side', x > width - 125 ? 'left' : 'right');
    set('low', String(y < 28));
    set('bottom', String(y > height - 28));
    set('visible', 'true');
    // Commit native suppression last, with the overlay positioned in the same frame.
    if (root.dataset.alCursor !== 'active') root.dataset.alCursor = 'active';
    if (!settled) frame = requestAnimationFrame(safely(draw));
    else previousTime = 0;
  }
  function schedule(refresh = false) {
    if (!engaged || document.hidden || destroyed) return;
    dirty ||= refresh;
    if (!frame && (visible || dirty)) {
      if (!previousTime) previousTime = performance.now();
      frame = requestAnimationFrame(safely(draw));
    }
  }
  function move(event) {
    if (event.pointerType !== 'mouse') { if (engaged) suspend(); return; }
    x = event.clientX; y = event.clientY; buttons = event.buttons;
    if (!buttons) { pressedControl = null; dragging = false; }
    engaged = true;
    // Native controls never schedule interpolation; their native cursor returns now.
    if (wantsNative(event.target)) { lastElement = event.target; dirty = false; hide(); return; }
    schedule(event.target !== lastElement || !visible);
  }
  function updateMotion() {
    const next = reduced.matches || root.classList.contains('motion-paused');
    if (next !== calm) { calm = next; schedule(true); }
  }

  try {
    document.body.append(overlay);
    if (getComputedStyle(overlay).getPropertyValue('--al-cursor-ready').trim() !== '1') { destroy(); return null; }
    overlay.hidden = false;
    listen(document, 'pointermove', move);
    listen(document, 'pointerover', event => { if (engaged) move(event); });
    listen(document, 'pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) { suspend(); return; }
      pressedControl = event.target.closest(clickable);
      move(event); if (!wantsNative(event.target)) schedule(true);
    });
    listen(document, 'pointerup', event => {
      if (event.pointerType !== 'mouse') return;
      move(event); if (!wantsNative(event.target)) schedule(true);
    });
    listen(document, 'dragstart', () => { dragging = true; hide(); });
    listen(document, 'dragend', suspend);
    listen(document, 'pointercancel', suspend);
    listen(root, 'pointerleave', suspend);
    listen(document, 'keydown', suspend);
    listen(document, 'visibilitychange', suspend);
    listen(window, 'blur', suspend);
    listen(window, 'pagehide', suspend);
    listen(window, 'pageshow', suspend);
    listen(window, 'hashchange', () => schedule(true));
    listen(window, 'scroll', () => schedule(true), { capture: true });
    listen(window, 'resize', () => { width = root.clientWidth; height = root.clientHeight; schedule(true); });
    for (const type of ['transitionend', 'transitioncancel']) listen(document, type, event => {
      if (event.propertyName === 'background-color' && event.target.contains(lastElement)) schedule(true);
    });
    listen(reduced, 'change', updateMotion);
    sceneObserver = new MutationObserver(safely(updateMotion));
    sceneObserver.observe(root, { attributes: true, attributeFilter: ['class'] });
    bodyObserver = new MutationObserver(safely(records => {
      if (!overlay.isConnected) { destroy(); return; }
      if (engaged && records.some(record => !overlay.contains(record.target))) schedule(true);
    }));
    bodyObserver.observe(document.body, { subtree: true, childList: true, attributes: true,
      attributeFilter: ['disabled', 'aria-disabled', 'aria-pressed', 'aria-selected', 'class', 'hidden', 'inert', 'data-cursor-tone', 'data-cursor-label', 'data-cursor'] });
  } catch { destroy(); return null; }
  return { destroy };
}

// Alpha-composite painted ancestors; explicit hints cover the colors inside a canvas.
function surfaceTone(element) {
  const explicit = element.closest('[data-cursor-tone]')?.dataset.cursorTone;
  if (['dark', 'light', 'accent'].includes(explicit)) return explicit;
  let rgb = [0, 0, 0], remaining = 1;
  for (let el = element; el && remaining > .01; el = el.parentElement) {
    const channels = getComputedStyle(el).backgroundColor.match(/[\d.]+/g)?.map(Number);
    if (!channels || channels.length < 3) continue;
    const alpha = channels[3] ?? 1;
    rgb = rgb.map((value, i) => value + channels[i] * alpha * remaining);
    remaining *= 1 - alpha;
  }
  rgb = rgb.map((value, i) => value + [17, 18, 16][i] * remaining);
  const linear = rgb.map(value => {
    const channel = value / 255;
    return channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4;
  });
  const luminance = linear[0] * .2126 + linear[1] * .7152 + linear[2] * .0722;
  if (luminance < .18) return 'dark';
  return rgb[0] > rgb[1] * 1.6 && rgb[0] > rgb[2] * 1.6 ? 'accent' : 'light';
}

mountCursor();
