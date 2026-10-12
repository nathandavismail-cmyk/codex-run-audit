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
:root{color-scheme:light;--ink:#1d1d1f;--muted:#6e6e73;--line:#e5e5e7;--accent:#0066cc;--paper:#fff}
*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:90px}body{margin:0;background:var(--paper);color:var(--ink);font:14px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}a:focus-visible,summary:focus-visible,.table-wrap:focus-visible{outline:3px solid #0071e3;outline-offset:5px}button,a,summary{-webkit-tap-highlight-color:transparent}.toolbar{position:sticky;top:0;z-index:2;background:#ffffffed;backdrop-filter:blur(18px);border-bottom:1px solid var(--line)}.toolbar-inner{max-width:1120px;margin:auto;padding:0 40px;min-height:68px;display:flex;align-items:center;justify-content:space-between;gap:24px}.brand{font-size:17px;letter-spacing:-.035em;font-weight:600;white-space:nowrap}.toolbar nav{display:flex;gap:25px;margin-left:auto}.toolbar nav a{font-size:12px;color:var(--muted);padding:12px 0;white-space:nowrap}.toolbar nav a:hover{color:var(--ink);text-decoration:none}.button{display:inline-flex;align-items:center;gap:8px;white-space:nowrap;background:#f5f5f7;border:1px solid #e9e9eb;border-radius:7px;padding:7px 12px;font-size:12px;color:var(--ink)}.button:hover{background:#ededf0;text-decoration:none}.shell{max-width:1120px;padding:0 40px;margin:auto}header{padding:70px 0 34px}h1{font-size:48px;line-height:1.08;letter-spacing:-.055em;font-weight:600;margin:0 0 16px}header p{font-size:17px;line-height:1.5;color:var(--muted);max-width:640px;margin:0;letter-spacing:-.015em}.notice{font-size:12px;color:var(--muted);padding:0 0 22px;line-height:1.6}.notice strong{color:#515154;font-weight:600}.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));background:#f5f5f7;border-radius:18px;padding:28px 0;margin:0 0 54px}.card{padding:0 26px;min-width:0;border-left:1px solid #dddde0}.card:first-child{border:0}.card small{font-size:12px;font-weight:500;color:#515154}.metric{font-size:32px;line-height:1.25;font-weight:600;letter-spacing:-.045em;font-variant-numeric:tabular-nums;margin:10px 0}.card p{font-size:11px;line-height:1.5;color:var(--muted);margin:0;max-width:180px}.grid{display:grid;grid-template-columns:1.1fr 1fr;gap:64px}.grid section{margin:0;padding:0;border:0}section{margin-top:48px;padding-top:32px;border-top:1px solid var(--line);min-width:0;scroll-margin-top:96px}h2{font-size:22px;font-weight:600;letter-spacing:-.035em;line-height:1.3;margin:0 0 24px}h3{font-size:14px;font-weight:600;letter-spacing:-.015em;margin:0;text-transform:capitalize}.split-title{display:flex;align-items:baseline;justify-content:space-between;gap:16px;margin-bottom:24px}.split-title h2{margin:0}.badge{font-size:12px;font-weight:400;color:var(--muted);white-space:nowrap}.muted,.section-intro{font-size:12px;line-height:1.65;color:var(--muted)}.section-intro{margin:-12px 0 24px}.allocation{padding:0 0 26px}.allocation-head{display:flex;align-items:baseline;justify-content:space-between;gap:12px;font-size:12px;color:var(--muted)}.allocation-head strong{color:var(--ink);font-weight:600;font-size:28px;letter-spacing:-.04em}.allocation-head strong small{font-size:12px;font-weight:400;letter-spacing:0;color:var(--muted);margin-left:7px}.usage-bar{height:8px;border-radius:8px;background:#e8e8ed;overflow:hidden;margin:15px 0}.usage-bar span{height:100%;display:block;background:#424245;border-radius:8px}.legend{display:flex;justify-content:space-between;gap:16px;font-size:11px;color:var(--muted)}.legend b{font-weight:500;color:var(--ink);margin-left:6px;font-variant-numeric:tabular-nums}.swatch{display:inline-block;width:6px;height:6px;border-radius:50%;background:#424245;margin-right:6px}.swatch.light{background:#d2d2d7}table{width:100%;border-collapse:collapse;text-align:left;font-size:13px;font-variant-numeric:tabular-nums}th{font-size:11px;color:var(--muted);font-weight:400;white-space:nowrap}td,th{padding:12px 0;border-bottom:1px solid #eeeeef;vertical-align:top}td:not(:first-child),th:not(:first-child){text-align:right;padding-left:16px}tr:last-child td{border-bottom:0}.finding{display:grid;grid-template-columns:20px 1fr;gap:16px;padding:22px 0;border-top:1px solid var(--line)}.finding-number{color:#86868b;font-size:11px;padding-top:2px;font-variant-numeric:tabular-nums}.finding p{margin:6px 0 0;color:var(--muted);font-size:13px;line-height:1.65;max-width:850px}.finding .next{color:#515154;margin-top:9px}.next strong{font-weight:500;color:var(--ink)}.code{font:11px/1.8 ui-monospace,SFMono-Regular,monospace;overflow-wrap:anywhere;color:var(--muted);background:#f5f5f7;padding:16px 20px;border-radius:10px}.table-wrap{overflow:auto}.table-hint{display:none}details summary{cursor:pointer;font-size:15px;font-weight:500;letter-spacing:-.02em;list-style-position:outside;margin-left:18px;padding:4px 0}details[open] summary{margin-bottom:20px}.status{display:inline-flex;border-radius:5px;padding:2px 7px;background:#f5f5f7;color:#515154;font-size:11px}.status.completed{background:#edf5ef;color:#31633d}.status.failed{background:#fff0ef;color:#aa3530}.status.incomplete{background:#fcf5e8;color:#855e13}footer{border-top:1px solid var(--line);margin-top:48px;padding:26px 0 36px;color:var(--muted);font-size:11px;display:flex;gap:36px}footer strong{font-weight:500;color:#515154;white-space:nowrap}footer p{margin:0;max-width:750px}.skip{position:absolute;top:-100px;left:20px;padding:10px;background:#fff;z-index:4}.skip:focus{top:10px}
@media(max-width:1000px){.toolbar nav{gap:16px}.toolbar-inner,.shell{padding-left:28px;padding-right:28px}.grid{gap:38px}.card{padding:0 20px}.metric{font-size:27px}}
@media(max-width:760px){html{scroll-padding-top:120px}.toolbar-inner{padding:15px 22px 0;flex-wrap:wrap;gap:8px}.brand{font-size:16px}.button{margin-left:auto}.toolbar nav{order:3;flex-basis:100%;justify-content:space-between;margin:0;gap:15px;overflow:auto}.toolbar nav a{padding:10px 0;font-size:11px}.shell{padding:0 22px}header{padding:42px 0 24px}h1{font-size:38px;letter-spacing:-.05em}header p{font-size:15px}.notice{font-size:11px;padding-bottom:20px}.cards{grid-template-columns:repeat(2,minmax(0,1fr));padding:0 20px;margin-bottom:38px;border-radius:14px}.card{padding:21px 0;border:0}.card:nth-child(even){padding-left:20px}.card:nth-child(-n+2){border-bottom:1px solid #dddde0}.metric{font-size:25px}.card p{font-size:10px;padding-right:7px}.grid{grid-template-columns:1fr;gap:36px}.grid section+section{padding-top:28px;border-top:1px solid var(--line)}h2{font-size:21px}.split-title{gap:8px}.badge{font-size:11px}section{margin-top:36px;padding-top:28px;scroll-margin-top:120px}.finding{gap:10px;padding:20px 0}.finding p{font-size:12px}.table-wrap table{min-width:440px}.table-hint{display:block;font-size:11px}footer{display:block;font-size:10px;margin-top:36px}footer p{margin-top:10px}.code{font-size:10px;padding:13px 15px}.legend{font-size:10px}.legend b{margin-left:4px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{.toolbar,.skip{display:none}.shell{padding:0}header{padding-top:0}section,.card{break-inside:avoid}.cards{grid-template-columns:repeat(4,1fr)}.grid{grid-template-columns:1fr 1fr}footer{padding-bottom:0}}
`;
function page(
  title: string,
  subtitle: string,
  body: string,
  synthetic: boolean,
): string {
  const comparison = title === 'Run comparison';
  const navigation = comparison
    ? [
        ['overview', 'Overview'],
        ['usage', 'Usage comparison'],
        ['boundaries', 'Interpretation'],
        ['provenance', 'Sources'],
      ]
    : [
        ['overview', 'Overview'],
        ['usage', 'Token usage'],
        ['diagnostics', 'Diagnostics'],
        ['timeline', 'Event timeline'],
      ];
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${escapeHtml(title)} · Codex Run Audit</title><style>${styles}</style></head><body><a class="skip" href="#overview">Skip to report</a><div class="toolbar"><div class="toolbar-inner"><div class="brand">Codex Run Audit</div><nav aria-label="Report navigation">${navigation.map(([id, label]) => `<a href="#${id}">${label}</a>`).join('')}</nav><a class="button" href="report.json">Export JSON <span aria-hidden="true">↓</span></a></div></div><div class="shell"><header id="overview"><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></header><main>${synthetic ? '<div class="notice"><strong>Synthetic demonstration.</strong> Invented test events, not measurements from a real agent run.</div>' : ''}${body}</main><footer><strong>Codex Run Audit</strong><p>Generated locally. No scripts, remote assets, telemetry, or model calls. Raw prompts, commands, tool outputs, paths and messages are omitted. Source fingerprints can correlate reports; review before sharing.</p></footer></div></body></html>`;
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
    'Run overview',
    'A closer look at your agent’s work.',
    `
    <div class="cards">${card('Execution', r.execution, 'Task correctness remains unverified')}${card('Input tokens', num(r.usage.input), 'Includes cached input; never add it twice')}${card('Output tokens', num(r.usage.output), 'Includes reported reasoning output')}${card('Elapsed time', r.elapsedMs === null ? 'Unknown' : `${num(r.elapsedMs)} ms`, 'Only from complete, ordered source timestamps')}</div>
    <div class="grid"><section id="usage"><div class="split-title"><h2>Token accounting</h2><span class="badge">Tokens</span></div>${ratio === null ? '<p class="muted">Input allocation unavailable. Missing usage stays unknown.</p>' : `<div class="allocation"><div class="allocation-head"><strong>${ratio}%<small>of input cached</small></strong><span>Input allocation</span></div><div class="usage-bar" role="img" aria-label="${ratio}% of recorded input cached"><span style="width:${ratio}%"></span></div><div class="legend"><div><span class="swatch"></span>Cached<b>${num(r.usage.cachedInput)}</b></div><div><span class="swatch light"></span>Uncached<b>${num(r.usage.uncachedInput)}</b></div></div></div>`}<table><thead><tr><th>Category</th><th>Recorded tokens</th></tr></thead><tbody>${tokenRows}</tbody></table><p class="muted">Cache share: ${ratio === null ? 'unknown' : `${ratio}%`}. This measures recorded input reuse, not subscription savings.</p></section><section><h2>Recorded activity</h2><table><thead><tr><th>Activity</th><th>Completed items</th></tr></thead><tbody>${activityRows}</tbody></table><p class="muted">Counts reflect emitted terminal items only. Zero does not prove no tool was attempted: blocked activity may be absent from the export. Identical commands may be justified. Counts do not attribute token cost to individual tools.</p></section></div>
    <section id="diagnostics"><div class="split-title"><h2>Worth a closer look</h2><span class="badge">${r.findings.length} observations</span></div><p class="section-intro">Evidence from this export, with a concrete next action for each finding.</p>${r.findings.map((f, i) => `<div class="finding"><span class="finding-number">${i + 1}</span><div><h3>${escapeHtml(f.code.replaceAll('-', ' '))}${f.count > 1 ? ` · ${num(f.count)}` : ''}</h3><p>${escapeHtml(f.message)}</p><p class="next"><strong>Next step:</strong> ${escapeHtml(f.nextStep)}</p></div></div>`).join('')}</section>
    <section id="provenance"><h2>Coverage &amp; provenance</h2><p>${r.coverage.turnsWithUsage} of ${r.coverage.turns} turns have input/output measurements. ${r.coverage.unknownEvents} unknown events; ${r.coverage.duplicateEvents} duplicate terminal events excluded.</p><p class="muted">Model, linked subagents, independent acceptance results, subscription allowance, and billing cost: unknown. This report describes one explicit export, not your entire account.</p><div class="code">SHA-256 ${r.source.sha256}<br>${num(r.source.bytes)} source bytes · codex-exec-jsonl · Codex Run Audit ${escapeHtml(r.generator)}</div></section>
    <section><h2>Per-turn measurements</h2><p class="muted">Known measurements remain useful even when incomplete turns make whole-run totals unknown. Showing ${Math.min(r.turns.length, 200)} of ${r.turns.length} turns. Full data is available in the JSON export.</p><p class="muted table-hint">Scroll the table horizontally to see all columns.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Scrollable data table"><table><thead><tr><th>Turn</th><th>Execution</th><th>Input</th><th>Cached subset</th><th>Output</th></tr></thead><tbody>${r.turns
      .slice(0, 200)
      .map(
        (t) =>
          `<tr><td>${t.index}</td><td><span class="status ${t.status}">${escapeHtml(t.status)}</span></td><td>${num(t.usage.input)}</td><td>${num(t.usage.cachedInput)}</td><td>${num(t.usage.output)}</td></tr>`,
      )
      .join('')}</tbody></table></div></section>
    <section id="timeline"><details><summary>Event timeline · ${r.timeline.length} rows${r.coverage.timelineOmitted ? ` · ${r.coverage.timelineOmitted} omitted` : ''}</summary><p class="muted">Source order only; content and commands are omitted. Use browser Find to locate an event type.</p><p class="muted table-hint">Scroll the table horizontally to see all columns.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Scrollable data table"><table><thead><tr><th>Event</th><th>Turn</th><th>Kind</th><th>Status</th></tr></thead><tbody>${r.timeline.map((e) => `<tr><td>${e.index}</td><td>${e.turn ?? '—'}</td><td>${escapeHtml(e.kind)}</td><td>${escapeHtml(e.status ?? '—')}</td></tr>`).join('')}</tbody></table></div></details></section>`,
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
    'Run comparison',
    'A descriptive comparison of two exports. A smaller number is not automatically a better outcome.',
    `
    <div class="notice"><strong>Task equivalence is unknown.</strong> This report cannot establish a causal improvement or a regression in task quality.</div>
    <div class="cards">${card('Baseline execution', c.baseline.execution, 'Correctness unverified')}${card('Candidate execution', c.candidate.execution, 'Correctness unverified')}${card('Input delta', num(c.delta.input), 'Candidate minus baseline')}${card('Output delta', num(c.delta.output), 'Candidate minus baseline')}</div>
    <section id="usage"><h2>Recorded usage comparison</h2><p class="muted table-hint">Scroll the table horizontally to see all columns.</p><div class="table-wrap" tabindex="0" role="region" aria-label="Scrollable data table"><table><thead><tr><th>Category</th><th>Baseline</th><th>Candidate</th><th>Delta</th></tr></thead><tbody>${rows}<tr><td>Elapsed milliseconds</td><td>${num(c.baseline.elapsedMs)}</td><td>${num(c.candidate.elapsedMs)}</td><td>${num(c.delta.elapsedMs)}</td></tr></tbody></table></div></section>
    <section id="boundaries"><h2>Interpretation boundaries</h2>${c.warnings.map((w) => `<p class="muted">${escapeHtml(w)}</p>`).join('')}</section>
    <section id="provenance"><h2>Source fingerprints</h2><p class="code">Baseline ${c.sources.baseline}</p><p class="code">Candidate ${c.sources.candidate}</p></section>`,
    c.synthetic,
  );
}
