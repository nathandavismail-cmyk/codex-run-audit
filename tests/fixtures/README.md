# Native CLI fixture with a synthetic provider

`native-mock-alpha.jsonl` was emitted by `codex-cli 0.162.0-alpha.17.2`
on macOS arm64 on 2026-10-11. The thread ID was replaced with
`synthetic-thread`; other JSON fields are unchanged. Content and usage are
original synthetic data supplied by the loopback provider in
`scripts/capture-native.mjs`. No model inference, credentials, or private
history were used. This fixture is distributed under the project's MIT license.

It verifies native serialization, a pre-turn model-metadata diagnostic, and
inclusive counter mapping (100 input, 60 cached, 20 output, 5 reasoning).
It does not measure actual token consumption or prove compatibility with
other versions, tool executions, model providers, or desktop exports.

After `npm run build`, reproduce explicitly with:

```sh
node scripts/capture-native.mjs /path/to/new-capture-directory
```

Requires `codex` on PATH and permission to bind a loopback port. Uses a fresh
temporary HOME/CODEX_HOME and read-only, ephemeral execution; it neither loads
the user's credentials nor modifies their Codex configuration. Captures are
local and never uploaded. The probe fails after a 30-second process timeout.
It is opt-in and is not part of the ordinary unit test suite.
