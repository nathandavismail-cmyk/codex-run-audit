export const VERSION = '0.1.0';
export interface Usage {
  input: number | null;
  cachedInput: number | null;
  uncachedInput: number | null;
  output: number | null;
  reasoningOutput: number | null;
}
export interface Turn {
  index: number;
  status: 'completed' | 'failed' | 'incomplete';
  usage: Usage;
}
export interface TimelineEvent {
  index: number;
  turn: number | null;
  kind: string;
  status: string | null;
}
export interface Finding {
  code: string;
  message: string;
  count: number;
  nextStep: string;
}
export interface Report {
  schema: 'runlens.report/v1';
  generator: string;
  synthetic: boolean;
  source: { sha256: string; bytes: number; format: 'codex-exec-jsonl' };
  coverage: {
    turns: number;
    turnsWithUsage: number;
    unknownEvents: number;
    duplicateEvents: number;
    timelineOmitted: number;
    subagents: 'not-collected';
  };
  execution: 'completed' | 'failed' | 'incomplete';
  taskVerification: 'unverified';
  elapsedMs: number | null;
  model: null;
  cost: null;
  usage: Usage;
  turns: Turn[];
  activity: {
    commands: number;
    failedCommands: number;
    mcpCalls: number;
    webSearches: number;
    fileChanges: number;
    repeatedCommands: number;
  };
  findings: Finding[];
  timeline: TimelineEvent[];
}
export interface Comparison {
  schema: 'runlens.comparison/v1';
  generator: string;
  synthetic: boolean;
  sources: { baseline: string; candidate: string };
  comparableTask: 'unknown';
  verdict: 'descriptive-only';
  baseline: {
    execution: Report['execution'];
    usage: Usage;
    elapsedMs: number | null;
  };
  candidate: {
    execution: Report['execution'];
    usage: Usage;
    elapsedMs: number | null;
  };
  delta: Usage & { elapsedMs: number | null };
  warnings: string[];
}
export const emptyUsage = (): Usage => ({
  input: null,
  cachedInput: null,
  uncachedInput: null,
  output: null,
  reasoningOutput: null,
});
