# v1 readiness

Reviewed 2026-10-11. Version **1.0.0 is the first public release**. The stable scope is the explicit-export CLI and v1 report schemas described in [versioning](versioning.md).
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
| Security disclosure | Enabled; API state and public reporting link verified |
| Publication | Public GitHub repository and 1.0.0 release; npm blocked by missing publisher authentication |

## Public release scope and remaining actions

The first public version is 1.0.0. Native tool execution, Safari opening, Windows,
billing and outcome verification remain explicitly unverified or unsupported;
1.0 does not expand those claims. Developer feedback is not required.

Private vulnerability reporting is enabled. Native/Safari limitations remain visible in the README and release notes. Broader compatibility requires future source-matched evidence on a suitable host, without weakening security controls.

npm publication requires publisher authentication. No paid model runs, participant outreach or system-wide configuration changes were used for launch.
