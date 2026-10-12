# Release procedure

Version 1.0.0 is distributed on GitHub. npm publication is blocked by missing publisher authentication. Public launch was authorized on 2026-10-11; see [launch](launch.md). Future publication and workflow changes still require maintainer authorization.

1. Review the source diff, release notes, license and supported-format claims.
2. From a clean checkout with Node 24: `npm ci`, then `npm run check`.
3. Run `npm pack`; inspect the archive. Tests run through prepack. Ensure no logs, private files, reports, credentials or dependency directories are included.
4. Install that tarball in a disposable directory with `npm install --ignore-scripts /absolute/path/to/codex-run-audit-1.0.0.tgz`. Run its installed `codex-run-audit --help`, demo, analyze and compare paths.
   `npm run test:package` automates an isolated offline prefix install, report checks, repeat-pack hash comparison, and uninstall. Direct Git installation must also be checked from a committed source snapshot because npm has a separate preparation lifecycle.
5. Record OS, Node version, test counts, archive hash and remaining limitations. Byte-identical archives require matching source/toolchain inputs; cross-platform reproducibility has not been claimed.
6. Before making GitHub public, review metadata and obtain visibility approval. After the authorized visibility change, enable GitHub private vulnerability reporting, verify its reporting form and update SECURITY.md before announcement. Private reporting is now enabled and its public link verified.
7. npm publication, provenance configuration, remote pushes, tags and releases require approval. GitHub Actions require separate explicit approval. Do not invent a CI badge or supply-chain attestation.

## Publication checklist

Use this sequence for future releases. The first GitHub release was authorized; npm requires authentication.

1. Approve repository visibility and review preserved Git author metadata.
   Older commits include a local-machine author identity; no history was rewritten.
   The source ZIP and npm archive exclude Git history.
2. Change the repository to public only after approval. Enable GitHub private
   vulnerability reporting and verify its form before announcing availability.
3. Update README, llms.txt, SECURITY.md, docs/project-facts.json, CITATION.cff,
   launch/readiness docs and the changelog to reflect actual public/released
   status. Do not claim npm availability until its publication succeeds.
4. Freeze the reviewed commit, run the manual Ubuntu checks, regenerate the
   archive/checksums, and use `docs/releases/1.0.0.md` as the release-note draft.
   Release tags and GitHub releases require maintainer authorization.
5. If separately authorized, publish the verified package to npm. Check registry
   ownership first. Provenance is not currently configured; do not add an
   attestation badge or claim it exists. Configure trusted publishing in a
   separately approved publishing workflow if desired.
6. Verify anonymous README/image/documentation links, release downloads, security
   reporting and installation from the published artifact. Only then announce.

The targeted preflight examined 194 reachable Git blobs for credential patterns
and sensitive paths, with no hits. That is a limited check, not a full secret
scan or security audit. A point-in-time npm registry lookup returned E404 for
`codex-run-audit`; this is not a reservation or proof of publication rights.
