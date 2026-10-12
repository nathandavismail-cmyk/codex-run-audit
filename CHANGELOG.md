# Changelog

Changes follow semantic versioning. Until 1.0, minor releases may revise adapter support; machine-readable schema revisions are explicit.

## 1.0.0 — Unreleased

- Make developer feedback optional rather than a release gate.
- Prepare GitHub private vulnerability reporting for an authorized public launch.
- Extend manual Ubuntu browser coverage to Firefox and verify keyboard access to the skip link.

- Add opt-in `--open` for generated reports, encoded browser URLs and recoverable headless-launch failures.
- Extend the approved manual Ubuntu browser checks to WebKit as well as Chromium; fix narrow-screen metric wrapping found by WebKit.
- Add five checksum-pinned synthetic diagnosis cases, a conformance runner and separate participant/facilitator pilot materials.

- Redesign HTML reports with responsive navigation, input-cache allocation charts, structured diagnostic actions, status badges, and a direct JSON export. Reports remain self-contained and script-free.

- Rename the project and executable to Codex Run Audit (`codex-run-audit`); retain existing report schema identifiers.
- Build Git installations through npm's prepare lifecycle so the executable exists after installation.
- Add an isolated offline package install/uninstall regression check and installation guide.
- Add static next-step guidance to findings and a developer pilot/comparison protocol.

- Analyze explicit Codex execution JSONL exports into local HTML and JSON.
- Preserve unknown usage and reject inconsistent accounting or raw rollout input.
- Compare recorded usage without inferring task equivalence or causal improvement.
- Bound input resources and omit raw transcript content from reports.
- Include a synthetic demo, serial unit/integration tests, and local release checks.
- Reject impossible timestamp dates and enforce line limits before trimming whitespace.
- Surface unfinished tool activity and item-level errors without leaking source messages.
- Add explicit synthetic labeling, subcommand help, and actionable filesystem errors.
- Show per-turn measurements in HTML when aggregate usage is unavailable.
- Accept native startup error diagnostics without admitting tool activity outside turns.
- Add an opt-in, isolated Codex CLI probe with a loopback mock provider and a captured synthetic regression fixture.
- Document one authorized real-model export smoke test with source-matched usage counters; keep its transcript local and excluded from distribution.
- Add native mock-provider failure coverage with unknown usage and private errors omitted.
- Explain missing tool telemetry in reports after live tool probes encountered sandbox restrictions without command events.

No npm package, GitHub release, or real-model benchmark has been published.
