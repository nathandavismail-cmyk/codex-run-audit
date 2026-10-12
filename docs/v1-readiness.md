# v1 readiness

Reviewed 2026-10-11. Keep the package at **0.1.0 unreleased / private preview**.
This checklist separates working implementation from product validation.

| Area | Evidence / status |
| --- | --- |
| Import and accounting | Bounded explicit JSONL input, unknown-preserving counters, original regression fixtures |
| Installation and removal | Fresh source and isolated packaged installations tested on macOS and Ubuntu; output survives uninstall |
| Report experience | Self-contained responsive HTML; encoded file URL; opt-in `--open` with recoverable launch failure |
| Browser rendering | 12 Chromium/WebKit desktop/mobile scenarios passed on Ubuntu; WebKit mobile wrapping fixed |
| Browser launch | Process argument and failure tests pass; actual Safari launch was unavailable on this host |
| Reproducible diagnosis cases | Five original SHA-256-pinned fixtures; JSON/Markdown results; no human outcome claims |
| Native Codex | One prior real no-tool smoke test; synthetic native success/provider-failure probes; native tools remain host-sandbox-blocked |
| Developer demand | Participant packet and ledger prepared; no external participants contacted or measured |
| Security disclosure | Policy documented; verified private public-facing contact still needed before public launch |
| Publication | Private repository authorized; npm, public visibility, tags/releases and announcements not authorized |

## What must happen before v1

1. Run the pilot with 3–5 consenting developers. Observe an unaided installation,
   report opening, diagnosis of their own problem, and removal. Preserve negative
   feedback. At least one useful next action should be independently verified.
2. Capture consented success, failure and interrupted native tool exports on a
   host whose normal sandbox works. Record exact versions and privacy review.
   Do not disable security controls to manufacture a passing result.
3. Verify real Safari opening on macOS. WebKit on Ubuntu is useful engine
   coverage, not Safari or macOS integration certification. Windows remains
   outside the initial support claim.
4. Establish a verified private disclosure channel, approve public distribution,
   and follow the release checklist. Do not relabel a private preview as v1 merely
   because automated checks are green.

No new paid model runs, participant outreach, public releases, or system-wide
configuration changes were performed during this readiness pass.
