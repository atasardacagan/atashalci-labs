import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { SOURCES, DIRECTIONS, createOperationsState, generateOperationsResult, presentOperationsResult, sourceEvidence, workspaceValue, transitionOperations as send } from '../dist/assets/operations.mjs';

const messages = Object.fromEntries(['en', 'tr'].map(locale => [locale,
  JSON.parse(readFileSync(new URL(`../locales/${locale}/ops.json`, import.meta.url), 'utf8'))
]));
const translator = locale => (key, params = {}) => {
  assert.equal(typeof messages[locale][key], 'string', `Missing ${locale} Operations message: ${key}`);
  return messages[locale][key].replace(/\{(\w+)\}/g, (_, name) => {
    assert.ok(Object.hasOwn(params, name), `Missing interpolation: ${key}.${name}`);
    return String(params[name]);
  });
};

const complete = state => {
  const running = send(state, { type: 'run' });
  return send(running, { type: 'complete', runId: running.runId });
};
const configure = (sources, direction = 'attention') => {
  let state = createOperationsState();
  for (const source of SOURCES) state = send(state, { type: 'source', source, enabled: sources.includes(source) });
  return send(state, { type: 'direction', direction });
};

for (let mask = 0; mask < 16; mask++) {
  const sources = SOURCES.filter((_, i) => mask & (1 << i));
  for (const direction of DIRECTIONS) {
    test('source boundary: ' + (sources.join('+') || 'none') + ' / ' + direction, () => {
      const initial = configure(sources, direction), done = complete(initial);
      if (!sources.length) {
        assert.equal(done.result, null);
        assert.notEqual(done.phase, 'running');
        assert.deepEqual(send(done, { type: 'apply' }), done);
        return;
      }
      const result = done.result;
      assert.deepEqual(result.citations, sources);
      assert.deepEqual(result.evidence.map(item => item.source), sources);
      assert.deepEqual(result.changes.map(item => item.source), sources.filter(source => source !== 'knowledge'));
      const approved = send(done, { type: 'apply' });
      for (const source of ['crm', 'tasks', 'messages']) {
        assert.equal(approved.workspace[source] !== initial.workspace[source], sources.includes(source));
      }
      assert.deepEqual(initial.workspace, createOperationsState().workspace, 'proposal must not mutate committed state');
      assert.deepEqual(send(approved, { type: 'apply' }), approved, 'approval must be idempotent');
      const again = complete(approved);
      assert.deepEqual(again.result.changes, [], 'same approved direction must not manufacture new writes');
      assert.equal(again.result.outcome, sources.some(source => source !== 'knowledge') ? 'aligned' : 'reference');
    });
  }
}

test('the exact acceptance selection creates no task or communication claim/change', () => {
  const done = complete(configure(['knowledge', 'crm'], 'reply'));
  const content = [done.result.detail, ...done.result.evidence.map(item => item.text), ...done.result.citations].join(' ');
  assert.doesNotMatch(content, /communication|handoff|task queue|internal message/i);
  assert.deepEqual(done.result.changes.map(item => item.source), ['crm']);
  const approved = send(done, { type: 'apply' });
  assert.equal(approved.phase, 'applied');
  assert.equal(approved.workspace.crm, 'reply.crm');
  assert.equal(approved.workspace.messages, 'initial.messages');
  assert.equal(approved.workspace.tasks, 'initial.tasks');
  assert.equal(workspaceValue(approved.workspace.crm), 'Reply review requested');
});

test('source and direction choices meaningfully change results', () => {
  const outputs = DIRECTIONS.map(direction => generateOperationsResult(configure(SOURCES, direction)));
  assert.equal(new Set(outputs.map(result => result.heading + result.detail)).size, 3);
  assert.equal(new Set(outputs.map(result => JSON.stringify(result.changes))).size, 3);
  const all = generateOperationsResult(configure(SOURCES, 'reply'));
  const withoutMessages = generateOperationsResult(configure(['knowledge', 'crm', 'tasks'], 'reply'));
  assert.notEqual(all.detail, withoutMessages.detail);
  for (const source of SOURCES) {
    const limited = generateOperationsResult(configure([source], 'attention'));
    assert.equal(limited.evidence.length, 1);
    assert.equal(limited.evidence[0].source, source);
  }
});

for (const interruption of [
  { type: 'source', source: 'crm', enabled: false },
  { type: 'direction', direction: 'reply' },
  { type: 'reset' }
]) {
  test(interruption.type + ' invalidates pending work and late callbacks', () => {
    const running = send(createOperationsState(), { type: 'run' });
    const changed = send(running, interruption);
    assert.equal(changed.result, null);
    assert.equal(changed.step, -1);
    assert.notEqual(changed.phase, 'running');
    assert.deepEqual(send(changed, { type: 'complete', runId: running.runId }), changed);
    assert.deepEqual(send(changed, { type: 'stage', step: 2, runId: running.runId }), changed);
    const rerun = send(changed, { type: 'run' });
    assert.deepEqual(send(rerun, { type: 'complete', runId: running.runId }), rerun);
  });
}

test('processing is explicit, duplicate run blocked, and apply blocked until review', () => {
  const running = send(createOperationsState(), { type: 'run' });
  assert.equal(running.phase, 'running'); assert.equal(running.step, 0);
  assert.deepEqual(send(running, { type: 'run' }), running);
  assert.deepEqual(send(running, { type: 'apply' }), running);
  const judgment = send(running, { type: 'stage', step: 1, runId: running.runId });
  const action = send(judgment, { type: 'stage', step: 2, runId: running.runId });
  assert.equal(action.step, 2);
  assert.deepEqual(send(action, { type: 'stage', step: 1, runId: running.runId }), action);
  const done = send(action, { type: 'complete', runId: running.runId });
  assert.equal(done.phase, 'review'); assert.equal(done.step, 3);
});

test('source inspection does not change configuration or invalidate a proposal', () => {
  const done = complete(configure(['crm'], 'handoff'));
  for (const source of SOURCES) {
    const inspected = send(done, { type: 'inspect', source });
    assert.equal(inspected.inspected, source);
    assert.deepEqual(inspected.sources, ['crm']);
    assert.equal(inspected.result, done.result);
    assert.equal(inspected.phase, done.phase);
  }
});

test('configuration changes invalidate the proposal and preserve clearly committed values', () => {
  const approved = send(complete(createOperationsState()), { type: 'apply' });
  const changed = send(approved, { type: 'direction', direction: 'reply' });
  assert.equal(changed.result, null);
  assert.equal(changed.phase, 'changed');
  assert.deepEqual(changed.workspace, approved.workspace);
  assert.deepEqual(send(changed, { type: 'apply' }), changed);
  const result = complete(changed).result;
  assert.ok(result.evidence.some(item => item.text.includes(workspaceValue(approved.workspace.crm))));
  assert.ok(result.evidence.some(item => item.text.includes(workspaceValue(approved.workspace.tasks))));
});

test('reset restores every user-visible state from every phase', () => {
  const ready = createOperationsState();
  const running = send(configure(['crm'], 'reply'), { type: 'run' });
  const review = complete(configure(['tasks', 'messages'], 'handoff'));
  const approved = send(review, { type: 'apply' });
  for (const state of [ready, running, review, approved]) {
    const { runId, ...reset } = send(state, { type: 'reset' });
    const { runId: initialId, ...initial } = createOperationsState();
    assert.deepEqual(reset, initial);
    assert.ok(runId > state.runId);
  }
});

test('all source/direction combinations have complete curated EN and TR presentations', () => {
  assert.deepEqual(Object.keys(messages.en).sort(), Object.keys(messages.tr).sort());
  for (let mask = 1; mask < 16; mask++) {
    for (const direction of DIRECTIONS) {
      const state = complete(configure(SOURCES.filter((_, i) => mask & (1 << i)), direction));
      const before = JSON.stringify(state);
      for (const locale of ['en', 'tr', 'en']) {
        const translate = translator(locale);
        const view = presentOperationsResult(state.result, translate);
        assert.equal(view.evidence.length, state.sources.length);
        assert.ok(view.heading && view.detail);
        assert.doesNotMatch(JSON.stringify(view), /ops\.(?:result|value|evidence)|\{\w+\}/);
        for (const change of state.result.changes) {
          assert.ok(workspaceValue(change.from, translate));
          assert.ok(workspaceValue(change.to, translate));
        }
      }
      assert.equal(JSON.stringify(state), before, 'presentation never mutates the result or its configuration');
    }
  }
});

test('EN → TR → EN preserves pre-approval evidence and previously applied workspace history', () => {
  const firstReview = complete(createOperationsState());
  const approved = send(firstReview, { type: 'apply' });
  const englishBefore = presentOperationsResult(approved.result, translator('en'));
  const turkish = presentOperationsResult(approved.result, translator('tr'));
  assert.match(turkish.evidence.find(item => item.source === 'crm').text, /henüz atanmamış/);
  assert.doesNotMatch(turkish.evidence.find(item => item.source === 'crm').text, /Ön değerlendirme istendi/);
  assert.deepEqual(presentOperationsResult(approved.result, translator('en')), englishBefore);
  assert.deepEqual(approved.result, firstReview.result, 'approval must retain the original evidence snapshot');

  const nextReview = complete(send(approved, { type: 'direction', direction: 'reply' }));
  const nextApproved = send(nextReview, { type: 'apply' });
  const priorEvidenceTR = presentOperationsResult(nextApproved.result, translator('tr'));
  assert.match(priorEvidenceTR.evidence.find(item => item.source === 'crm').text, /Ön değerlendirme istendi/);
  assert.doesNotMatch(priorEvidenceTR.evidence.find(item => item.source === 'crm').text, /Yanıt incelemesi istendi/);
  assert.match(sourceEvidence('crm', nextApproved.workspace, translator('tr')), /Yanıt incelemesi istendi/);
  assert.deepEqual(presentOperationsResult(nextApproved.result, translator('en')), presentOperationsResult(nextReview.result, translator('en')));
  assert.deepEqual(complete(nextApproved).result.changes, [], 'switching presentation cannot create duplicate workspace changes');
});
