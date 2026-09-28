// One state model owns Context → Reasoning → Human Review. No external requests.
import { t, getLocale, onLocaleChange } from './i18n.js';

export const SOURCES = ['knowledge', 'crm', 'messages', 'tasks'];
export const DIRECTIONS = ['attention', 'handoff', 'reply'];
// Workspace values are identifiers, never translated text. A language change
// cannot alter whether a change has been applied or manufacture duplicate writes.
const initialWorkspace = { crm: 'initial.crm', tasks: 'initial.tasks', messages: 'initial.messages' };
const targets = Object.fromEntries(DIRECTIONS.map(direction => [direction,
  Object.fromEntries(['crm', 'tasks', 'messages'].map(source => [source, `${direction}.${source}`]))
]));
export const workspaceValue = (value, translate = t) => translate(`ops.value.${value}`);
const sourceName = source => t(`ops.source.${source}`);

export function createOperationsState(runId = 0) {
  return { sources: [...SOURCES], direction: 'attention', inspected: 'knowledge', phase: 'ready', step: -1,
    workspace: { ...initialWorkspace }, result: null, runId, change: null };
}
export function sourceEvidence(source, workspace, translate = t) {
  if (source === 'knowledge') return translate('ops.evidence.knowledge');
  const value = workspace[source];
  return value === initialWorkspace[source]
    ? translate(`ops.evidence.${source}.initial`)
    : translate(`ops.evidence.${source}.updated`, { value: workspaceValue(value, translate) });
}
// Evidence snapshots describe the workspace at analysis time. In particular,
// approval must not rewrite the evidence used to justify its own proposal.
export function presentOperationsResult(result, translate = t) {
  return {
    heading: translate(`ops.result.${result.direction}.heading`),
    detail: translate(`ops.result.${result.direction}.${result.focus}`) +
      (result.citations.includes('knowledge') ? ' ' + translate('ops.result.reviewRule') : ''),
    evidence: result.evidence.map(item => ({ ...item,
      text: sourceEvidence(item.source, { [item.source]: item.value }, translate) }))
  };
}
export function generateOperationsResult(state) {
  const has = source => state.sources.includes(source);
  const evidence = state.sources.map(source => ({ source, value: state.workspace[source] ?? null }));
  const focus = has('messages') ? 'messages' : has('crm') ? 'crm' : has('tasks') ? 'tasks' : 'knowledge';
  const destinations = state.sources.filter(source => source !== 'knowledge');
  const changes = destinations.filter(source => state.workspace[source] !== targets[state.direction][source])
    .map(source => ({ source, from: state.workspace[source], to: targets[state.direction][source] }));
  const result = { direction: state.direction, focus, evidence, citations: [...state.sources], changes,
    outcome: !destinations.length ? 'reference' : !changes.length ? 'aligned' : 'proposal' };
  return { ...result, ...presentOperationsResult(result) };
}
export function transitionOperations(state, action) {
  if (action.type === 'reset') return createOperationsState(state.runId + 1);
  if (action.type === 'inspect' && SOURCES.includes(action.source)) return { ...state, inspected: action.source };
  if (action.type === 'source' && SOURCES.includes(action.source)) {
    const sources = SOURCES.filter(source => source === action.source ? action.enabled : state.sources.includes(source));
    return { ...state, sources, phase: 'changed', step: -1, result: null, change: 'sources', runId: state.runId + 1 };
  }
  if (action.type === 'direction' && DIRECTIONS.includes(action.direction)) {
    return { ...state, direction: action.direction, phase: 'changed', step: -1, result: null, change: 'direction', runId: state.runId + 1 };
  }
  if (action.type === 'run' && state.sources.length && state.phase !== 'running') {
    return { ...state, phase: 'running', step: 0, result: null, change: null, runId: state.runId + 1 };
  }
  if (action.type === 'stage' && state.phase === 'running' && action.runId === state.runId && action.step > state.step && action.step < 3) {
    return { ...state, step: action.step };
  }
  if (action.type === 'complete' && state.phase === 'running' && action.runId === state.runId) {
    return { ...state, phase: 'review', step: 3, result: generateOperationsResult(state) };
  }
  if (action.type === 'apply' && state.phase === 'review' && state.result?.changes.length) {
    const workspace = { ...state.workspace };
    state.result.changes.forEach(change => { if (state.sources.includes(change.source)) workspace[change.source] = change.to; });
    return { ...state, workspace, phase: 'applied' };
  }
  return state;
}

function mountOperations() {
  const root = document.querySelector('#lab-001');
  if (!root) return;
  const $ = selector => root.querySelector(selector);
  const write = (selector, text) => { if ($(selector).textContent !== text) $(selector).textContent = text; };
  let state = createOperationsState(), timers = [], lastAnswer = '', lastReview = '';
  const inputs = [...root.querySelectorAll('[data-source]')];
  const inspectors = [...root.querySelectorAll('[data-source-view]')];
  const stages = [...root.querySelectorAll('[data-ops-stage]')];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const calm = () => reduced.matches || document.documentElement.classList.contains('motion-paused');
  const clearRun = () => { timers.forEach(clearTimeout); timers = []; };
  const node = (tag, className, text) => {
    const element = document.createElement(tag); element.className = className; element.textContent = text; return element;
  };
  function render() {
    const running = state.phase === 'running', applied = state.phase === 'applied', result = state.result;
    const presentation = result ? presentOperationsResult(result) : null;
    const hasApplied = Object.keys(initialWorkspace).some(key => state.workspace[key] !== initialWorkspace[key]);
    root.dataset.opsPhase = state.phase;
    inputs.forEach(input => {
      input.checked = state.sources.includes(input.dataset.source);
      input.closest('.source-item').dataset.included = String(input.checked);
    });
    $('#ops-question').value = state.direction;
    write('#ops-source-count', t(state.sources.length === 1 ? 'ops.sourceCount.one' : 'ops.sourceCount.other', { count: state.sources.length }));
    write('#ops-source-summary', state.sources.length ? state.sources.map(sourceName).join(' · ') : t('ops.sources.empty'));
    inspectors.forEach(button => button.setAttribute('aria-pressed', String(state.inspected === button.dataset.sourceView)));
    const included = state.sources.includes(state.inspected);
    write('#source-excerpt-title', t(`ops.sourceTitle.${state.inspected}`) + ' / ' + t(included ? 'ops.sourceIncluded' : 'ops.sourceExcluded'));
    write('#source-excerpt-body', included ? sourceEvidence(state.inspected, state.workspace) : t('ops.sourceExcluded.detail'));
    $('#ops-run').disabled = running || !state.sources.length;
    write('#ops-run-label', t(running ? 'ops.run.processing' : 'ops.run.ready'));
    $('#ops-apply').disabled = state.phase !== 'review' || !result?.changes.length;
    $('#ops-answer').setAttribute('aria-busy', String(running));
    stages.forEach((stage, i) => {
      const active = running && i === state.step, done = state.step > i;
      stage.dataset.state = active ? 'active' : done ? 'complete' : 'idle';
      stage.setAttribute('aria-label', t('ops.stage.label', { stage: t(`ops.stage.${i}`), status: t(active ? 'ops.stage.progress' : done ? 'ops.stage.complete' : 'ops.stage.waiting') }));
    });
    const progress = [0, 1, 2].map(step => t(`ops.progress.${step}`));
    write('#ops-progress-status', running ? progress[state.step] : t(result ? 'ops.progress.complete' : 'ops.progress.waiting'));
    let kicker, heading, detail;
    if (result) {
      kicker = t(applied ? 'ops.answer.applied' : result.changes.length ? 'ops.answer.proposed' : 'ops.answer.complete');
      heading = result.outcome === 'aligned' ? t('ops.answer.aligned') : presentation.heading;
      detail = presentation.detail;
    } else if (running) {
      kicker = t(`ops.answer.stage.${state.step}`);
      heading = progress[state.step]; detail = t('ops.answer.running');
    } else if (!state.sources.length) {
      kicker = t('ops.answer.empty.kicker'); heading = t('ops.answer.empty.heading');
      detail = t('ops.answer.empty.detail');
    } else {
      kicker = t(state.phase === 'changed' ? (state.change === 'direction' ? 'ops.answer.directionChanged' : 'ops.answer.contextChanged') : 'ops.answer.ready');
      heading = t('ops.answer.waiting');
      detail = t(state.phase === 'changed' ? 'ops.answer.changed.detail' : 'ops.answer.ready.detail');
    }
    const answerKey = JSON.stringify([getLocale(), kicker, heading, detail, result]);
    if (answerKey !== lastAnswer) {
      const answer = $('#ops-answer');
      answer.replaceChildren(node('span', 'ops-answer-kicker', kicker), node('h4', '', heading), node('p', '', detail));
      if (result) {
        answer.append(node('p', 'ops-evidence-label', t(applied ? 'ops.evidence.approved' : 'ops.evidence.selected')));
        const evidence = node('ul', 'ops-evidence', '');
        presentation.evidence.forEach(item => evidence.append(node('li', '', item.text)));
        answer.append(evidence, node('span', 'ops-citations', t('ops.evidence.citations', { sources: result.citations.map(sourceName).join(' + ') })));
      }
      lastAnswer = answerKey;
    }
    let reviewStatus, reviewHeading, proposal, status;
    if (applied) {
      reviewStatus = t('ops.review.applied.status'); reviewHeading = t('ops.review.applied.heading');
      proposal = t('ops.review.applied.proposal');
      status = t('ops.status.applied');
    } else if (result?.changes.length) {
      reviewStatus = t('ops.review.proposed.status'); reviewHeading = t('ops.review.proposed.heading');
      proposal = t('ops.review.proposed.proposal');
      status = t('ops.status.proposed');
    } else if (result) {
      reviewStatus = t(result.outcome === 'reference' ? 'ops.review.reference.status' : 'ops.review.aligned.status');
      reviewHeading = t('ops.review.noChanges');
      proposal = t(result.outcome === 'reference' ? 'ops.review.reference.proposal' : 'ops.review.aligned.proposal');
      status = t('ops.status.noChanges');
    } else {
      reviewStatus = t(running ? 'ops.review.running' : state.phase === 'changed' ? 'ops.review.changed' : 'ops.review.waiting');
      reviewHeading = t('ops.review.ready.heading');
      proposal = t(running ? 'ops.review.running.proposal' : 'ops.review.ready.proposal');
      status = !state.sources.length ? t('ops.status.empty') : running ? progress[state.step] : t(hasApplied ? 'ops.status.previouslyApplied' : state.phase === 'changed' ? 'ops.status.changed' : 'ops.status.ready');
    }
    write('#ops-action-state', reviewStatus);
    write('#ops-review-title', reviewHeading);
    write('#ops-proposal', proposal);
    write('#ops-status', status);
    $('.ops-values').hidden = !state.sources.some(source => source !== 'knowledge');
    write('#ops-values-label', t(result?.changes.length ? applied ? 'ops.values.applied' : 'ops.values.proposed' : hasApplied ? 'ops.values.previouslyApplied' : 'ops.values.current'));
    const reviewKey = JSON.stringify([getLocale(), state.sources, state.workspace, result?.changes, applied]);
    if (reviewKey !== lastReview) {
      root.querySelectorAll('[data-ops-destination]').forEach(row => {
        const source = row.dataset.opsDestination;
        row.hidden = !state.sources.includes(source);
        const dd = row.querySelector('dd'), change = result?.changes.find(item => item.source === source);
        dd.replaceChildren();
        if (change && !applied) {
          dd.append(node('span', 'ops-current-value', workspaceValue(change.from)), node('span', 'ops-proposed-value', '→ ' + workspaceValue(change.to)), node('small', 'ops-value-status', t('ops.valueStatus.proposed')));
        } else {
          dd.append(node('span', '', workspaceValue(state.workspace[source])), node('small', 'ops-value-status', t(change && applied ? 'ops.valueStatus.applied' : 'ops.valueStatus.current')));
        }
      });
      lastReview = reviewKey;
    }
  }
  function dispatch(action) {
    if (['source', 'direction', 'reset'].includes(action.type)) clearRun();
    state = transitionOperations(state, action); render();
  }
  inputs.forEach(input => input.addEventListener('change', () => dispatch({ type: 'source', source: input.dataset.source, enabled: input.checked })));
  inspectors.forEach(button => button.addEventListener('click', () => dispatch({ type: 'inspect', source: button.dataset.sourceView })));
  $('#ops-question').addEventListener('change', event => dispatch({ type: 'direction', direction: event.target.value }));
  $('#ops-run').addEventListener('click', () => {
    if (!state.sources.length || state.phase === 'running') return;
    clearRun(); dispatch({ type: 'run' });
    const runId = state.runId;
    if (calm()) dispatch({ type: 'complete', runId });
    else {
      timers = [
        setTimeout(() => dispatch({ type: 'stage', step: 1, runId }), 350),
        setTimeout(() => dispatch({ type: 'stage', step: 2, runId }), 700),
        setTimeout(() => dispatch({ type: 'complete', runId }), 1050)
      ];
    }
  });
  $('#ops-apply').addEventListener('click', () => {
    dispatch({ type: 'apply' });
    if (state.phase === 'applied') $('#ops-review-title').focus({ preventScroll: true });
  });
  $('#ops-reset').addEventListener('click', () => dispatch({ type: 'reset' }));
  function motionChanged() {
    if (calm() && state.phase === 'running') { clearRun(); dispatch({ type: 'complete', runId: state.runId }); }
  }
  reduced.addEventListener('change', motionChanged);
  new MutationObserver(motionChanged).observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  onLocaleChange(render);
  render();
  root.querySelectorAll('input[inert],button[inert],select[inert]').forEach(control => control.removeAttribute('inert'));
  root.setAttribute('data-ops-ready', '');
}
if (typeof document !== 'undefined') mountOperations();
