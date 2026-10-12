# Roadmap

## Working local preview

- Offline execution JSONL import, bounded accounting, HTML/JSON reports.
- Descriptive report comparison, conservative missing-data handling.
- Synthetic demo and serial tests.

## Release gates

1. Completed: one authorized real no-tool export and native mocked success/failure, with exact CLI version. Pending: successful native tool execution outside the nested sandbox.
2. Completed: Ubuntu installation, package, Chromium, WebKit and Firefox report checks plus desktop/mobile screenshot review. Actual Safari integration and Windows remain separately planned.
3. Completed: rename to Codex Run Audit and point-in-time registry lookup. Completed: public GitHub repository and enabled private vulnerability reporting.
4. Completed on macOS: fresh source installation, direct Git preparation, archive inspection and installed-package/uninstall checks.
5. Completed: public repository, GitHub release and manual Ubuntu validation workflow. npm publication is blocked by missing publisher authentication.

See [launch preparation](launch.md) for the repository and checks.

## Next product experiments

- Compare accounting against an existing analyzer using the same supported data.
- Add explicit independent acceptance results with provenance, not inferred test semantics.
- Support linked agent streams only after defining ownership and inherited-history handling.
- Build original fixtures for installation/discovery disagreement and version-change diagnosis.
- Pilot diagnosis with consenting developers, measuring task resolution and effort.

Automatic remediation, a registry, agent orchestration, exact subscription-cost inference and unbounded history scanning are outside the current scope.
