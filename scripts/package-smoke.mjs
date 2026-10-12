import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';

if (process.platform === 'win32')
  throw new Error(
    'Windows packaging is not certified; run this check on macOS or Linux.',
  );
const root = await mkdtemp(path.join(tmpdir(), 'codex-run-audit package '));
const cache = path.join(root, 'cache');
const prefix = path.join(root, 'consumer');
const steps = [];
const execute = (file, args, cwd = root) =>
  execFileSync(file, args, {
    cwd,
    encoding: 'utf8',
    timeout: 60_000,
    maxBuffer: 4 * 1024 * 1024,
  });
const npm = (args, cwd) =>
  execute('npm', [...args, '--cache', cache, '--no-audit', '--no-fund'], cwd);
try {
  const source = process.cwd();
  const info = JSON.parse(
    npm(
      ['pack', '--ignore-scripts', '--json', '--pack-destination', root],
      source,
    ),
  )[0];
  for (const entry of info.files) {
    assert.ok(
      !/(^|\/)(private-inputs|reports|node_modules|tests|\.git)(\/|$)/.test(
        entry.path,
      ),
      entry.path,
    );
  }
  const archive = path.join(root, info.filename);
  const first = createHash('sha256')
    .update(await readFile(archive))
    .digest('hex');
  npm(
    ['pack', '--ignore-scripts', '--json', '--pack-destination', root],
    source,
  );
  assert.equal(
    createHash('sha256')
      .update(await readFile(archive))
      .digest('hex'),
    first,
  );
  steps.push('archive contents and repeat-pack hash');
  npm([
    'install',
    '--global',
    '--prefix',
    prefix,
    '--offline',
    '--ignore-scripts',
    archive,
  ]);
  const cli = path.join(prefix, 'bin', 'codex-run-audit');
  assert.match(execute(cli, ['--help']), /codex-run-audit analyze/);
  assert.equal(execute(cli, ['--version']).trim(), '0.1.0');
  steps.push('offline isolated global install, help and version');
  const reportDir = path.join(root, 'my reports');
  await mkdir(reportDir);
  const a = path.join(reportDir, 'demo');
  const b = path.join(reportDir, 'analyzed');
  const c = path.join(reportDir, 'comparison');
  execute(cli, ['demo', '--out', a]);
  const fixture = path.join(
    prefix,
    'lib',
    'node_modules',
    'codex-run-audit',
    'examples',
    'synthetic-run.jsonl',
  );
  const before = await readFile(fixture);
  execute(cli, ['analyze', fixture, '--synthetic', '--out', b]);
  assert.deepEqual(await readFile(fixture), before);
  execute(cli, [
    'compare',
    path.join(a, 'report.json'),
    path.join(b, 'report.json'),
    '--out',
    c,
  ]);
  const report = JSON.parse(
    await readFile(path.join(a, 'report.json'), 'utf8'),
  );
  assert.equal(report.synthetic, true);
  assert.equal(report.usage.input, 12500);
  const comparison = JSON.parse(
    await readFile(path.join(c, 'report.json'), 'utf8'),
  );
  assert.equal(comparison.delta.input, 0);
  steps.push('demo, analyze, compare, spaces in paths, unchanged input');
  const saved = await readFile(path.join(a, 'report.json'));
  const overwrite = spawnSync(cli, ['demo', '--out', a], {
    encoding: 'utf8',
    timeout: 10_000,
  });
  assert.equal(overwrite.status, 1);
  assert.match(overwrite.stderr, /already exists/);
  assert.deepEqual(await readFile(path.join(a, 'report.json')), saved);
  steps.push('overwrite refusal');
  npm([
    'uninstall',
    '--global',
    '--prefix',
    prefix,
    '--offline',
    '--ignore-scripts',
    'codex-run-audit',
  ]);
  assert.equal(existsSync(cli), false);
  assert.equal(
    existsSync(path.join(prefix, 'lib', 'node_modules', 'codex-run-audit')),
    false,
  );
  assert.deepEqual(await readFile(path.join(a, 'report.json')), saved);
  steps.push('uninstall removes CLI and preserves reports');
  console.log(
    JSON.stringify(
      {
        passed: true,
        platform: process.platform,
        arch: process.arch,
        node: process.version,
        packageSha256: first,
        steps,
      },
      null,
      2,
    ),
  );
} finally {
  await rm(root, { recursive: true, force: true });
}
