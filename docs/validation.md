# Local validation record

Date: 2026-10-11. Environment: macOS / Darwin arm64, Node 24.21.0, npm 11.19.0.

## Passed

- `npm run check`: strict TypeScript, Biome, build and **34 tests**, including static follow-up guidance and privacy checks.
- Fresh local Git clone in a path containing spaces: registry-backed `npm ci` with prepare/build, quality gate, and package smoke test passed without copying node_modules. The previous clean-install uncertainty is resolved.
- Direct npm Git installation initially installed no executable. Adding the prepare/build lifecycle fixed it; a commit-pinned `git+file` install then passed help and demo. This validates npm's Git preparation, not remote GitHub authentication or transport.
- `npm run test:package` passed: offline isolated global-prefix installation, help/version, demo/analyze/compare, paths with spaces, unchanged inputs, overwrite refusal, removal of package/executable, preservation of reports, package-content exclusions and identical repeated archive hashes on this host/toolchain.
- Registry-backed `npm audit`: zero reported vulnerabilities on 2026-10-11. Advisory databases and toolchains can change; this is not a general security certification.
- Native CLI probe: `codex-cli 0.162.0-alpha.17.2` emitted JSON through one loopback mock-provider request. Expected synthetic counters survived native serialization and parsing. A pre-turn error-item incompatibility was found, fixed, and preserved as a regression fixture; orphan tools remain rejected. No real model was called.
- Separately, one user-authorized real-model run completed through the existing ChatGPT login on the same CLI version. The fixed response was verified; Codex Run Audit matched the source usage exactly. See [live validation](live-validation.md) for observations and limits. This is a smoke test, not a benchmark.
- Native provider-failure probe: an isolated mock HTTP 400 produced `error` and `turn.failed` with CLI exit 1. Codex Run Audit preserved failed execution, unknown usage, and error privacy. Added a captured synthetic fixture and regression test.
- Two authorized live tool probes produced source-matching usage reports, but tool execution was blocked by the native macOS sandbox. These tool probes did not pass. Added a report explanation and regression test for missing tool telemetry without inferring task success.
- Parser tests cover inclusive accounting, identical legitimate turns, duplicate terminals, missing/zero counters, overflow, incomplete streams, unsupported rollout input, event ordering, timestamps, bounded timelines and privacy.
- CLI integration tests exercise demo, analyze, compare, errors and overwrite refusal.
- Review added regressions for invalid calendar dates, missing tool completions, hidden item errors, whitespace-padded oversized lines, synthetic labeling, CLI diagnostics and partial per-turn HTML. Six new tests failed against the original implementation before the fixes.
- Filesystem tests cover regular-file requirements, direct symlinks, FIFOs, invalid UTF-8, existing output symlinks and preservation of unrelated files.
- Packaged CLI installed into a disposable directory with no runtime dependencies; demo, analyze, compare and help succeeded independently of the source checkout.
- Archive inspection excludes source transcripts, reports, node_modules, tests and Git metadata.

## Not established

- Browser visual inspection: no attached browser was available and native Safari inspection failed. HTML content/escaping tests passed; visual review remains pending.
- Successful real-model tool execution, live provider-failure coverage, private-history import, measured outcome improvement or subscription-cost reconciliation. The successful no-tool run and mocked provider failure do not establish these; attempted live tools were sandbox-blocked.
- Linux or Windows execution. Docker and Podman are unavailable on this host. Do not interpret macOS tests as cross-platform certification.
- Package provenance, public GitHub configuration, npm publication or a public release. The user approved a private repository and manual Ubuntu workflow; see launch documentation.

## Developer installation review

The project was renamed to Codex Run Audit after identifying same-name agent
debuggers. The executable/package is `codex-run-audit`; report schema identifiers
remain compatible. Installation and removal instructions, static next-step
guidance, and a developer pilot protocol are now included. A maintainer simulated
the new-developer journey locally; no external participant feedback is claimed.
New local commits use the verified GitHub account's noreply identity; earlier
development history is preserved. The user approved pushing the reviewed history to a private GitHub repository. A fresh remote clone passed clean install, demo and package checks.

The demo and automated fixtures are synthetic. Their numeric values establish expected fixture behavior only. The separate real-model smoke test remains local; its raw capture is excluded from source and package archives. See [compatibility](compatibility.md) for coverage limits.
