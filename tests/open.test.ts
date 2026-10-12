import assert from 'node:assert/strict';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';
import { browserLaunch, openReport } from '../src/open.js';

test('browser opening encodes paths and never evaluates shell metacharacters', async () => {
  const report = path.resolve('reports/a #?;$(touch nope) ü/index.html');
  const mac = browserLaunch('darwin', report);
  assert.equal(mac?.command, '/usr/bin/open');
  assert.deepEqual(mac?.args.slice(0, 2), ['-a', 'Safari']);
  assert.equal(fileURLToPath(mac?.args[2] ?? ''), report);
  const linux = browserLaunch('linux', report);
  assert.equal(linux?.command, 'xdg-open');
  assert.equal(linux?.args.length, 1);
  assert.equal(fileURLToPath(linux?.args[0] ?? ''), report);
  const calls: string[][] = [];
  assert.equal(
    await openReport(report, 'linux', async (command, args) => {
      calls.push([command, ...args]);
    }),
    true,
  );
  assert.deepEqual(calls, [['xdg-open', ...(linux?.args ?? [])]]);
});

test('unsupported hosts and failed browser launches return a recoverable result', async () => {
  assert.equal(browserLaunch('win32', 'report.html'), null);
  assert.equal(
    await openReport('report.html', 'win32', async () => {
      assert.fail('Unsupported host must not spawn');
    }),
    false,
  );
  assert.equal(
    await openReport('report.html', 'linux', async () => {
      throw new Error('PRIVATE_DIAGNOSTIC');
    }),
    false,
  );
});
