import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { VERSION } from '../dist/src/model.js';
import { parseExport } from '../dist/src/parser.js';
import { renderReport } from '../dist/src/render.js';

const source = new URL('../evals/diagnosis/', import.meta.url);
const manifest = JSON.parse(
  await readFile(new URL('manifest.json', source), 'utf8'),
);
const output = path.resolve(process.argv[2] ?? 'artifacts/diagnosis');
await mkdir(path.dirname(output), { recursive: true });
await mkdir(output); // Never overwrite a previous evaluation.
const cases = [];
for (const entry of manifest.cases) {
  assert.match(entry.file, /^[a-z-]+\.jsonl$/);
  const input = await readFile(new URL(entry.file, source), 'utf8');
  const sha256 = createHash('sha256').update(input).digest('hex');
  assert.equal(sha256, entry.sha256, `${entry.file}: fixture integrity`);
  const report = parseExport(input, true);
  assert.deepEqual(
    {
      execution: report.execution,
      input: report.usage.input,
      failedCommands: report.activity.failedCommands,
      repeatedCommands: report.activity.repeatedCommands,
    },
    entry.expected,
  );
  assert.equal(report.taskVerification, 'unverified');
  const dir = path.join(output, entry.file.replace('.jsonl', ''));
  await mkdir(dir);
  await writeFile(
    path.join(dir, 'report.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  );
  await writeFile(path.join(dir, 'index.html'), renderReport(report));
  cases.push({ fixture: entry.file, sha256, passed: true });
}
const result = {
  synthetic: true,
  type: 'fixture-conformance',
  version: VERSION,
  node: process.version,
  platform: process.platform,
  cases,
  developerOutcome: 'not-measured',
  modelCalls: 0,
};
await writeFile(
  path.join(output, 'results.json'),
  `${JSON.stringify(result, null, 2)}\n`,
);
await writeFile(
  path.join(output, 'report.md'),
  `# Synthetic fixture verification\n\n${cases.length} of ${cases.length} fixtures passed expected accounting and integrity checks.\n\nThis verifies implementation behavior, not diagnosis speed, developer usefulness, or model performance. No participants or model calls were involved.\n`,
);
console.log(JSON.stringify(result, null, 2));
