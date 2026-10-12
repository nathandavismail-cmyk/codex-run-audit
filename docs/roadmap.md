# Roadmap

## Working local preview

- Offline execution JSONL import, bounded accounting, HTML/JSON reports.
- Descriptive report comparison, conservative missing-data handling.
- Synthetic demo and serial tests.

## Release gates

1. Completed: one authorized real no-tool export and native mocked success/failure, with exact CLI version. Pending: successful native tool execution outside the nested sandbox.
2. Pending: Linux checks and visual report inspection; Windows remains separately planned.
3. Completed: rename to Codex Run Audit and point-in-time registry lookup. Pending: remote ownership approval and a verified private security channel before public release.
4. Completed on macOS: fresh source installation, direct Git preparation, archive inspection and installed-package/uninstall checks.
5. Pending: explicit approval to create/push the repository and separately create GitHub Actions. No workflow is currently shipped.

See [launch preparation](launch.md) for the concrete proposed repository and checks.

## Next product experiments

- Compare accounting against an existing analyzer using the same supported data.
- Add explicit independent acceptance results with provenance, not inferred test semantics.
- Support linked agent streams only after defining ownership and inherited-history handling.
- Build original fixtures for installation/discovery disagreement and version-change diagnosis.
- Pilot diagnosis with consenting developers, measuring task resolution and effort.

Automatic remediation, a registry, agent orchestration, exact subscription-cost inference and unbounded history scanning are outside the current scope.
