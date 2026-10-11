# Compatibility

Reference accessed 2026-10-11: [OpenAI non-interactive mode documentation](https://learn.chatgpt.com/docs/non-interactive-mode). Its example documents thread, turn and item events plus turn-completion usage. This defines the initial target format; it does not establish that every Codex release or surface emits exactly those fields.

Supported event families: `thread.started`, `turn.started`, `turn.completed`, `turn.failed`, `item.started`, `item.updated`, `item.completed`, and `error`. Known items: command executions, MCP calls, web searches, file changes, agent messages, reasoning, todo lists and errors. Unknown types are counted, omitted as raw text, and reported as a coverage limitation.

The sequence must start with a thread before any turn. Items require an active turn; simultaneous turns and concatenated threads are not accepted. Malformed JSON fails rather than silently dropping a truncated tail. A syntactically valid export ending mid-turn produces an incomplete report.

Optional timestamp fields are accepted for explicitly timestamped exports; no claim is made that standard Codex supplies them. Missing cached/reasoning counters stay unknown. Model identity, subagent relationships, subscription limits and independent test results are not inferred.

Unsupported: raw `~/.codex/sessions` rollouts, app-server protocol streams, multi-thread merged traces, automatic history scanning, cloud/desktop exports without a verified adapter, and billing reconciliation. Windows is not claimed supported. Linux execution is planned but unverified in the current environment.

Before declaring native compatibility, preserve a consented scrubbed real export with exact Codex version, source surface, independently expected measurements, and permission to distribute the fixture. Do not run a new model task or expose private history merely to satisfy this gate.
