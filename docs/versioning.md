# Versioning and the 1.x contract

The first public release is **1.0.0**.
The version commits to a defined interface, not compatibility with every Codex
surface or proof of developer productivity.

## Stable in 1.x

- `analyze`, `compare`, `demo`, `--out`, `--synthetic` for analyze, `--open`,
  `--help`, and `--version` retain their documented purposes.
- Output is an exclusive new directory containing `index.html` and `report.json`.
  Existing output is not overwritten; input is not changed.
- Exit 0 means report generation succeeded. Failure to open an optional browser
  produces a warning and preserves exit 0. Invalid input or generation failure
  exits 1. Human-readable message wording is not a machine API.
- `runlens.report/v1` and `runlens.comparison/v1` retain their names and existing
  field meanings. The historical name is intentional. Comparisons continue to
  accept compatible 0.1.0 reports; generator version is not a schema identifier.
- Unknown counters remain null. Cached input and reasoning output are subsets,
  not additions to their inclusive totals. Task success is not inferred.

Consumers should ignore additive fields and use JSON rather than scraping HTML.
HTML layout, diagnostic wording and internal TypeScript modules are not stable APIs.
New event support must document its source/version evidence; unverified native
formats do not become supported merely because the package reaches 1.0.

## Release rules

Breaking changes to documented commands, existing JSON meanings, overwrite
behavior, or the minimum Node version require a major release. Compatible new
features use a minor release. Corrections and security fixes use a patch release.
An accounting bug fix may correct formerly wrong output; release notes must
explain the affected input and change. Malformed or unsafe input can be rejected
more strictly as a documented security fix.

Node 24 is the tested runtime. macOS arm64 and Ubuntu CLI checks are recorded in
validation. Native Codex tool execution and actual Safari opening remain
unverified on this host; Windows, billing and raw session rollouts are outside
the supported scope. These limits are not hidden behind a version number.

This policy follows [Semantic Versioning 2.0.0](https://semver.org/) (accessed 2026-10-11), with the public contract defined above.
