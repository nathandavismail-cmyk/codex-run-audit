# Launch preparation

Status: private GitHub repository created and pushed with explicit user approval; npm/public release pending. Reviewed 2026-10-11 in
America/Los_Angeles. User approved the name **Codex Run Audit**.

## GitHub setup

- Owner: `nathandavismail-cmyk`, verified through the connected GitHub account.
- Repository: [codex-run-audit](https://github.com/nathandavismail-cmyk/codex-run-audit).
- Visibility: private, confirmed through GitHub after creation.
- Description: Offline Codex run analyzer for token usage, command failures, timelines, and private HTML reports.
- Topics include `codex`, `codex-cli`, `openai-codex`, `token-usage`, `agent-observability`, `jsonl`, `offline`, `html-report`, `typescript`, `cli`, `developer-tools`, and `observability`.
- Default branch: `main`; license MIT; 0.1.0 remains unreleased.
- Existing source includes contributing/security/conduct policies and issue/PR templates.

The reviewed history is pushed; package metadata has actual repository/homepage/issue URLs. A fresh authenticated remote clone passed clean installation, demo and package installation/removal checks. Do not publish to npm or create releases as part
of repository creation alone. Older development commits retain their original
inferred author metadata; history has not been rewritten.

## Approved opt-in Ubuntu validation

The user explicitly approved creation and execution. The workflow is `.github/workflows/validate.yml`; it never runs on pushes or pull requests.

One manually dispatched `ubuntu-latest` job, read-only repository permission,
Node 24, 10-minute timeout, no push/PR schedule or macOS runner. Run clean install,
quality checks, package install/uninstall, and a bounded browser report smoke
test with screenshots for human inspection. No model calls or credentials are
needed for offline checks. GitHub Actions minutes may be consumed. Native Codex
tool execution should use an isolated mock provider where feasible; it remains
a distinct check from parser/renderer tests.

## Before public launch

Finish or explicitly narrow Linux/visual/tool support claims; configure a
verified private security-reporting channel; review archive contents and commit
metadata; publish evidence and limitations. Developer feedback is optional, not a release gate.
Name searches and npm E404 are not legal clearance or package reservation.
The project is independent of OpenAI. No invitations, public announcements, npm publication or GitHub releases have been made. Artifact storage was full during validation; synthetic screenshots can also be recovered from the bounded CI log output. Artifact-upload failure is reported separately and does not mask a failing test.

README, package keywords, `llms.txt`, and structured project facts are prepared for accurate discovery. Public indexing remains blocked by private visibility; see [discoverability](discoverability.md). No recommendation ranking or search-traffic lift is claimed.
