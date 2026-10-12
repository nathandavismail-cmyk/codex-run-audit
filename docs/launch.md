# Launch preparation

Status: local release candidate, not published. Reviewed 2026-10-11 in
America/Los_Angeles. User approved the name **Codex Run Audit**.

## Proposed GitHub setup

- Owner: `nathandavismail-cmyk`, verified through the connected GitHub account.
- Repository: `codex-run-audit`; metadata lookup returned 404 at review time.
- Initial visibility: private, pending owner approval.
- Description: Offline reports for Codex execution exports, with conservative token accounting and evidence-based follow-up guidance.
- Topics: `codex`, `typescript`, `cli`, `developer-tools`, `observability`.
- Default branch: `main`; license MIT; 0.1.0 remains unreleased.
- Existing source includes contributing/security/conduct policies and issue/PR templates.

After creation is approved: push the reviewed local history, add real repository,
homepage and issue URLs to package metadata, clone the remote into a fresh
directory, and repeat the install/demo/package tests. Do not claim remote
installation before that check. Do not publish to npm or create releases as part
of repository creation alone. Older development commits retain their original
inferred author metadata; history has not been rewritten.

## Proposed opt-in Ubuntu validation

Requires separate approval because the user prohibited creating workflows
without permission. No workflow file has been created.

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
metadata; run the consenting-developer pilot; publish evidence and limitations.
Name searches and npm E404 are not legal clearance or package reservation.
The project is independent of OpenAI. No invitations, announcements, new remote
repository, workflow, or publication have been sent or created in this review.
