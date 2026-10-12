import { createHash } from 'node:crypto';
import { nextStep } from './guidance.js';
import {
  emptyUsage,
  type Report,
  type Turn,
  type Usage,
  VERSION,
} from './model.js';

export const MAX_BYTES = 32 * 1024 * 1024;
const MAX_LINE = 1024 * 1024;
const MAX_EVENTS = 100_000;
const MAX_TURNS = 10_000;
export function object(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw new Error('Expected a JSON object');
  return value as Record<string, unknown>;
}
function counter(value: unknown): number | null {
  if (value === undefined || value === null) return null;
  if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0)
    throw new Error('Usage counters must be nonnegative safe integers');
  return value;
}
function usage(value: unknown): Usage {
  if (value === undefined || value === null) return emptyUsage();
  const u = object(value);
  const input = counter(u.input_tokens);
  const cachedInput = counter(u.cached_input_tokens);
  const output = counter(u.output_tokens);
  const reasoningOutput = counter(u.reasoning_output_tokens);
  if (input !== null && cachedInput !== null && cachedInput > input)
    throw new Error('Cached input exceeds inclusive input');
  if (output !== null && reasoningOutput !== null && reasoningOutput > output)
    throw new Error('Reasoning output exceeds inclusive output');
  return {
    input,
    cachedInput,
    uncachedInput:
      input !== null && cachedInput !== null ? input - cachedInput : null,
    output,
    reasoningOutput,
  };
}
function digest(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}
function timestamp(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const parts =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,9})?(Z|[+-]\d{2}:\d{2})$/.exec(
      value,
    );
  if (!parts) return null;
  const year = Number(parts[1]);
  const month = Number(parts[2]);
  const day = Number(parts[3]);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const zone = parts[7] ?? '';
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > (days[month - 1] ?? 0) ||
    Number(parts[4]) > 23 ||
    Number(parts[5]) > 59 ||
    Number(parts[6]) > 59
  )
    return null;
  if (
    zone !== 'Z' &&
    (Number(zone.slice(1, 3)) > 23 || Number(zone.slice(4)) > 59)
  )
    return null;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}
function aggregate(turns: Turn[]): Usage {
  const result = emptyUsage();
  for (const key of Object.keys(result) as (keyof Usage)[]) {
    const values = turns.map((t) => t.usage[key]);
    if (!values.length || values.some((v) => v === null)) continue;
    const sum = values.reduce<number>((a, b) => a + (b ?? 0), 0);
    if (!Number.isSafeInteger(sum))
      throw new Error('Aggregate counter exceeds safe integer range');
    result[key] = sum;
  }
  return result;
}

export function parseExport(text: string, synthetic = false): Report {
  const bytes = Buffer.byteLength(text);
  if (bytes > MAX_BYTES) throw new Error('Input exceeds 32 MiB limit');
  const r: Report = {
    schema: 'runlens.report/v1',
    generator: VERSION,
    synthetic,
    source: { sha256: digest(text), bytes, format: 'codex-exec-jsonl' },
    coverage: {
      turns: 0,
      turnsWithUsage: 0,
      unknownEvents: 0,
      duplicateEvents: 0,
      timelineOmitted: 0,
      subagents: 'not-collected',
    },
    execution: 'incomplete',
    taskVerification: 'unverified',
    elapsedMs: null,
    model: null,
    cost: null,
    usage: emptyUsage(),
    turns: [],
    activity: {
      commands: 0,
      failedCommands: 0,
      mcpCalls: 0,
      webSearches: 0,
      fileChanges: 0,
      repeatedCommands: 0,
    },
    findings: [],
    timeline: [],
  };
  let active: Turn | undefined;
  let started = false;
  let lastCompletion = '';
  let firstTime: number | null = null;
  let lastTime: number | null = null;
  let timedEvents = 0;
  let eventCount = 0;
  let unorderedTime = false;
  let sawError = false;
  const completedItems = new Map<string, string>();
  const pendingItems = new Set<string>();
  const commands = new Set<string>();
  const note = (code: string, message: string, count = 1) => {
    const existing = r.findings.find((f) => f.code === code);
    if (existing) existing.count += count;
    else r.findings.push({ code, message, count, nextStep: nextStep(code) });
  };
  const unfinished = () => {
    if (pendingItems.size)
      note(
        'unfinished-items',
        'Tool activity started or updated without a matching completion in this turn. Terminal activity counts may be incomplete.',
        pendingItems.size,
      );
    pendingItems.clear();
  };
  const lines = text.replace(/^\uFEFF/, '').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i] ?? '';
    if (Buffer.byteLength(rawLine) > MAX_LINE)
      throw new Error(`Line ${i + 1} exceeds 1 MiB limit`);
    const line = rawLine.trim();
    if (!line) continue;
    if (++eventCount > MAX_EVENTS) throw new Error('Input exceeds event limit');
    let e: Record<string, unknown>;
    try {
      e = object(JSON.parse(line));
    } catch {
      throw new Error(
        `Invalid JSON object at line ${i + 1}; no raw content is echoed`,
      );
    }
    if (
      e.type === 'event_msg' ||
      e.type === 'session_meta' ||
      e.type === 'response_item' ||
      e.type === 'turn_context'
    )
      throw new Error(
        'Raw rollout format is unsupported. Supply a codex exec --json export; cumulative usage must not be summed as turn usage.',
      );
    if (typeof e.type !== 'string')
      throw new Error(`Missing event type at line ${i + 1}`);
    const time = timestamp(e.timestamp);
    if (time !== null) {
      if (lastTime !== null && time < lastTime) unorderedTime = true;
      firstTime ??= time;
      lastTime = time;
      timedEvents++;
    }
    let kind = e.type;
    let status: string | null = null;
    switch (e.type) {
      case 'thread.started':
        if (started)
          throw new Error(
            'Multiple thread starts: concatenated/replayed exports must be separated',
          );
        started = true;
        break;
      case 'turn.started':
        if (!started) throw new Error('Turn precedes thread.started');
        if (active) throw new Error('Overlapping turns are unsupported');
        if (r.turns.length >= MAX_TURNS) throw new Error('Too many turns');
        active = {
          index: r.turns.length + 1,
          status: 'incomplete',
          usage: emptyUsage(),
        };
        r.turns.push(active);
        completedItems.clear();
        lastCompletion = '';
        break;
      case 'turn.completed':
      case 'turn.failed': {
        const fingerprint = digest(JSON.stringify(e));
        if (!active && lastCompletion === fingerprint) {
          r.coverage.duplicateEvents++;
          continue;
        }
        if (!active)
          throw new Error('Terminal turn event without an active turn');
        active.status = e.type === 'turn.completed' ? 'completed' : 'failed';
        active.usage = usage(e.usage);
        unfinished();
        status = active.status;
        active = undefined;
        lastCompletion = fingerprint;
        break;
      }
      case 'item.started':
      case 'item.updated':
      case 'item.completed': {
        const item = object(e.item);
        // Native CLI can report model-metadata errors after thread creation,
        // before the first turn. This exception does not admit orphan tools.
        const startupDiagnostic =
          started &&
          r.turns.length === 0 &&
          e.type === 'item.completed' &&
          item.type === 'error';
        if (!active && !startupDiagnostic)
          throw new Error('Item event outside an active turn');
        if (typeof item.id !== 'string' || typeof item.type !== 'string')
          throw new Error('Item requires id and type');
        const knownTypes = [
          'command_execution',
          'mcp_tool_call',
          'web_search',
          'file_change',
          'agent_message',
          'reasoning',
          'todo_list',
          'error',
        ];
        kind = knownTypes.includes(item.type) ? item.type : 'unknown_item';
        if (kind === 'unknown_item') {
          r.coverage.unknownEvents++;
          note(
            'unknown-events',
            'Some events are unsupported; activity coverage is partial.',
          );
        }
        status =
          typeof item.status === 'string' &&
          ['in_progress', 'completed', 'failed'].includes(item.status)
            ? item.status
            : null;
        const tool = [
          'command_execution',
          'mcp_tool_call',
          'web_search',
          'file_change',
        ].includes(item.type);
        if (tool && e.type !== 'item.completed') {
          if (completedItems.has(item.id))
            throw new Error(
              'Tool activity follows its completion without a new turn',
            );
          pendingItems.add(item.id);
        }
        if (e.type === 'item.completed') {
          const fingerprint = digest(JSON.stringify(item));
          const previous = completedItems.get(item.id);
          if (previous) {
            if (previous !== fingerprint)
              throw new Error('Conflicting duplicate completed item');
            r.coverage.duplicateEvents++;
            continue;
          }
          completedItems.set(item.id, fingerprint);
          pendingItems.delete(item.id);
          if (item.type === 'error')
            note(
              'item-errors',
              'The source includes a completed error item. Its private message is omitted; inspect the original export to determine the impact.',
            );
          if (item.type === 'command_execution') {
            r.activity.commands++;
            if (
              item.status === 'failed' ||
              (typeof item.exit_code === 'number' && item.exit_code !== 0)
            )
              r.activity.failedCommands++;
            if (typeof item.command === 'string') {
              const key = digest(item.command);
              if (commands.has(key)) r.activity.repeatedCommands++;
              commands.add(key);
            }
          }
          if (item.type === 'mcp_tool_call') r.activity.mcpCalls++;
          if (item.type === 'web_search') r.activity.webSearches++;
          if (item.type === 'file_change') r.activity.fileChanges++;
        }
        break;
      }
      case 'error':
        sawError = true;
        note(
          'stream-error',
          'The source contains an error event; its raw message is omitted.',
        );
        break;
      default:
        kind = 'unknown_event';
        r.coverage.unknownEvents++;
        note(
          'unknown-events',
          'Some events are unsupported; activity coverage is partial.',
        );
    }
    if (r.timeline.length < 2000)
      r.timeline.push({
        index: eventCount,
        turn: r.turns.length || null,
        kind,
        status,
      });
    else r.coverage.timelineOmitted++;
  }
  if (!started)
    throw new Error(
      'No thread.started event; not a supported execution export',
    );
  unfinished();
  r.coverage.turns = r.turns.length;
  r.coverage.turnsWithUsage = r.turns.filter(
    (t) => t.usage.input !== null && t.usage.output !== null,
  ).length;
  r.usage = aggregate(r.turns);
  r.execution =
    active || !r.turns.length
      ? 'incomplete'
      : r.turns.some((t) => t.status === 'failed') || sawError
        ? 'failed'
        : 'completed';
  if (
    firstTime !== null &&
    lastTime !== null &&
    timedEvents === eventCount &&
    !unorderedTime
  )
    r.elapsedMs = lastTime - firstTime;
  else
    note(
      'time-unknown',
      'Full ordered event timestamps are absent; elapsed time is unavailable.',
    );
  if (r.execution === 'incomplete')
    note(
      'incomplete',
      'The export has no terminal result for every started turn.',
    );
  if (r.coverage.turnsWithUsage < r.coverage.turns)
    note(
      'usage-partial',
      'Some turns lack usage; whole-run totals for missing categories remain unknown.',
    );
  if (r.activity.repeatedCommands)
    note(
      'repetition',
      'Identical command text recurs. This may be justified; raw commands are excluded.',
    );
  if (r.activity.failedCommands)
    note(
      'command-failures',
      'One or more recorded commands failed; failure can be intentional, such as a regression test.',
    );
  if (r.coverage.duplicateEvents)
    note(
      'duplicates',
      'Exact duplicate terminal events were excluded within their supported scope.',
    );
  note(
    'verification-unavailable',
    'Agent completion and successful commands do not establish task correctness. No independent acceptance results were supplied.',
  );
  note(
    'coverage-boundary',
    'This export does not establish model identity, linked-agent totals, subscription allowance, or billing cost.',
  );
  return r;
}
