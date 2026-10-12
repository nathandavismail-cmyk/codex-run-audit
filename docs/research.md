# Research and differentiation

Research date: 2026-10-11. The preceding project screened 214 GitHub issues and examined 50 selected reports; this repository implements a narrower product direction. Those counts describe a purposive sample, not user-population prevalence. Raw issue logs and private diagnostics are not distributed here.

Motivating examples:

- [Codex #37143](https://github.com/openai/codex/issues/37143): reporter observations distinguish installed/catalog-visible skills from execution-session exposure.
- [Codex #41882](https://github.com/openai/codex/issues/41882): reported completion claims miss intended behavior despite tests.
- [Superpowers #1152](https://github.com/obra/superpowers/issues/1152): workflow overhead complaints with later mitigations and unresolved causal attribution.
- [ccusage #950](https://github.com/ccusage/ccusage/issues/950): historical closed report about inflated subagent accounting. It motivates careful ownership semantics, not a claim that the current tool remains broken.

These reports were not independently reproduced here. Synthetic parser fixtures test original accounting scenarios, not reproduction of upstream defects.

Prior art matters. [ccusage](https://github.com/ccusage/ccusage) offers local usage analysis; [skillfold](https://github.com/byronxlg/skillfold) offers pinned skill installations; [skill-harness](https://github.com/MrBinnacle/skill-harness) distinguishes delivery/invocation in controlled comparisons; [CEWP](https://github.com/SetraTheXX/Codex-Engineering-Workflow-Pack/blob/main/docs/evidence-receipts.md) documents outcome/usage evidence. No competitor was independently benchmarked in this implementation pass.

Codex Run Audit is not yet proven uniquely valuable. The next differentiation gate is one original incident case where it produces clearer actionable evidence than the nearest applicable existing tools under comparable conditions. If an integration or upstream contribution solves the problem better, prefer that over duplicating an ecosystem.

## Naming and positioning review

Accessed 2026-10-11 (America/Los_Angeles). The initial working name RunLens
collides with existing agent-debugging products, including
[harshbhatia04/RUNLENS](https://github.com/harshbhatia04/RUNLENS) and
[mda-diaz/runlens](https://github.com/mda-diaz/runlens). Their own READMEs describe
run inspection and debugging; this is direct naming and positioning overlap,
not evidence about their quality. No code or content was copied.

The user selected the descriptive name **Codex Run Audit**. npm registry lookup
returned E404 for `codex-run-audit` at review time. That is a point-in-time lookup,
not reservation, legal clearance, or proof of uniqueness. The product remains
independent of OpenAI. Offline explicit-file analysis, no instrumentation or
server, conservative missing-data handling, and static follow-up guidance are
the current scope; their value must still be tested with developers.
