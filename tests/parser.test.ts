import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { compareReports } from '../src/compare.js';
import { parseExport } from '../src/parser.js';
import { escapeHtml, renderComparison, renderReport } from '../src/render.js';

const start = [
  { type: 'thread.started', thread_id: 'test' },
  { type: 'turn.started' },
];
const terminal = {
  type: 'turn.completed',
  usage: {
    input_tokens: 100,
    cached_input_tokens: 60,
    output_tokens: 20,
    reasoning_output_tokens: 5,
  },
};
const jsonl = (events: unknown[]) =>
  events.map((e) => JSON.stringify(e)).join('\n');
const run = (...events: unknown[]) => parseExport(jsonl([...start, ...events]));

test('native provider failure remains failed with unknown usage and private errors omitted', async () => {
  const text = await readFile(
    'tests/fixtures/native-provider-failure.jsonl',
    'utf8',
  );
  const report = parseExport(text, true);
  assert.equal(report.execution, 'failed');
  assert.equal(report.turns[0]?.status, 'failed');
  assert.equal(report.coverage.turnsWithUsage, 0);
  assert.ok(Object.values(report.usage).every((value) => value === null));
  assert.ok(report.findings.some((finding) => finding.code === 'stream-error'));
  assert.ok(
    !JSON.stringify(report).includes('RUNLENS_SYNTHETIC_PROVIDER_FAILURE'),
  );
  assert.ok(
    !renderReport(report).includes('RUNLENS_SYNTHETIC_PROVIDER_FAILURE'),
  );
});

test('missing tool telemetry stays distinct from verified task success', () => {
  const report = run(
    {
      type: 'item.completed',
      item: {
        id: 'message',
        type: 'agent_message',
        text: 'PRIVATE_SYNTHETIC_TOOL_BLOCKED',
      },
    },
    terminal,
  );
  assert.equal(report.execution, 'completed');
  assert.equal(report.taskVerification, 'unverified');
  assert.equal(report.activity.commands, 0);
  assert.equal(report.activity.failedCommands, 0);
  const html = renderReport(report);
  assert.ok(html.includes('Zero does not prove no tool was attempted'));
  assert.ok(!html.includes('PRIVATE_SYNTHETIC_TOOL_BLOCKED'));
});

test('native alpha CLI startup diagnostics preserve completion and synthetic counters', async () => {
  const text = await readFile('tests/fixtures/native-mock-alpha.jsonl', 'utf8');
  const report = parseExport(text, true);
  assert.equal(report.execution, 'completed');
  assert.deepEqual(report.usage, {
    input: 100,
    cachedInput: 60,
    uncachedInput: 40,
    output: 20,
    reasoningOutput: 5,
  });
  assert.equal(report.synthetic, true);
  assert.equal(report.elapsedMs, null);
  assert.equal(report.findings.find((f) => f.code === 'item-errors')?.count, 1);
  assert.ok(!JSON.stringify(report).includes('runlens-synthetic'));
  assert.ok(!JSON.stringify(report).includes('RUNLENS_SYNTHETIC_OK'));
});

test('startup diagnostic exception rejects orphan tools and errors before a thread', () => {
  const diagnostic = {
    type: 'item.completed',
    item: { id: 'x', type: 'error' },
  };
  assert.throws(() => parseExport(jsonl([diagnostic])), /outside an active/);
  assert.throws(
    () =>
      parseExport(
        jsonl([
          start[0],
          {
            type: 'item.completed',
            item: { id: 'x', type: 'command_execution' },
          },
        ]),
      ),
    /outside an active/,
  );
  assert.throws(() => run(terminal, diagnostic), /outside an active/);
});

test('inclusive accounting does not double count cached or reasoning tokens', () => {
  const r = run(terminal);
  assert.deepEqual(r.usage, {
    input: 100,
    cachedInput: 60,
    uncachedInput: 40,
    output: 20,
    reasoningOutput: 5,
  });
  assert.equal(r.execution, 'completed');
  assert.equal(r.taskVerification, 'unverified');
  assert.equal(r.elapsedMs, null);
});
test('multiple turns sum only per-turn observations, including identical legitimate turns', () => {
  const r = run(terminal, { type: 'turn.started' }, terminal);
  assert.equal(r.usage.input, 200);
  assert.equal(r.coverage.turns, 2);
});
test('duplicate terminal events are not double counted', () => {
  const r = run(terminal, terminal);
  assert.equal(r.usage.input, 100);
  assert.equal(r.coverage.duplicateEvents, 1);
});
test('conflicting or orphan terminal events fail closed', () => {
  assert.throws(
    () => run(terminal, { ...terminal, usage: { input_tokens: 200 } }),
    /without an active/,
  );
  assert.throws(
    () => parseExport(jsonl([start[0], terminal])),
    /without an active/,
  );
});
test('missing data stays unknown and observed zero stays zero', () => {
  assert.equal(run({ type: 'turn.completed' }).usage.input, null);
  assert.equal(
    run({
      type: 'turn.completed',
      usage: { input_tokens: 0, output_tokens: 0 },
    }).usage.input,
    0,
  );
  const partial = run(
    terminal,
    { type: 'turn.started' },
    { type: 'turn.failed' },
  );
  assert.equal(partial.usage.input, null);
  assert.equal(partial.turns[0]?.usage.input, 100);
  assert.equal(partial.execution, 'failed');
  assert.equal(partial.coverage.turnsWithUsage, 1);
});
test('incomplete and error streams cannot claim completed execution', () => {
  assert.equal(run().execution, 'incomplete');
  assert.equal(
    run({ type: 'error', message: 'private' }, terminal).execution,
    'failed',
  );
  assert.throws(() => run({ type: 'turn.started' }), /Overlapping/);
});
test('raw rollout counters and concatenated threads are rejected', () => {
  for (const type of [
    'event_msg',
    'session_meta',
    'response_item',
    'turn_context',
  ])
    assert.throws(() => parseExport(jsonl([{ type }])), /rollout/);
  assert.throws(() => run(terminal, start[0]), /Multiple thread/);
});
test('invalid counters and arithmetic overflow are rejected', () => {
  for (const value of [-1, 0.5, '100', Number.MAX_SAFE_INTEGER + 1])
    assert.throws(
      () => run({ type: 'turn.completed', usage: { input_tokens: value } }),
      /safe integers/,
    );
  assert.throws(
    () =>
      run({
        type: 'turn.completed',
        usage: { input_tokens: 1, cached_input_tokens: 2 },
      }),
    /Cached/,
  );
  assert.throws(
    () =>
      run({
        type: 'turn.completed',
        usage: { output_tokens: 1, reasoning_output_tokens: 2 },
      }),
    /Reasoning/,
  );
  const huge = {
    type: 'turn.completed',
    usage: { input_tokens: Number.MAX_SAFE_INTEGER },
  };
  assert.throws(() => run(huge, { type: 'turn.started' }, huge), /Aggregate/);
});
test('timestamps are optional and unordered or partial time is unknown', () => {
  const events = [...start, terminal].map((e, i) => ({
    ...e,
    timestamp: `2026-01-01T00:00:0${i}Z`,
  }));
  assert.equal(parseExport(jsonl(events)).elapsedMs, 2000);
  assert.equal(
    parseExport(
      jsonl([
        events[0],
        { ...events[1], timestamp: '2025-01-01T00:00:00Z' },
        events[2],
      ]),
    ).elapsedMs,
    null,
  );
  assert.equal(
    parseExport(jsonl([events[0], start[1], events[2]])).elapsedMs,
    null,
  );
});
test('counts terminal items once and flags repetition without leaking commands', () => {
  const item = {
    id: 'a',
    type: 'command_execution',
    command: 'SECRET_SENTINEL /private/name',
    status: 'failed',
    exit_code: 1,
    aggregated_output: 'SECRET_OUTPUT',
  };
  const complete = { type: 'item.completed', item };
  const r = run(
    { type: 'item.started', item },
    complete,
    complete,
    {
      type: 'item.completed',
      item: { ...item, id: 'b', status: 'completed', exit_code: 0 },
    },
    terminal,
  );
  assert.equal(r.activity.commands, 2);
  assert.equal(r.activity.failedCommands, 1);
  assert.equal(r.activity.repeatedCommands, 1);
  assert.equal(r.coverage.duplicateEvents, 1);
  const exported = JSON.stringify(r) + renderReport(r);
  assert.ok(!exported.includes('SECRET'));
  assert.ok(!exported.includes('/private/name'));
  assert.throws(
    () => run(complete, { ...complete, item: { ...item, exit_code: 0 } }),
    /Conflicting/,
  );
});
test('unknown event names and user messages never pass through to exports', () => {
  const r = run(
    { type: '<script>alert(1)</script>', payload: 'SECRET' },
    {
      type: 'item.completed',
      item: { id: 'x', type: '<img src=x>', text: 'SECRET' },
    },
    terminal,
  );
  assert.equal(r.coverage.unknownEvents, 2);
  assert.ok(!JSON.stringify(r).includes('<script>'));
  assert.ok(!renderReport(r).includes('SECRET'));
  assert.equal(escapeHtml('<script>"&'), '&lt;script&gt;&quot;&amp;');
});
test('malformed and oversized lines fail without echoing content', () => {
  assert.throws(
    () => parseExport('{"SECRET"'),
    (e) => e instanceof Error && !e.message.includes('SECRET'),
  );
  assert.throws(() => parseExport('x'.repeat(1024 * 1024 + 1)), /line|Line/);
  assert.throws(() => parseExport('{}'), /Missing event/);
  assert.throws(() => parseExport(''), /No thread/);
});
test('timeline is bounded while accounting covers all supported events', () => {
  const events = Array.from({ length: 2100 }, (_, i) => ({
    type: 'item.completed',
    item: { id: `${i}`, type: 'web_search' },
  }));
  const r = run(...events, terminal);
  assert.equal(r.timeline.length, 2000);
  assert.equal(r.coverage.timelineOmitted, 103);
  assert.equal(r.activity.webSearches, 2100);
});
test('accounting invariants hold across varying synthetic inputs', () => {
  for (let input = 0; input < 200; input += 7) {
    const cached = Math.floor(input / 3);
    const r = run({
      type: 'turn.completed',
      usage: {
        input_tokens: input,
        cached_input_tokens: cached,
        output_tokens: 12,
        reasoning_output_tokens: 4,
      },
    });
    assert.equal(
      (r.usage.uncachedInput ?? 0) + (r.usage.cachedInput ?? 0),
      input,
    );
  }
});
test('comparisons remain descriptive and never infer task success from savings', () => {
  const a = run(terminal);
  const b = run({
    type: 'turn.failed',
    usage: { input_tokens: 10, output_tokens: 1 },
  });
  const c = compareReports({ ...a, generator: '0.1.0' }, b);
  assert.equal(c.generator, '1.0.0');
  assert.equal(c.schema, 'runlens.comparison/v1');
  assert.equal(c.delta.input, -90);
  assert.equal(c.delta.cachedInput, null);
  assert.equal(c.verdict, 'descriptive-only');
  assert.ok(c.warnings.some((w) => w.includes('failed')));
  assert.ok(renderComparison(c).includes('Task equivalence is unknown'));
  assert.throws(() => compareReports(a, { ...b, schema: 'bad' }), /Expected/);
  assert.throws(
    () => compareReports(a, { ...b, usage: { ...b.usage, input: '10' } }),
    /counter/,
  );
  assert.throws(
    () => compareReports(a, { ...a, usage: { ...a.usage, uncachedInput: 0 } }),
    /accounting/,
  );
});
test('synthetic demonstration has known accounting and explicit labeling', async () => {
  const r = parseExport(
    await readFile('examples/synthetic-run.jsonl', 'utf8'),
    true,
  );
  assert.equal(r.usage.uncachedInput, 2500);
  assert.equal(r.elapsedMs, 20_000);
  assert.equal(r.activity.failedCommands, 1);
  assert.equal(r.activity.repeatedCommands, 1);
  assert.ok(renderReport(r).includes('Synthetic demonstration'));
  assert.ok(renderReport(r).includes("default-src 'none'"));
});

test('impossible calendar dates never produce elapsed time', () => {
  for (const date of ['2026-02-30', '2025-02-29', '2026-04-31']) {
    const events = [...start, terminal].map((e, i) => ({
      ...e,
      timestamp: `${date}T00:00:0${i}Z`,
    }));
    assert.equal(parseExport(jsonl(events)).elapsedMs, null);
  }
  const leap = [...start, terminal].map((e, i) => ({
    ...e,
    timestamp: `2024-02-29T00:00:0${i}+02:00`,
  }));
  assert.equal(parseExport(jsonl(leap)).elapsedMs, 2000);
});

test('unfinished tool items are surfaced without pretending the turn failed', () => {
  const item = {
    id: 'tool',
    type: 'command_execution',
    command: 'private text',
    status: 'in_progress',
  };
  const r = run({ type: 'item.started', item }, terminal);
  assert.equal(r.execution, 'completed');
  assert.equal(r.activity.commands, 0);
  assert.ok(
    r.findings.some((f) => f.code === 'unfinished-items' && f.count === 1),
  );
  const completed = run(
    { type: 'item.started', item },
    {
      type: 'item.completed',
      item: { ...item, status: 'completed', exit_code: 0 },
    },
    terminal,
  );
  assert.ok(!completed.findings.some((f) => f.code === 'unfinished-items'));
});

test('item errors are reported without exposing messages or redefining turn status', () => {
  const e = {
    type: 'item.completed',
    item: { id: 'err', type: 'error', message: 'PRIVATE_ERROR' },
  };
  const r = run(e, e, terminal);
  assert.equal(r.execution, 'completed');
  assert.ok(r.findings.some((f) => f.code === 'item-errors' && f.count === 1));
  assert.ok(!JSON.stringify(r).includes('PRIVATE_ERROR'));
});

test('line limits include whitespace rather than only trimmed content', () => {
  assert.throws(
    () => parseExport(' '.repeat(1024 * 1024 + 1) + jsonl(start)),
    /Line/,
  );
});

test('HTML exposes known per-turn values when whole-run usage is unknown', () => {
  const r = run(terminal, { type: 'turn.started' }, { type: 'turn.failed' });
  assert.equal(r.usage.input, null);
  const html = renderReport(r);
  assert.match(html, /Per-turn measurements/);
  assert.match(
    html,
    /<td>1<\/td><td><span class="status completed">completed<\/span><\/td><td>100<\/td>/,
  );
  assert.match(
    html,
    /<td>2<\/td><td><span class="status failed">failed<\/span><\/td><td>Unknown<\/td>/,
  );
  assert.match(html, /href="report.json"/);
});
