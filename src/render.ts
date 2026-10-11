import type { Comparison, Report } from './model.js';

export const escapeHtml = (s: string): string =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[
        c
      ] ?? c,
  );
const num = (n: number | null): string =>
  n === null ? 'Unknown' : new Intl.NumberFormat('en-US').format(n);
const names = {
  input: 'Input · inclusive',
  cachedInput: 'Cached input · subset',
  uncachedInput: 'Uncached input · derived',
  output: 'Output · inclusive',
  reasoningOutput: 'Reasoning output · subset',
};
const styles = `
:root{color-scheme:light;--ink:#142d38;--muted:#4e626c;--line:#dce4e4;--paper:#f4f6f2;--green:#17694f}*{box-sizing:border-box}body{margin:0;background:var(--paper);color:var(--ink);font:16px/1.6 system-ui,-apple-system,sans-serif}header{background:#142d38;color:#f3f7f3;padding:36px max(24px,calc((100vw - 1120px)/2)) 46px}header p{color:#c1d4d1;max-width:760px}header .brand{letter-spacing:.18em;font-size:13px;font-weight:750;color:#a9ddbd}.topline{display:flex;justify-content:space-between;align-items:center;gap:16px}h1{font-size:clamp(30px,5vw,48px);line-height:1.15;letter-spacing:-.04em;margin:26px 0 12px}h2{font-size:22px;letter-spacing:-.02em;margin:0 0 16px}h3{font-size:17px;margin:0}main{max-width:1168px;margin:auto;padding:28px 24px 60px}.badge{display:inline-block;border:1px solid #76958e;border-radius:99px;padding:4px 12px;font-size:12px;letter-spacing:.03em}.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}.card,section{background:white;border:1px solid var(--line);border-radius:12px;padding:24px}.card small{display:block;color:var(--muted);font-size:13px}.metric{font-size:30px;font-weight:650;letter-spacing:-.04em;overflow-wrap:anywhere}.card p{font-size:12px;color:var(--muted);margin:8px 0 0}.grid{display:grid;grid-template-columns:1.2fr 1fr;gap:20px;margin:20px 0}section{margin-top:20px}.grid section{margin:0}table{width:100%;border-collapse:collapse;font-size:14px;text-align:left}th{font-size:11px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted)}td,th{padding:12px 8px;border-bottom:1px solid var(--line);vertical-align:top}td:first-child,th:first-child{padding-left:0}tr:last-child td{border-bottom:0}.notice{border-left:4px solid #c5973f;padding:14px 18px;background:#fffaec;border-radius:6px;margin-bottom:20px;font-size:14px}.finding{padding:16px 0;border-bottom:1px solid var(--line)}.finding:last-child{border-bottom:0}.finding p{margin:6px 0 0;color:var(--muted);font-size:14px}.code{font:12px ui-monospace,monospace;overflow-wrap:anywhere;color:var(--muted)}.muted{color:var(--muted);font-size:14px}details summary{cursor:pointer;font-weight:650;padding:4px 0}footer{margin-top:28px;color:var(--muted);font-size:12px}.table-wrap{overflow:auto}.status{text-transform:capitalize;color:var(--green);font-weight:600}a{color:#17694f}.bar{height:9px;background:#e8efec;border-radius:6px;overflow:hidden;margin-top:12px}.bar span{display:block;height:100%;background:#297257}@media(max-width:760px){.cards{grid-template-columns:repeat(2,1fr)}.grid{grid-template-columns:1fr}.card,section{padding:18px}.metric{font-size:25px}}@media print{header{background:white;color:#142d38;padding:12px}header p,header .brand{color:#142d38}body{background:white}main{padding:12px}section,.card{break-inside:avoid}details{display:block}.cards{grid-template-columns:repeat(4,1fr)}}`;
function page(
  title: string,
  subtitle: string,
  body: string,
  synthetic: boolean,
): string {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${escapeHtml(title)} · RunLens</title><style>${styles}</style></head><body><header><div class="topline"><div class="brand">◉ RUNLENS</div><span class="badge">LOCAL REPORT · V0.1</span></div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></header><main>${synthetic ? '<div class="notice"><strong>Synthetic demonstration.</strong> These events are invented test data, not measurements from a real agent run.</div>' : ''}${body}<footer>Generated locally. No scripts, remote assets, telemetry, or model calls. Raw prompts, commands, tool outputs, paths and messages are omitted. Source fingerprints can correlate reports; review before sharing.</footer></main></body></html>`;
}
function card(label: string, value: string, caption: string): string {
  return `<div class="card"><small>${escapeHtml(label)}</small><div class="metric">${escapeHtml(value)}</div><p>${escapeHtml(caption)}</p></div>`;
}
export function renderReport(r: Report): string {
  const ratio =
    r.usage.input && r.usage.cachedInput !== null
      ? Math.round((r.usage.cachedInput / r.usage.input) * 100)
      : null;
  const tokenRows = Object.entries(names)
    .map(
      ([key, name]) =>
        `<tr><td>${name}</td><td>${num(r.usage[key as keyof typeof names])}</td></tr>`,
    )
    .join('');
  const activityRows = [
    ['Commands', r.activity.commands],
    ['Failed commands', r.activity.failedCommands],
    ['Repeated commands', r.activity.repeatedCommands],
    ['MCP calls', r.activity.mcpCalls],
    ['Web searches', r.activity.webSearches],
    ['File-change items', r.activity.fileChanges],
  ]
    .map(([k, v]) => `<tr><td>${k}</td><td>${num(v as number)}</td></tr>`)
    .join('');
  return page(
    'Understand the run.',
    'Recorded execution, usage, and diagnostic evidence. Unknowns stay visible.',
    `
    <div class="cards">${card('Execution', r.execution, 'Task correctness remains unverified')}${card('Input tokens', num(r.usage.input), 'Includes cached input; never add it twice')}${card('Output tokens', num(r.usage.output), 'Includes reported reasoning output')}${card('Elapsed time', r.elapsedMs === null ? 'Unknown' : `${num(r.elapsedMs)} ms`, 'Only from complete, ordered source timestamps')}</div>
    <div class="grid"><section><h2>Token accounting</h2><table><thead><tr><th>Category</th><th>Recorded tokens</th></tr></thead><tbody>${tokenRows}</tbody></table><p class="muted">Cache share: ${ratio === null ? 'unknown' : `${ratio}%`}. This measures recorded input reuse, not subscription savings.</p>${ratio === null ? '' : `<div class="bar" aria-label="${ratio}% of input cached"><span style="width:${ratio}%"></span></div>`}</section><section><h2>Recorded activity</h2><table><thead><tr><th>Activity</th><th>Completed items</th></tr></thead><tbody>${activityRows}</tbody></table><p class="muted">Identical commands may be justified. Counts do not attribute token cost to individual tools.</p></section></div>
    <section><h2>What needs attention</h2>${r.findings.map((f) => `<div class="finding"><h3>${escapeHtml(f.code.replaceAll('-', ' '))}${f.count > 1 ? ` · ${num(f.count)}` : ''}</h3><p>${escapeHtml(f.message)}</p></div>`).join('')}</section>
    <section><h2>Coverage &amp; provenance</h2><p>${r.coverage.turnsWithUsage} of ${r.coverage.turns} turns have input/output measurements. ${r.coverage.unknownEvents} unknown events; ${r.coverage.duplicateEvents} duplicate terminal events excluded.</p><p class="muted">Model, linked subagents, independent acceptance results, subscription allowance, and billing cost: unknown. This report describes one explicit export, not your entire account.</p><div class="code">SHA-256 ${r.source.sha256}<br>${num(r.source.bytes)} source bytes · codex-exec-jsonl · RunLens ${escapeHtml(r.generator)}</div></section>
    <section><h2>Per-turn measurements</h2><p class="muted">Known measurements remain useful even when incomplete turns make whole-run totals unknown. Showing ${Math.min(r.turns.length, 200)} of ${r.turns.length} turns. <a href="report.json">Open the full JSON report</a>.</p><div class="table-wrap"><table><thead><tr><th>Turn</th><th>Execution</th><th>Input</th><th>Cached subset</th><th>Output</th></tr></thead><tbody>${r.turns
      .slice(0, 200)
      .map(
        (t) =>
          `<tr><td>${t.index}</td><td>${escapeHtml(t.status)}</td><td>${num(t.usage.input)}</td><td>${num(t.usage.cachedInput)}</td><td>${num(t.usage.output)}</td></tr>`,
      )
      .join('')}</tbody></table></div></section>
    <section><details><summary>Event timeline · ${r.timeline.length} rows${r.coverage.timelineOmitted ? ` · ${r.coverage.timelineOmitted} omitted` : ''}</summary><p class="muted">Source order only; content and commands are omitted. Use browser Find to locate an event type.</p><div class="table-wrap"><table><thead><tr><th>Event</th><th>Turn</th><th>Kind</th><th>Status</th></tr></thead><tbody>${r.timeline.map((e) => `<tr><td>${e.index}</td><td>${e.turn ?? '—'}</td><td>${escapeHtml(e.kind)}</td><td>${escapeHtml(e.status ?? '—')}</td></tr>`).join('')}</tbody></table></div></details></section>`,
    r.synthetic,
  );
}
export function renderComparison(c: Comparison): string {
  const rows = Object.entries(names)
    .map(([key, name]) => {
      const k = key as keyof typeof names;
      const delta = c.delta[k];
      return `<tr><td>${name}</td><td>${num(c.baseline.usage[k])}</td><td>${num(c.candidate.usage[k])}</td><td>${delta !== null && delta > 0 ? '+' : ''}${num(delta)}</td></tr>`;
    })
    .join('');
  return page(
    'What changed?',
    'A descriptive comparison of two exports. A smaller number is not automatically a better outcome.',
    `
    <div class="notice"><strong>Task equivalence is unknown.</strong> This report cannot establish a causal improvement or a regression in task quality.</div>
    <div class="cards">${card('Baseline execution', c.baseline.execution, 'Correctness unverified')}${card('Candidate execution', c.candidate.execution, 'Correctness unverified')}${card('Input delta', num(c.delta.input), 'Candidate minus baseline')}${card('Output delta', num(c.delta.output), 'Candidate minus baseline')}</div>
    <section><h2>Recorded usage comparison</h2><div class="table-wrap"><table><thead><tr><th>Category</th><th>Baseline</th><th>Candidate</th><th>Delta</th></tr></thead><tbody>${rows}<tr><td>Elapsed milliseconds</td><td>${num(c.baseline.elapsedMs)}</td><td>${num(c.candidate.elapsedMs)}</td><td>${num(c.delta.elapsedMs)}</td></tr></tbody></table></div></section>
    <section><h2>Interpretation boundaries</h2>${c.warnings.map((w) => `<p class="muted">${escapeHtml(w)}</p>`).join('')}</section>
    <section><h2>Source fingerprints</h2><p class="code">Baseline ${c.sources.baseline}</p><p class="code">Candidate ${c.sources.candidate}</p></section>`,
    c.synthetic,
  );
}
