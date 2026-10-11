import {
  type Comparison,
  emptyUsage,
  type Report,
  type Usage,
  VERSION,
} from './model.js';
import { object } from './parser.js';

function nullableNumber(value: unknown): number | null {
  if (value === null) return null;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0)
    throw new Error('Invalid report counter');
  return value;
}
function validated(value: unknown): {
  sha256: string;
  synthetic: boolean;
  execution: Report['execution'];
  usage: Usage;
  elapsedMs: number | null;
} {
  const r = object(value);
  if (r.schema !== 'runlens.report/v1')
    throw new Error('Expected runlens.report/v1');
  const source = object(r.source);
  if (
    typeof source.sha256 !== 'string' ||
    !/^[a-f0-9]{64}$/.test(source.sha256)
  )
    throw new Error('Invalid source fingerprint');
  if (
    r.execution !== 'completed' &&
    r.execution !== 'failed' &&
    r.execution !== 'incomplete'
  )
    throw new Error('Invalid execution status');
  if (typeof r.synthetic !== 'boolean')
    throw new Error('Missing synthetic flag');
  if (r.taskVerification !== 'unverified')
    throw new Error('Unsupported verification status');
  const u = object(r.usage);
  const usage = emptyUsage();
  for (const key of Object.keys(usage) as (keyof Usage)[])
    usage[key] = nullableNumber(u[key]);
  if (usage.input !== null && usage.cachedInput !== null) {
    if (
      usage.cachedInput > usage.input ||
      usage.uncachedInput !== usage.input - usage.cachedInput
    )
      throw new Error('Inconsistent input accounting');
  } else if (usage.uncachedInput !== null)
    throw new Error('Uncached input requires known input and cached input');
  if (
    usage.output !== null &&
    usage.reasoningOutput !== null &&
    usage.reasoningOutput > usage.output
  )
    throw new Error('Inconsistent output accounting');
  return {
    sha256: source.sha256,
    synthetic: r.synthetic,
    execution: r.execution,
    usage,
    elapsedMs: nullableNumber(r.elapsedMs),
  };
}
export function compareReports(
  baseline: unknown,
  candidate: unknown,
): Comparison {
  const a = validated(baseline);
  const b = validated(candidate);
  const delta: Comparison['delta'] = { ...emptyUsage(), elapsedMs: null };
  for (const key of Object.keys(a.usage) as (keyof Usage)[]) {
    const left = a.usage[key];
    const right = b.usage[key];
    delta[key] = left !== null && right !== null ? right - left : null;
  }
  if (a.elapsedMs !== null && b.elapsedMs !== null)
    delta.elapsedMs = b.elapsedMs - a.elapsedMs;
  const warnings = [
    'Descriptive comparison only. Equal task, model, budget and acceptance criteria have not been established.',
    'Lower usage does not prove better efficiency, and recorded execution completion does not prove task success.',
    'Imported reports are untrusted observations, not independently attested measurements.',
  ];
  if (a.sha256 === b.sha256)
    warnings.push('Both reports reference the same source fingerprint.');
  if (a.execution !== 'completed' || b.execution !== 'completed')
    warnings.push('At least one execution failed or is incomplete.');
  return {
    schema: 'runlens.comparison/v1',
    generator: VERSION,
    synthetic: a.synthetic || b.synthetic,
    sources: { baseline: a.sha256, candidate: b.sha256 },
    comparableTask: 'unknown',
    verdict: 'descriptive-only',
    baseline: {
      execution: a.execution,
      usage: a.usage,
      elapsedMs: a.elapsedMs,
    },
    candidate: {
      execution: b.execution,
      usage: b.usage,
      elapsedMs: b.elapsedMs,
    },
    delta,
    warnings,
  };
}
