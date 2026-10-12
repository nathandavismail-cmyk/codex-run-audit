# Codex Run Audit

**Understand what your coding agent did—and what the evidence actually supports.**

Codex Run Audit turns an explicitly selected Codex execution export into a private, local report. Inspect recorded token usage, command failures, repeated commands and event order. Compare two exports without treating lower token use as proof of better work.

**Status: 0.1.0 local preview.** Working CLI, standalone HTML/JSON reports, 34 tests, an isolated package-install/uninstall check, native success/failure probes using a synthetic local provider, and one successful real-model export smoke test. Live tool probes were sandbox-blocked; tool compatibility remains unverified. Available in the private GitHub repository; not published to npm. No live-model benchmark or broad compatibility certification yet. The name is not trademark-cleared.

## Try the demo

Requires Node.js 24 or later and access to the private repository:

```sh
gh repo clone nathandavismail-cmyk/codex-run-audit
cd codex-run-audit
```

Then:

```sh
npm ci
npm run check
npm run demo
```

Open `reports/demo/index.html` in your browser. The demo is visibly **synthetic**. Re-running it refuses to overwrite the existing report; choose another output directory:

```sh
node dist/src/cli.js demo --out reports/demo-2
```

No API key, network service, model call, browser extension, or runtime dependency is needed to analyze files. Installing development dependencies may require internet access.

For packaged installation, direct Git installation, upgrades, removal and setup
troubleshooting, see the [installation guide](docs/install.md). The executable
is `codex-run-audit`; the earlier local working name was RunLens. Existing JSON
schema identifiers are retained for compatibility with those reports.

## Analyze a run

Supply JSONL emitted by `codex exec --json`, not a raw session-history rollout:

```sh
node dist/src/cli.js analyze ./private-inputs/task.jsonl --out reports/task
```

This writes `report.json` and `index.html` in a **new** directory. Your input remains unchanged. Codex Run Audit does not scan your history or execute commands from the export.

For your own invented test exports, add `--synthetic` to keep the report visibly labeled. `codex-run-audit analyze --help` shows the command syntax. The built-in `demo` applies this label automatically.

If you choose to capture a new Codex task, append `--json` to your normal `codex exec` invocation and redirect stdout to a JSONL file. Running Codex itself can change files and consume your allowance; Codex Run Audit does not launch it. Capture stderr separately so it does not corrupt the JSONL stream. [Supported format and upstream reference](docs/compatibility.md).

## What the report tells you

| View | Evidence shown |
|---|---|
| Token accounting | Inclusive input/output, cached-input and reasoning subsets when supplied; derived uncached input |
| Activity | Completed command/MCP/search/file-change items; recorded command failures and repeated command text |
| Execution | Completed, failed or incomplete stream; always separate from task correctness |
| Timeline | Bounded source-order events without raw commands, outputs or messages |
| Coverage | Missing usage, unsupported events, excluded duplicates and unavailable measurements |
| Per-turn measurements | Known turn values remain visible even when incomplete turns make aggregate usage unknown |
| Next steps | Static, evidence-specific follow-up advice for each finding; no automatic execution or invented diagnosis |
| Provenance | Input SHA-256, byte count, adapter format and generator version |

Most standard execution exports lack timestamps. **Elapsed time remains unknown** unless all source events carry ordered timestamps. Model identity, subscription usage, billing costs, linked subagents, test semantics and independent task verification are not established in this release.

## Compare runs

```sh
node dist/src/cli.js compare reports/baseline/report.json reports/candidate/report.json --out reports/comparison
```

The comparison shows candidate-minus-baseline differences and execution states. It does not certify equal tasks, infer skill effects, recommend a cheaper model or declare a winner. Unknown categories remain unknown.

## Why Codex Run Audit?

Codex Run Audit focuses on readable evidence and conservative interpretation in a small offline tool. It has zero runtime dependencies and generates reports with no JavaScript or external assets. Repeated activity is a diagnostic lead, not an accusation of waste. A successful shell command is not automatically a passing acceptance test.

Existing tools already provide substantial functionality: [ccusage](https://github.com/ccusage/ccusage) covers usage analytics, and [Codex Engineering Workflow Pack](https://github.com/SetraTheXX/Codex-Engineering-Workflow-Pack) documents richer workflow evidence. Codex Run Audit does not claim to invent these capabilities. The longer-term hypothesis is incident-driven diagnosis across Codex versions; [our research and differentiation gate](docs/research.md) explain what remains to prove.

## Privacy and safety

- Only files explicitly passed to the CLI are read; there is no telemetry or network code.
- Reports omit raw prompts, commands, tool results, messages, thread IDs and filesystem paths from the input. Identical-command detection uses an in-memory hash, which is not exported.
- Counts and source fingerprints can still disclose or correlate activity. Review artifacts before sharing.
- Inputs must be UTF-8 regular files, at most 32 MiB, with lines at most 1 MiB. Direct input symlinks are refused.
- Existing output directories and symlinks are refused. New report directories use restrictive permissions on POSIX systems.
- Reports are observations, not tamper-proof attestations. Never treat an imported report as authorization to execute anything.

Read the [security model](SECURITY.md) and [accounting contract](docs/accounting.md).

## Troubleshooting

| Message or symptom | Action |
|---|---|
| Raw rollout unsupported | Supply `codex exec --json` output. Do not sum cumulative history counters manually. |
| Output directory already exists | Choose a new directory. Existing reports are never overwritten. |
| Path not found / access denied | Check supplied paths and permissions; errors intentionally omit private path values. |
| Invalid JSON object | Keep only JSONL stdout; a truncated final JSON object must be recovered at the source. Raw content is not echoed in errors. |
| Unknown usage or time | Inspect coverage. Missing fields are not zero; standard exports may not contain timestamps. |
| Multiple thread starts | Split independent exports. Concatenating sessions risks double-counting. |
| Large file/line rejected | Export a smaller bounded task. Resource limits are intentional. |
| Completed but unverified | Execution ended; independent acceptance evidence is not available to this parser. |

## Development and roadmap

```sh
npm run typecheck
npm run lint
npm test
npm run check
npm run test:package
npm pack
```

Tests run serially with original synthetic inputs and disposable directories. `npm pack` runs the quality gate before producing a local archive; it does not publish. See [CONTRIBUTING](CONTRIBUTING.md), [architecture](docs/architecture.md), [release preparation](docs/releasing.md), and [roadmap](docs/roadmap.md).

The [developer pilot and comparison protocol](docs/developer-pilot.md) describes
how to test whether reports improve diagnosis. No participant results or
controlled efficiency improvements are claimed yet.

Next: expand real-export coverage to tool activity and failed runs; run Linux checks; test accounting against a compatible existing analyzer; then add supported subagent linkage and independent acceptance evidence. Raw rollout parsing and automatic repair remain deferred.

## License

MIT. See [LICENSE](LICENSE) and [NOTICE](NOTICE.md). Codex Run Audit is an independent project and is not affiliated with or endorsed by OpenAI.
