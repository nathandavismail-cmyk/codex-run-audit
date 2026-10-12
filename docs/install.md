# Install, verify, update and remove

Requires Node.js 24+ and npm. Check `node --version` before installing. Codex
itself is only needed to capture new exports, not to run this analyzer.
macOS arm64 is tested; Linux and Windows remain separate validation gates.
The project is not yet published to npm or GitHub. Never install an unrelated
package merely because its name matches a draft project name.

## Source checkout or source ZIP

Once a GitHub repository exists, copy its exact clone URL from the Code button,
clone it, and change into that directory. For the local source ZIP, extract it
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

From a source checkout, create the archive with `npm pack`. Or use an explicitly
provided project release archive, verifying its checksum against its source.
Install the archive you actually downloaded:

```sh
npm install --global --ignore-scripts ./codex-run-audit-0.1.0.tgz
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
remote GitHub transport remains untested until a repository is published.

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
