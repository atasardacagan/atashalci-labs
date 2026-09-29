import { t, onLocaleChange } from './i18n.js';
import { setArrowLabel } from './icons.js';

// All records and transitions in this module are local prototype state.
const $ = selector => document.querySelector(selector);
const put = (selector, value) => { $(selector).textContent = value; };
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionStopped = () => reduced.matches || document.documentElement.classList.contains('motion-paused');
let progress = -1, inspected = 0, execution = 'manual', running = false, flowTimer = 0;
let statusKind = 'ready', statusStep = 0;
const stepButtons = [...document.querySelectorAll('[data-flow-step]')];
function flowSteps() {
  const brief = t('flow.briefs')[$('#flow-brief').value];
  return t('flow.steps').map(step => ({
    ...step,
    fields: step.fields.map(([label, value]) => [label, value.replace(/\{(\w+)\}/g, (token, key) => brief[key] ?? token)])
  }));
}
function renderFlowStatus() {
  const step = t('flow.stepLabels')[statusStep];
  if (statusKind === 'inspect') {
    put('#flow-status', t(statusStep <= progress ? 'flow.status.inspectedComplete' : 'flow.status.inspectedPreview', { step }));
  } else if (statusKind === 'advance') {
    put('#flow-status', t(progress === 5 ? 'flow.status.finished' : 'flow.status.advanced', { step, count: progress + 1 }));
  } else put('#flow-status', t('flow.status.ready'));
}
function renderFlow() {
  const steps = flowSteps(), item = steps[inspected];
  stepButtons.forEach((button, i) => {
    if (i === inspected) button.setAttribute('aria-current', 'step');
    else button.removeAttribute('aria-current');
    button.parentElement.dataset.complete = String(i <= progress);
    button.querySelector('.flow-node-number').dataset.inspecting = t('flow.node.inspecting');
    button.querySelector('.flow-node-state').textContent = t(i <= progress ? 'flow.node.complete' : i === progress + 1 ? 'flow.node.next' : 'flow.node.waiting');
  });
  put('#flow-inspect-number', String(inspected + 1).padStart(2, '0'));
  put('#flow-inspect-label', item.label);
  put('#flow-payload-state', t(inspected <= progress ? 'flow.payload.complete' : 'flow.payload.preview'));
  put('#flow-payload-title', item.title);
  const fields = $('#flow-payload-fields');
  fields.replaceChildren();
  item.fields.forEach(([key, value]) => {
    const row = document.createElement('div'), dt = document.createElement('dt'), dd = document.createElement('dd');
    dt.textContent = key; dd.textContent = value; row.append(dt, dd); fields.append(row);
  });
  const log = $('#flow-log-list');
  log.replaceChildren();
  const entries = progress < 0 ? [t('flow.log.waiting')] : steps.slice(0, progress + 1).map((step, i) => String(i + 1).padStart(2, '0') + ' / ' + step.log);
  entries.forEach(value => { const li = document.createElement('li'); li.textContent = value; log.append(li); });
  $('#flow-run').disabled = progress === 5 || running;
  setArrowLabel($('#flow-run'), t(running ? 'flow.run.running' : progress === 5 ? 'flow.run.complete' : execution === 'automatic' ? 'flow.run.automatic' : progress < 0 ? 'flow.run.start' : 'flow.run.advance', { step: t('flow.stepLabels')[progress + 1] }), running || progress === 5 ? null : 'right');
  put('#flow-instruction', t(execution === 'manual' ? 'flow.instruction.manual' : 'flow.instruction.automatic'));
  renderFlowStatus();
}
function stopFlow() { clearTimeout(flowTimer); flowTimer = 0; running = false; }
function resetFlow() {
  stopFlow(); progress = -1; inspected = 0; statusKind = 'ready'; statusStep = 0;
  renderFlow();
}
function advanceFlow() {
  progress = Math.min(5, progress + 1); inspected = progress; statusKind = 'advance'; statusStep = progress;
  if (progress === 5) running = false;
  renderFlow();
}
function automatedStep() {
  advanceFlow();
  if (progress < 5 && running) flowTimer = setTimeout(automatedStep, 800);
}
$('#flow-run').addEventListener('click', () => {
  if (running || progress === 5) return;
  if (execution === 'manual') { advanceFlow(); return; }
  if (motionStopped()) { progress = 4; advanceFlow(); }
  else { running = true; automatedStep(); }
});
document.querySelectorAll('[data-flow-mode]').forEach(button => button.addEventListener('click', () => {
  if (execution === button.dataset.flowMode) return;
  execution = button.dataset.flowMode;
  document.querySelectorAll('[data-flow-mode]').forEach(other => other.setAttribute('aria-pressed', String(other === button)));
  resetFlow();
}));
stepButtons.forEach((button, i) => button.addEventListener('click', () => {
  inspected = i; statusKind = 'inspect'; statusStep = i; renderFlow();
}));
$('#flow-brief').addEventListener('change', resetFlow);
$('#flow-reset').addEventListener('click', resetFlow);
function motionPreferenceChanged() {
  if (motionStopped() && running) { stopFlow(); progress = 4; advanceFlow(); }
}
reduced.addEventListener('change', motionPreferenceChanged);
new MutationObserver(motionPreferenceChanged).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

renderFlow();
onLocaleChange(renderFlow);
$('#lab-002').querySelectorAll('button[inert],select[inert]').forEach(control => control.removeAttribute('inert'));
$('#lab-002').setAttribute('data-flow-ready', '');

// Share the experiment itself, not a claim to preserve its local prototype state.
document.querySelectorAll('[data-share-experiment]').forEach(button => {
  const region = button.closest('.experiment-share');
  const status = region.querySelector('[role="status"]');
  const fallback = region.querySelector('input');
  let outcome = '', attempt = 0;
  const experimentUrl = () => {
    const url = new URL(location.href);
    url.search = '';
    url.hash = button.dataset.shareExperiment;
    return url.href;
  };
  function renderShare() {
    status.textContent = outcome ? t(`static.journey.share_${outcome}`) : '';
    fallback.hidden = outcome !== 'manual';
    fallback.value = experimentUrl();
  }
  button.addEventListener('click', async () => {
    const currentAttempt = ++attempt;
    const url = experimentUrl();
    button.disabled = true;
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(url);
      if (currentAttempt !== attempt) return;
      outcome = 'copied';
    } catch {
      if (currentAttempt !== attempt) return;
      outcome = 'manual';
    } finally {
      if (currentAttempt === attempt) {
        button.disabled = false;
        renderShare();
        if (outcome === 'manual') {
          fallback.focus({ preventScroll: true });
          fallback.select();
        }
      }
    }
  });
  fallback.addEventListener('click', () => fallback.select());
  onLocaleChange(() => {
    // A pending copy can still finish for the previous language. Do not report
    // that the newly selected language's URL was copied when it was not.
    if (button.disabled) {
      attempt++;
      button.disabled = false;
      outcome = '';
    }
    if (outcome === 'copied') outcome = '';
    renderShare();
  });
  renderShare();
  region.hidden = false;
});
