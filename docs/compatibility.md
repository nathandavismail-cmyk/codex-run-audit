# Compatibility

Reference accessed 2026-10-11: [OpenAI non-interactive mode documentation](https://learn.chatgpt.com/docs/non-interactive-mode). Its example documents thread, turn and item events plus turn-completion usage. This defines the initial target format; it does not establish that every Codex release or surface emits exactly those fields.

Supported event families: `thread.started`, `turn.started`, `turn.completed`, `turn.failed`, `item.started`, `item.updated`, `item.completed`, and `error`. Known items: command executions, MCP calls, web searches, file changes, agent messages, reasoning, todo lists and errors. Unknown types are counted, omitted as raw text, and reported as a coverage limitation.

The sequence must start with a thread before any turn. Items require an active turn, except completed error diagnostics between thread creation and the first turn (observed in the native CLI). Simultaneous turns and concatenated threads are not accepted. Malformed JSON fails rather than silently dropping a truncated tail. A syntactically valid export ending mid-turn produces an incomplete report.

Optional timestamp fields are accepted for explicitly timestamped exports; no claim is made that standard Codex supplies them. Missing cached/reasoning counters stay unknown. Model identity, subagent relationships, subscription limits and independent test results are not inferred.

Unsupported: raw `~/.codex/sessions` rollouts, app-server protocol streams, multi-thread merged traces, automatic history scanning, cloud/desktop exports without a verified adapter, and billing reconciliation. Windows is not claimed supported. Linux execution is planned but unverified in the current environment.

Before declaring native compatibility, preserve a consented scrubbed real export with exact Codex version, source surface, independently expected measurements, and permission to distribute the fixture. Do not run a new model task or expose private history merely to satisfy this gate.

A user-authorized [live smoke test](live-validation.md) now establishes one
successful no-tool export from CLI `0.162.0-alpha.17.2`. Its scrubbed capture is
local and excluded from distribution. This does not satisfy broad release
certification or independent token-meter verification; additional tool/failure
coverage and a distributable real fixture remain pending.

## Native serialization probe

On 2026-10-11, `codex-cli 0.162.0-alpha.17.2` on macOS arm64 emitted an
export using an isolated loopback mock provider. The probe uses the documented
[custom provider configuration](https://learn.chatgpt.com/docs/config-file/config-advanced)
(accessed 2026-10-11). No credentials or model inference were involved. The
scrubbed capture and reproduction instructions are in `tests/fixtures/` in the
source checkout; `scripts/capture-native.mjs` is an opt-in local probe.

Observed: a pre-turn error item, a completed agent message, and turn usage
mapping of 100 input / 60 cached / 20 output / 5 reasoning tokens. These are
**synthetic provider counters**, not measured consumption. The native export
also included `cache_write_input_tokens: 0`; RunLens currently omits that
additional counter. It contained no timestamps or model identity, so those
report fields remain null. This validates only the captured sequence and
version, not real-model accounting, tools, or other Codex surfaces/releases.
