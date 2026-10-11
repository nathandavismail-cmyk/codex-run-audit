# Real-model export validation

Observed 2026-10-11, at 22:21 UTC, on macOS arm64 with Node 24.21.0 and
`codex-cli 0.162.0-alpha.17.2`. This is one integration smoke test, not a
performance benchmark or a baseline/enhanced comparison.

## Procedure

The user authorized a small real-model validation. Codex used the existing
ChatGPT login in a new empty temporary directory, with read-only sandboxing,
ephemeral execution, user configuration and rules ignored, web search disabled,
and approval policy `never`. No credentials were copied or inspected, and no
unrelated session history was scanned. The prompt requested exactly
`RUNLENS_LIVE_OK` with no tools or file inspection. A 60-second external timeout
bounded the process. No model override was supplied.

The initial attempt failed before emitting events because the local app-server
could not initialize under the filesystem sandbox. After runtime-directory
access was granted, one real-model execution completed with exit code 0.

## Observations

| Measurement | Observed value |
| --- | ---: |
| Completed turns | 1 |
| Input tokens, inclusive | 11,751 |
| Cached input, subset | 9,856 |
| Uncached input, derived | 1,895 |
| Output tokens, inclusive | 10 |
| Reasoning output, subset | 0 |
| Recorded command/MCP/web/file-change items | 0 |
| Externally measured process duration | 4,023 ms |

The emitted final message matched the requested marker. Assertions checked
each parsed token category against the native `turn.completed.usage` fields,
the derived subtraction, execution status, and omission of the marker and
thread ID from report content. A second import of the scrubbed export preserved
all usage and activity measurements. No parser changes were necessary.

These are provider-reported counters. Matching an export verifies RunLens's
import, not the provider's underlying token meter. Input includes context beyond
the short user prompt; this test does not attribute that context or establish
that it was unnecessary. Cached input is already included in input and must not
be added again.

The export omitted timestamps and model identity. RunLens correctly retains
null elapsed time, model and cost. The external process duration above is
separate from export-derived elapsed time. Subscription allowance consumed,
dollar cost and exact model version were not established.

## Privacy and reproduction

The raw capture stays in local scratch storage. A copy with only the generated
thread ID replaced is in ignored `private-inputs/`; reports are in ignored
`reports/live-verified/`. Neither capture nor report is included in Git or the
npm package. No permission to distribute the live transcript is assumed.

To repeat, explicitly authorize allowance consumption first. In an empty
temporary directory, run the following with the installed CLI; capture stdout
and stderr separately and apply an external timeout:

```sh
codex exec --json --ephemeral --ignore-user-config --ignore-rules \
  --skip-git-repo-check --sandbox read-only \
  -c 'approval_policy="never"' -c 'web_search="disabled"' \
  'Reply with exactly RUNLENS_LIVE_OK. Do not use tools, inspect files, or do anything else.' \
  > export.jsonl 2> diagnostics.txt
```

Analyze the resulting export with `runlens analyze export.jsonl --out new-report`.
Do not use `--synthetic` for a real-model capture. Numeric results may change
with model selection, native instructions, cache state, and CLI version.

## Tool probes: blocked, not passed

Two further authorized live runs used the same isolation and timeout at
22:28 UTC on 2026-10-11. One requested exactly one execution of
`/usr/bin/printf RUNLENS_TOOL_OK`; the other requested exactly one execution of
`/bin/sh -c 'exit 7'`, with no retries. Both ended with CLI exit 0 and
`turn.completed`, but neither produced the expected response or a command item.
The agent messages reported a sandbox restriction: `sandbox_apply: Operation
not permitted` in the first and sandbox exit 71 rather than expected 7 in the
second. The requested command outcomes were therefore **not verified**.
No sandbox bypass or additional live retries were performed.

| Provider-reported measurement | Requested success | Requested exit 7 |
| --- | ---: | ---: |
| Input, inclusive | 23,646 | 23,690 |
| Cached input, subset | 21,504 | 21,504 |
| Uncached input, derived | 2,142 | 2,186 |
| Output, inclusive | 58 | 76 |
| Reasoning output, subset | 0 | 0 |
| Recorded command items | 0 | 0 |
| External process duration, ms | 6,724 | 6,497 |

RunLens preserves the source's completed-turn status and leaves task correctness
unverified. It does not parse the private agent messages into fabricated command
events. Reports now explicitly explain that zero recorded tools does not prove
no tool was attempted. Source-matching counter checks passed, but these runs
do not establish successful live tool support or native failed-turn coverage.
Scrubbed captures stay in ignored `private-inputs/tool-success.jsonl` and
`private-inputs/tool-failure.jsonl`; reports are local only.

## Native failed-turn probe: passed with a mock provider

A separate loopback mock returned HTTP 400 with an original synthetic error.
The same installed Codex CLI exited 1 and emitted `error` followed by
`turn.failed`, with no usage. RunLens reported failed execution, kept all usage
categories null, and omitted the raw error message. The capture and metadata
are distributed as synthetic regression fixtures. This required no inference.
Reproduce using the source checkout's `scripts/capture-native.mjs` with
`--fail-provider` after the output directory.

Next priorities: execute tool probes in an environment that permits the native
read-only sandbox, then Linux execution and browser visual review. Native
MCP/web/file-change events remain unverified.
