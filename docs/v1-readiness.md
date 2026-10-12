# v1 readiness

Reviewed 2026-10-11. Keep the package at **0.1.0 unreleased / private preview**.
This checklist separates working implementation from unverified compatibility.
Developer feedback is optional and is not required for release, per the maintainer’s
2026-10-11 instruction. No productivity or usefulness improvement is claimed.

| Area | Evidence / status |
| --- | --- |
| Import and accounting | Bounded explicit JSONL input, unknown-preserving counters, original regression fixtures |
| Installation and removal | Fresh source and isolated packaged installations tested on macOS and Ubuntu; output survives uninstall |
| Report experience | Self-contained responsive HTML; encoded file URL; opt-in `--open` with recoverable launch failure |
| Browser rendering | 18 Chromium/WebKit/Firefox desktop/mobile scenarios passed on Ubuntu; WebKit mobile wrapping fixed |
| Browser launch | Process argument and failure tests pass; actual Safari launch was unavailable on this host |
| Reproducible diagnosis cases | Five original SHA-256-pinned fixtures; JSON/Markdown results; no human outcome claims |
| Native Codex | One prior real no-tool smoke test; synthetic native success/provider-failure probes; native tools remain host-sandbox-blocked |
| Developer feedback | Optional, explicitly removed as a release gate; no measured usefulness claim |
| Security disclosure | GitHub private-report form prepared; enable and verify after authorized public visibility, before announcement |
| Publication | Private repository authorized; npm, public visibility, tags/releases and announcements not authorized |

## What must happen before v1

1. Capture consented success, failure and interrupted native tool exports on a
   host whose normal sandbox works. Record exact versions and privacy review.
   Do not disable security controls to manufacture a passing result.
2. Verify real Safari opening on macOS. WebKit on Ubuntu is useful engine
   coverage, not Safari or macOS integration certification. Windows remains
   outside the initial support claim.
3. Obtain public-distribution approval, enable and verify GitHub private
   vulnerability reporting at launch, and follow the release checklist. Do not relabel a private preview as v1 merely
   because automated checks are green.

No new paid model runs, participant outreach, public releases, or system-wide
configuration changes were performed during this readiness pass.
