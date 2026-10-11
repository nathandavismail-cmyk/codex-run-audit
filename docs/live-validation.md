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

Next coverage priorities: real tool activity and failure exports, Linux execution,
and browser visual review. None is implied by this successful no-tool test.
