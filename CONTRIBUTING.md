# Contributing to Codex Run Audit

Start with a small reproducible problem. For accounting changes, explain the source format/version, whether counters are per-turn or cumulative, and why the expected answer is independently known. Do not submit private transcripts or credentials.

## Local setup

Use Node 24+, run `npm ci`, then `npm run check`. The project uses strict TypeScript, Biome, and Node's test runner with serial concurrency. Runtime dependencies require an architecture decision and a clear benefit.

Tests belong in `tests/`. Use original synthetic events and disposable directories. Include missing fields, malformed data, duplicated events and version differences. A test that merely mirrors an algorithm is weaker than a fixture with independently calculated totals.

## Pull requests

Explain the user problem, resulting behavior, evidence/format boundaries, and validation. Keep unrelated changes separate. Update documentation when a supported format or measurement changes. Do not weaken unknown states to make dashboards look complete.

Run `npm run check`; for CLI/package changes also run `npm pack` and test the resulting tarball in a clean directory. Do not add GitHub Actions without maintainer approval. The approved Ubuntu workflow is manual-only, with a 10-minute timeout and no model calls.

`npm run test:package` automates package installation, representative commands,
overwrite refusal and removal in a disposable prefix. It uses no model calls.
The native CLI probes under `scripts/capture-native.mjs` are opt-in and use a
loopback mock provider. Human feedback and comparative evaluations follow
[the pilot protocol](docs/developer-pilot.md).

Contributions are licensed under the project's MIT license. Do not copy external skill content, fixtures, or code without license review and attribution. Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
