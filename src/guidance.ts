// Static advice only. Imported commands and messages are never instructions.
const steps: Record<string, string> = {
  'unfinished-items':
    'Inspect the original export for missing item completions or interrupted capture before relying on activity totals.',
  'unknown-events':
    'Check the source Codex version and event format against the compatibility guide; unsupported events can hide activity.',
  'item-errors':
    'Review the original error privately and check whether it affected the requested outcome. An error item alone does not prove the turn failed.',
  'stream-error':
    'Inspect the original error privately and verify authentication, provider availability, or capture integrity before rerunning.',
  'time-unknown':
    'Record wall-clock duration separately for future trials; do not estimate it from event counts.',
  incomplete:
    'Recover a complete stdout capture if available. Keep partial measurements separate from completed-run comparisons.',
  'usage-partial':
    'Use the per-turn table to locate missing counters; do not replace unknown totals with zero.',
  repetition:
    'Check whether repeated commands are expected retries or test iterations before changing the workflow.',
  'command-failures':
    'Inspect the original command exit status and expected test outcome; a deliberate negative test can correctly fail.',
  duplicates:
    'Check the export pipeline for replayed events and avoid concatenating independent sessions.',
  'verification-unavailable':
    'Run the project acceptance checks and record their results separately before calling the task successful.',
  'coverage-boundary':
    'Record model, CLI version and test conditions alongside the export when planning a comparison; use account records for billing.',
};
export const nextStep = (code: string): string =>
  steps[code] ??
  'Review the original evidence privately before drawing a conclusion.';
