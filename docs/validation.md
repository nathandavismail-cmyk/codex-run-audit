# Local validation record

Date: 2026-10-11. Environment: macOS / Darwin arm64, Node 24.21.0, npm 11.19.0.

## Passed

- `npm run check`: strict TypeScript, Biome, build and **21 tests**.
- Parser tests cover inclusive accounting, identical legitimate turns, duplicate terminals, missing/zero counters, overflow, incomplete streams, unsupported rollout input, event ordering, timestamps, bounded timelines and privacy.
- CLI integration tests exercise demo, analyze, compare, errors and overwrite refusal.
- Filesystem tests cover regular-file requirements, direct symlinks, FIFOs, invalid UTF-8, existing output symlinks and preservation of unrelated files.
- Packaged CLI installed into a disposable directory with no runtime dependencies; demo, analyze, compare and help succeeded independently of the source checkout.
- Archive inspection excludes source transcripts, reports, node_modules, tests and Git metadata.

## Not established

- A new clean development-dependency installation: offline npm lacked one cached development tarball. Existing local dependencies at the same pinned versions were reused for checks. The lockfile is included for ordinary `npm ci` setup.
- Browser visual inspection: no attached browser was available and native Safari inspection failed. HTML content/escaping tests passed; visual review remains pending.
- Real-model execution, real private-history import, measured outcome improvement or subscription-cost reconciliation.
- Linux or Windows execution. Do not interpret macOS tests as cross-platform certification.
- Online dependency vulnerability audit, package provenance, public GitHub configuration, publication or CI. No GitHub Actions workflow was created.

The demo is synthetic. Its numeric values establish expected fixture behavior only. See [compatibility](compatibility.md) for the real-export release gate.
