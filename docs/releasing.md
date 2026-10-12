# Local release preparation

The source repository is private on GitHub; no npm package or GitHub release is published. Keep 0.1.0 marked unreleased until publication is authorized.

1. Review the source diff, release notes, license and supported-format claims.
2. From a clean checkout with Node 24: `npm ci`, then `npm run check`.
3. Run `npm pack`; inspect the archive. Tests run through prepack. Ensure no logs, private files, reports, credentials or dependency directories are included.
4. Install that tarball in a disposable directory with `npm install --ignore-scripts /absolute/path/to/codex-run-audit-0.1.0.tgz`. Run its installed `codex-run-audit --help`, demo, analyze and compare paths.
   `npm run test:package` automates an isolated offline prefix install, report checks, repeat-pack hash comparison, and uninstall. Direct Git installation must also be checked from a committed source snapshot because npm has a separate preparation lifecycle.
5. Record OS, Node version, test counts, archive hash and remaining limitations. Byte-identical archives require matching source/toolchain inputs; cross-platform reproducibility has not been claimed.
6. Before making GitHub public, review metadata and obtain visibility approval. After the authorized visibility change, enable GitHub private vulnerability reporting, verify its reporting form and update SECURITY.md before announcement. The custom form is prepared; the feature is not active for this private repository.
7. npm publication, provenance configuration, remote pushes, tags and releases require approval. GitHub Actions require separate explicit approval. Do not invent a CI badge or supply-chain attestation.
