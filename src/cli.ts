#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareReports } from './compare.js';
import { readInput, writeBundle } from './io.js';
import { VERSION } from './model.js';
import { parseExport } from './parser.js';
import { renderComparison, renderReport } from './render.js';

const help = `Codex Run Audit ${VERSION} — local reports for Codex execution exports

  codex-run-audit analyze <export.jsonl> --out <new-directory> [--synthetic]
  codex-run-audit compare <baseline.json> <candidate.json> --out <new-directory>
  codex-run-audit demo --out <new-directory>
  codex-run-audit --help
  codex-run-audit --version

No model calls, telemetry, or automatic session scanning.
Existing output directories are never overwritten. Raw rollout files are unsupported.
Demo data is synthetic. Execution completion does not establish task success.`;

async function main(args: string[]): Promise<void> {
  if (!args.length || (args.length === 1 && args[0] === '--help')) {
    console.log(help);
    return;
  }
  if (args.length === 1 && args[0] === '--version') {
    console.log(VERSION);
    return;
  }
  const command = args.shift();
  if (!['analyze', 'compare', 'demo'].includes(command ?? ''))
    throw new Error('Unknown command; run codex-run-audit --help');
  if (args.length === 1 && args[0] === '--help') {
    console.log(help);
    return;
  }
  const positionals: string[] = [];
  let out: string | undefined;
  let synthetic = false;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--out') {
      if (out || !args[i + 1] || args[i + 1]?.startsWith('--'))
        throw new Error('--out requires one directory');
      out = args[++i];
    } else if (arg === '--synthetic' && command === 'analyze' && !synthetic)
      synthetic = true;
    else if (arg?.startsWith('-'))
      throw new Error('Unknown option; run codex-run-audit --help');
    else if (arg) positionals.push(arg);
  }
  const expected = command === 'compare' ? 2 : command === 'analyze' ? 1 : 0;
  if (positionals.length !== expected || !out)
    throw new Error('Invalid arguments; run codex-run-audit --help');
  if (command === 'compare') {
    const a = JSON.parse(await readInput(positionals[0] ?? '')) as unknown;
    const b = JSON.parse(await readInput(positionals[1] ?? '')) as unknown;
    const report = compareReports(a, b);
    const dir = await writeBundle(out, report, renderComparison(report));
    console.log(
      `Comparison written to ${path.join(dir, 'index.html')}\nDescriptive only; task equivalence is unknown.`,
    );
  } else {
    const input =
      command === 'demo'
        ? fileURLToPath(
            new URL('../../examples/synthetic-run.jsonl', import.meta.url),
          )
        : (positionals[0] ?? '');
    const report = parseExport(
      await readInput(input),
      command === 'demo' || synthetic,
    );
    const dir = await writeBundle(out, report, renderReport(report));
    console.log(
      `Report written to ${path.join(dir, 'index.html')}\nExecution: ${report.execution}; task correctness: unverified.${report.synthetic ? '\nSYNTHETIC DEMONSTRATION — not a real benchmark.' : ''}`,
    );
  }
}
main(process.argv.slice(2)).catch((error: unknown) => {
  // Never echo JSON parser snippets, source payloads, or system error paths.
  const known =
    error instanceof Error &&
    !('code' in error) &&
    !(error instanceof SyntaxError);
  const code =
    error && typeof error === 'object' && 'code' in error
      ? String(error.code)
      : '';
  const messages: Record<string, string> = {
    EEXIST:
      'Output directory already exists; choose a new --out directory. Nothing was overwritten.',
    ENOENT:
      'An input or required path was not found. Check the supplied paths.',
    ELOOP:
      'Symlink inputs are not accepted. Supply the intended regular file directly.',
    EACCES: 'Access denied. Check permissions on the input and output parent.',
    EPERM: 'Access denied by the operating system or sandbox.',
    ENOTDIR: 'A path component is not a directory. Check the supplied paths.',
    ERR_ENCODING_INVALID_ENCODED_DATA: 'Input must be valid UTF-8.',
  };
  console.error(
    `Codex Run Audit: ${messages[code] ?? (error instanceof SyntaxError ? 'Invalid JSON report; no source content is echoed.' : known ? error.message : 'Could not read input or create output. Check access and file format.')}`,
  );
  process.exitCode = 1;
});
