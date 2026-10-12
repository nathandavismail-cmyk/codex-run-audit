# Install, verify, update and remove

Requires Node.js 24+ and npm. Check `node --version` before installing. Codex
itself is only needed to capture new exports, not to run this analyzer.
macOS arm64 and Ubuntu with Node 24 are tested for installation and CLI behavior. Windows remains a separate validation gate.
The GitHub repository is public. The package is not published to npm; use the official [1.0.0 release](https://github.com/nathandavismail-cmyk/codex-run-audit/releases/tag/v1.0.0) archives. Never install an unrelated package merely because its name matches.

## Source checkout or source ZIP

Clone `https://github.com/nathandavismail-cmyk/codex-run-audit` without credentials and change into that directory. For the local source ZIP, extract it
and change into `codex-run-audit/`. Then:

```sh
npm ci
npm run check
npm run demo
```

`npm ci` installs pinned development dependencies and builds the CLI through
the `prepare` lifecycle. No user-wide configuration is changed. If you disable
lifecycle scripts, run `npm run build` explicitly afterward.

Open `reports/demo/index.html`. Repeated demo invocations deliberately refuse
to overwrite it; use `node dist/src/cli.js demo --out reports/another-demo`.

## Packaged command

Download `codex-run-audit-1.0.0.tgz` and `codex-run-audit-checksums.txt` from the official release. Compare its SHA-256 with the matching entry using `shasum -a 256 codex-run-audit-1.0.0.tgz` (macOS) or `sha256sum codex-run-audit-1.0.0.tgz` (Linux). Checksums detect corrupted downloads; they are not signed provenance. You can also build an archive from source with `npm pack`.
Install the verified archive:

```sh
npm install --global --ignore-scripts ./codex-run-audit-1.0.0.tgz
codex-run-audit --version
codex-run-audit demo --out reports/installed-demo
```

The archive includes compiled JavaScript and has no runtime dependencies, so
package installation needs no lifecycle scripts. If the global prefix is not
writable, use a user-owned prefix with npm's `--prefix` flag rather than sudo;
its `bin` directory must be on PATH. For a project-local install use
`npm install --save-dev --ignore-scripts /absolute/path/to/the-archive.tgz` and
invoke `./node_modules/.bin/codex-run-audit` from that project on macOS/Linux.

Direct npm installation from a trusted Git URL also builds through `prepare`.
It requires development dependencies and enabled lifecycle scripts. Pin a
reviewed commit rather than a moving branch. A local Git transport was tested;
a fresh authenticated GitHub clone also passed clean install, demo and package tests.
Some npm versions warn about unapproved lifecycle scripts. Review the source
before enabling any script; the prebuilt archive is the script-free installation
path. Do not globally approve arbitrary install scripts to silence a warning.

## Updates and removal

For a source checkout, review the desired tag/commit, preserve your own changes,
switch to it, and repeat `npm ci` and `npm run check`. For a packaged install,
install the reviewed new archive using the same prefix/scope as before.

```sh
# Global install; include the same --prefix if you used one.
npm uninstall --global codex-run-audit
# Project-local install, from that project:
npm uninstall --save-dev codex-run-audit
```

Uninstall removes the package and executable; reports and input files remain
yours. Source checkouts have no uninstall hooks or background services. Remove
only the checkout you no longer need after preserving its reports and changes.
There are no Codex config edits, skills, daemons, or telemetry to undo.

## Common setup problems

| Symptom | Resolution |
| --- | --- |
| Command not found after source install | Run `npm run build`; use `node dist/src/cli.js` or install the packed archive. |
| Command not found after prefix install | Use the prefix's `bin/codex-run-audit` or add that directory to your shell PATH. |
| npm cache permission error | Choose a writable cache with `npm ci --cache /path/to/task-cache`; do not change ownership recursively as a first step. |
| Compiler missing | Install development dependencies; `npm ci --omit=dev` is not a source build. |
| Existing report directory | Choose a new output directory; never delete an existing report just to make the command pass. |
| Codex nested sandbox error | Analysis still works offline. Capture elsewhere with the intended sandbox; do not disable protections to generate a demo. |

Maintainers can run `npm run test:package` to test an isolated offline global
install, demo/analyze/compare, spaces in paths, overwrite refusal, repeat-pack
hash stability and uninstall. Its temporary prefix is removed automatically.


## Open reports directly

All three report commands accept `--open`:

```sh
codex-run-audit demo --out reports/first-look --open
codex-run-audit analyze my-export.jsonl --out reports/my-run --open
codex-run-audit compare baseline/report.json candidate/report.json --out reports/comparison --open
```

On macOS this explicitly opens Safari so an HTML editor association does not
show source code. On Linux it uses `xdg-open`; desktop HTML associations determine
the application. On a headless host or unsupported platform, opening may fail:
the CLI warns, retains the completed report, prints a `file:` URL, and exits
successfully. Paste that URL into a local browser. When connected to a remote
host, transfer the report directory to your computer first. No server is started,
no report is uploaded, and ordinary commands do not open applications.

Browser launching is tested through process-boundary tests; automated WebKit
checks do not establish that macOS Safari launched successfully.
