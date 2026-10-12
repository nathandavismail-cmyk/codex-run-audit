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
:root{color-scheme:light;--ink:#192332;--muted:#627083;--line:#e5e9ef;--paper:#f5f7fa;--accent:#5664dc}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:24px}body{margin:0;background:var(--paper);color:var(--ink);font:14px/1.6 -apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}a{color:var(--accent);text-decoration:none}a:hover{text-decoration:underline}a:focus-visible,summary:focus-visible,.table-wrap:focus-visible{outline:3px solid #8290ff;outline-offset:4px}.sidebar{position:fixed;inset:0 auto 0 0;width:216px;background:#111b2c;color:#d5dce8;padding:32px 20px;display:flex;flex-direction:column}.brand{display:flex;gap:11px;align-items:center;font-size:14px;font-weight:700;line-height:1.35;letter-spacing:-.02em}.mark{display:grid;place-items:center;width:36px;height:36px;background:#c9d3ff;color:#253561;border-radius:10px;font:700 19px monospace}.brand small{display:block;color:#8290a8;font-size:10px;letter-spacing:.14em;margin-top:4px}.nav-label{font-size:10px;letter-spacing:.16em;color:#8290a8;margin:44px 12px 12px}.sidebar nav{display:grid;gap:5px}.sidebar nav a{display:flex;gap:13px;padding:11px 12px;color:#acb9ce;border-radius:7px}.sidebar nav a:hover{background:#243049;color:white;text-decoration:none}.sidebar nav a:first-child{background:#28354f;color:white}.nav-icon{color:#8e9cbd;font:13px monospace}.local{margin-top:auto;padding:18px 12px 0;border-top:1px solid #2b3649;font-size:12px;color:#98a6bc}.dot{display:inline-block;width:7px;height:7px;border-radius:100%;background:#70cfad;margin-right:7px}.local small{display:block;font-size:11px;color:#79899f;margin-top:5px}.shell{margin-left:216px;padding:0 40px;max-width:1620px}.topline{height:72px;display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--line);color:var(--muted);font-size:12px;gap:12px}.badge{font-size:10px;letter-spacing:.08em;background:#e9edf3;border-radius:5px;padding:5px 8px;white-space:nowrap}.button{display:inline-flex;align-items:center;gap:12px;background:white;color:var(--ink);border:1px solid #d8dee7;padding:8px 13px;border-radius:7px;font-size:12px;font-weight:600;box-shadow:0 1px 2px #15223908}header{padding:30px 0 24px}header .eyebrow{font-size:10px;font-weight:700;letter-spacing:.18em;color:var(--accent)}h1{font-size:34px;line-height:1.2;letter-spacing:-.045em;margin:9px 0}header p{margin:0;color:var(--muted);font-size:14px}h2{font-size:16px;letter-spacing:-.02em;margin:0 0 18px;display:flex;align-items:center;gap:10px}h2:before{content:'';height:15px;width:3px;border-radius:2px;background:#8994ec}h3{font-size:13px;margin:0;text-transform:capitalize}.cards{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:14px}.card,section{background:#fff;border:1px solid var(--line);border-radius:10px;box-shadow:0 2px 3px #15223903}.card{padding:20px;min-width:0}.card small{font-size:11px;color:var(--muted);font-weight:600}.metric{font-size:clamp(21px,2.4vw,32px);line-height:1.3;font-weight:650;letter-spacing:-.045em;font-variant-numeric:tabular-nums;margin-top:10px}.card p{font-size:10px;line-height:1.5;color:var(--muted);margin:9px 0 0}.card:first-child{border-top:2px solid #8390e8}.grid{display:grid;grid-template-columns:1.15fr 1fr;gap:20px;margin-top:20px;align-items:start}section{padding:24px;margin-top:20px;scroll-margin-top:24px;min-width:0}.grid section{margin:0}.notice{display:flex;gap:9px;align-items:baseline;background:#fff8e8;color:#7c632e;border:1px solid #f0e4c7;padding:10px 14px;border-radius:7px;margin-bottom:20px;font-size:11px}.notice strong{white-space:nowrap}.muted{color:var(--muted);font-size:12px;line-height:1.7}.allocation{display:flex;align-items:center;gap:24px;padding:7px 0 22px}.donut{flex:0 0 120px;height:120px;border-radius:50%;display:grid;place-items:center;background:conic-gradient(var(--accent) var(--share),#e8ecf8 0)}.donut-inner{width:92px;height:92px;border-radius:50%;background:white;display:grid;align-content:center;text-align:center;font-size:25px;font-weight:650;letter-spacing:-.04em}.donut-inner small{font-size:9px;font-weight:500;color:var(--muted);letter-spacing:0}.legend{display:grid;gap:12px;font-size:11px;color:var(--muted)}.legend b{display:block;font-size:17px;color:var(--ink);font-weight:600;font-variant-numeric:tabular-nums}.swatch{display:inline-block;width:7px;height:7px;border-radius:2px;background:var(--accent);margin-right:6px}.swatch.light{background:#dce1f6}table{width:100%;border-collapse:collapse;text-align:left;font-size:12px;font-variant-numeric:tabular-nums}th{font-size:9px;letter-spacing:.08em;text-transform:uppercase;color:var(--muted);font-weight:600;background:#fafbfd;white-space:nowrap}td,th{padding:11px 10px;border-bottom:1px solid #edf0f5;vertical-align:top}td:not(:first-child),th:not(:first-child){text-align:right}tr:last-child td{border-bottom:0}tbody tr:hover{background:#fafbfe}.finding{display:grid;grid-template-columns:26px 1fr;gap:12px;padding:17px 0;border-top:1px solid var(--line)}.finding-number{display:grid;place-items:center;height:24px;border:1px solid #dfe4ee;border-radius:6px;color:#627083;font:11px monospace}.finding p{margin:5px 0 0;color:var(--muted);font-size:12px}.finding .next{background:#f7f8fc;padding:9px 12px;border-radius:5px;color:#48556b;margin-top:10px}.section-intro{margin:-10px 0 20px;color:var(--muted);font-size:12px}.code{font:11px/1.8 ui-monospace,SFMono-Regular,monospace;overflow-wrap:anywhere;color:var(--muted);background:#f7f9fb;border:1px solid var(--line);padding:12px 14px;border-radius:6px}.table-wrap{overflow:auto}.table-hint{display:none}details summary{cursor:pointer;font-weight:600;list-style-position:outside;margin-left:16px}footer{display:flex;gap:26px;border-top:1px solid var(--line);margin-top:28px;padding:22px 0 36px;color:var(--muted);font-size:10px}footer strong{white-space:nowrap;color:#46546a}footer p{margin:0;max-width:720px}.status{display:inline-flex;border-radius:5px;padding:2px 7px;background:#edf1fa;color:#4d6090;font-size:11px}.status.completed{background:#e8f5ee;color:#267355}.status.failed{background:#fceced;color:#ae4351}.status.incomplete{background:#fff4df;color:#88692e}.split-title{display:flex;align-items:center;justify-content:space-between;gap:16px}.split-title h2{margin-bottom:0}.split-title{margin-bottom:18px}.sources{display:grid;grid-template-columns:1fr 1fr;gap:16px}.source-label{font-size:10px;letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}@media(min-width:1600px){.shell{margin-right:auto}}@media(max-width:1050px){.sidebar{width:180px;padding:28px 14px}.shell{margin-left:180px;padding:0 24px}.card{padding:16px}.grid{grid-template-columns:1fr}.metric{font-size:23px}}@media(max-width:700px){.sidebar{position:static;width:auto;padding:16px 20px;display:block}.brand{font-size:13px}.mark{width:30px;height:30px}.brand small{display:none}.sidebar nav{display:flex;gap:4px;margin-top:16px;overflow:auto}.sidebar nav a{padding:7px 10px;font-size:11px;white-space:nowrap}.nav-icon,.nav-label,.local{display:none}.shell{margin:0;padding:0 18px}.topline{height:59px;font-size:10px}.badge{font-size:9px}.button{font-size:10px;padding:7px 9px}header{padding:23px 0}h1{font-size:29px}header p{font-size:12px}.cards{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.metric{font-size:24px}.card{padding:15px}.card p{font-size:10px}.notice{display:block;font-size:10px}.notice strong{margin-right:4px}section{padding:18px}.grid{gap:16px;margin-top:16px}h2{font-size:15px}.table-hint{display:block;font-size:10px}.table-wrap table{min-width:460px}.sources{grid-template-columns:1fr}.allocation{gap:22px}.finding{gap:9px}footer{display:block}footer p{margin-top:8px}.split-title{align-items:flex-start}.split-title .badge{font-size:8px}}@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}@media print{.sidebar,.button{display:none}.shell{margin:0;padding:0}body{background:white}section,.card{break-inside:avoid;box-shadow:none}.grid{grid-template-columns:1fr 1fr}.cards{grid-template-columns:repeat(4,1fr)}details{display:block}footer{padding-bottom:0}}
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
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"><title>${escapeHtml(title)} · Codex Run Audit</title><style>${styles}</style></head><body><aside class="sidebar"><div class="brand"><span class="mark">↗</span><div>Codex Run Audit<small>EXECUTION INTELLIGENCE</small></div></div><div class="nav-label">WORKSPACE / LOCAL</div><nav aria-label="Report navigation">${navigation.map(([id, label], i) => `<a href="#${id}"><span class="nav-icon">0${i + 1}</span>${label}</a>`).join('')}</nav><div class="local"><span class="dot"></span>Private by design<small>Offline · No telemetry · v0.1</small></div></aside><div class="shell"><div class="topline"><span>Workspace <span aria-hidden="true"> / </span> <strong>${comparison ? 'Comparison' : 'Execution report'}</strong></span><a class="button" href="report.json">Export JSON <span aria-hidden="true">↗</span></a></div><header id="overview"><div class="eyebrow">${comparison ? 'COMPARE / TWO EXPORTS' : 'ANALYZE / SINGLE EXPORT'}</div><h1>${escapeHtml(title)}</h1><p>${escapeHtml(subtitle)}</p></header><main>${synthetic ? '<div class="notice"><strong>Synthetic demonstration.</strong> Invented test events, not measurements from a real agent run.</div>' : ''}${body}</main><footer><strong>◉ Codex Run Audit</strong><p>Generated locally. No scripts, remote assets, telemetry, or model calls. Raw prompts, commands, tool outputs, paths and messages are omitted. Source fingerprints can correlate reports; review before sharing.</p></footer></div></body></html>`;
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
    'Recorded execution, usage, and diagnostic evidence. Unknowns stay visible.',
    `
    <div class="cards">${card('Execution', r.execution, 'Task correctness remains unverified')}${card('Input tokens', num(r.usage.input), 'Includes cached input; never add it twice')}${card('Output tokens', num(r.usage.output), 'Includes reported reasoning output')}${card('Elapsed time', r.elapsedMs === null ? 'Unknown' : `${num(r.elapsedMs)} ms`, 'Only from complete, ordered source timestamps')}</div>
    <div class="grid"><section id="usage"><div class="split-title"><h2>Token accounting</h2><span class="badge">RECORDED USAGE</span></div>${ratio === null ? '<p class="muted">Input allocation unavailable. Missing usage stays unknown.</p>' : `<div class="allocation"><div class="donut" style="--share:${ratio}%" role="img" aria-label="${ratio}% of recorded input cached"><div class="donut-inner">${ratio}%<small>INPUT CACHED</small></div></div><div class="legend"><div><span class="swatch"></span>Cached input<b>${num(r.usage.cachedInput)}</b></div><div><span class="swatch light"></span>Uncached input<b>${num(r.usage.uncachedInput)}</b></div></div></div>`}<table><thead><tr><th>Category</th><th>Recorded tokens</th></tr></thead><tbody>${tokenRows}</tbody></table><p class="muted">Cache share: ${ratio === null ? 'unknown' : `${ratio}%`}. This measures recorded input reuse, not subscription savings.</p></section><section><h2>Recorded activity</h2><table><thead><tr><th>Activity</th><th>Completed items</th></tr></thead><tbody>${activityRows}</tbody></table><p class="muted">Counts reflect emitted terminal items only. Zero does not prove no tool was attempted: blocked activity may be absent from the export. Identical commands may be justified. Counts do not attribute token cost to individual tools.</p></section></div>
    <section id="diagnostics"><div class="split-title"><h2>Diagnostics &amp; next steps</h2><span class="badge">${r.findings.length} OBSERVATIONS</span></div><p class="section-intro">Evidence from this export, with a concrete next action for each finding.</p>${r.findings.map((f, i) => `<div class="finding"><span class="finding-number">${i + 1}</span><div><h3>${escapeHtml(f.code.replaceAll('-', ' '))}${f.count > 1 ? ` · ${num(f.count)}` : ''}</h3><p>${escapeHtml(f.message)}</p><p class="next"><strong>Next step:</strong> ${escapeHtml(f.nextStep)}</p></div></div>`).join('')}</section>
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
