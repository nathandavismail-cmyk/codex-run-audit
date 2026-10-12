# Public launch

Version 1.0.0 is distributed through the [public GitHub repository](https://github.com/nathandavismail-cmyk/codex-run-audit) and [release archives](https://github.com/nathandavismail-cmyk/codex-run-audit/releases/tag/v1.0.0). Launch authorized 2026-10-11 (America/Los_Angeles).

- MIT license, Node 24+, zero runtime dependencies; stable CLI and v1 report contract.
- Private vulnerability reporting enabled and its public reporting link verified. Secret scanning and push protection enabled.
- README, actual report screenshot, topics, package keywords, citation, `llms.txt` and structured facts describe supported functionality without promised rankings or endorsements.
- Release assets include a prebuilt package, source ZIP and SHA-256 checksums. Checksums are not signed provenance.
- npm publication is blocked by missing publisher authentication; never substitute an unrelated similarly named package.
- Historical Git author metadata is preserved, including older local-machine identities. Archives exclude Git history.

## Validation

The approved manual Ubuntu workflow has a 10-minute timeout, runs only on request, uses Node 24 and makes no model calls. Unit/integration, package install/uninstall, diagnosis fixtures and 18 Chromium/WebKit/Firefox scenarios are covered. See [validation](validation.md).

Native tool execution remains host-sandbox-blocked; actual Safari opening and Windows remain unverified. Developer feedback is optional. No productivity or token-savings outcome is claimed.

GitHub artifact storage was full during earlier validation; upload warnings are separate from test results. Synthetic screenshots are also emitted in bounded CI logs. Release assets use GitHub Releases, not Actions artifact storage.

No public announcements, participant outreach or paid model trials were performed for launch.
