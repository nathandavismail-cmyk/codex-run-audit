#!/usr/bin/env node
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { compareReports } from './compare.js';
import { readInput, writeBundle } from './io.js';
import { VERSION } from './model.js';
import { parseExport } from './parser.js';
import { renderComparison, renderReport } from './render.js';

const help = `RunLens ${VERSION} — local reports for Codex execution exports

  runlens analyze <export.jsonl> --out <new-directory>
  runlens compare <baseline.json> <candidate.json> --out <new-directory>
  runlens demo --out <new-directory>
  runlens --help
  runlens --version

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
    throw new Error('Unknown command; run runlens --help');
  const positionals: string[] = [];
  let out: string | undefined;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--out') {
      if (out || !args[i + 1] || args[i + 1]?.startsWith('--'))
        throw new Error('--out requires one directory');
      out = args[++i];
    } else if (arg?.startsWith('-'))
      throw new Error('Unknown option; run runlens --help');
    else if (arg) positionals.push(arg);
  }
  const expected = command === 'compare' ? 2 : command === 'analyze' ? 1 : 0;
  if (positionals.length !== expected || !out)
    throw new Error('Invalid arguments; run runlens --help');
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
    const report = parseExport(await readInput(input), command === 'demo');
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
  console.error(
    `RunLens: ${known ? error.message : 'Could not read input or create output. Check file format, access, and that the output directory does not exist.'}`,
  );
  process.exitCode = 1;
});
