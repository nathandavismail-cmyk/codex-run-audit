# Local validation record

Date: 2026-10-11. Environment: macOS / Darwin arm64, Node 24.21.0, npm 11.19.0.

## Passed

- `npm run check`: strict TypeScript, Biome, build and **30 tests**.
- Native CLI probe: `codex-cli 0.162.0-alpha.17.2` emitted JSON through one loopback mock-provider request. Expected synthetic counters survived native serialization and parsing. A pre-turn error-item incompatibility was found, fixed, and preserved as a regression fixture; orphan tools remain rejected. No real model was called.
- Separately, one user-authorized real-model run completed through the existing ChatGPT login on the same CLI version. The fixed response was verified; RunLens matched the source usage exactly. See [live validation](live-validation.md) for observations and limits. This is a smoke test, not a benchmark.
- Parser tests cover inclusive accounting, identical legitimate turns, duplicate terminals, missing/zero counters, overflow, incomplete streams, unsupported rollout input, event ordering, timestamps, bounded timelines and privacy.
- CLI integration tests exercise demo, analyze, compare, errors and overwrite refusal.
- Review added regressions for invalid calendar dates, missing tool completions, hidden item errors, whitespace-padded oversized lines, synthetic labeling, CLI diagnostics and partial per-turn HTML. Six new tests failed against the original implementation before the fixes.
- Filesystem tests cover regular-file requirements, direct symlinks, FIFOs, invalid UTF-8, existing output symlinks and preservation of unrelated files.
- Packaged CLI installed into a disposable directory with no runtime dependencies; demo, analyze, compare and help succeeded independently of the source checkout.
- Archive inspection excludes source transcripts, reports, node_modules, tests and Git metadata.

## Not established

- A new clean development-dependency installation: offline npm lacked one cached development tarball. Existing local dependencies at the same pinned versions were reused for checks. The lockfile is included for ordinary `npm ci` setup.
- Browser visual inspection: no attached browser was available and native Safari inspection failed. HTML content/escaping tests passed; visual review remains pending.
- Real-model tool/failure coverage, private-history import, measured outcome improvement or subscription-cost reconciliation. The single successful live smoke test does not establish these.
- Linux or Windows execution. Docker and Podman are unavailable on this host. Do not interpret macOS tests as cross-platform certification.
- Online dependency vulnerability audit, package provenance, public GitHub configuration, publication or CI. No GitHub Actions workflow was created.

The demo and automated fixtures are synthetic. Their numeric values establish expected fixture behavior only. The separate real-model smoke test remains local; its raw capture is excluded from source and package archives. See [compatibility](compatibility.md) for coverage limits.
