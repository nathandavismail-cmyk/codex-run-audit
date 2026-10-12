import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { readInput, writeBundle } from '../src/io.js';

const cli = path.resolve('dist/src/cli.js');
const invoke = (...args: string[]) =>
  spawnSync(process.execPath, [cli, ...args], { encoding: 'utf8' });
test('help, version and invalid arguments have predictable exit codes', () => {
  assert.equal(invoke('--help').status, 0);
  assert.equal(invoke('--version').stdout.trim(), '0.1.0');
  for (const args of [
    ['unknown'],
    ['demo'],
    ['demo', '--out', 'x', '--out', 'y'],
    ['demo', '--oops'],
    ['demo', '--out', 'x', '--open', '--open'],
  ])
    assert.equal(invoke(...args).status, 1);
});
test('demo, analyze and compare work end to end without modifying inputs', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'codex-run-audit-cli-'));
  try {
    const a = path.join(dir, 'first');
    const b = path.join(dir, 'second');
    const c = path.join(dir, 'comparison');
    assert.equal(invoke('demo', '--out', a).status, 0);
    const before = await readFile('examples/synthetic-run.jsonl', 'utf8');
    assert.equal(
      invoke('analyze', 'examples/synthetic-run.jsonl', '--out', b).status,
      0,
    );
    assert.equal(
      await readFile('examples/synthetic-run.jsonl', 'utf8'),
      before,
    );
    assert.equal(
      invoke(
        'compare',
        path.join(a, 'report.json'),
        path.join(b, 'report.json'),
        '--out',
        c,
      ).status,
      0,
    );
    assert.match(
      await readFile(path.join(c, 'index.html'), 'utf8'),
      /descriptive|Descriptive/,
    );
    const report = JSON.parse(
      await readFile(path.join(a, 'report.json'), 'utf8'),
    );
    assert.equal(report.synthetic, true);
    assert.equal(report.usage.input, 12500);
    const saved = await readFile(path.join(a, 'report.json'), 'utf8');
    assert.equal(invoke('demo', '--out', a).status, 1);
    assert.equal(await readFile(path.join(a, 'report.json'), 'utf8'), saved);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test('filesystem input rejects symlinks, directories, invalid UTF-8 and FIFOs', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'codex-run-audit-io-'));
  try {
    const file = path.join(dir, 'input');
    await writeFile(file, 'hello');
    const link = path.join(dir, 'link');
    await symlink(file, link);
    await assert.rejects(readInput(link));
    await assert.rejects(readInput(dir), /regular/);
    await writeFile(file, Buffer.from([0xff]));
    await assert.rejects(readInput(file));
    if (process.platform !== 'win32') {
      const fifo = path.join(dir, 'fifo');
      execFileSync('mkfifo', [fifo]);
      await assert.rejects(readInput(fifo), /regular/);
    }
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test('output refuses an existing symlink and preserves unrelated content', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'codex-run-audit-output-'));
  try {
    const original = path.join(dir, 'original');
    await mkdir(original);
    await writeFile(path.join(original, 'keep'), 'unchanged');
    const link = path.join(dir, 'link');
    await symlink(original, link);
    await assert.rejects(writeBundle(link, {}, 'html'));
    assert.equal(
      await readFile(path.join(original, 'keep'), 'utf8'),
      'unchanged',
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
test('CLI errors never expose malformed JSON content', async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'codex-run-audit-errors-'));
  try {
    const source = path.join(dir, 'bad.json');
    await writeFile(source, '{PRIVATE_TOKEN');
    const r = invoke('compare', source, source, '--out', path.join(dir, 'out'));
    assert.equal(r.status, 1);
    assert.ok(!r.stderr.includes('PRIVATE_TOKEN'));
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('analyze accepts an explicit synthetic label and scoped help', async () => {
  const dir = await mkdtemp(
    path.join(os.tmpdir(), 'codex-run-audit-synthetic-'),
  );
  try {
    const out = path.join(dir, 'report');
    assert.equal(
      invoke(
        'analyze',
        'examples/synthetic-run.jsonl',
        '--synthetic',
        '--out',
        out,
      ).status,
      0,
    );
    assert.equal(
      JSON.parse(await readFile(path.join(out, 'report.json'), 'utf8'))
        .synthetic,
      true,
    );
    assert.match(
      await readFile(path.join(out, 'index.html'), 'utf8'),
      /Synthetic demonstration/,
    );
    assert.equal(invoke('analyze', '--help').status, 0);
    assert.equal(
      invoke('compare', '--synthetic', '--out', path.join(dir, 'invalid'))
        .status,
      1,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('CLI distinguishes missing inputs and existing output safely', async () => {
  const dir = await mkdtemp(
    path.join(os.tmpdir(), 'codex-run-audit-diagnostics-'),
  );
  try {
    const missing = invoke(
      'analyze',
      path.join(dir, 'PRIVATE_NAME'),
      '--out',
      path.join(dir, 'new'),
    );
    assert.match(missing.stderr, /not found/);
    assert.ok(!missing.stderr.includes('PRIVATE_NAME'));
    const existing = invoke('demo', '--out', dir);
    assert.match(existing.stderr, /already exists/);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('headless Linux --open failure preserves a usable report and success exit', {
  skip: process.platform !== 'linux',
}, async () => {
  const dir = await mkdtemp(path.join(os.tmpdir(), 'codex-audit-open-'));
  try {
    const out = path.join(dir, 'report # with spaces');
    const result = spawnSync(
      process.execPath,
      [cli, 'demo', '--out', out, '--open'],
      {
        encoding: 'utf8',
        env: { ...process.env, PATH: '' },
        timeout: 10000,
      },
    );
    assert.equal(result.status, 0);
    assert.match(result.stderr, /report was saved successfully/);
    assert.match(result.stdout, /Browser URL: file:/);
    assert.match(result.stdout, /%23/);
    assert.equal(
      JSON.parse(await readFile(path.join(out, 'report.json'), 'utf8')).usage
        .input,
      12500,
    );
    assert.match(
      await readFile(path.join(out, 'index.html'), 'utf8'),
      /Run overview/,
    );
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});
