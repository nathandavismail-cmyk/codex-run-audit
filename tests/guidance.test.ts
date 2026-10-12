import assert from 'node:assert/strict';
import test from 'node:test';
import { parseExport } from '../src/parser.js';
import { renderReport } from '../src/render.js';

test('failed-command guidance requests evidence without repeating private commands', () => {
  const report = parseExport(
    [
      { type: 'thread.started' },
      { type: 'turn.started' },
      {
        type: 'item.completed',
        item: {
          id: 'one',
          type: 'command_execution',
          command: 'PRIVATE_COMMAND; send-secret',
          status: 'failed',
          exit_code: 7,
        },
      },
      { type: 'turn.completed' },
    ]
      .map((event) => JSON.stringify(event))
      .join('\n'),
    true,
  );
  const finding = report.findings.find((f) => f.code === 'command-failures');
  assert.match(finding?.nextStep ?? '', /expected test outcome/);
  assert.equal(report.taskVerification, 'unverified');
  assert.match(renderReport(report), /Next step:/);
  assert.ok(!JSON.stringify(report).includes('PRIVATE_COMMAND'));
  assert.ok(!renderReport(report).includes('send-secret'));
});

test('incomplete-run guidance directs users to recover evidence rather than assume zero', () => {
  const report = parseExport(
    '{"type":"thread.started"}\n{"type":"turn.started"}',
  );
  assert.equal(report.execution, 'incomplete');
  assert.equal(report.usage.input, null);
  assert.match(
    report.findings.find((f) => f.code === 'incomplete')?.nextStep ?? '',
    /Recover a complete stdout capture/,
  );
  assert.match(
    report.findings.find((f) => f.code === 'usage-partial')?.nextStep ?? '',
    /do not replace unknown totals with zero/,
  );
});
