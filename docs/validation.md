# Local validation record

Date: 2026-10-11. Environment: macOS / Darwin arm64, Node 24.21.0, npm 11.19.0.

## Passed

- Approved manual Ubuntu validation passed on commit `eb2cfb7`: [workflow evidence](https://github.com/nathandavismail-cmyk/codex-run-audit/actions/runs/38198752068). Clean installation, 34 tests, package installation/uninstallation and dependency audit passed.
- Redesigned reports passed Chromium 156.0.8078.4 checks at 1280px and 390px for synthetic completed, failed and comparison reports. Navigation targets and JSON export resolve; metrics fit on one line; pages do not overflow horizontally; timeline expands; no page errors or external requests were observed. Desktop and mobile screenshots were reviewed. Tables scroll within their containers on narrow screens.
- Ubuntu native Codex 0.162.1 mock-provider success and failure probes passed. Both native tool probes recorded host sandbox restrictions, **not verified tool execution**. The green workflow includes explicit environmental-block reporting and must not be interpreted as tool support certification.


- `npm run check`: strict TypeScript, Biome, build and **37 tests** (36 pass and one Linux-only test skips on macOS), including static follow-up guidance and privacy checks.
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

- Actual macOS Safari and Windows browser coverage. Linux WebKit does not establish Safari integration.
- Successful real-model tool execution, live provider-failure coverage, private-history import, measured outcome improvement or subscription-cost reconciliation. The successful no-tool run and mocked provider failure do not establish these; attempted live tools were sandbox-blocked.
- Windows execution. Ubuntu checks passed separately; this does not establish all Linux distributions.
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


## Report-opening and pilot readiness pass

- `--open` uses separate process arguments and encoded file URLs. Tests cover
  spaces, Unicode, shell metacharacters, unsupported hosts, and process failure.
- The actual macOS opener attempt could not launch Safari in this environment.
  The command retained HTML/JSON, printed the file URL and warning, and exited 0.
  Successful application launch remains unverified here.
- Five original checksum-pinned diagnosis fixtures passed accounting expectations
  locally. Results explicitly say `fixture-conformance` and developer outcome
  `not-measured`. This is not a benchmark or human trial.
- Updated package installation and removal checks passed locally.

- Final Ubuntu run on `e3a343f` passed all **37 tests**, packaging, five
  diagnosis fixtures, dependency audit, and **12 browser scenarios** across
  Chromium 156.0.8078.4 and WebKit 27.2 at 1280px/390px. No page errors or remote
  requests were observed. WebKit exposed a mobile metric wrap; the fixed mobile
  layout passed and its screenshot was inspected.
  [Workflow evidence](https://github.com/nathandavismail-cmyk/codex-run-audit/actions/runs/38199890375).
  The native tool probes still explicitly report sandbox-blocked execution.


## Final compatibility pass

Developer feedback was explicitly removed as a release requirement on 2026-10-11.
The optional research materials remain available; usefulness is still unmeasured.
A native-app inventory reported Safari running, but accessing its window returned
`cgWindowNotFound`. This does not establish successful Safari report rendering.
The sandbox-blocked native command probes remain unresolved; controls were not
weakened and no paid model task was run to retry them.

Final [manual Ubuntu run](https://github.com/nathandavismail-cmyk/codex-run-audit/actions/runs/38202572750)
passed all 37 tests, package checks, five fixtures, dependency audit and **18**
Chromium/WebKit/Firefox desktop/mobile scenarios. The browser checks also exercised
keyboard Tab/Enter access to the skip link, with reduced motion. No page errors
or external requests were recorded. This is targeted keyboard coverage, not a
full accessibility certification. Native tools remained explicitly sandbox-blocked.
